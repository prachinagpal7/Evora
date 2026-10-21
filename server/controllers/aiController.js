/*this is contoller ie A function that runs when a specific API is hit, controller only runs through route */

import OpenAI from "openai";        /*for taling to ai, Gemini here*/
import sql from "../configs/db.js"     /*talk to database*/
import {clerkClient} from "@clerk/express"   /*to get the user's ID and to update user data (free usage etc)*/
import axios from "axios"
import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'
import { PDFParse } from 'pdf-parse' // This uses the v2 parser API.

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,  /*secret key-used to authenticate your request to google, without this request will be rejected as per the browser security*/
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"   //this tells where to send requests
});      /* this creates an object AI - tool to send prompts to gemini, basically A client to call SOMEONE ELSE'S API (Google Gemini)*/
/*Your API → for frontend, Gemini API → for your backend */

//this runs when 'POST /api/ai/generate-article' is called
export const generateArticle = async (req, res) => {
    try {
        const {userId} = await req.auth();    //extract userid from clerk to know who is making request
        const {prompt, length} = req.body;    //extract frontend data
        const plan = req.plan;
        const free_usage = req.free_usage;   
        //came from auth middleware

        if(plan !== 'premium' && free_usage >= 10){
            return res.json({ success: false, message: "Limit reached. Upgrade to continue."})
        }
        //return stops function immediately

        //call AI and sends request to gemini
        const response = await AI.chat.completions.create({
            model: "gemini-3-flash-preview", //which model
            messages: [{ role: "user", content: prompt }],   //what user asked
            temperature: 0.7,    //creativity
            max_tokens: 8192,  //length of ouput
        });  /*telling AI to generate article based on this prompt*/

        //await is important bcz Wait for AI to generate response

        /*extract result ..it looks like
        response = {
        choices: [
            {
            message: {
                content: "AI is transforming the world..."
            }
            }
        ]
        }  ...and you extract only content*/
        const choice = response.choices[0];
        console.log(choice.finish_reason, response.usage); // temporary, to confirm
        const content = choice.message.content;

        //save to database
        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;
        //${} → safely inserts values (prevents SQL injection)

        //update usage (free users only)
        if(plan !== 'premium'){
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }

        //sends response  
        res.json({success: true, content})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const generateBlogTitle = async (req, res) => {
    try {
        const {userId} = await req.auth();  
        const {prompt} = req.body; 
        const plan = req.plan;
        const free_usage = req.free_usage;   
        if(plan !== 'premium' && free_usage >= 10){
            return res.json({ success: false, message: "Limit reached. Upgrade to continue."})
        }
        const response = await AI.chat.completions.create({
            model: "gemini-3-flash-preview", 
            messages: [{ role: "user", content: prompt, }],   
            temperature: 0.7,    
            max_tokens: 8192,  
        });  
        const content = response.choices[0].message.content
        console.log(response.choices[0].message.content);
        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;
        if(plan !== 'premium'){
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }
        res.json({success: true, content})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const generateImage = async (req, res) => {
    try {
        const {userId} = await req.auth();  
        const {prompt, publish} = req.body; 
        const plan = req.plan;  
        if(plan !== 'premium'){
            return res.json({ success: false, message: "This feature is only available for premium subscriptions."})
        }
         
        //Formdata is like a container for sending a data like a package 
        const formData = new FormData()
        formData.append('prompt', prompt)

        //axios is like a fetch() for backend, it sneds http requests. So your backend says 'hey clipdrop, generate image for this prompt'
        const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: {'x-api-key': process.env.CLIPDROP_API_KEY,},
            responseType: "arraybuffer",
        })
        //why x-api-key bcz clipdrop asks who is making this request so we give here's my api key for clipdrop
        //why the responseType = arraybuffer bcz normally axios expects json, but image isnt json, its binary bytes data so axios stores it in an array buffer 

        //an image response comes back from clipdrop smth like png binary data ie raw image bytes 
        //data contains raw image bytes, browser cant easily display raw bytes so convert them into base64 string and now image becomes text
        //why convert to base64 bcz cloudinary can upload it easily 
        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

        //now upload this image on cloud storage for that we will se cloudinary which we already installed ...we have to create the configuration and we need the api keys to configure the cloudinary storage
        const {secure_url} = await cloudinary.uploader.upload(base64Image)
        //now cloudinary receives base64 image and Cloudinary stores image on its servers and returns { secure_url: "https://res.cloudinary.com/..."}

        //its like - image generated, uploaded, cloudinary gives permanent url

        await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;
        //content is the cloudinay url

        //if we dont use cloudinary - image generated, Response sent, Image lost forever

        //if we use cloudinary - image generated, upload, Permanent URL, Save URL, Can view image anytime

        res.json({success: true, content: secure_url})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const removeImageBackground = async (req, res) => {
    try {
        const {userId} = await req.auth();  
        const image = req.file;
        const plan = req.plan;  
        if(plan !== 'premium'){
            return res.json({ success: false, message: "This feature is only available for premium subscriptions."})
        }

        console.log("Removing background from:", image.filename);
        
        try {
            const {secure_url} = await cloudinary.uploader.upload(image.path, {
                transformation: [{
                    effect: 'background_removal',
                    background_removal: 'remove_the_background'
                }]
            });
            
            console.log("✓ Background removed successfully");
            
            await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;
            res.json({success: true, content: secure_url})
        } catch (cloudinaryError) {
            console.error("Cloudinary background removal error:", {
                message: cloudinaryError.message,
                http_code: cloudinaryError.http_code
            });
            
            if (cloudinaryError.http_code === 400 && cloudinaryError.message.includes('background_removal')) {
                throw new Error('Background removal feature not available. Make sure you have the add-on enabled in Cloudinary account settings.');
            }
            throw cloudinaryError;
        }
    } catch (error) {
        console.error("Remove background error:", error.message);
        res.json({success: false, message: error.message})
    }
}

export const removeImageObject = async (req, res) => {
    try {
        const {userId} = await req.auth();  
        const {object} = req.body; 
        const image = req.file; 
        const plan = req.plan;  
        if(plan !== 'premium'){
            return res.json({ success: false, message: "This feature is only available for premium subscriptions."})
        }

        const {public_id} = await cloudinary.uploader.upload(image.path)  //cloudinary stores image and returns {public_id: "abc1234"}, its like cloudinary'x internal image id 
        const imageUrl = cloudinary.url(public_id, {
            transformation: [{effect: `gen_remove:${object}`}],
            resource_type: 'image'
        })  //this doesnt upload the image again, it creates a url and then transforms it cloudinary ai edits image 
        //cloudinary generates url and store in database 

        //here we have created public_id first bcz user may want to re-edit again and again, so instead of re-uplooad, we create riginal image's identifier once 
        //same image, different or many tramsformations, no re-upload needed. Cloudinary can create many URLs from the same public_id. That's the main reason public_id exists. It lets Cloudinary reference an already-uploaded image and generate different transformed versions without repeatedly uploading the file.

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;

        res.json({success: true, content: imageUrl})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

/*Why we install pdf-parse bcz normally a pdf looks like resume.pdf. To us it looks readable but to node.js it is just a binary file data. 
Node cannot directly understand name:prachi, skills:.. inside a pdf, so we install npm install pdf-parse which can do: pdf file, extact text, return plain text*/
export const resumeReview = async (req, res) => {
    try {
        const {userId} = await req.auth();  
        const resume = req.file; 
        const plan = req.plan;  
        if(plan !== 'premium'){
            return res.json({ success: false, message: "This feature is only available for premium subscriptions."})
        }
        
        if(resume.size > 5 * 1024 * 1024){
            return res.json({success: false, message: "Resume file size exceeds, allowed size (5MB)."})
        } //this checks 5MB

        const dataBuffer = fs.readFileSync(resume.path) // this line reads file contents into memory.
        // Buffer means raw file data stored in ram.
        const parser = new PDFParse({ data: dataBuffer })
        const pdfData = await parser.getText() // before buffer contains unreadable PDF data. now pdfData contains readable data
        await parser.destroy()

        const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`

        const response = await AI.chat.completions.create({
            model: "gemini-3-flash-preview", 
            messages: [{ role: "user", content: prompt }],   
            temperature: 0.7,   
            max_tokens: 8192,  
        }); 

        const content = response.choices[0].message.content

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;
        res.json({success: true, content})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}
/*RESUME REVIEW: 
User uploads resume.pdf
↓
Frontend sends request
↓
Multer receives PDF
↓
Creates req.file
↓
Auth middleware checks user
↓
Controller starts
↓
Check premium plan
↓
Check file size
↓
Read PDF file
↓
pdf-parse extracts text
↓
Create prompt
↓
Send prompt to Gemini
↓
Gemini reviews resume
↓
Save review in PostgreSQL
↓
Return review to frontend*/

/*Frontend, calls YOUR API (/api/ai/generate-article), Your backend, calls GEMINI API, gets response, saves to DB, returns to frontend*/

/*1. Get user info
2. Get request data
3. Check limits
4. Call AI
5. Extract result
6. Save to DB
7. Update usage
8. Send response */

//now using this controller function, we will create the api end point

/*one thing more here - in this we are basically saying - Use OpenAI SDK,
but send requests to Gemini servers,
and authenticate using my API key

OpenAI SDK = delivery app
baseURL = which restaurant
apiKey = your account ID 
so with baseurl - order goes to  gemini api key
without baseurl - order goes to openai api bcz gemini api key wont work, the OpenAI library will default to OpenAI’s servers, not Gemini which may result in authentication error/invalid key so baseurl overridedefault api endpoint
even if you dont write baseurl, it still knows where to go  but it goes to the wrong place */
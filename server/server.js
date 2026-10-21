import express from 'express';      /* to create backend server using express framework, without it ...you have to write more code to create server and handle request and response, but with express you can do it in few lines of code */
import { v2 as cloudinary } from "cloudinary";
import connectCloudinary from './configs/cloudinary.js';
import cors from 'cors';            /* to connect backend with any frontend ....by default browser will not allow to connect backend and frontend if they are running on different ports or locationns ...like here ...frontend at localhost:5173 and backend at localhost:3000, so we need to use cors package to connect them */
import 'dotenv/config';         /*Loads environment variables from .env.... to use env file in our project, we can store all the secret keys and database url in env file and use it in our project without exposing it to public, like here we are using DATABASE_URL from env file to connect to database ......after this, process.env.PORT works*/
import { clerkMiddleware, requireAuth } from '@clerk/express'  
import aiRouter from './routes/aiRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();  /*This is basically your server instance, Think: app = your backend machine ............create app using express package, this app will be used to create server and handle request and response*/

await connectCloudinary(); /*when server starts: server boots, cloudinary configured, ready for uploads*/

app.use(cors());          /*add middleware for cors package to enable cors ...now frontend can talk to backend, all the request will be passed using this cors, allows cross-origin requests, if you dont use cors- your frontend will still be able to send request using backend url + port with fetch function + its own origin url ....and backend will still receive the request and sends a response but browser will reject it(browser blocks javascript from reading it) ...bcz cors is like a security check ....if not enabled then no response to the frontend ...or use same origin or postman etc if you want it to work without cors*/   
app.use(express.json());   /*all the request will be passed using this json method, it will parse the request body and convert it into json format, so we can use it in our project, eg- Frontend sends {"name": "Prachi"} in request body, then we can access it in backend using req.body.name, without this middleware req.body = undefined, but with this middleware req.body.name = "Prachi" ...Express does NOT parse JSON by default, it stays raw*/
 
//Without clerk clerkMiddleware, backend sees the token but doesnt know if its Real,fake,expired
app.use(clerkMiddleware());   /*This is the clerk code runnning inside your backend, it verifies the token ie reads token, verifies signature, verifies expiry, verifies it was issued by clerk. if token is fake then request rejected otherwise accepted. Attaches authentication info to request, after this, req.auth becomes available, without this req.auth = undefined*/

app.get('/', (req, res) => {     /*defines a home route, get request to '/' means when we hit the root url of our backend server, it will send a response 'Server is live' to the client, this is just to check if our server is working or not, you can remove this route later when you start working on other routes*/
    res.send('Server is live');     /*req - request (data coming in), res - response (what you send back), res.send() - Sends response to client*/
});

app.use(requireAuth());     /*now when we will create any routes, then all the routes will be protected means only logged in user can access the routes - blocks unauthenticated users*/

app.use('/api/ai', aiRouter);  /*it prefix all routes eg - aiRouter.post('/generate-article', ...) Becomes: /api/ai/generate-article */

app.use('/api/user', userRouter);

const PORT = process.env.PORT || 3000;   /*.env PORT (if exists in env file) else use 3000 by default, bcz deployment platforms assign ports dynamically but locally you use 3000 etc, where we will start the backend server*/

app.listen(PORT, () => {    /*start the server, Listening for requests on PORT */
    console.log(`Server is running on port ${PORT}`);
}); 

/* full flow - node server.js or npm run server or npm start, server starts, frontend or browser sends a request via GET/ , Route matches → sends response
npm run server will start the server using the nodemon package*/

/*type: module - this enables import ... from ... instead of const express = require('express') etc, it allows us to use ES6 modules in our project, if you dont add this then you have to use require() and module.exports etc, but with this you can use import and export keywords, it makes the code cleaner and more modern  
nodemon - Automatically restarts server when you change code...otherwise you have to restart the server manuallyy everytime you make even a little change in code ....Save file → server restarts automatically*/

//middlewares check before request, controllers defines logic, routes are the api endpoints 

//middleware androutes are seperate functions, they dont share variables directly ...middleware sets the data and route uses the data

/*API is not one keyord, it is the endpoint you expose,
final api endpoint - POST http://localhost:3000/api/ai/generate-article
api = url + http method + logic behind it 
for eg - URL → /api/ai/generate-article  
Method → POST  
Logic → generateArticle controller
frontend hits this api and backend response*/
/* Frontend
↓
POST /api/ai/generate-article  ← THIS is API
↓
Router
↓
Middleware
↓
Controller
↓
Response */ 

/*now to test this api, we will use postman application*/



/* now in order to test our backend without writing the frontend code first thats why we have downloaded the postman
In postman, we have created a request with post method and url-http://localhost:3000/api/ai/generate-article with body(raw and json)-{
  "prompt":"Impact of ai on jobs",
  "length":800
}, but why we did this because normally frontend sends this request but frontend wasnt ready yet so postman pretended to be the frontend.
Postman = fake frontend
But why send wasnt working immediately because your route was protected due to this app.use(requireAuth()); as this middleware wants proof that only logged in user is trying to access this page and make a request, without proof-request rejected
Inside react - 'const { getToken } = useAuth();' this comes from clerk .......when user logs in with email and password, then clerk verifies and user is authenticated. So now clerk creates a token, think of it like a digital id card, this token contains information like userid, email, session, expiry time and it is digitally signed
But why print token becuase we ask the clerk to give me my login token then print the token in console
But why put token in postman is because that is exactly what frontend would do later so now request contains both api and authorization: bearer eyj....
Bearer is like a the person carrying this token
Server sees authorization header exists and extracts token_here
What happens in backend is when request reaches app.use(requireAuth()); here then clerk middleware reads authorization header which contains beaer eyj... so then clerk checks is the token genuine, has it expired, was it created by clerk, if its valid then user authenticated and if invalid then 401 unauthorized
How does the backend know the user: you never send {"userId":"abc123"} yet database got user_id = smth so how? because the reason is clerk middleware decoded the token. Inside the middleware req.auth() now contains {userId: "user_abc123"} then later controller does const {userId} = req.auth(); and gets user_abc123
Controller runs: 'const { prompt, length } = req.body;' and extracts the prompt and length from postman body 
Gemini call: controller sends impact of ai on jobs to gemini and gemini returns the response and stored in centent
Database insert: then query creates a new row and neon now contains id,user_id,prompt,content,type ie exactly what you saw
Response back to postman: finally res.json({success:true,content}) goes back to postman and postman displays the {"success": true,"content": "..."} resonse
Why did we do all this because before building the frontend you wanted to verify:
is route working, is clerk authentication working, is token accepted, is gemini working. is database insertion working
Complete flow: login, clerk creates token, gettoken(), copy token, paste in postman, postman sends request, backend receives request, clerk verifies token, userid exctrated, gemini generates article, neon stores article, response sent back, postman displays response

token arrives, clerk middleware verifies and decodes, stores result in req ie req.auth, controller accesses req.auth()*/

/* Frontend Clerk = creates/provides token
Backend Clerk middleware = verifies and decodes token
req.auth() = reads the decoded information
clerkClient = lets backend query/update Clerk users*/



/*Clerk have one more advanced feature that admin can login in any user's account
suppose there are 5 users and 3rd user is facing issue, so admin can login to his account in order to debug without sharing admin's own credentials*/ 
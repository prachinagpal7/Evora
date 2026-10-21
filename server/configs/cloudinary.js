import {v2 as cloudinary} from 'cloudinary'

const connectCloudinary = async () => {
    const config = {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    };

    cloudinary.config(config);
}

export default connectCloudinary;

//This tells Cloudinary SDK that Which Cloudinary account should I use?

/*complete flow : Postman
↓
POST /generate-image
↓
Clerk verifies user
↓
auth middleware checks plan
↓
Controller runs
↓
Prompt extracted
↓
ClipDrop generates image
↓
Image bytes returned
↓
Convert to Base64
↓
Upload to Cloudinary
↓
Get image URL
↓
Store URL in PostgreSQL
↓
Return URL to frontend*/

/*cloudinary is not for storage only, it is storage + image cdn + image transformation + ai editing + optimization, so in our project we do two things, 
1. store images like in generateImage 
2. edit images like in background and object removal, here cloudinary is acting like an AI image editor.
Cloudinary reads a file from disk and uploads it, you are not uploading url but a local image file
3. cloudinary can also upload the direct url, it will download it itself */
import multer from "multer";  //importing multer package

const storage = multer.diskStorage({});  /*this tells multer that Store uploaded file on disk temporarily. Normally you could specify destination, filename like  const storage = multer.diskStorage({
  destination:'uploads/',
  filename:(req,file,cb)=>{
      cb(null,file.originalname)
  }
}) but here multer.diskStorage({}) means Use default temporary storage.*/

export const upload = multer({storage}) //then this creates middleware

/*express can easily read json using app.use(express.json()) but images are different, browser sends binary image data not json, express alone cannot handle uploaded files, thats why we installed multer 
multer = middleware for file uploads */


/*think 'upload.single("image")' means accept one uploaded file named "image"
eg: <input name="image" type="file">
after multer runs, it creates 'req.file' which contains information about uploaded image 
smth like: req.file = {
path: "/tmp/abc123.jpg",
  originalname: "cat.jpg",
  mimetype: "image/jpeg"
} so req.file comes form multer 

full flow: suppose router.post("/remove-background",upload.single("image"),removeImageBackground) 
flow: request arrives, multer runs first, creates req.file, controller runs*/

/*BACKGROUND REMOVAL:
Upload image
↓
Multer stores temp file
↓
req.file created
↓
Cloudinary uploads image
↓
Cloudinary removes background
↓
Returns URL
↓
Save URL in PostgreSQL
↓
Send URL to frontend*/

/*OBJECT REMOVAL:
Upload image
↓
User enters object name
↓
Multer stores image
↓
Cloudinary uploads image
↓
Cloudinary AI removes object
↓
Cloudinary creates transformed URL
↓
Save URL in PostgreSQL
↓
Send URL to frontend*/
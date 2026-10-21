import express from "express";
import {auth} from "../middlewares/auth.js";
import {generateArticle, generateBlogTitle, generateImage, removeImageBackground, removeImageObject, resumeReview} from "../controllers/aiController.js";
import {upload} from "../configs/multer.js"

const aiRouter = express.Router();         
//in this router,we can create the api end point
/*this creates a mini app inside your main app ie group of related routes (AI routes)*/

aiRouter.post('/generate-article', auth, generateArticle)
aiRouter.post('/generate-blog-title', auth, generateBlogTitle)
aiRouter.post('/generate-image', auth, generateImage)
aiRouter.post('/generate-image-background', upload.single('image'), auth, removeImageBackground)
aiRouter.post('/generate-image-object', upload.single('image'), auth, removeImageObject)
aiRouter.post('/resume-review', upload.single('resume'), auth, resumeReview)

/*Request arrives
↓
upload.single('resume')
↓
Multer processes PDF
↓
Creates req.file
↓
auth middleware runs
↓
Controller runs*/

export default aiRouter

/*Frontend sends request - POST /api/ai/generate-article - server.js → sees '/api/ai' → forwards to aiRouter - aiRouter matches '/generate-article' - authenticateRequest runs - auth middleware (your custom one) runs (if added)- generateArticle controller runs - response sent back*/

/*1. Clerk auth → verifies user
2. Your auth → sets req.plan, req.free_usage
3. Controller → uses that data*/ 

/*server.js → mounts router
router → defines endpoint
middleware → prepares request
controller → handles logic
response → goes back to frontend */
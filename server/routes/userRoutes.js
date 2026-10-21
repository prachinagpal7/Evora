import express, { application } from "express";
import {auth} from "../middlewares/auth.js"
import { getPublishCreations, getUserCreations, toggleLikeCreations } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/get-user-creations', auth, getUserCreations)
userRouter.get('/get-published-creations', auth, getPublishCreations)
userRouter.post('/toggle-like-creations', auth, toggleLikeCreations)      //post method bcz we are sending the post id with the request

export default userRouter;

//after this we have created all the api's for our ai saas application, now we will link these api's with our frontend so that we can create fully functional ai saas application
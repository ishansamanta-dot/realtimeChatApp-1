import express from "express";
import {editProfile, getCurrentUser, getSuggestedUsers, search } from "../controllers/user.controller.js";
import protectAuth from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.js";

const userRouter=express.Router();


userRouter.get("/current",protectAuth,getCurrentUser);
userRouter.get("/others",protectAuth,getSuggestedUsers);
userRouter.put("/profile",protectAuth, upload.single("image"), editProfile);
userRouter.get("/search",protectAuth,search);

export default userRouter;
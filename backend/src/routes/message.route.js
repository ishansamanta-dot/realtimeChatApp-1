import express from "express";
import protectAuth from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.js";
import { getMessages, SendMessage } from "../controllers/message.controller.js";

const messageRouter=express.Router();

messageRouter.post("/send/:receiver",protectAuth, upload.single("image"),SendMessage);
messageRouter.get("/get/:receiver",protectAuth,getMessages);

export default messageRouter;
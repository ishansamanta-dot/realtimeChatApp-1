import express from "express";
import {acceptFriendRequest, deleteFriend, editProfile, getCurrentUser, getFriendRequests, getFriends, getSentFriendRequests, getSuggestedUsers, rejectFriendRequest, search, sendFriendRequest } from "../controllers/user.controller.js";
import protectAuth from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.js";
import { getZegoToken } from "../controllers/auth.controller.js";

const userRouter=express.Router();


userRouter.get("/current",protectAuth,getCurrentUser);
userRouter.get("/others",protectAuth,getSuggestedUsers);
userRouter.put("/profile",protectAuth, upload.single("image"), editProfile);
userRouter.get("/search",protectAuth,search);
userRouter.post("/friend-request/:receiver",protectAuth,sendFriendRequest);
userRouter.get("/friend-request",protectAuth,getFriendRequests);
userRouter.get("/friend-request/sent",protectAuth,getSentFriendRequests);
userRouter.put("/friend-request/accept/:requestId",protectAuth,acceptFriendRequest);
userRouter.put("/friend-request/reject/:requestId",protectAuth,rejectFriendRequest);
userRouter.get("/friends",protectAuth,getFriends);
userRouter.delete("/friends/:friendId",protectAuth,deleteFriend);
userRouter.get("/zego-token/:roomID", protectAuth, getZegoToken);

export default userRouter;
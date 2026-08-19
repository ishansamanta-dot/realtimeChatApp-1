import mongoose from "mongoose"
import uploadOnCloudinary from "../config/cloudinary.js"
import { upload } from "../middleware/multer.js"
 import Conversation from "../model/conversation.js"
import Message from "../model/message.js"
import { getReceiverSocketId, io } from "../socket/socket.js"

export const SendMessage=async(req,res)=>{
    try{
        let sender=req.userId
        let {receiver}=req.params
        let {message}=req.body

        let image;
        if(req.file){
            image=await uploadOnCloudinary(req.file.path)
        }

        let conversation=await Conversation.findOne({
            participants:{$all:[sender,receiver]}
        });

        let newMessage=await Message.create({
            sender,receiver,message,image
        })

        if(!conversation){
            conversation=await Conversation.create({
                participants:[sender,receiver],
                messages:[newMessage._id]
            })
        }else{
            conversation.messages.push(newMessage._id)
            await conversation.save()
        }

        const receiverSocketId=getReceiverSocketId(receiver)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        return res.status(201).json(newMessage)
    }catch(err){
        return res.status(500).json({message:`send Message error ${err}`});
    }
}

export const getMessages=async(req,res)=>{
    try{
        let sender=req.userId
        let {receiver}=req.params
        let conversation = await Conversation.findOne({
            participants:{$all:[sender,receiver]}
        }).populate("messages")

        //return res.status(400).json({message:"conversation not found"});
        if(!conversation){
            return res.status(200).json([]);
        }

        await Message.updateMany(
            {
                sender:receiver,
                receiver:sender,
                seen:false
            },
           {$set: {
                seen:true
            }}
        );

        return res.status(200).json(conversation?.messages)
    }catch(err){
        return res.status(500).json({message:`get Message error ${err.message}`});
    }
}



export const markMessageAsRead=async (req,res)=>{
    try{
        let sender=req.userId
        let {receiver}=req.params

        await Message.updateMany(
            {
                sender:receiver,
                receiver:sender,
                seen:false
            },
            {$set:{
                seen:true
            }}
        );
        return res.status(200).json({ message:"Messages marked as read"});

    }catch(err){ 
        return res.status(500).json({ message:`mark messages read error ${err.message}`});
    }
}


export const getUnreadMessages=async(req,res)=>{
    try{

        let messages=await Message.find({
            receiver:req.userId,
            seen:false
        });

        return res.status(200).json(messages);

    }catch(err){

        return res.status(500).json({
            message:`get unread messages error ${err.message}`
        });

    }
}
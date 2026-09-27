import http from "http"
import express from "express"
import { Server } from "socket.io"

let app=express()

const server=http.createServer(app)
const io=new Server(server,{
    cors:{
        origin:"https://realtimechatapp-k0c4.onrender.com"
    }
})

const userSocketMap={}
export const getReceiverSocketId=(receiver)=>{
    return userSocketMap[receiver]
}

io.on("connection",(Socket)=>{
    const userId=Socket.handshake.query.userId
    if(userId!=undefined){
        userSocketMap[userId]=Socket.id
        //userId:socketid
        //userId:socketid
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap))


    Socket.on("disconnect",()=>{
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })

})


export {app,server,io}

import express from "express";
import "dotenv/config";
import authRouter from "./src/routes/auth.route.js"
import { connectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./src/routes/user.route.js";
import messageRouter from "./src/routes/message.route.js";
import { app, server } from "./src/socket/socket.js";

//const app=express();
const port=process.env.PORT;


app.use(cors({
    origin:"https://realtimechatapp-k0c4.onrender.com",
    credentials:true
}))


app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/message",messageRouter);


server.listen(port,()=>{
    console.log(`Server is Running on port ${port}`);
    connectDB();
});

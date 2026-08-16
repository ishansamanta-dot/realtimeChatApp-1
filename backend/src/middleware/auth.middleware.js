import jwt from "jsonwebtoken";

const protectAuth=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;

        if(!token){
            return res.status(400).json({message: "Unauthorized No token found"});
        }

        let verifyToken= await jwt.verify(token,process.env.JWT_SECRET_KEY);
        //console.log("verifyToken");
        req.userId=verifyToken.userId;
        next()

    }catch(err){
        res.status(500).json({message:'Internal Server Error ${err.message}'});
        console.log("Error in protectAuth middleware",err);
    }
}

export default protectAuth;
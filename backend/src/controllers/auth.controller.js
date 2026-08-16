import genToken from "../config/jwt.js";
import User from "../model/user.js";
import jwt from "jsonwebtoken"

export async function signup(req,res){
    const {fullname,email,password}=req.body

    try{
        if (!email || !password || !fullname){
            return res.status(400).json({message:"All feilds are required"});
        }

        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }

        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email format"});
        }

        const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must include uppercase, lowercase, number & special character."
            });
        }

        const existingfullname=await User.findOne({fullname});
        if(existingfullname)
            return res.status(400).json({message:"Username already exists, please use a different Username"});


        const existingemail=await User.findOne({email});
        if(existingemail)
            return res.status(400).json({message:"Email already exists, please use a different email"});

        const user=await User.create({
            email,
            fullname,
            password,
            //profilepic: randomAvatar,
            profilepic:"",
        })

        //   JWT TOKEN GENARATE
        const token= await genToken(user._id)

        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,
            sameSite:"Strict", //prevent xss attacks
            secure:false,
            //secure:process.env.NODE_ENV==="production"
        });
        res.status(201).json({success:true,user});
        
    }catch(error){
        
        console.log("Error in Signup controller", error);
        res.status(500).json({message:"Internal Srever Error"});
    }
}

export async function login(req,res){
    try{
        const{email, password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const user = await User.findOne({email});
        if(!user) return res.status(401).json({message:"User does not Exist"});

        const isPasswordCorrect=await user.matchPassword(password)
        if(!isPasswordCorrect) return res.status(401).json({message: "Invalid Password"});

        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
        expiresIn: "7d"
        });

        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,
            sameSite:"Strict", //prevent xss attacks
            //secure:process.env.NODE_ENV==="production"
            secure:false
        });

        res.status(200).json({success:true,user});

    }catch(error){
        console.log("Error in login controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const logout=async(req,res)=>{
    try{
        res.clearCookie("jwt");
        return res.status(200).json({success:true,message:"Logout Successfully"});
    }catch(err){
        return res.status(500).json({message:`Logout error ${err}`});
    }
}
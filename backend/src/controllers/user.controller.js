import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../model/user.js"


export const getCurrentUser=async(req,res)=>{
    try{
        let userId=req.userId
        let user=await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        return res.status(200).json(user)
    }catch (err){
        return res.status(500).json({message:`Current user error ${err}`})
        console.log("Getcurrenterror")
    }
}

export const editProfile=async(req,res)=>{
    try{
        let {bio,hobbies}=req.body
        let profilepic=req.body.profilepic;

        if(bio.length>70){
            return res.status(400).json({message:"Bio cannot exceed 70 characters."});
        }

        if(req.file){
            profilepic=await uploadOnCloudinary(req.file.path)
        }
        let user=await User.findByIdAndUpdate(req.userId,{
            profilepic,
            bio,
            hobbies
        },
    {
    returnDocument: "after"
    })
    return res.status(200).json(user);

    }catch(err){
        return res.status(500).json({message:` current user error ${err.message}`});
    }
}


export const getSuggestedUsers=async(req,res)=>{
    try{
        let currentUser=await User.findById(req.userId);

        let users=await User.find({
            _id:{$ne:req.userId}
        }).select("-password")
        return res.status(200).json(users)
    }catch(err){
        return res.status(500).json({message:`get Suggested users error ${err}`})
    }
}

export const search=async (req,res)=>{
    try{
        let {query}=req.query
        if(!query){
            return res.status(400).json({message:"query is required"})
        }
        let users=await User.find({
            _id:{$ne:req.userId},
            fullname:{$regex:query,$options:"i"}
            
        })
        return res.status(200).json(users)
    }catch(err){
        return res.status(500).json({message:`Search users error ${err}`})
    }
}
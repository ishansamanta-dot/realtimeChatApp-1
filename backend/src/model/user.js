import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema=new mongoose.Schema({
    fullname:{
        type: String,
        required: true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    
    password:{
        type:String,
        required:true,
        minlength:6
    }, 

    bio:{
        type: String,
        default:"",
    },

    profilepic:{
        type: String,
        default:"",
    },

    hobbies:[{
        type:String
    }],

    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],

},{timestamps:true});

//pre hook(password hashing)
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();

    try{
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
    }catch(err) {
    }
});

userSchema.methods.matchPassword=async function (enteredPassword) {
    const isPasswordCorrect=await bcrypt.compare(enteredPassword,this.password);
    return isPasswordCorrect;   
}

const User = mongoose.model("User",userSchema);

export default User;
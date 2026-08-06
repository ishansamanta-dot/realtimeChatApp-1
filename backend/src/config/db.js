import mongoose from 'mongoose';

export const connectDB= async()=>{
    try{
        const DB=await mongoose.connect(process.env.MongoDB_url);
        console.log(`Database Is Connected: ${DB.connection.host}`);

    }catch(err){
        console.log("Error in connecting to MongoDB", err);
        process.exit(1);//1 means failure
    }
};
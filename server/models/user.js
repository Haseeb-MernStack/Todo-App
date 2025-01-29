import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

// jo naam pehle dia hai voh hi second place par bhi dena laazmi ha. e.g., "User"
export const User =  mongoose.model("User", userSchema);
import mongoose from "mongoose";
import joi from "joi";


interface user{
    name:string;
    password:string;
    email:string;
    isAdmin?:boolean
}

const userValidator=joi.object<user>({
    name:joi.string().max(120).required(),
    password:joi.string().min(8).max(20).required(),
    isAdmin:joi.boolean().optional(),
    email:joi.string().email().required()
    
})

const userSchema=new mongoose.Schema<user>({
    name:{type:String, required:true}, 
    password:{type:String, required:true},
    email:{type:String, required:true},
    isAdmin:{type:Boolean, default:false}
},{timestamps:true})

export default mongoose.model<user>("User",userSchema);
export {userValidator};



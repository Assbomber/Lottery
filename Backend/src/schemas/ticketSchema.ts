import { number } from "joi";
import mongoose from "mongoose";
import { Type } from "typescript";
import joi from "joi";

interface ticket{
    winningSum:number,
    participants:[mongoose.Schema.Types.ObjectId],
    buyPrice?:number,
    startedOn:Date,
}

const ticketValidator = joi.object<ticket>({
    winningSum:joi.number().min(500).multiple(5).required(),
    participants:joi.array().items(joi.string()).required(),
    startedOn:joi.date().required()
})



const ticketSchema=new mongoose.Schema<ticket>({
    winningSum:{type:Number, required:true},
    startedOn:{type:Date, required:true},
    participants:{type:[mongoose.Schema.Types.ObjectId],required:true},
    buyPrice:{type:Number, required:true}
    
},{timestamps:true});


export default mongoose.model<ticket>("Ticket",ticketSchema);
export {ticketValidator};
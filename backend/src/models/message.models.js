import mongoose ,{Schema} from "mongoose";

const messageSchema= new Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Message=mongoose.model("Message",messageSchema)
import mongoose ,{ Schema } from "mongoose";

const ContactSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    email:{
        type: String,
        required: true
    },
    name: {
        type: String, // Change this from ObjectId to String to store the name directly
        required: true
    }
})

export const Contact =mongoose.model("Contact",ContactSchema)
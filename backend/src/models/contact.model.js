import mongoose ,{ Schema } from "mongoose";

const ContactSchema = new Schema({
    nameA:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true


    },
    nameB:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    emailA:{
        type: String,
        required: true
    },
    emailB:{
        type: String,
        required: true,
    }

})

export const Contact =mongoose.model("Contact",ContactSchema)
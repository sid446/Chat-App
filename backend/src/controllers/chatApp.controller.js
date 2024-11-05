import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Contact } from "../models/contact.model";
import { User } from "../models/user.model";
import { io } from "..";



const addAccount=asyncHandler(async(req,res)=>{
    const {email}=req.body
    if(!email){
        throw new ApiError(400,"did not received email")
    }
    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(404,"User not found with this email")
    }

    const existedContact=await Contact.findOne({
        $or:[{userId:user._id,email}]
    })
    if(existedContact){
        throw new ApiError(400,"User already added in contact")
    }
    const newContact=new Contact({
        userId: user._id, 
        name: user.name, 
        email: user.email 
    })
    await newContact.save();

   io.to(email).emit('addAccount',{})
    



})
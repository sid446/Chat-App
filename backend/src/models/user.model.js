import mongoose ,{ Schema } from "mongoose";
import bcrypt from "bcrypt"


const userSchema=new  Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:[true,"Password is Required"],

    },
    refreshToken:{
        type:String
    },
    online:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password)
}

export const User=mongoose.model("User",userSchema)

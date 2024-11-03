import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken =async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})

        return{accessToken,refreshToken}
        
    } catch (error) {
        throw new ApiError(500,"something went wrong while creating access token and refresh token")
    }
}
const registerUser=asyncHandler(async(req,res)=>
    {
        console.log(req.body)
        const {name,email,password}= req.body

        if([name,email,password].some((field)=>field?.trim()=="")){
            throw new ApiError(400,"All field are required")
        }
        const existedUser = await User.findOne({
            $or:[{name},{email}]
        })
        if(existedUser){
            throw new ApiError(409,"User with email and name already exists")
        }
        const user = await User.create({
            name: name.toLowerCase(),
            email,
            password
        });
        
        const createdUser=await User.findById(user._id).select("-password -refreshToken")

        if(!createdUser){
            throw new ApiError(500,"Something went wrong while creating user ")
        }
        return res.status(201).json(new ApiResponse(200,createdUser,"User created successfully"))
    })

const loginUser = asyncHandler(async(req,res)=>{

    const {email,password}=req.body

    if(!email || !password){
        throw new ApiError(400,"email and password required")
    }
    const user =await User.findOne({email})

    if(!user){
        throw new ApiError(401,"Invalid credentials")
    }
    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid Password")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

    const loggedUser=await User.findById(user._id).select("-password -refreshToken")

    const option={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedUser,accessToken,refreshToken
            },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }

    )
    const option={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken",option)
    .json(new ApiResponse(200,{},"User Logged Out"))


})

export {registerUser,loginUser,logoutUser,}
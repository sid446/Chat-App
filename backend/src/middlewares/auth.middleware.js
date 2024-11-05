import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
       
        const token = req.cookies.accessToken ;
        // Check if token is defined
        if (!token) {
            console.log("Token is not provided");
            throw new ApiError(401, "Unauthorized request: Token not provided");
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find the user associated with the token
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // Check if user exists
        if (!user) {
            console.log("User not found for the provided token");
            throw new ApiError(401, "Invalid Access Token: User not found");
        }

        // Attach the user to the request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("JWT verification error:", error.message);
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});

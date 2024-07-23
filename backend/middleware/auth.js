import User from "../models/userModel.js";
import createError from "../utils/createError.js";
import jwt from "jsonwebtoken"


const auth = async (req , res , next) => {

    try {

        const token  = req.cookies.jwt

        if(!token){
            return next(createError("Not Authorized" , 401))
        }

        jwt.verify(token , process.env.JWT_SECRET_KEY , async (err , decodedToken) => {
            
            if(err){
                return next(createError("Access Forbiden" , 403))
            }

            req.user = await User.findById(decodedToken.userId).select("-password")
            
            next()

        })


    } catch (error) {
        next(error)        
    }
}



export default auth
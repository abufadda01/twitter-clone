import User from "../models/userModel.js"
import Joi from "joi"
import createError from "../utils/createError.js"



const register = async (req , res , next) => {

    const signUpSchema = Joi.object({
        username: Joi.string().required(),
        fullname: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    })

    const {value , error} = signUpSchema.validate(req.body , {abortEarly : false})
    
    if (error) {
        return next(createError ("Inavlid Credentials", 500));
    }
    
    try {
        
        const {username , fullname , email , password} = value
        
        const isUserExist = await User.findOne({email})
        const isUserNameExist = await User.findOne({username})
        
        if(isUserExist){
            return next(createError ("Email already exist", 400));        
        }
        
        if(isUserNameExist){
            return next(createError ("username already exist", 400));        
        }
        
        const newUser = new User({
            username,
            email,
            fullname,
            password
        })
        
        await newUser.save()
        
        newUser.password = undefined

        const token = newUser.signJWT()

        res.cookie("jwt" , token , {
            httpOnly : true,
            secure : process.env.NODE_ENV !== "development" ,
            sameSite : "strict" ,
            maxAge : 30 * 24 * 60 * 60 * 1000
        })  

        res.status(201).json(newUser)
    
    } catch (error) {
        next(error)
    }
}
    
    
    
    

const login = async (req , res , next) => {
        
        const signUpSchema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().min(6).required(),
        })
    
        const {value , error} = signUpSchema.validate(req.body , {abortEarly : false})
        
        if (error) {
            return next(createError ("Inavlid Credentials", 500));
        }
        
        const {username , password} = value

        try {
        
           const user = await User.findOne({username}).select("+password")
            
           if(!user){
            return next(createError ("Inavlid Credentials", 500));
           }

           const isPasswordMatched = await user.comparePassword(password , user.password)

           if(!isPasswordMatched){
            return next(createError ("Inavlid Credentials", 500));
           }

           const token = user.signJWT()

           user.password = undefined

           res.cookie("jwt" , token , {
               httpOnly : true,
               secure : process.env.NODE_ENV !== "development" ,
               sameSite : "strict" ,
               maxAge : 30 * 24 * 60 * 60 * 1000
           })  

           res.status(200).json(user)

    } catch (error) {
        next(error)
    }
}





const logout = async (req , res , next) => {
    try {
        res.cookie("jwt" , "" , {maxAge : 0})
        res.status(200).json({msg : "Logged out successfully"})
    } catch (error) {
        next(error)
    }
}





const getMe = async (req , res , next) => {

    try {
            
        const user = await User.findById(req.user._id).select("-password")
       
        if(!user){
            return next(createError("User not found" , 404))
        }

        res.status(200).json(user)

    } catch (error) {
        next(error)
    }
}




export {register , login , logout , getMe}
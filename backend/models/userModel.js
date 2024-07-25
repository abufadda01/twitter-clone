import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
    username : {
        type : String ,
        required : true ,
        unique : true
    },
    fullName : {
        type : String ,
        required : true ,
    },
    password : {
        type : String ,
        required : true ,
        select : false ,
        min : [6 , "password must be at least 6 digits"]
    },
    email : {
        type : String ,
        required : true ,
        unique : true,
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ , "please add a valid email structure"]
    },
    followers : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "users" ,
            default : []
        }
    ],
    following : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "users" ,
            default : []
        }
    ],
    profileImg : {
        type : String ,
        default : ""
    },
    coverImg : {
        type : String ,
        default : ""
    },
    bio : {
        type : String ,
        default : ""
    },
    link : {
        type : String ,
        default : ""
    },
    likedPosts : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "posts" ,
            default : []
        }
    ]
} , {timestamps : true})




userSchema.pre("save" , async function(next) {
    
    if(!this.isModified("password")){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password , salt)
    this.password = hashedPassword

})



userSchema.methods.signJWT = function(){
    return jwt.sign({userId : this._id} , process.env.JWT_SECRET_KEY , {expiresIn : process.env.JWT_SECRET_EXPIRE})
}


userSchema.methods.comparePassword = async function(password , savedPassword) {
    return await bcrypt.compare(password , savedPassword)
}


const User = mongoose.model("users" , userSchema)



export default User
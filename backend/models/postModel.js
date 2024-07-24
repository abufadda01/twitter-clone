import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users" ,
        required : true
    },
    text : {
        type : String
    },
    img : {
        type : String
    },
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "users"
        }
    ],
    comments : [
        {
            user : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "users" ,
                required : true
            },
            text : {
                type : String
            }
        }
    ]
} , {timestamps : true})




const Post = mongoose.model("posts" , postSchema)



export default Post
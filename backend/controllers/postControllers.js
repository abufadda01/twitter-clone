import User from "../models/userModel.js"
import Post from "../models/postModel.js"
import createError from "../utils/createError.js"
import { v2 as cloudinary } from "cloudinary"
import Notification from "../models/notificationModel.js"




const getAllPosts = async (req , res , next) => {

    try {
        
        // sort them by lastest one (the newest)
        const posts = await Post.find().sort({createdAt : -1}).populate("user").populate("comments.user") // .populate({path : "user" , select : "selected keys names"})
        
        if(posts.length === 0){
            res.status(200).json([])
        }

        res.status(200).json(posts)

    } catch (error) {
        next(error)
    }
}





const createPost = async (req , res , next) => {

    try {
        
        const {text} = req.body
        let {img} = req.body

        const user = await User.findById(req.user._id)

        if(!user){
            return next(createError("User not found" , 404))
        }

        if(!text &!img){
            return next(createError("you must at least provide text or image to create a post" , 400))            
        }

        if(img){
            const uploadUrl = await cloudinary.uploader.upload(img)
            img = uploadUrl.secure_url
        }

        const newPost = new Post({
            user : req.user._id ,
            text ,
            img
        })

        await newPost.save()

        res.status(201).json(newPost)

    } catch (error) {
        next(error)
    }

}





const likeUnlikePost = async (req , res , next) => {

    try {
        
        const {postId} = req.params

        const loggedUserId = req.user._id

        const post = await Post.findById(postId)

        if(!post){
            return next(createError("Post not found" , 404))
        }

        const isUserAlreadyLikedPost = post.likes.includes(loggedUserId)

        // if already user like the post so we must remove its like now from likes array (unlike case)
        if(isUserAlreadyLikedPost){

            await Post.findByIdAndUpdate(post._id , {$pull : {likes : loggedUserId}} , {new : true})
            await User.findByIdAndUpdate(req.user._id , {$pull : {likedPosts : postId}} , {new : true})
            
            const updatedLikes = post.likes.filter((userId) => userId.toString() !== loggedUserId.toString())

            res.status(200).json(updatedLikes)

        }else{

            // if user not liked this post before so we add user id to the likes array (like case)
            post.likes.push(loggedUserId)
            
            await User.findByIdAndUpdate(req.user._id , {$push : {likedPosts : postId}} , {new : true})

            const newNotification = new Notification({
                from : req.user._id ,
                to : post.user ,
                type : "like"
            }) 

            await newNotification.save()
            await post.save()
            
            res.status(200).json(post.likes)

        }

    } catch (error) {
        next(error)
    }

}





const commentOnPost = async (req , res , next) => {

    try {
        
        const {text} = req.body
        const {postId} = req.params

        const loggedUserId = req.user._id

        const post = await Post.findById(postId)

        if(!post){
            return next(createError("Post not found" , 404))
        }

        if(!text){
            return next(createError("post text is required" , 400))
        }

        const comment = {user : loggedUserId , text }

        post.comments.push(comment)

        await post.save()

        res.status(201).json(post)

    } catch (error) {
        next(error)
    }

}





const deletePost = async (req , res , next) => {

    try {
        
        const {postId} = req.params

        const post = await Post.findById(postId)

        if(!post){
            return next(createError("Post not found" , 404))
        }

        if(post.user.toString() !== req.user._id.toString()){
            return next(createError("You don't have access to delete this post" , 401))            
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0]
            cloudinary.uploader.destroy(imgId)
        }

        await Post.findByIdAndDelete(postId)

        res.status(200).json({msg : "Post deleted successfully"})

    } catch (error) {
        next(error)
    }

}





const getLikedPosts = async (req , res , next) => {

    try {
        
        const loggedUserId = req.user._id

        const user = await User.findById(req.params.id)

        if(!user){
            return next(createError("User not found" , 404))
        }

        const likedPosts = await Post.find({_id : {$in : user.likedPosts}}).populate("user").populate("comments.user")
        
        res.status(200).json(likedPosts)

    } catch (error) {
        next(error)
    }

}





const getFollowingPosts = async (req , res , next) => {

    try {
         
        const loggedUserId = req.user._id

        const user = await User.findById(loggedUserId)

        if(!user){
            return next(createError("User not found" , 404))
        }

        const userFollowingArr = user.following

        const userFollowingPosts = await Post.find({user : {$in : userFollowingArr}})
            .sort({createdAt : -1})
            .populate("user")
            .populate("comments.user")

        res.status(200).json(userFollowingPosts)    

    } catch (error) {
        next(error)
    }

}





const getUserPosts = async (req , res , next) => {

    try {
        
        const {username} = req.params
        const loggedUserId = req.user._id

        const user = await User.findById(loggedUserId)

        if(!user){
            return next(createError("User not found" , 404))
        }

        const targetUser = await User.findOne({username})

        if(!targetUser){
            return next(createError("User not found" , 404))
        }

        const targetUserPosts = await Post.find({user : targetUser._id})
            .sort({createdAt : -1})
            .populate("user")
            .populate("comments.user")

        res.status(200).json(targetUserPosts)

    } catch (error) {
        next(error)
    }

}





export {
    createPost , 
    likeUnlikePost , 
    commentOnPost , 
    deletePost , 
    getAllPosts , 
    getLikedPosts ,
    getFollowingPosts,
    getUserPosts
}
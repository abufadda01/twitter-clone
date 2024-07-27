import Notification from "../models/notificationModel.js"
import User from "../models/userModel.js"
import createError from "../utils/createError.js"
import {v2 as cloudinary} from "cloudinary"



const getUserProfile = async (req , res , next) => {

    const {username} = req.params

    try {
        
        const user = await User.findOne({username})

        if(!user){
            return next(createError("User not found" , 404))
        }

        res.status(200).json(user)

    } catch (error) {
        next(error)
    }

}





const followUnfollowUser = async (req , res , next) => {

    try {
        
        const {userId} = req.params

        const targetUser = await User.findById(userId)
        const loggedUser = await User.findById(req.user._id)

        if(userId.toString() === req.user._id.toString()){
            return next(createError("You can't follow or unFollow your self" , 400))
        }

        if(!targetUser || !loggedUser){
            return next(createError("User not found" , 404))            
        }

        // check if the user i want to follow him is inside my following list
        const isFollowing = loggedUser.following.includes(userId)

            // unFollow him
            // update the target user followers array and pull me from it
            // then update my following array and pull the target user id from it
        if(isFollowing){
            const updatedTargetdUser = await User.findByIdAndUpdate(userId , {$pull : {followers : req.user._id}} , {new : true})            
            const updatedLoggedUser = await User.findByIdAndUpdate(req.user._id , {$pull : {following : userId}} , {new : true})
            res.status(200).json({updatedLoggedUser , updatedTargetdUser})            
        }else{
            // follow him
            // update the target user followers array and push me inside it
            // then update my following array and push the target user id inside it
            const updatedTargetdUser = await User.findByIdAndUpdate(userId , {$push : {followers : req.user._id}} , {new : true})
            const updatedLoggedUser = await User.findByIdAndUpdate(req.user._id , {$push : {following : userId}} , {new : true})
            
            // send notification to the user that i follow him
            const newNotification = new Notification({
                from : req.user._id ,
                to : targetUser._id ,
                type : "follow"
            }) 

            await newNotification.save()

            res.status(200).json({updatedLoggedUser , updatedTargetdUser})            
        
        }

    } catch (error) {
        next(error)
    }

}





const getSuggestedUsers = async (req , res , next) => {

    try {
        
        const loggedUserId = req.user._id

        const loggedUser = await User.findById(loggedUserId)

        // get users without the logged user by using aggregate pipline stages
        // first stage will be find users that _id key match the operator (not equal the logged user id)
        // second stage return a sample random data with 10 different users
        const users = await User.aggregate([
            {
                $match : {_id : {$ne : loggedUserId}}
            },
            {
                $sample : {size : 20}
            }
        ])

        
        // filter the returned users array by remove the users that i already follwed them , and only keep the users that i dont follow them (not inside my following array) 
        const filteredUser = users.filter(user => !loggedUser.following.includes(user._id))

        // slice and get only 4 of them
        const suggestedUsers = filteredUser.slice(0 , 4)

        // remove their password key to not return it in the response
        suggestedUsers.forEach(user => user.password = null)


        res.status(200).json(suggestedUsers)

    } catch (error) {
        next(error)
    }

}





const updateUserProfile = async (req , res , next) => {

    try {
        
        const {fullName , email , username , currentPassword , newPassword , bio , link} = req.body
        let {profileImg , coverImg} = req.body

        const loggedUserId = req.user._id

        let loggedUser = await User.findById(loggedUserId).select("+password")

        if(!loggedUser){
            return next(createError("User not found" , 404))
        }

        if((!newPassword && currentPassword) || (!currentPassword && newPassword)){
            return next(createError("please provide both new password and current password" , 400))
        }

        if(currentPassword && newPassword){

            const isPasswordMatch = await loggedUser.comparePassword(currentPassword , loggedUser.password)

            if(!isPasswordMatch){
                return next(createError("incorrect current password" , 400))
            }

            if(newPassword.length < 6){
                return next(createError("new password must be more than 6 digits" , 400))
            }

            loggedUser.password = newPassword

        }


        if(profileImg){

            // if user already has a profile image we want to delete the previous one before save the new one to always free some storage 
            if(loggedUser.profileImg){
                await cloudinary.uploader.destroy(loggedUser.profileImg.split("/").pop().split(".")[0])
            }

            const uploadUrl = await cloudinary.uploader.upload(profileImg)
            profileImg = uploadUrl.secure_url

            loggedUser.profileImg = profileImg
        }


        if(coverImg){
            
            // if user already has a cover image we want to delete the previous one before sace the new one to always free some storage 
            if(loggedUser.coverImg){
                await cloudinary.uploader.destroy(loggedUser.coverImg.split("/").pop().split(".")[0])
            }

            const uploadUrl = await cloudinary.uploader.upload(coverImg)
            coverImg = uploadUrl.secure_url

            loggedUser.coverImg = coverImg
        }
        

        if(fullName){
            loggedUser.fullname = fullName
        }

        if(username){
            loggedUser.username = username
        }

        if(email){
            loggedUser.email = email
        }
  
        if(bio){
            loggedUser.bio = bio
        }

        if(link){
            loggedUser.link = link
        }

        await loggedUser.save()

        loggedUser.password = undefined

        res.status(200).json(loggedUser)

    } catch (error) {
        next(error)
    }

}





export {getUserProfile , followUnfollowUser , getSuggestedUsers , updateUserProfile}
import User from "../models/userModel.js"
import createError from "../utils/createError.js"



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
            res.status(200).json({updatedLoggedUser , updatedTargetdUser})            
        }

    } catch (error) {
        next(error)
    }

}







export {getUserProfile , followUnfollowUser}
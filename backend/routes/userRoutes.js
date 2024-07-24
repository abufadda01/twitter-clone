import express from "express"
import auth from "../middleware/auth.js"
import { getUserProfile , followUnfollowUser, getSuggestedUsers, updateUserProfile } from "../controllers/userControllers.js"


const userRoutes = express.Router()


userRoutes.get("/profile/:username" , auth , getUserProfile)

userRoutes.post("/follow/:userId" , auth , followUnfollowUser)

userRoutes.get("/suggested" , auth , getSuggestedUsers)

userRoutes.patch("/update/profile" , auth , updateUserProfile)




export default userRoutes 
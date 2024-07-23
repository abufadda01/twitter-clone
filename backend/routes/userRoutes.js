import express from "express"
import auth from "../middleware/auth.js"
import { getUserProfile , followUnfollowUser } from "../controllers/userControllers.js"


const userRoutes = express.Router()


userRoutes.get("/profile/:username" , auth , getUserProfile)

userRoutes.post("/follow/:userId" , auth , followUnfollowUser)

// userRoutes.get("/suggested" , auth , getUserPrfile)


// userRoutes.patch("/update/profile" , auth , getUserPrfile)



export default userRoutes
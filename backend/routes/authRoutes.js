import express from "express"

import { 
    register , 
    login , 
    logout, 
    getMe 
} from "../controllers/authControllers.js"

import auth from "../middleware/auth.js"


const authRoutes = express.Router()


authRoutes.get("/getMe" , auth , getMe)

authRoutes.post("/register" , register)

authRoutes.post("/login" , login)

authRoutes.post("/logout" , logout)



export default authRoutes
import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import cors from "cors"
import {v2 as cloudinary} from "cloudinary"
import cookieParser from "cookie-parser"
import connectDB from "./db/connectDB.js"
import errorHandler from "./middleware/errorHandler.js"

import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"

dotenv.config({path : "./.env"})


// CLOUDINARY config
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME ,
    api_key : process.env.CLOUDINARY_API_KEY ,
    api_secret : process.env.CLOUDINARY_API_SECRET
})



const app = express()


// middlewares
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended : true}))

// to parse and access the req cookies
app.use(cookieParser())



// routes
app.use("/api/auth" , authRoutes)
app.use("/api/user" , userRoutes)
app.use("/api/post" , postRoutes)




app.use(errorHandler)


const port = process.env.PORT

const start = async () => {
    try {
        app.listen(process.env.PORT , () => console.log(`Twitter server started on port ${port}`.bgBlue.red))
        await connectDB()
    } catch (error) {
        next(error)
    }
}


start()
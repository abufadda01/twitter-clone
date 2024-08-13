import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import cors from "cors"
import {v2 as cloudinary} from "cloudinary"
import cookieParser from "cookie-parser"
import connectDB from "./db/connectDB.js"
import errorHandler from "./middleware/errorHandler.js"
import morgan from "morgan"
import path from "path"

import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"

dotenv.config({path : "./.env"})


// CLOUDINARY config
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME ,
    api_key : process.env.CLOUDINARY_API_KEY ,
    api_secret : process.env.CLOUDINARY_API_SECRET
})



const app = express()

const __dirname = path.resolve()


// middlewares
app.use(express.json({limit : "5mb"})) // to limit the uploaded req file size to be up to 5 mega byte

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.urlencoded({extended : true}))

// to parse and access the req cookies
app.use(cookieParser())

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
  


// routes
app.use("/api/auth" , authRoutes)
app.use("/api/user" , userRoutes)
app.use("/api/post" , postRoutes)
app.use("/api/notification" , notificationRoutes)



app.use(errorHandler)


if(process.env.NODE_ENV === "production"){

    app.use(express.static(path.join(__dirname , "/client/dist")))

    app.get("*" , (req , res) => {
        res.sendFile(path.resolve(__dirname , "client" , "dist" , "index.html"))
    })
}


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
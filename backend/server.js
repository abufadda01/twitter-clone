import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./db/connectDB.js"
import errorHandler from "./middleware/errorHandler.js"

import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config({path : "./.env"})

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
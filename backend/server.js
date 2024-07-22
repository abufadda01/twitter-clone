import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import connectDB from "./db/connectDB.js"
import authRoutes from "./routes/authRoutes.js"
import errorHandler from "./middleware/errorHandler.js"

dotenv.config({path : "./.env"})

const app = express()


// routes
app.use("/api/auth" , authRoutes)




app.use(errorHandler)


const port = process.env.PORT

const start = async () => {
    try {
        app.listen(process.env.PORT , () => console.log(`Twitter server started on port ${port}`.bgBlue.red))
        await connectDB()
    } catch (error) {
        
    }
}


start()
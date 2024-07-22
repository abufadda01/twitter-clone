import mongoose from "mongoose";



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('TWITTER CLONE DATABASE CONNECTED SUCCESSFULLY'.black.bgMagenta)
    } catch (error) {
        console.log(`FAILED IN CONNECTION TO THE DB ERR : ${err}`.red)
        process.exit(1)
    }
}


export default connectDB
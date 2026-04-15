import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const mongoDBUri = process.env.MONGODBURI || "mongodb://localhost:27017/expense-tracker"

        const connection = await mongoose.connect(mongoDBUri)
        console.log("====================================")
        console.log(" MongoDB Connected Successfully.")
        console.log(` Database: ${connection.connection.name}`)
        console.log(` Host: ${connection.connection.host}`)
        console.log("====================================")
    } catch (error) {
        console.log("====================================")
        console.log(" MongoDB Connection Error:", error)
        console.log("====================================")
    }
}

export default connectDB;
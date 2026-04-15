import express, { Application } from "express"
import expenseRoutes from "./routes/expenseRoutes"
import authRoutes from "./routes/authRoutes"
import profileRoutes from "./routes/profileRoutes"
import analyticsRoutes from "./routes/analyticsRoutes"
import { errorHandler } from "./middlewares/errorHandler"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db"

dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 5000;

connectDB();

const corsOptions = {
    origin: "https://localhost:3000",
    credentials: true,
}

app.use(cors(corsOptions))

app.use(express.json())

app.use("/api/expenses", expenseRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/analytics", analyticsRoutes)

app.use((req,res) => {
    res.status(404).json({
        success: false,
        errorMessage: `Cannot Find ${req.method} ${req.originalUrl}`,
    });
});

app.use(errorHandler)

app.listen(PORT, ()=> {
    console.log(`Server is running at PORT: ${PORT}`)
    console.log(
        `Port loaded from: ${process.env.PORT} ? ".env file" : default (8000)`
    );
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
})

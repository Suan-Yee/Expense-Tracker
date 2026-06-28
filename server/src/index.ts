import express, { Application } from "express"
import expenseRoutes from "./routes/expenseRoutes"
import authRoutes from "./routes/authRoutes"
import profileRoutes from "./routes/profileRoutes"
import analyticsRoutes from "./routes/analyticsRoutes"
import budgetRoutes from "./routes/budgetRoutes"
import { errorHandler } from "./middlewares/errorHandler"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db"

dotenv.config()

const app: Application = express()
const PORT = Number(process.env.PORT) || 5000
const HOST = process.env.HOST || "localhost"
const allowedOrigins = (process.env.CLIENT_URLS || "http://localhost:3000,http://localhost:3001,http://localhost:5173,http://127.0.0.1:5173,http://127.0.0.1:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

connectDB()

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())

app.use("/api/expenses", expenseRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/budgets", budgetRoutes)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        errorMessage: `Cannot Find ${req.method} ${req.originalUrl}`,
    })
})

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`)
    console.log(`Port source: ${process.env.PORT ? ".env file" : "default (5000)"}`)
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
    console.log(`Allowed client origins: ${allowedOrigins.join(", ")}`)
})

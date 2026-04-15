import { Request, Response } from "express";
import { AuthResponse } from "../types";
import { AppError } from "../middlewares/errorHandler";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/tokenHelper";

// export let mockUsers: User[] = [
//     {
//         id: "user_001",
//         name: "Alice Johnson",
//         email: "alice@example.com",
//         password: "hashed_password_123",
//         createdAt: new Date("2026-03-20T10:00:00"),
//         updatedAt: new Date("2026-03-20T10:00:00"),
//   },
//   {
//         id: "user_002",
//         name: "Bob Smith",
//         email: "bob@example.com",
//         password: "hashed_password_456",
//         createdAt: new Date("2026-03-22T14:30:00"),
//         updatedAt: new Date("2026-03-22T14:30:00"),
//   }
// ]

export const signup = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    if(!name || !email || !password) {
        throw new AppError("Please provide name, email and password", 400);
    }

    if (name && name.trim().length < 2) {
        throw new AppError("Name must be at least 2 characters long.", 400);
    }

    if (name && name.trim().length > 50) {
        throw new AppError("Name cannot exceed 50 characters long.", 400);
    }

    if (email) {
        const emailRegax = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegax.test(email)) {
            throw new AppError("Invalid email format", 400);
        }
    }

    if (password) {
        if (password.length < 8) {
            throw new AppError("password must be at least 8 characters.", 400)
        }
        const passwordRegax = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!passwordRegax.test(password)) {
            throw new AppError("password must be contain uppercase, lowercase, number and special character.", 400)
        }
    }
    // const existingUser = mockUsers.find(user => user.email === email);
    const existingUser = await User.findOne({ email: email });

    if(existingUser) {
        throw new AppError("This email is already used for registration.", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = new User({
        name,
        email,
        password: hashedPassword
    })
    
    const savedUser = await newUser.save();
    const userObject = savedUser.toObject();

    const { password: _, ...userWithoutPassword } = userObject;

    const authResponse: AuthResponse = {
        user: { ...userWithoutPassword, _id: savedUser._id.toString() },
        token: "fake-jwt-token" + newUser.id
    };

    sendSuccess<AuthResponse>(res, authResponse, "Account created successfully", 201);
})

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    if(!email || !password) {
        throw new AppError("Please provide name and password", 400);
    }

    // const existingUser = mockUsers.find(user => user.email === email);
    const user = await User.findOne({ email: email })

    if(!user) {
        throw new AppError("Invalid email or password!", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 403);
    }

    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;
    const token = generateToken(user._id.toString());

    const authResponse: AuthResponse = {
        token,
        user: { ...userWithoutPassword, _id: user._id.toString() }
    }

    sendSuccess<AuthResponse>(res, authResponse, "User Login Successfully.", 200);
})

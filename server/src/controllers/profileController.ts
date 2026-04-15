import { Request, Response } from "express";
import { AppError } from "../middlewares/errorHandler";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers";
import User from "../models/User";
import bcrypt from "bcryptjs";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {

    const userId = req.userId;
    // const user = mockUsers.find(user => user.id === userId)!
    const user = await User.findOne({ _id: userId });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const userObject = user.toObject();

    const { password: _, ...userWithoutPassword } = userObject;

    sendSuccess(res, userWithoutPassword, "User profile retrieved successfully", 200)
})

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {

    const userId = req.userId;
    const { name, email, password } = req.body;

    if (!name && !email && !password) {
        throw new AppError("please provide name, email or password!", 400)
    }

    if (name && name.trim().length < 2) {
        throw new AppError("Name must be at least 2 characters long.", 400)
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

    // const userIndex = mockUsers.findIndex(user => user.id === userId)
    const user = await User.findOne({ _id: userId });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (email && email !== user.email) {
        // const emailExists = mockUsers.find(user => user.email === email);
        const emailExists = await User.findOne({ email: email, _id: { $ne: userId } });

        if (emailExists) {
            throw new AppError("Email already in use!", 409);
        }
    }

    if (name) {
        user.name = name;
    }

    if (email) {
        user.email = email;
    }

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
    }

    const updatedUser = await user.save();
    const userObject = updatedUser.toObject();
    const { password: _, ...userWithoutPassword } = userObject;

    sendSuccess(res, userWithoutPassword, "Profile uploaded successful.", 200);
});

import mongoose, { Schema } from "mongoose";
import { IGoal } from "../types";

const goalSchema = new Schema<IGoal>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Goal title is required"],
            trim: true,
        },
        targetAmount: {
            type: Number,
            required: [true, "Target amount is required"],
            min: [1, "Target amount must be greater than 0"],
        },
        currentAmount: {
            type: Number,
            default: 0,
            min: [0, "Current amount cannot be negative"],
        },
        deadline: {
            type: Date,
        },
        category: {
            type: String,
            default: "other",
            trim: true,
            lowercase: true,
        },
        color: {
            type: String,
            default: "emerald",
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

goalSchema.index({ userId: 1, createdAt: -1 });

const Goal = mongoose.model<IGoal>("Goal", goalSchema);
export default Goal;

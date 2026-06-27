import mongoose, { Schema } from "mongoose";
import { IBudget } from "../types";

const budgetSchema = new Schema<IBudget>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        limit: {
            type: Number,
            required: true,
            min: [1, "Budget limit must be greater than 0"],
        },
        month: {
            type: Number,
            required: true,
            min: 0,
            max: 11,
        },
        year: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Unique constraint: one budget per category per month per year per user
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model<IBudget>("Budget", budgetSchema);
export default Budget;

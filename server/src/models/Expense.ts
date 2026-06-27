import mongoose, { Schema } from "mongoose";
import { IExpense, TransactionType, RecurringFrequency } from "../types";

const expenseSchema = new Schema<IExpense>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: Object.values(TransactionType),
            default: TransactionType.EXPENSE
        },
        category: {
            type: String,
            trim: true,
            lowercase: true
        },
        description: {
            type: String,
            trim: true,
        },
        date: {
            type: Date,
            default: Date.now
        },
        tags: {
            type: [String],
            default: []
        },
        isRecurring: {
            type: Boolean,
            default: false
        },
        frequency: {
            type: String,
            enum: Object.values(RecurringFrequency),
        },
        nextDueDate: {
            type: Date,
        },
    },
    {
        timestamps: true
    }
)

expenseSchema.index({ userId: 1, isRecurring: 1, nextDueDate: 1 });

const Expense = mongoose.model<IExpense>("Expense", expenseSchema)
export default Expense;
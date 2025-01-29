import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    }
});

// jo naam pehle dia hai voh hi second place par bhi dena laazmi ha. e.g., "Todo"
export const Todo = mongoose.model("Todo", todoSchema);
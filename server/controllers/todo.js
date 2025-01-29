import { Todo } from "../models/todo.js";

// Todo CRUD Operation's.
// create Todo
export const createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const todo = new Todo({ title, description });
        todo.save();

        return res.status(201).json({
            success: true,
            message: "Todo created.",
            todo,
        });
    } catch (error) {
        console.log(error);
    }
}
// read Todo
export const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find(); // sara kuch mil jy ga jo todos mai ho ga.

        return res.status(200).json({
            success: true,
            todos,
        })
    } catch (error) {
        console.log(error);
    }
}
// update todo
export const updateTodo = async (req, res) => {
    try {
        const todoId = req.params.todoId; // Get the todoId from the URL params
        const { title, description } = req.body; // Destructure both title and description from the request body

        // Check if both title and description are provided
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required."
            });
        }

        // Find the todo by its ID and update the fields
        const todo = await Todo.findByIdAndUpdate(
            todoId,
            { title, description }, // Update both title and description
            { new: true, runValidators: true } // Return updated document and run validation
        );

        // If the todo does not exist, return a 404 error
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found."
            });
        }

        // Return the updated todo
        return res.status(200).json({
            success: true,
            message: "Todo updated successfully.",
            todo,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
};

// delete todo
export const deleteTodo = async (req, res) => {
    try {
        const todoId = req.params.todoId;
        await Todo.findByIdAndDelete(todoId);
        return res.status(200).json({
            success: true,
            message: "Todo deleted successfully.",
        })
    } catch (error) {
        console.log(error);
    }
}
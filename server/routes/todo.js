import express from 'express';
import { createTodo, deleteTodo, getAllTodos, updateTodo } from '../controllers/todo.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

// Basic API Endpoints for CRUD operations
router.route("/")
    .post(isAuthenticated, createTodo)
    .get(getAllTodos);

router.route("/:todoId")
    .put(isAuthenticated, updateTodo)  // PUT for updating a specific todo
    .delete(isAuthenticated, deleteTodo);

export default router;

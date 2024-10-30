import { addTodo, getAllTodos, getAllTodosByUserId, getOneTodo, removeTodo, updateTodoStatus, updateTodoTitle } from "../controllers/controllers.ts";

import { Router } from "../deps.ts";
import { authMiddleware } from "../controllers/middleware-jwt.ts";

export const todoRouter = new Router();

todoRouter
    .post("/todos", authMiddleware, addTodo)
    .get("/todos/user/:id", authMiddleware, getAllTodosByUserId)
    .get("/todos/admin", authMiddleware, getAllTodos)
    .patch("/todos/status/:id", authMiddleware, updateTodoStatus)
    .patch("/todos/title/:id", authMiddleware, updateTodoTitle)
    .get("/todos/:id", authMiddleware, getOneTodo)
    .delete("/todos/:id", authMiddleware, removeTodo)


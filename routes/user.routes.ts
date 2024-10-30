import { getAllUsers, login, signup } from "../controllers/controllers.ts";

import { Router } from "../deps.ts";
import { authMiddleware } from "../controllers/middleware-jwt.ts";

export const userRouter = new Router();

userRouter
    .get("/users", authMiddleware, getAllUsers)
    .post("/users", signup)
    .post("/users/auth", login)

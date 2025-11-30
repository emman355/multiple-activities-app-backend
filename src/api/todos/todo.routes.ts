import { Router } from "express";
import { TodoController } from "./todo.controller.js";
import { requireAuth } from "../../middleware/auth.js";

export const todoRouter = Router();

todoRouter.use(requireAuth);

todoRouter.get("/", TodoController.list);
todoRouter.post("/", TodoController.create);
todoRouter.patch("/:id", TodoController.update);
todoRouter.delete("/:id", TodoController.remove);

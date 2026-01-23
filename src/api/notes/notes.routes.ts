import { Router } from "express";
import { NotesController } from "./notes.controller.js";
import { requireAuth } from "../../middleware/auth.js";

export const notesRouter = Router();

notesRouter.use(requireAuth);

notesRouter.get("/", NotesController.list);
notesRouter.get("/:id", NotesController.getById);
notesRouter.post("/", NotesController.create);
notesRouter.patch("/:id", NotesController.update);
notesRouter.delete("/:id", NotesController.remove);

import { Request, Response, NextFunction } from "express";
import { NotesRepo } from "./notes.repo.js";

export const NotesController = {
  // GET /notes
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await NotesRepo.list(req.user!.id);
      res.json(items);
    } catch (err) {
      next(err); // delegate to errorMiddleware
    }
  },

  // GET /notes/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await NotesRepo.getById(req.params.id, req.user!.id);
      if (!items || items.length === 0) {
        const notFound = new Error("NotFoundError");
        return next(notFound);
      }
      res.json(items[0]);
    } catch (err) {
      next(err);
    }
  },

  // POST /notes
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body?.title) {
        throw new Error("ValidationError: Title is required");
      }
      if (!req.body?.content) {
        throw new Error("ValidationError: Content is required");
      }
      const [item] = await NotesRepo.create(
        req.user!.id,
        req.body.title,
        req.body.content,
        req.body.category
      );
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },

  // PUT /notes/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    console.log("Update request:", req.params.id, req.user, req.body);
    try {
      const [item] = await NotesRepo.update(
        req.params.id,
        req.user!.id,
        req.body
      );
      if (!item) {
        const notFound = new Error("NotFoundError");
        return next(notFound);
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  // DELETE /notes/:id
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [item] = await NotesRepo.remove(req.params.id, req.user!.id);
      if (!item) {
        const notFound = new Error("NotFoundError");
        return next(notFound);
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
};

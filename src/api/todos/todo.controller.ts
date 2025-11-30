import { Request, Response, NextFunction } from "express";
import { TodoRepo } from "./todo.repo.js";

export const TodoController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await TodoRepo.list(req.user!.id);
      res.json(items);
    } catch (err) {
      next(err); // delegate to errorMiddleware
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body?.title) {
        throw new Error("ValidationError: Title is required");
      }
      const [item] = await TodoRepo.create(req.user!.id, req.body.title);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [item] = await TodoRepo.update(req.params.id, req.user!.id, req.body);
      if (!item) {
        const notFound = new Error("NotFoundError");
        return next(notFound);
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [item] = await TodoRepo.remove(req.params.id, req.user!.id);
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

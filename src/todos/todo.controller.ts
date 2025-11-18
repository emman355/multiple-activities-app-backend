import { Request, Response } from "express";
import { TodoRepo } from "./todo.repo.js";

export const TodoController = {
  list: async (req: Request, res: Response) => {
    const items = await TodoRepo.list(req.user!.id);
    res.json(items);
  },
  get: async (req: Request, res: Response) => {
    const item = await TodoRepo.get(req.params.id, req.user!.id);
    if (!item.length) return res.status(404).json({ error: "Not found" });
    res.json(item[0]);
  },
  create: async (req: Request, res: Response) => {
    const [item] = await TodoRepo.create(req.user!.id, req.body.title);
    res.status(201).json(item);
  },
  update: async (req: Request, res: Response) => {
    const [item] = await TodoRepo.update(req.params.id, req.user!.id, req.body);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  },
  remove: async (req: Request, res: Response) => {
    const [item] = await TodoRepo.remove(req.params.id, req.user!.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
  }
};

import { db } from "../config/db.js";
import { todos } from "../schema/todos.js";
import { eq, and } from "drizzle-orm";

export const TodoRepo = {
  list: (userId: string) => db.select().from(todos).where(eq(todos.userId, userId)),
  get: (id: string, userId: string) =>
    db.select().from(todos).where(and(eq(todos.id, id), eq(todos.userId, userId))),
  create: (userId: string, title: string) =>
    db.insert(todos).values({ userId, title }).returning(),
  update: (id: string, userId: string, patch: Partial<{ title: string; done: boolean }>) =>
    db.update(todos).set(patch).where(and(eq(todos.id, id), eq(todos.userId, userId))).returning(),
  remove: (id: string, userId: string) =>
    db.delete(todos).where(and(eq(todos.id, id), eq(todos.userId, userId))).returning()
};

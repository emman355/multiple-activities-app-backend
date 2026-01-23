import { eq, and } from "drizzle-orm";
import { db } from "../../config/db.js";
import { notes } from "../../schema/notes.js";

export const NotesRepo = {
  // List all notes for a user
  list: (userId: string) =>
    db.select().from(notes).where(eq(notes.userId, userId)),

  // Get a single note by ID (only if it belongs to the user)
  getById: (id: string, userId: string) =>
    db
      .select()
      .from(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId))),

  // Create a new note
  create: (
    userId: string,
    title: string,
    content: unknown,
    tag?: string
  ) =>
    db
      .insert(notes)
      .values({ userId, title, content, tag })
      .returning(),

  // Update a note (only if it belongs to the user)
  update: (
    id: string,
    userId: string,
    patch: Partial<{ title: string; content: unknown; tag: string }>
  ) =>
    db
      .update(notes)
      .set({ ...patch, updatedAt: new Date() })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning(),

  // Remove a note (only if it belongs to the user)
  remove: (id: string, userId: string) =>
    db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning()
};

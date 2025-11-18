import { pgTable, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const todos = pgTable("todos", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid("user_id").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  done: boolean("done").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

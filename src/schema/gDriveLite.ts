import { pgTable, uuid, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Assuming you already have a `users` table defined
export const gDriveLiteSchema = pgTable("drive_lite_photos", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid("user_id").notNull(),
  photoName: varchar("photo_name", { length: 150 }).notNull(),
  photoUrl: text("photo_url").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fileSize: integer("file_size").notNull(),
  fileType: varchar("file_type"),
  width: integer("width"),
  height: integer("height"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});
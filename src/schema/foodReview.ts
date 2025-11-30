import { pgTable, uuid, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const foodReview = pgTable("foodReview", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid("user_id").notNull(),
  photoName: varchar("photo_name", { length: 150 }).notNull(),
  photoUrl: text("photo_url").notNull(),
  location: text("location"), // 🔄 renamed from description
  rating: integer("rating"),  // optional until review is added
  review: text("review"),     // owner’s single comment
  uploadDate: timestamp("upload_date", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

import { pgTable, uuid, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";

export const pokemonReview = pgTable("pokemon_review", {
  id: uuid("id").defaultRandom().primaryKey(),
  pokemonId: integer("pokemon_id").notNull(),
  userEmail: varchar("user_email", { length: 255 }).notNull(), // 👈 new column
  userId: uuid("user_id").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  pokemonName: varchar("pokemon_name", { length: 100 }),
  uploadDate: timestamp("upload_date").defaultNow(),
});
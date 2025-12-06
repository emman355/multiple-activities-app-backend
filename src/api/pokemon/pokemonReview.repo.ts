import { db } from "../../config/db.js";
import { eq, and, asc, desc } from "drizzle-orm";
import { pokemonReview } from "../../schema/pokemonReview.js";
import { supabaseAdmin } from "../../config/supabase.js";

export const PokemonReview = {
  // 📄 List reviews for a user
  async getReviews(userId: string, sortBy: "name" | "date" = "date") {
    return await db
      .select()
      .from(pokemonReview)
      .orderBy(
        sortBy === "name" ? asc(pokemonReview.pokemonName) : desc(pokemonReview.uploadDate)
      );
  },

  // 📄 Get single review by ID + user
  async getReviewById(reviewId: string, userId: string) {
    const rows = await db
      .select()
      .from(pokemonReview)
      .where(and(eq(pokemonReview.id, reviewId), eq(pokemonReview.userId, userId)));
    return rows[0];
  },

  // ➕ Create review
  async createReview(
    userId: string,
    pokemonId: number,
    pokemonName: string,
    rating: number,
    content: string
  ) {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error) {
      throw error;
    }

    const userEmail = data.user?.email ?? "";
    return await db
      .insert(pokemonReview)
      .values({
        userId,
        userEmail, // 👈 pulled from Supabase Auth
        pokemonId,
        pokemonName,
        rating,
        content: content ?? "",
      })
      .returning();
  },

  // ✏️ Update review
  async updateReview(
    reviewId: string,
    userId: string,
    payload: Partial<{
      rating: number;
      content: string;
    }>
  ) {
    // Only pick rating and content from payload
    const updatePayload: Partial<{
      rating: number;
      content: string;
    }> = {};

    if (payload.rating !== undefined) {
      updatePayload.rating = payload.rating;
    }
    if (payload.content !== undefined) {
      updatePayload.content = payload.content;
    }

    return await db
      .update(pokemonReview)
      .set(updatePayload)
      .where(and(eq(pokemonReview.id, reviewId), eq(pokemonReview.userId, userId)))
      .returning();
  },

  // ❌ Remove review
  async removeReview(reviewId: string, userId: string) {
    return await db
      .delete(pokemonReview)
      .where(and(eq(pokemonReview.id, reviewId), eq(pokemonReview.userId, userId)))
      .returning();
  },
};

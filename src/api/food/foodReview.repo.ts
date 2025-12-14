import { eq, and } from "drizzle-orm";
import { foodReview } from "../../schema/foodReview.js";
import { db } from "../../config/db.js";

export const FoodReview = {
  // 📸 Photos
  getReviews: (userId: string) =>
    db.select().from(foodReview)
      .where(eq(foodReview.userId, userId)),
  
   // 👇 NEW: fetch single review by ID and user
  getReviewById: async (id: string, userId: string) => {
    const result = await db
      .select()
      .from(foodReview)
      .where(and(eq(foodReview.id, id), eq(foodReview.userId, userId)))
      .limit(1);

    return result[0]; // return single item
  },

  createReview: (
    userId: string,
    photoName: string,
    photoUrl: string,
    location?: string,
    rating?: number,
    review?: string
  ) =>
    db.insert(foodReview)
      .values({ userId, photoName, photoUrl, location, rating, review })
      .returning(),

  updateReview: (
    id: string,
    userId: string,
    patch: Partial<{
      photoName: string;
      photoUrl: string;
      location: string;
      rating: number;
      review: string;
    }>
  ) =>
    db.update(foodReview)
      .set({ ...patch, updatedAt: new Date() })
      .where(and(eq(foodReview.id, id), eq(foodReview.userId, userId)))
      .returning(),

  removeReview: (id: string, userId: string) =>
    db.delete(foodReview)
      .where(and(eq(foodReview.id, id), eq(foodReview.userId, userId)))
      .returning(),
};

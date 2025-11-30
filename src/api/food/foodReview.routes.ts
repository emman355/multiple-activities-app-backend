import { Router } from "express";
import { FoodController } from "./foodReview.controller.js";
import { requireAuth } from "../../middleware/auth.js";

export const foodReviewRouter = Router();

foodReviewRouter.use(requireAuth);

// 📸 Photos + Reviews (single table)
foodReviewRouter.get("/reviews", FoodController.listReviews);

// createReview handles both file upload + optional rating/review
foodReviewRouter.post("/reviews", ...FoodController.createReview); // spread array of middlewares

// updateReview allows updating photo metadata or rating/review (with optional file upload)
foodReviewRouter.put("/reviews/:id", ...FoodController.updateReview);

// removeReview deletes the photo + its review
foodReviewRouter.delete("/reviews/:id", FoodController.removeReview);

import { Router } from "express";
import { PokemonReviewController } from "./pokemonReview.controller.js"; // adjust path if needed
import { requireAuth } from "../../middleware/auth.js";

export const pokemonReviewRouter = Router();

pokemonReviewRouter.use(requireAuth);

// List all reviews for the current user
pokemonReviewRouter.get("/", PokemonReviewController.listReviews);

// Create a new review
pokemonReviewRouter.post("/", PokemonReviewController.createReview);

// Update an existing review
pokemonReviewRouter.put("/:id", PokemonReviewController.updateReview);

// Delete a review
pokemonReviewRouter.delete("/:id", PokemonReviewController.removeReview);

export default pokemonReviewRouter;

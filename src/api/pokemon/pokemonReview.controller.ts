import { Request, Response, NextFunction } from "express";
import { PokemonReview } from "./pokemonReview.repo.js";

export const PokemonReviewController = {
  listReviews: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await PokemonReview.getReviews(
        req.user!.id,
      );
      res.json(items);
    } catch (err) {
      next(err);
    }
  },

  createReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body?.pokemonId || !req.body?.pokemonName || !req.body?.content) {
        throw new Error("ValidationError: pokemonId, pokemonName, and content are required");
      }

      const [item] = await PokemonReview.createReview(
        req.user!.id,
        Number(req.body.pokemonId),
        req.body.pokemonName,
        Number(req.body.rating),
        req.body.content
      );

      res.status(201).json(item);
    } catch (err) {
      console.log(err)
      next(err);
    }
  },

  updateReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewId = req.params.id;
      const userId = req.user!.id;

      const existing = await PokemonReview.getReviewById(reviewId, userId);
      if (!existing) return next(new Error("NotFoundError"));

      // Only allow rating and content updates
      const updatePayload: Partial<{
        rating: number;
        content: string;
      }> = {};

      if (req.body.rating !== undefined) {
        updatePayload.rating = Number(req.body.rating);
      }
      if (req.body.content !== undefined) {
        updatePayload.content = req.body.content;
      }

      const [item] = await PokemonReview.updateReview(reviewId, userId, updatePayload);
      if (!item) return next(new Error("NotFoundError"));

      res.json({
        message: "Review updated successfully",
        review: item,
      });
    } catch (err) {
      next(err);
    }
  },

  removeReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [item] = await PokemonReview.removeReview(req.params.id, req.user!.id);
      if (!item) return next(new Error("NotFoundError"));

      res.json({
        message: "Review deleted successfully",
        review: item,
      });
    } catch (err) {
      next(err);
    }
  }
};

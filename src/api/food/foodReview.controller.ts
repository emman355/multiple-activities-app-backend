import { Request, Response, NextFunction } from "express";
import { FoodReview } from "./foodReview.repo.js";
import { deleteFile, uploadFile } from "../s3.service.js";
import multer from "multer";

// configure multer (memory storage so we can pass buffer to Supabase S3)
const upload = multer({ storage: multer.memoryStorage() });

export const FoodController = {
  listReviews: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await FoodReview.getReviews(
        req.user!.id,
      );
      res.json(items);
    } catch (err) {
      next(err);
    }
  },

  // attach multer middleware only here
  createReview: [
    upload.single("file"), // multer runs only for this route
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.file || !req.body?.photoName) {
          throw new Error("ValidationError: photoName and file are required");
        }

        // Upload file to Supabase Storage
        const photoUrl = await uploadFile(
          "food-photos",
          `${req.user!.id}-${Date.now()}-${req.file.originalname}`,
          req.file.buffer,
          req.file.mimetype
        );

        // Save record in DB (with optional location, rating, review)
        const [item] = await FoodReview.createReview(
          req.user!.id,
          req.body.photoName,
          photoUrl,
          req.body.location,
          req.body.rating ? Number(req.body.rating) : undefined,
          req.body.review
        );
        res.status(201).json(item);
      } catch (err) {
        next(err);
      }
    },
  ],

  updateReview: [
    upload.single("file"), // allow optional file upload
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const reviewId = req.params.id;
        const userId = req.user!.id;

        // 1️⃣ Fetch existing review
        const existing = await FoodReview.getReviewById(reviewId, userId);
        if (!existing) return next(new Error("NotFoundError"));

        // If a new file is uploaded, replace photoUrl
        let photoUrl: string | undefined;
        if (req.file) {
          // Parse bucket and path from old photoUrl
          const url = new URL(existing.photoUrl);
          const parts = url.pathname.split("/");
          const bucket = parts[5];
          const objectPath = parts.slice(6).join("/");

          // Delete old file
          await deleteFile(bucket, objectPath);
          
          photoUrl = await uploadFile(
            "food-photos",
            `${userId}-${Date.now()}-${req.file.originalname}`,
            req.file.buffer,
            req.file.mimetype
          );
        }

        // Build update payload
        const updatePayload: Partial<{
          photoName: string;
          photoUrl: string;
          location: string;
          rating: number;
          review: string;
        }> = {
          photoName: req.body.photoName,
          location: req.body.location,
          review: req.body.review,
        };

        if (req.body.rating) {
          updatePayload.rating = Number(req.body.rating);
        }
        if (photoUrl) {
          updatePayload.photoUrl = photoUrl;
        }

        // Update in DB
        const [item] = await FoodReview.updateReview(reviewId, userId, updatePayload);
        if (!item) {
          return next(new Error("NotFoundError"));
        }

        res.json({
          message: "Review updated successfully",
          review: item,
        });
      } catch (err) {
        next(err);
      }
    },
  ],

  removeReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // First fetch the review so we know its photoUrl
      const [item] = await FoodReview.removeReview(req.params.id, req.user!.id);

      if (!item) {
        return next(new Error("NotFoundError"));
      }

      // If the review had a photo, delete it from storage
      if (item.photoUrl) {
        try {
          // Supabase public URL looks like:
          // https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
          const url = new URL(item.photoUrl);
          const parts = url.pathname.split("/");
          // e.g. ["", "storage", "v1", "object", "public", "food-photos", "userId-123-file.png"]
          const bucket = parts[5];
          const objectPath = parts.slice(6).join("/");
          await deleteFile(bucket, objectPath);
        } catch (storageErr) {
           res.status(500).json({
            message: "Failed to delete photo from bucket:", storageErr,
            error: storageErr instanceof Error ? storageErr.message : String(storageErr),
          });
        }
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

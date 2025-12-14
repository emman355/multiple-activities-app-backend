import { Request, Response } from "express";
import { GoogleDriveLite } from "./driveLite.repo.js";
import { deleteFile, uploadFile } from "../s3.service.js";
import multer from "multer";
import { imageSize } from "image-size";

// configure multer (memory storage so we can pass buffer to Supabase S3)
const upload = multer({ storage: multer.memoryStorage() });

export const DriveLiteController = {
  getPhotoList: async (req: Request, res: Response) => {
    try {
      const items = await GoogleDriveLite.getPhotoList(req.user!.id);

      if (!items || items.length === 0) {
        return res.status(200).json({
          message: "No photos found for this user",
          photos: [],
        });
      }

      res.status(200).json({
        message: "Photos retrieved successfully",
        photos: items,
      });
    } catch (err) {
      // Instead of generic 500, send a clear error
      res.status(500).json({
        message: "Failed to retrieve photos",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  },

  getPhotoById: async (req: Request, res: Response) => {
    try {
      const photoId = req.params.id;
      const userId = req.user!.id;

      if (!photoId) {
        return res.status(400).json({
          message: "Photo ID is required",
        });
      }

      const photo = await GoogleDriveLite.getPhotoById(photoId, userId);

      if (!photo) {
        return res.status(404).json({
          message: "Photo not found",
          photoId,
        });
      }

      res.status(200).json({
        message: "Photo retrieved successfully",
        photo,
      });
    } catch (err) {
      res.status(500).json({
        message: "Failed to retrieve photo",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  },

  uploadPhoto: [
    upload.single("file"),
    async (req: Request, res: Response) => {
      try {
        if (!req.file) {
          return res.status(400).json({
            message: "ValidationError: file is required",
          });
        }

        const photoName = req.file.originalname;
        const fileSize = req.file.size;
        const fileType = req.file.mimetype;

        // get dimensions
        const { width, height } = imageSize(req.file.buffer);

        const photoUrl = await uploadFile(
          "drive-lite-photos",
          `${req.user!.id}-${Date.now()}-${photoName}`,
          req.file.buffer,
          req.file.mimetype
        );

        const [item] = await GoogleDriveLite.uploadPhoto(
          req.user!.id,
          photoName,
          photoUrl,
          req.body.title,
          req.body.description,
          fileSize,
          fileType,
          width,
          height
        );

        res.status(201).json({
          message: "Photo uploaded successfully",
          photo: item,
        });
      } catch (err) {
        res.status(500).json({
          message: "Failed to upload photo",
          error: err instanceof Error ? err.message : String(err),
        });
      }
    },
  ],



  updatePhoto: [
    upload.single("file"),
    async (req: Request, res: Response) => {
      try {
        const photoId = req.params.id;
        const userId = req.user!.id;

        const existing = await GoogleDriveLite.getPhotoById(photoId, userId);
        if (!existing) {
          return res.status(404).json({
            message: "Photo not found",
            photoId,
          });
        }

        let photoUrl: string | undefined;
        let photoName: string | undefined;
        let fileSize: number | undefined;
        let fileType: string | undefined;
        let width: number | undefined;
        let height: number | undefined;

        // ✅ If a new file is uploaded, replace photoUrl + photoName + fileSize + fileType + dimensions
        if (req.file) {
          // delete old file from bucket
          const url = new URL(existing.photoUrl);
          const parts = url.pathname.split("/");
          const bucket = parts[5];
          const objectPath = parts.slice(6).join("/");
          await deleteFile(bucket, objectPath);

          // upload new file
          photoUrl = await uploadFile(
            "drive-lite-photos",
            `${userId}-${Date.now()}-${req.file.originalname}`,
            req.file.buffer,
            req.file.mimetype
          );

          photoName = req.file.originalname;
          fileSize = req.file.size;
          fileType = req.file.mimetype;

          // get dimensions
          const { width: w, height: h } = imageSize(req.file.buffer);
          width = w;
          height = h;
        }

        // Build update payload
        const updatePayload: Partial<{
          photoName: string;
          photoUrl: string;
          title: string;
          description: string;
          fileSize: number;
          fileType: string;
          width: number;
          height: number;
        }> = {
          title: req.body.title ?? existing.title,
          description: req.body.description ?? existing.description,
        };

        if (photoUrl) updatePayload.photoUrl = photoUrl;
        if (photoName) updatePayload.photoName = photoName;
        if (fileSize) updatePayload.fileSize = fileSize;
        if (fileType) updatePayload.fileType = fileType;
        if (width) updatePayload.width = width;
        if (height) updatePayload.height = height;

        const [item] = await GoogleDriveLite.updatePhoto(photoId, userId, updatePayload);
        if (!item) {
          return res.status(404).json({
            message: "Photo not found after update",
            photoId,
          });
        }

        res.status(200).json({
          message: "Photo updated successfully",
          photo: item,
        });
      } catch (err) {
        res.status(500).json({
          message: "Failed to update photo",
          error: err instanceof Error ? err.message : String(err),
        });
      }
    },
  ],

  removePhoto: async (req: Request, res: Response) => {
    try {
      const [item] = await GoogleDriveLite.removePhoto(req.params.id, req.user!.id);

      if (!item) {
        return res.status(404).json({
          message: "Photo not found",
          photoId: req.params.id,
        });
      }

      if (item.photoUrl) {
        try {
          const url = new URL(item.photoUrl);
          const parts = url.pathname.split("/");
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

      res.status(200).json({
        message: "Photo removed successfully",
        photoId: req.params.id,
      });
    } catch (err) {
      res.status(500).json({
        message: "Failed to remove photo",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  },
};

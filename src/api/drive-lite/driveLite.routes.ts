import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { DriveLiteController } from "./driveLite.controller.js";

export const driveLiteRouter = Router();

driveLiteRouter.use(requireAuth);

// 📸 Photos(single table)
driveLiteRouter.get("/photos", DriveLiteController.getPhotoList);

// Get single photo by ID
driveLiteRouter.get("/photos/:id", DriveLiteController.getPhotoById);

// uploadPhoto handles both file upload + metadata
driveLiteRouter.post("/photos", ...DriveLiteController.uploadPhoto); // spread array of middlewares

// updatePhoto allows updating photo metadata
driveLiteRouter.put("/photos/:id", ...DriveLiteController.updatePhoto);

// removePhoto deletes the photo and its metadata
driveLiteRouter.delete("/photos/:id", DriveLiteController.removePhoto);

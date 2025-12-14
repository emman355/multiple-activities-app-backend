import { eq, and } from "drizzle-orm";
import { gDriveLiteSchema } from "../../schema/gDriveLite.js";
import { db } from "../../config/db.js";

export const GoogleDriveLite = {
  // 📸 Photos
  getPhotoList: (userId: string) =>
    db.select().from(gDriveLiteSchema)
      .where(eq(gDriveLiteSchema.userId, userId)),

  // 👇 NEW: fetch single photo by ID and user
  getPhotoById: async (id: string, userId: string) => {
    const result = await db
      .select()
      .from(gDriveLiteSchema)
      .where(and(eq(gDriveLiteSchema.id, id), eq(gDriveLiteSchema.userId, userId)))
      .limit(1);

    return result[0]; // return single item
  },

  uploadPhoto: (
    userId: string,
    photoName: string,
    photoUrl: string,
    title: string,
    description: string,
    fileSize: number,
    fileType: string,
    width: number,
    height: number,
  ) =>
    db.insert(gDriveLiteSchema)
      .values({
        userId,
        photoName,
        photoUrl,
        title,
        description,
        fileSize,
        fileType,
        width,
        height
      })
      .returning(),

  updatePhoto: (
    id: string,
    userId: string,
    patch: Partial<{
      photoName: string,
      photoUrl: string,
      title: string,
      description: string,
    }>
  ) =>
    db.update(gDriveLiteSchema)
      .set({ ...patch, updatedAt: new Date() })
      .where(and(eq(gDriveLiteSchema.id, id), eq(gDriveLiteSchema.userId, userId)))
      .returning(),

  removePhoto: (id: string, userId: string) =>
    db.delete(gDriveLiteSchema)
      .where(and(eq(gDriveLiteSchema.id, id), eq(gDriveLiteSchema.userId, userId)))
      .returning(),
};

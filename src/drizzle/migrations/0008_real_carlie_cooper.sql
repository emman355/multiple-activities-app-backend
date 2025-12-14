CREATE TABLE "drive_lite_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"photo_name" varchar(150) NOT NULL,
	"photo_url" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"upload_date" timestamp with time zone DEFAULT now() NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "foodReview" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"photo_name" varchar(150) NOT NULL,
	"photo_url" text NOT NULL,
	"location" text,
	"rating" integer,
	"review" text,
	"upload_date" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "photos" CASCADE;--> statement-breakpoint
DROP TABLE "reviews" CASCADE;
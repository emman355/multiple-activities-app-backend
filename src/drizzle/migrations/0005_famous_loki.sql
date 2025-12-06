CREATE TABLE "pokemon_review" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pokemon_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"rating" integer NOT NULL,
	"pokemon_name" varchar(100),
	"upload_date" timestamp DEFAULT now()
);

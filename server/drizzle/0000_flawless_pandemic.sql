CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"created_at" text DEFAULT '2025-06-15T21:34:22.661Z',
	"updated_at" text DEFAULT '2025-06-15T21:34:22.661Z',
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

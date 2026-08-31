CREATE TABLE `letters` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`unlock_label` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "letters_status_check" CHECK("letters"."status" IN ('draft', 'active', 'hidden'))
);
--> statement-breakpoint
CREATE INDEX `letters_status_created_idx` ON `letters` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `memories` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`story` text,
	`memory_date` text,
	`category` text DEFAULT 'Momen Kecil' NOT NULL,
	`media_key` text,
	`media_original_name` text,
	`media_size_bytes` integer,
	`media_mime_type` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`is_favorite` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "memories_status_check" CHECK("memories"."status" IN ('draft', 'active', 'hidden'))
);
--> statement-breakpoint
CREATE INDEX `memories_status_date_idx` ON `memories` (`status`,`memory_date`);--> statement-breakpoint
CREATE TABLE `memory_cards` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`card_type` text DEFAULT 'Alasan' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "memory_cards_status_check" CHECK("memory_cards"."status" IN ('draft', 'active', 'hidden'))
);
--> statement-breakpoint
CREATE INDEX `memory_cards_status_sort_idx` ON `memory_cards` (`status`,`sort_order`);--> statement-breakpoint
CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`note` text,
	`plan_status` text DEFAULT 'ingin_dilakukan' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "plans_plan_status_check" CHECK("plans"."plan_status" IN ('ingin_dilakukan', 'direncanakan', 'tercapai')),
	CONSTRAINT "plans_status_check" CHECK("plans"."status" IN ('draft', 'active', 'hidden'))
);
--> statement-breakpoint
CREATE INDEX `plans_status_sort_idx` ON `plans` (`status`,`sort_order`);--> statement-breakpoint
CREATE TABLE `quiz_questions` (
	`id` text PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`option_a` text NOT NULL,
	`option_b` text NOT NULL,
	`option_c` text NOT NULL,
	`option_d` text NOT NULL,
	`correct_option` text DEFAULT 'A' NOT NULL,
	`feedback` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "quiz_questions_correct_opt_check" CHECK("quiz_questions"."correct_option" IN ('A', 'B', 'C', 'D')),
	CONSTRAINT "quiz_questions_status_check" CHECK("quiz_questions"."status" IN ('draft', 'active', 'hidden'))
);
--> statement-breakpoint
CREATE INDEX `quiz_questions_status_sort_idx` ON `quiz_questions` (`status`,`sort_order`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` text PRIMARY KEY DEFAULT 'main' NOT NULL,
	`birthday_message` text,
	`final_message` text,
	`music_url` text,
	`updated_at` text NOT NULL
);

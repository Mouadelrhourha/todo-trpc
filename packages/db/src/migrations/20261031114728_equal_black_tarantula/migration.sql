CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL,
	`completed` integer DEFAULT false,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL
);

import type { Database } from "@todo-trpc/db";

export type Context = {
  db: Database;
};

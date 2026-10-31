import { createDb } from "@todo-trpc/db";

import { ENV } from "./env.server";

export const db = createDb(ENV);

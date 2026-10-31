import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todosTable = sqliteTable("todos", {
    id: integer().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    completed: integer({ mode: 'boolean' }).default(false),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

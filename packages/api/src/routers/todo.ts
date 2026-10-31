import { eq } from "@todo-trpc/db";
import { todosTable } from "@todo-trpc/db/schema/index";
import { z } from "zod";
import { publicProcedure, router } from "../index";

const todoListSchema = z
	.object({
		page: z.number().int().min(1).default(1),
		pageSize: z.number().int().min(1).max(100).default(10),
	})
	.default({
		page: 1,
		pageSize: 10,
	});

const markTodoCompletedSchema = z.object({ id: z.number().int() });

const createSchema = z.object({
	title: z.string(),
	dateToExecute: z.iso.datetime().transform((value) => new Date(value)),
});

export const todoRouter = router({
	list: publicProcedure.input(todoListSchema).query(async ({ input, ctx }) => {
		const { page, pageSize } = input;
		console.log(`Fetching todos for page ${page} with page size ${pageSize}`);
		const todos = await ctx.db
			.select()
			.from(todosTable)
			.where(eq(todosTable.completed, false))
			.limit(pageSize)
			.offset((page - 1) * pageSize);
		return todos ?? [];
	}),
	complete: publicProcedure
		.input(markTodoCompletedSchema)
		.mutation(async ({ input, ctx }) => {
			const { id } = input;
			console.log(`Completing todo with id ${id}`);
			const updatedTodo = await ctx.db
				.update(todosTable)
				.set({ completed: true })
				.where(eq(todosTable.id, id))
				.returning();
			return updatedTodo[0] ?? null;
		}),

	create: publicProcedure.input(createSchema).mutation(({ ctx, input }) => {
		return ctx.db
			.insert(todosTable)
			.values({
				title: input.title,
				dateToExecute: input.dateToExecute,
			})
			.returning();
	}),
});

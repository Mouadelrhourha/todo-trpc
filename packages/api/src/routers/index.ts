import { publicProcedure, router } from "../index";
import { todoRouter } from "./todo";

export const appRouter = router({
	todos: todoRouter,
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
});

export type AppRouter = typeof appRouter;

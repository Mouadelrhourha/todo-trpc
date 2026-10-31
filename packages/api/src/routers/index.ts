import {todoRouter} from "./todo";
import { publicProcedure, router } from "../index";

export const appRouter = router({
  todos: todoRouter,
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
});

export type AppRouter = typeof appRouter;

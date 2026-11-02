import type { AppRouter } from "@todo-trpc/api/routers/index";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

type Todo = RouterOutput["todos"]["list"][number];

export type { Todo };

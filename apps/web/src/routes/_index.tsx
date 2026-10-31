import {useMutation, useQuery,useQueryClient} from "@tanstack/react-query";

import { trpc } from "@/utils/trpc";
import {Button} from "@todo-trpc/ui/components/button";
import {Item, ItemActions, ItemContent, ItemDescription, ItemTitle} from "@todo-trpc/ui/components/item";

import type { Route } from "./+types/_index";

const TITLE_TEXT = `
 ████████╗ ██████╗ ██████╗  ██████╗ ███████╗
 ╚══██╔══╝██╔═══██╗██╔══██╗██╔═══██╗██╔════╝
    ██║   ██║   ██║██║  ██║██║   ██║███████╗
    ██║   ██║   ██║██║  ██║██║   ██║╚════██║
    ██║   ╚██████╔╝██████╔╝╚██████╔╝███████║
    ╚═╝    ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝

 ████████╗██████╗ ██████╗  ██████╗
 ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝
    ██║   ██████╔╝██████╔╝██║
    ██║   ██╔══██╗██╔═══╝ ██║
    ██║   ██║  ██║██║     ╚██████╗
    ╚═╝   ╚═╝  ╚═╝╚═╝      ╚═════╝
 `;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "todo-trpc" },
    { name: "description", content: "todo-trpc is a web application" },
  ];
}

export default function Home() {
  const { isPending, isSuccess, data: todos } = useQuery(trpc.todos.list.queryOptions());
  const markTodoCompletedMutation = useMutation(trpc.todos.complete.mutationOptions());
  const queryClient = useQueryClient();

  function onClickMarkAsCompleted(id: number) {
      markTodoCompletedMutation.mutate({ id },{
          async onSuccess(){
              await queryClient.invalidateQueries(trpc.todos.list.queryFilter());
              console.log(`Todo with id ${id} marked as completed successfully.`);
          }
      });
  }
  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">Todo List</h2>
            {isPending && <p>Loading...</p>}
            {isSuccess && (
                <div className="flex w-full max-w-md flex-col gap-6">
                    {todos.map((todo) => <Item variant="outline">
                        <ItemContent>
                            <ItemTitle>{todo.title}</ItemTitle>
                            <ItemDescription>
                                {todo.createdAt}
                            </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <Button onClick={() => onClickMarkAsCompleted(todo.id)} variant="outline" size="sm">
                                Mark as completed
                            </Button>
                        </ItemActions>
                    </Item>)}
                </div>
            )}
        </section>
      </div>
    </div>
  );
}

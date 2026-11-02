import type { AppRouter } from "@todo-trpc/api/routers/index";
import { Button } from "@todo-trpc/ui/components/button";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "@todo-trpc/ui/components/item";
import { useContext } from "react";
import { TodoContext } from "@/routes/_index";
import type { Todo } from "@/types/todo.types";

type TodoProps = {
	todo: Todo;
};

export function TodoItem({ todo }: Readonly<TodoProps>) {
	const { onClickMarkAsCompleted } = useContext(TodoContext);
	return (
		<Item variant="outline">
			<ItemContent>
				<ItemTitle>{todo.title}</ItemTitle>
				<ItemDescription>
					{new Date(todo.dateToExecute).toLocaleDateString()}
				</ItemDescription>
			</ItemContent>
			<ItemActions>
				<Button
					onClick={() => onClickMarkAsCompleted(todo.id)}
					variant="outline"
					size="sm"
				>
					Mark as completed
				</Button>
			</ItemActions>
		</Item>

		//	<div> {todos.length === 0 ? "no todos found" : null} </div>
	);
}

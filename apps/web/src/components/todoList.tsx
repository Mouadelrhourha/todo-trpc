import React from "react";
import { TodoItem } from "@/components/todo";
import type { Todo } from "@/types/todo.types";

type TodoListState = {
	todos: Todo[];
};

export function TodoList({ todos }: TodoListState) {
	return todos.map((todo) => <TodoItem todo={todo} />);
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@todo-trpc/ui/components/button";
import { Calendar } from "@todo-trpc/ui/components/calendar";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogTrigger,
} from "@todo-trpc/ui/components/dialog";
import { Input } from "@todo-trpc/ui/components/input";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "@todo-trpc/ui/components/item";
import { Label } from "@todo-trpc/ui/components/label";
import React, { useState } from "react";
import { trpc } from "@/utils/trpc";

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

export function meta(_: Route.MetaArgs) {
	return [
		{ title: "todo-trpc" },
		{ name: "description", content: "todo-trpc is a web application" },
	];
}

export default function Home() {
	const {
		isPending,
		isSuccess,
		data: todos,
	} = useQuery(trpc.todos.list.queryOptions());

	const markTodoCompletedMutation = useMutation(
		trpc.todos.complete.mutationOptions(),
	);
	const queryClient = useQueryClient();
	const addTaskMutation = useMutation(trpc.todos.create.mutationOptions());

	const [task, setTask] = useState("");
	const [open, setOpen] = useState<boolean>(false);
	const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
	const [date, setDate] = React.useState<Date>(new Date());

	function onClickSave() {
		addTaskMutation.mutate(
			{ title: task, dateToExecute: date?.toISOString() },
			{
				async onSuccess() {
					setOpen(false);
					await queryClient.invalidateQueries(trpc.todos.list.queryFilter());
					setTask("");
				},
			},
		);
	}

	function onClickMarkAsCompleted(id: number) {
		markTodoCompletedMutation.mutate(
			{ id },
			{
				async onSuccess() {
					await queryClient.invalidateQueries(trpc.todos.list.queryFilter());
					console.log(`Todo with id ${id} marked as completed successfully.`);
				},
			},
		);
	}

	console.log(date?.toLocaleDateString());

	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
			<div className="grid gap-6">
				<section className="rounded-lg border p-4">
					<h2 className="mb-2 font-medium">Todo List</h2>
					<Dialog
						open={open}
						onOpenChange={(value) => {
							setOpen(value);
							if (!value) {
								setIsCalendarOpen(false);
								setDate(new Date());
							}
						}}
					>
						<form>
							<DialogTrigger
								render={<Button variant="outline">Add Task </Button>}
							/>
							<DialogContent className="sm:max-w-sm">
								<Label htmlFor="title-1">Task </Label>
								<Input
									id="title-1"
									name="title"
									value={task}
									onChange={(e) => setTask(e.target.value)}
								/>
								{isCalendarOpen && (
									<Calendar
										mode="single"
										selected={date}
										onSelect={(value) => {
											if (value) {
												setDate(value);
											}
										}}
										className="rounded-lg border"
										captionLayout="dropdown"
										required={false}
									/>
								)}
								<Label htmlFor="date-picker">Day</Label>
								<Input
									type="date"
									// id="date-picker"
									value={date?.toLocaleDateString("en-CA")}
									//defaultValue="2026-11-01"
									className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
								/>

								<Button onClick={() => setIsCalendarOpen(true)}> Date </Button>
								<DialogFooter>
									<DialogClose
										render={<Button variant="outline">Cancel</Button>}
									/>
									<Button onClick={onClickSave} type="submit">
										Save{" "}
									</Button>
								</DialogFooter>
							</DialogContent>
						</form>
					</Dialog>

					{isPending && <p>Loading...</p>}
					{isSuccess && (
						<div className="flex w-full max-w-md flex-col gap-6">
							{todos.map((todo) => (
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
							))}
							<div> {todos.length === 0 ? "no todos found" : null} </div>
						</div>
					)}
				</section>
			</div>
		</div>
	);
}

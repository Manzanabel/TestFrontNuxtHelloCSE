import type { Todo } from "~/server/utils/todoRepository";

export interface DisplayTodo extends Todo {
  formattedDate?: string;
  relativeDate?: string;
  displayDate?: string;
}

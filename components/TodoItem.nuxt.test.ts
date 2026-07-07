// @vitest-environment nuxt
import { describe, it, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TodoItem from "./TodoItem.vue";
import type { DisplayTodo } from "~/types/todos.types";

const dispatchMock = vi.fn();

vi.mock("vuex", async (importOriginal) => {
  const actual = await importOriginal<typeof import("vuex")>();
  return {
    ...actual,
    useStore: () => ({ dispatch: dispatchMock }),
  };
});

const baseTodo: DisplayTodo = {
  id: "todo-1",
  text: "buy milk",
  completed: false,
  createdAt: "2026-06-09T08:00:00.000Z",
};

describe("TodoItem", () => {
  it("displays the capitalized todo text", async () => {
    const wrapper = await mountSuspended(TodoItem, {
      props: { todo: baseTodo },
    });
    expect(wrapper.text()).toContain("Buy milk");
  });

  it("dispatches toggleTodo with the todo id when the checkbox changes", async () => {
    const wrapper = await mountSuspended(TodoItem, {
      props: { todo: baseTodo },
    });
    await wrapper.get('input[type="checkbox"]').setValue(true);
    expect(dispatchMock).toHaveBeenCalledWith("toggleTodo", "todo-1");
  });
});

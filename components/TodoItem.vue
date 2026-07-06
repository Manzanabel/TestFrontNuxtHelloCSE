<script setup lang="ts">
import { useStore } from 'vuex';
import type { DisplayTodo } from '~/types/todos.types';

const store = useStore();

const props = defineProps<{
  todo: DisplayTodo;
}>();

async function onToggle(): Promise<void> {
  try {
    await store.dispatch('toggleTodo', props.todo.id);
  } catch (e) {
    console.error('erreur lors du toggle:', e);
  }
}

async function onDelete(): Promise<void> {
  try {
    await store.dispatch('deleteTodo', props.todo.id);
  } catch (e) {
    console.error('erreur lors de la suppression:', e);
  }
}
</script>

<template>
  <div class="todo-item" :class="{ 'todo-item--completed': props.todo.completed }">
    <input
      type="checkbox"
      :checked="props.todo.completed"
      style="margin-right: 10px; width: 16px; height: 16px; cursor: pointer"
      @change="onToggle"
    />

  <span
    style="flex: 1"
    :style="{
      textDecoration: props.todo.completed ? 'line-through' : 'none',
      opacity: props.todo.completed ? 0.5 : 1,
    }"
  >
    {{ getDisplayText(props.todo.text) }}
  </span>

    <small
      style="color: #aaa; margin: 0 10px; font-size: 11px; white-space: nowrap"
    >
      {{ props.todo.displayDate || props.todo.formattedDate || getFormattedDate(props.todo.createdAt)}}
    </small>

    <button
      class="btn btn-xs btn-danger"
      style="padding: 2px 8px"
      @click="onDelete"
    >
      ✕
    </button>
  </div>
</template>

<style scoped lang="scss">
.todo-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  margin: 6px 0;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  background-color: #ffffff;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }

  &--completed {
    border-color: #c3e6cb;
    background-color: #d4edda;
  }
}
</style>

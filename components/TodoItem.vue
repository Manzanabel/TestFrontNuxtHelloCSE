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
  <div class="todo-item" :class="{ 'todo-item--completed': todo.completed }">
    <input
      type="checkbox"
      class="todo-item__checkbox"
      :checked="todo.completed"
      @change="onToggle"
    />

  <span
    class="todo-item__text"
    :class="{ 'todo-item__text--completed': todo.completed }"
  >
    {{ getDisplayText(todo.text) }}
  </span>

    <small class="todo-item__date">
      {{ todo.displayDate || todo.formattedDate || getFormattedDate(todo.createdAt)}}
    </small>

    <button
      class="btn btn-xs btn-danger todo-item__delete"
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

  &__checkbox {
    margin-right: 10px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  &__text {
    flex: 1;
    text-decoration: none;
    opacity: 1;

    &--completed {
      text-decoration: line-through;
      opacity: 0.5;
    }
  }

  &__date {
    color: #aaa;
    margin: 0 10px;
    font-size: 11px;
    white-space: nowrap;
  }

  &__delete {
    padding: 2px 8px;
  }
}
</style>

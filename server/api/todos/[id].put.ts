import { todoRepository } from '~/server/utils/todoRepository';

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')!;

  const todo = todoRepository.toggle(id);

  if (!todo) {
    throw createError({ statusCode: 404, statusMessage: 'Todo introuvable.' });
  }

  return todo;
});

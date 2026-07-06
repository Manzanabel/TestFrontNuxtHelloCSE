import { todoRepository } from '~/server/utils/todoRepository';

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')!;

  const deleted = todoRepository.remove(id);

  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'Todo introuvable.' });
  }

  setResponseStatus(event, 204);
});

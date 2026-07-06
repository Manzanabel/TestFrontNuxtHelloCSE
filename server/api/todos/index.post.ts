import { todoRepository } from '~/server/utils/todoRepository';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: unknown }>(event);

  if (!body?.title || typeof body.title !== 'string' || !body.title.trim()) {
    throw createError({
      statusCode: 422,
      statusMessage:
        'Le champ "title" est requis et doit être une chaîne non vide.',
    });
  }

  const todo = todoRepository.create(body.title.trim());

  setResponseStatus(event, 201);
  return todo;
});

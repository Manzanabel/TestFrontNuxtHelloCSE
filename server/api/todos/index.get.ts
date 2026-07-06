import { todoRepository } from '~/server/utils/todoRepository';

export default defineEventHandler(() => {
  return todoRepository.findAll();
});

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
};

type TodoRepository = {
  findAll: () => Todo[];
  findById: (id: string) => Todo | undefined;
  create: (text: string) => Todo;
  toggle: (id: string) => Todo | undefined;
  remove: (id: string) => boolean;
};

const store: Todo[] = [
  {
    id: crypto.randomUUID(),
    text: 'Faire les courses',
    completed: false,
    createdAt: '2026-06-09T08:00:00.000Z',
  },
  {
    id: crypto.randomUUID(),
    text: 'Préparer la réunion de lundi',
    completed: true,
    createdAt: '2026-06-10T14:30:00.000Z',
  },
  {
    id: crypto.randomUUID(),
    text: 'Appeler le plombier',
    completed: false,
    createdAt: '2026-06-11T09:15:00.000Z',
  },
];

export const todoRepository: TodoRepository = {
  findAll: () => store,

  findById: (id: string) => store.find((t) => t.id === id),

  create: (text: string) => {
    const todo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    store.push(todo);
    return todo;
  },

  toggle: (id: string) => {
    const todo = store.find((t) => t.id === id);
    if (!todo) return undefined;
    todo.completed = !todo.completed;
    return todo;
  },

  remove: (id: string) => {
    const index = store.findIndex((t) => t.id === id);
    if (index === -1) return false;
    store.splice(index, 1);
    return true;
  },
};

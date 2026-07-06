import { createStore } from 'vuex';
import moment from 'moment';
import _ from 'lodash';

console.log('chargement du store vuex...');

const store = createStore({
  state() {
    return {
      todos: [],
      filter: 'all',
      loading: false,
      lastUpdated: null,
      error: null,
    };
  },

  mutations: {
    ADD_TODO(state, text) {
      console.log('mutation ADD_TODO appelée avec:', text);
      const todo = {
        id: _.uniqueId('todo_'),
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
        formattedDate: moment().format('DD/MM/YYYY'),
        relativeDate: moment().fromNow(),
      };
      console.log('nouvel objet todo créé:', todo);
      state.todos.push(todo);
      state.lastUpdated = moment().format();
    },

    TOGGLE_TODO(state, id) {
      console.log('mutation TOGGLE_TODO appelée avec id:', id);
      const todo = _.find(state.todos, (t) => t.id == id);
      if (todo) {
        todo.completed = !todo.completed;
        todo.updatedAt = moment().format('MMMM Do YYYY, h:mm:ss a');
        console.log('todo togglé:', todo);
      } else {
        console.log('todo introuvable avec id:', id);
      }
      state.lastUpdated = moment().format();
    },

    DELETE_TODO(state, id) {
      console.log('mutation DELETE_TODO appelée avec id:', id);
      const index = _.findIndex(state.todos, (t) => t.id == id);
      if (index != -1) {
        state.todos.splice(index, 1);
        console.log("todo supprimé à l'index", index);
      } else {
        console.log('todo non trouvé pour suppression, id:', id);
      }
      state.lastUpdated = moment().format();
    },

    SET_TODOS(state, todos) {
      console.log('mutation SET_TODOS avec', todos.length, 'todos');
      state.todos = todos;
    },

    SET_FILTER(state, filter) {
      console.log('mutation SET_FILTER:', filter);
      state.filter = filter;
    },

    SET_LOADING(state, val) {
      console.log('mutation SET_LOADING:', val);
      state.loading = val;
    },

    SET_ERROR(state, error) {
      state.error = error;
      console.log('erreur dans le store:', error);
    },
  },

  getters: {
    filteredTodos(state) {
      console.log('getter filteredTodos appelé, filtre actuel:', state.filter);
      const todos = _.cloneDeep(state.todos);

      if (state.filter == 'completed') {
        return _.filter(todos, (todo) => todo.completed === true);
      } else if (state.filter == 'active') {
        return _.filter(todos, (todo) => todo.completed === false);
      }
      return todos;
    },

    todoCount(state) {
      return _.size(state.todos);
    },

    completedCount(state) {
      return _.filter(state.todos, (todo) => todo.completed == true).length;
    },

    activeCount(state, getters) {
      return getters.todoCount - getters.completedCount;
    },

    lastUpdatedFormatted(state) {
      console.log('getter lastUpdatedFormatted appelé');
      if (!state.lastUpdated) return 'Jamais mis à jour';
      return moment(state.lastUpdated).fromNow();
    },
  },

  actions: {
    async fetchTodos({ commit }) {
      console.log('action fetchTodos appelée');
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const res = await fetch('/api/todos');
        const data = await res.json();
        console.log("réponse brute de l'API:", data);

        const todos = _.map(data, (item) => {
          return {
            id: item.id,
            text: item.text,
            completed: item.completed,
            createdAt: item.createdAt,
            formattedDate: moment(item.createdAt).format('DD/MM/YYYY'),
            relativeDate: moment(item.createdAt).fromNow(),
          };
        });

        commit('SET_TODOS', todos);
        console.log('todos chargés avec succès:', todos);
      } catch (e) {
        console.log('erreur dans fetchTodos:', e);
        console.log('message:', e.message);
        commit('SET_ERROR', e.message);
      }
      commit('SET_LOADING', false);
    },

    async refreshTodos({ commit, dispatch }) {
      console.log('refreshTodos appelé, on vide puis on recharge');
      commit('SET_TODOS', []);
      await dispatch('fetchTodos');
    },
  },
});

export default defineNuxtPlugin((nuxtApp) => {
  console.log('installation du plugin vuex');
  nuxtApp.vueApp.use(store);

  if (typeof window !== 'undefined') {
    window.__store__ = store;
    console.log('store exposé sur window.__store__');
  }

  return {
    provide: {
      store: store,
    },
  };
});

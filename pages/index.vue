<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';
import _ from 'lodash';

const store = useStore();

const welcomeMessage = ref(
  '<b>Bienvenue sur <i>Ma Super Todo App</i> !</b> Gérez vos tâches facilement.',
);
const appVersion = ref('1.0.0');

const loading = computed(() => {
  console.log('computed loading appelé');
  return store.state.loading;
});

const error = computed(() => store.state.error);

const filteredTodos = computed(() => store.getters.filteredTodos);
const todoCount = computed(() => store.getters.todoCount);
const completedCount = computed(() => store.getters.completedCount);
const lastUpdatedFormatted = computed(() => store.getters.lastUpdatedFormatted);

const todayFormatted = computed(() => {
  console.log('computed todayFormatted recalculé');
  return moment().format('dddd D MMMM YYYY');
});

const todosWithFormattedDates = computed(() => {
  console.log(
    'computed todosWithFormattedDates recalculé, nb todos:',
    filteredTodos.value.length,
  );
  return _.map(filteredTodos.value, (todo) => {
    return {
      ...todo,
      displayDate: moment(todo.createdAt).format('DD/MM/YYYY à HH:mm'),
      timeAgo: moment(todo.createdAt).fromNow(),
    };
  });
});

const nbTodos = computed(() => _.size(store.state.todos));

console.log('page index créée, on charge les todos');
store.dispatch('fetchTodos');

function onRefresh() {
  console.log('onRefresh appelé');
  store.dispatch('refreshTodos');
}

async function onReloadDirect() {
  console.log('onReloadDirect appelé');
  try {
    const res = await fetch('/api/todos');
    const data = await res.json();
    console.log('données rechargées directement:', data);
    _.each(data, (item) => {
      store.commit('ADD_TODO', item.title);
    });
  } catch (e) {
    console.log('erreur dans onReloadDirect:', e);
  }
}
</script>

<template>
  <div class="container">
    <h1>📝 Ma Todo App — {{ todayFormatted }}</h1>

    <div class="alert alert-info" v-html="welcomeMessage"></div>

    <div v-if="loading" class="text-center" style="padding: 20px; color: #888">
      Chargement en cours...
    </div>

    <div v-if="error" class="alert alert-danger" style="color: red">
      Erreur: {{ error }}
    </div>

    <TodoForm />
    <TodoFilter />

    <div
      v-if="filteredTodos.length == 0 && !loading"
      style="text-align: center; color: #aaa; padding: 40px 0"
    >
      Aucune tâche à afficher
    </div>

    <div v-for="todo in todosWithFormattedDates" :key="todo.id">
      <TodoItem :todo="todo" />
    </div>

    <div
      style="
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #eee;
        font-size: 12px;
        color: #999;
        text-align: right;
      "
    >
      {{ completedCount }} / {{ todoCount }} tâches terminées • Dernière mise à
      jour: {{ lastUpdatedFormatted }}
    </div>

    <div style="text-align: center; margin-top: 15px">
      <button
        class="btn btn-default btn-sm"
        style="margin-right: 5px"
        @click="onRefresh"
      >
        🔄 Recharger depuis l'API
      </button>
      <button class="btn btn-warning btn-sm" @click="onReloadDirect">
        ⚡ Reload direct
      </button>
    </div>
  </div>
</template>

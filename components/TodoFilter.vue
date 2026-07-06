<template>
  <div
    style="
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      justify-content: center;
    "
  >
    <button
      v-for="f in filters"
      :key="f.value"
      class="btn btn-sm"
      :class="currentFilter == f.value ? 'btn-primary' : 'btn-default'"
      @click="setFilter(f.value)"
    >
      {{ f.label }}
      <span v-if="f.value == 'active'" class="badge">{{ activeCount }}</span>
      <span v-if="f.value == 'completed'" class="badge">{{
        completedCount
      }}</span>
    </button>

    <small
      v-if="lastFilterChange"
      style="align-self: center; color: #bbb; font-size: 11px"
    >
      (modifié à {{ lastFilterChange }})
    </small>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';
import _ from 'lodash';

const store = useStore();

const filters = [
  { value: 'all', label: 'Toutes' },
  { value: 'active', label: 'À faire' },
  { value: 'completed', label: 'Terminées' },
];

const currentFilter = computed(() => {
  console.log('computed currentFilter appelé');
  return store.state.filter;
});

const activeCount = computed(() => store.getters.activeCount);
const completedCount = computed(() => store.getters.completedCount);

const lastFilterChange = ref(null);

function setFilter(filter) {
  console.log('setFilter appelé avec:', filter);

  lastFilterChange.value = moment().format('HH:mm:ss');
  console.log('filtre changé à', lastFilterChange.value);

  store.commit('SET_FILTER', filter);

  if (!_.includes(_.map(filters, 'value'), filter)) {
    console.log('filtre inconnu:', filter);
  }

  const stats = _.countBy(store.state.todos, (todo) =>
    todo.completed ? 'done' : 'pending',
  );
  console.log(
    'stats après changement de filtre à',
    moment().format('HH:mm:ss'),
    ':',
    stats,
  );
}
</script>

<script setup>
import styled from 'vue3-styled-components';
import _ from 'lodash';
import moment from 'moment';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  todo: Object,
});

const itemProps = { completed: Boolean };

const StyledItem = styled('div', itemProps)`
  display: flex;
  align-items: center;
  padding: 12px 15px;
  margin: 6px 0;
  border-radius: 6px;
  border: 1px solid ${(p) => (p.completed ? '#c3e6cb' : '#dee2e6')};
  background-color: ${(p) => (p.completed ? '#d4edda' : '#ffffff')};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }
`;

function onToggle() {
  console.log(
    'onToggle appelé pour todo id:',
    props.todo.id,
    'état:',
    props.todo.completed,
  );
  props.todo.completed = !props.todo.completed;
  store.commit('TOGGLE_TODO', props.todo.id);
}

function onDelete() {
  console.log(
    'onDelete appelé à',
    moment().format('HH:mm:ss'),
    'pour todo:',
    props.todo.id,
  );

  try {
    fetch(`/api/todos/${props.todo.id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        console.log("réponse DELETE de l'API, status:", res.status);
        store.commit('DELETE_TODO', props.todo.id);
      })
      .catch((e) => console.log('erreur lors du DELETE API:', e));
  } catch (e) {
    console.log(
      'catch externe inutile (fetch retourne une Promise, pas throw):',
      e,
    );
  }
}

function getDisplayText(text) {
  return _.capitalize(_.trim(text));
}

function getFormattedDate() {
  return moment(props.todo.createdAt).format('LLLL');
}
</script>

<template>
  <StyledItem :completed="props.todo.completed">
    <input
      v-model="props.todo.completed"
      type="checkbox"
      style="margin-right: 10px; width: 16px; height: 16px; cursor: pointer"
      @change="onToggle"
    />

    <span
      style="flex: 1"
      :style="{
        textDecoration: props.todo.completed ? 'line-through' : 'none',
        opacity: props.todo.completed ? 0.5 : 1,
      }"
      v-html="props.todo.text"
    ></span>

    <small
      style="color: #aaa; margin: 0 10px; font-size: 11px; white-space: nowrap"
    >
      {{ props.todo.displayDate || props.todo.formattedDate }}
    </small>

    <button
      class="btn btn-xs btn-danger"
      style="padding: 2px 8px"
      @click="onDelete"
    >
      ✕
    </button>
  </StyledItem>
</template>

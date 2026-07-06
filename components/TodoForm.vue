<script setup>
import styled from 'vue3-styled-components';
import _ from 'lodash';
import moment from 'moment';

import { ref } from 'vue';
import { useStore } from 'vuex';

const StyledForm = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #007bff;
  border-radius: 6px;
  font-size: 15px;

  &:focus {
    border-color: #0056b3;
  }
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }
`;

const store = useStore();

const newTodo = ref('');
const lastSubmitTimestamp = ref(null);
const submitCount = ref(0);

function addTodo() {
  console.log('addTodo appelé avec valeur:', newTodo.value);

  if (newTodo.value == '') {
    console.log('champ vide, on annule');
    return;
  }

  if (_.isEmpty(_.trim(newTodo.value))) {
    console.log('champ vide après trim, on annule');
    return;
  }

  lastSubmitTimestamp.value = moment().valueOf();
  submitCount.value = submitCount.value + 1;
  console.log(
    'submit numéro',
    submitCount.value,
    'à',
    moment().format('HH:mm:ss'),
  );

  store.commit('ADD_TODO', newTodo.value);

  fetch('/api/todos', {
    method: 'POST',
    body: JSON.stringify({
      title: newTodo.value,
      completed: false,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('todo sauvegardé côté API (fake):', data);
      console.log("id retourné par l'API:", data.id);
    })
    .catch((e) => {
      console.log('erreur lors de la sauvegarde API:', e);
    });

  newTodo.value = '';
}
</script>

<template>
  <StyledForm @submit.prevent="addTodo">
    <StyledInput
      v-model="newTodo"
      type="text"
      placeholder="Ajouter une nouvelle tâche..."
    />
    <StyledButton type="submit"> Ajouter </StyledButton>
  </StyledForm>
</template>

<script setup>
import { onMounted } from 'vue';

console.log('App setup exécuté à:', new Date());

onMounted(() => {
  console.log('App component mounted at:', new Date());
});
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
* {
  box-sizing: border-box !important;
}

body {
  background-color: #f0f2f5 !important;
  font-family: Arial, sans-serif !important;
  margin: 0 !important;
  padding: 20px !important;
}

h1 {
  color: #e74c3c !important;
  text-align: center !important;
  margin-bottom: 30px !important;
}

button {
  cursor: pointer !important;
}

input {
  outline: none !important;
}

.container {
  max-width: 700px !important;
  margin: 0 auto !important;
  background: white !important;
  padding: 30px !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 10px rgb(0 0 0 / 10%) !important;
}
</style>

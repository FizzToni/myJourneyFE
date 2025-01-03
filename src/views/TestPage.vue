<template>
  <div class="container">
    <div class="box" v-for="box in boxes" :key="box">
      Box {{ box }}
    </div>
  </div>
</template>

<script setup>
const boxes = [1, 2, 3, 4, 5, 6];
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  height: 100vh;
  padding: 16px;
  box-sizing: border-box;
}

.box {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: darkgrey;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 8px;
  height: 100%;
  min-height: 150px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>

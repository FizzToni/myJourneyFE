<template>
  <div class="container">
    <div class="box" v-for="box in boxes" :key="box.id">
      <h1>{{ box.id }}</h1>
      <p>{{ box.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Vaccine {
  _id: string;
  name: string;
  manufacturer?: string;
  recommended_age?: number;
  amount_needed?: number;
  dosage_schedule?: string;
  common_sideeffects?: string;
  prevent_desease?: string;
  description?: string;
}

interface Box {
  id: number;
  description: string;
  symbol?: symbol;
}

const vaccines = ref<Vaccine[]>([]);
const boxes = ref<Box[]>([
  { id: vaccines.value.length, description: "Vaccines text" },
]);

async function fetchVaccines() {
  try {
    const response = await fetch('https://n8n.tonii.at/webhook/getAllVaccine');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    vaccines.value = await response.json();

    boxes.value = [
      { id: vaccines.value.length, description: "Vaccines in total" },
    ];
  } catch (error) {
    console.error('Error fetching vaccines:', error);
  }
}

onMounted(fetchVaccines);
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: grey;
  color: blue;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 8px;
  height: 100%;
  min-height: 150px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  text-align: center;
}
</style>

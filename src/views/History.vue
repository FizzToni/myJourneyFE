<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const active = ref([]);
const inactive = ref([]);

async function fetchData() {
  try {
    const id = '676c39fd5991fae62fcb1a63';
    const response = await fetch(`https://n8n.tonii.at/webhook/history?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    active.value = jsonData[0].active;
    inactive.value = jsonData[0].inactive;
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Failed to fetch data. Check console for details.');
  }
}

function navigateToMyJourney(journey_id, title) {
  router.push({ path: '/main', query: { journey_id, title } });
}

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="main-background">
    <!-- Banner -->
    <div class="flex justify-center banner">
      <header class="flex justify-between items-center px-4">
        <h1>History</h1>
        <button class="refresh-button" @click="fetchData">
          <i class="material-symbols-outlined">refresh</i>
        </button>
      </header>
    </div>

    <!-- Active Subsection -->
    <section class="subsection">
      <h2>Active</h2>
      <ul v-if="active.length > 0">
        <li
          v-for="item in active"
          :key="item.id"
          @click="navigateToMyJourney(item.journey_id, item.title)"
          class="clickable-item"
        >
          {{ item.title }}
        </li>
      </ul>
      <p v-else>No active journeys available</p>
    </section>

    <!-- Inactive Subsection -->
    <section class="subsection">
      <h2>Inactive</h2>
      <ul v-if="inactive.length > 0">
        <li v-for="item in inactive" :key="item.id" @click="navigateToMyJourney(item.journey_id, item.title)"
        class="clickable-item">
          {{ item.title }}
        </li>
      </ul>
      <p v-else>No inactive journeys available</p>
    </section>
  </div>
</template>

<style scoped>
.main-background{
  background: linear-gradient(to bottom right, #cffdff, rgb(199, 255, 223));
  min-height: 100vh; /* Ensure it covers the entire viewport */
  padding: 0;
  margin: 0;
}
.banner {
  background: linear-gradient(to bottom right, #0EBE7E, #07D9AD);
  color: white;
  text-align: center;
  padding: 30px 0;
  font-size: 24px;
  font-weight: bold;
  border-radius: 0 0 20px 20px;
}

.refresh-button {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 24px;
  transition: transform 0.2s ease, color 0.2s ease;
}

.refresh-button:hover {
  transform: rotate(360deg);
  color: #0BE9A8;
}

.subsection {
  margin: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow-y: auto;
  max-height: 40vh; /* Set a maximum height for the subsection */
}

.subsection h2 {
  color: #333;
  font-size: 20px;
  margin-bottom: 10px;
}

.clickable-item {
  cursor: pointer;
  padding: 10px;
  transition: background-color 0.3s;
}

.clickable-item:hover {
  background-color: #f0f0f0;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Banner from "@/components/banner/banner.vue";
import Navbar from "@/components/navbar/Navbar.vue";

const router = useRouter();
const active = ref([]);
const inactive = ref([]);

async function fetchData() {
  try {
    const id = '677bf13348c5315f7a19a204';
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

function navigateToMyJourney(journey_id, title, status) {
  router.push({ path: '/main', query: { journey_id, title, status } });
}

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="main-container bg-gradient-to-br from-green-100 via-white to-blue-100">
    <!-- Banner -->
    <banner title="History" status="" :on-refresh="fetchData" />

    <!-- Scrollable Sections -->
    <div class="scrollable-sections">
      <!-- Active Subsection -->
      <section class="subsection">
        <h2>Active</h2>
        <ul v-if="active.length > 0">
          <li
            v-for="item in active"
            :key="item.id"
            @click="navigateToMyJourney(item.journey_id, item.title, 'active')"
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
          <li
            v-for="item in inactive"
            :key="item.id"
            @click="navigateToMyJourney(item.journey_id, item.title, 'inactive')"
            class="clickable-item"
          >
            {{ item.title }}
          </li>
        </ul>
        <p v-else>No inactive journeys available</p>
      </section>
    </div>

    <!-- Navbar -->
    <Navbar />
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full height of the viewport */
  user-select: none;

}

.scrollable-sections {
  flex: 1; /* Allow this section to grow or shrink */
  overflow-y: auto; /* Enable vertical scrolling */
  padding: 10px;
  padding-bottom: 90px; /* Add space for the navbar height */
}

.subsection {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
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

.banner {
  flex-shrink: 0; /* Prevent the banner from shrinking */
}

.navbar {
  flex-shrink: 0; /* Prevent the navbar from shrinking */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* Ensure it stays above other content */
  background: white;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
}
</style>

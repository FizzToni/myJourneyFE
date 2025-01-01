<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAccountStore } from '@/stores/account';
import { ref, onMounted } from 'vue';

const { user } = storeToRefs(useAccountStore());
const journeys = ref([]); // Store journey data
import { useRoute } from 'vue-router';
import Banner from "@/components/banner/banner.vue";
import Navbar from "@/components/navbar/Navbar.vue";

const route = useRoute();
const title = ref();

async function fetchJourneys() {
  try {
    const id = '676c39fd5991fae62fcb1a63'
    const subJourneyId = route.query.journey_id || 0;
    title.value = route.query.title;
    if(title.value === undefined){
      title.value = '';
    }

    //user.value.account_id
    const response = await fetch(`https://n8n.tonii.at/webhook/myjourney?id=${id}&journey_id=${subJourneyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    journeys.value = data || [];
    console.log(journeys);
  } catch (error) {
    console.error('Error fetching journeys:', error);
    alert('Failed to fetch journeys. Check console for details.');
    journeys.value = [];
  }
}

// Helper to get the date property
function getDateProperty(node) {
  const dateKey = Object.keys(node).find(key => key.toLowerCase().includes('date'));
  return dateKey ? node[dateKey] : null;
}

// Helper to format the date
function formatDate(date) {
  const d = new Date(date);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString(); // Format as 'MM/DD/YYYY'
}

onMounted(() => {
  fetchJourneys();
});
</script>

<template>
  <div class="main-container bg-gradient-to-br from-green-100 via-white to-blue-100">
    <!-- Banner -->
    <banner :title="`MyJourney ${title}`"  :on-refresh="fetchJourneys"/>

    <!-- Journey List -->
    <section class="scrollable-section">
      <ul v-if="journeys.length > 0">
        <li v-for="(node, index) in journeys" :key="node.id">
          <div class="info-container">
            <p>
              <span class="icon-circle">
                <i class="material-symbols-outlined">
                  <!-- Dynamically render icons -->
                  <template v-if="node.type === 'medication'">pill</template>
                  <template v-else-if="node.type === 'med_institution'">home_health</template>
                  <template v-else>help</template>
                </i>
              </span>
            </p>
            <p class="name">{{ node.name }}</p>
          </div>
          <!-- Display date dynamically if available -->
          <p v-if="getDateProperty(node)" class="date-display">
              {{ formatDate(getDateProperty(node)) }}
            </p>
          <div v-if="index < journeys.length - 1" class="dots">⋮</div>
        </li>
      </ul>
      <p v-else>No journeys available</p>
    </section>
    <navbar/>
  </div>
</template>

<style scoped>
.name{
  margin-top: -30px;
}
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full height of the viewport */
}

.scrollable-section {
  flex: 1; /* Allow this section to grow or shrink */
  overflow-y: auto; /* Enable vertical scrolling */
  /* Add padding */
  padding: 15px 15px 100px;
  margin-bottom: 90px; /* Add space for the navbar height */
}
.scrollable-section ul li {
  font-size: 20px; /* Increase the text size for items */
  color: black;
  font-weight: bold;
}

.scrollable-section h2 {
  color: #333;
  font-size: 20px;
  margin-bottom: 10px;
}
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined',serif;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
  color: #0EBE7E;
  font-size: 25pt;
}
.info-container {
  display: flex; /* Align items horizontally */
  align-items: center; /* Center items vertically */
  gap: 8px; /* Add spacing between items */
}
.icon-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px; /* Adjust size of the circle */
  height: 60px; /* Adjust size of the circle */
  background-color: white; /* Background color for the circle */
  border-radius: 50%; /* Makes it a perfect circle */
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3); /* Shadow effect */
}
.dots {
  display: flex;
  justify-content: left;
  align-items: center;
  font-size: 40px; /* Adjust size of the dots */
  color: gray; /* Set the color of the dots */
  margin-top: 5px;
  margin-left: 24px;
}
.date-display {
  font-size: 14px;
  color: gray;
  margin-top: -30px;
  margin-left: 70px;
}
</style>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAccountStore } from '@/stores/account';
import { ref, onMounted } from 'vue';
import {useRoute, useRouter} from 'vue-router';
import Banner from "@/components/banner/banner.vue";
import Navbar from "@/components/navbar/Navbar.vue";
import Addbutton from "@/components/addbutton/Addbutton.vue";
import Modal from "@/components/Modal/Modal.vue";

const { user } = storeToRefs(useAccountStore());
const journeys = ref([]); // Store journey data

const route = useRoute();
const router = useRouter();
const title = ref();
const status = ref();
const isVisible = ref(false);
// Current date
const currentDate = new Date(); // Today's date

async function fetchJourneys() {
  try {
    const id = '678175573b069098d0d222a4'
    const subJourneyId = route.query.journey_id || 0;
    title.value = route.query.title;
    status.value = route.query.status;
    if(title.value === undefined){
      title.value = '';
    }
    if(status.value === undefined){
      status.value = '';
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
    journeys.value = data[0].nodes || [];
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
function handleCustomEvent(newStatus: string) {
  console.log("Event received:", newStatus);
  status.value = newStatus
  // Handle the event data
  router.push({
    path: "/main", // Navigate to the /main route
    query: {
      journey_id: route.query.journey_id || "", // Retain existing journey_id
      title: route.query.title || "", // Retain existing title or use a default
      status: newStatus, // Update the status in the query params
    },
  });
}
onMounted(() => {
  fetchJourneys();
});
function handleCreateJourneyEvent() {
  console.log("Create Journey Event received");
  isVisible.value = true; // Open the modal
}
function openModal() {
  console.log("open modal");
  isVisible.value = true;
}
function closeModal() {
  isVisible.value = false;
}


// Function to determine if the "Today" line should be displayed before a node
function shouldRenderTodayLine(node, index, length) {
  const nodeDate = new Date(getDateProperty(node)); // Convert node date to Date object

  // Check if the node date exists and is greater or equal to today
  if (isNaN(nodeDate.getTime())) return false; // Skip invalid dates

  const previousNode = journeys.value[index - 1];
  const previousNodeDate = previousNode ? new Date(getDateProperty(previousNode)) : null;


  return (
    nodeDate >= currentDate && // Current node date is today or in the future
    (!previousNodeDate || previousNodeDate < currentDate)// Previous node date is before today
  );
}

function lastNode(node, index, length) {
  const nodeDate = new Date(getDateProperty(node)); // Convert node date to Date object

  // Check if the node date exists and is greater or equal to today
  if (isNaN(nodeDate.getTime())) return false; // Skip invalid dates
  return (
    nodeDate < currentDate && index == length -1// Previous node date is before today
  );
}
</script>

<template>
  <div class="main-container bg-gradient-to-br from-green-100 via-white to-blue-100">
    <!-- Banner -->
    <banner :title="`${title}`" :status="`${status}`"  :on-refresh="fetchJourneys"/>

    <!-- Journey List -->
    <section class="scrollable-section">
      <ul v-if="journeys.length > 0">
        <li v-for="(node, index) in journeys" :key="node.id">
          <div v-if="shouldRenderTodayLine(node, index, journeys.length)" class="today-line">
            <span class="line-text">Today {{ formatDate(currentDate) }}</span>
          </div>

          <!-- Journey Node -->
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

          <!-- Display Date -->
          <p v-if="getDateProperty(node)" class="date-display">
            {{ formatDate(getDateProperty(node)) }}
          </p>

          <!-- Dots Between Nodes -->
          <div v-if="index < journeys.length - 1" class="dots">⋮</div>
          <!-- Render the "Today" line dynamically -->
          <div v-if="lastNode(node, index, journeys.length)" class="last-today-line">
            <span class="line-text">Today {{ formatDate(currentDate) }}</span>
          </div>
        </li>
      </ul>

      <p v-else>No Nodes available</p>
      <addbutton class="floating-add-button"  @customEvent="handleCustomEvent" @createJourney="handleCreateJourneyEvent"/>
      <modal :on-close="closeModal" :is-visible="isVisible"/>
    </section>
    <navbar option="MyJourney"/>
  </div>
</template>

<style scoped>
.name{
  margin-top: -15px;
  font-size: 24px;
}
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full height of the viewport */
  user-select: none;

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
.floating-add-button {
  position: fixed; /* Fix the button in place */
  bottom: 100px; /* Adjust height from the bottom of the screen */
  right: 20px; /* Adjust distance from the right */
  z-index: 10; /* Ensure it appears above other content */
}

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined',serif;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
  color: #0EBE7E;
  font-size: 35pt;
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
  width: 80px; /* Adjust size of the circle */
  height: 80px; /* Adjust size of the circle */
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
  margin-left: 30px;
}
.date-display {
  font-size: 15px;
  color: gray;
  margin-top: -32px;
  margin-left: 90px;
}
.today-line {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* Positioning for pseudo-elements */
  width: 70%;
  z-index: 10; /* Ensure the line stays below the text */
  margin-left: 15%;
  margin-top: -40px;
  margin-bottom: 20px;
}
.last-today-line{
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* Positioning for pseudo-elements */
  width: 70%;
  z-index: 10; /* Ensure the line stays below the text */
  margin-left: 15%;
  margin-top: 30px;
}

.today-line .line-text,
.last-today-line .line-text {
  font-weight: bold;
  font-size: 14px;
  color: #555;
  background: rgba(255, 255, 255, 0); /* Fully transparent background */
  padding: 0 10px; /* Space around the text */
  z-index: 10; /* Ensure the text stays on top of the line */
}

.today-line::before,
.today-line::after,
.last-today-line::before,
.last-today-line::after {
  content: "";
  flex: 1; /* Allows the lines to grow and fill space */
  height: 2px; /* Thickness of the line */
  background-color: black;
  z-index: 10; /* Place the line below the text */
}


</style>

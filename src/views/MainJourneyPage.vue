<script setup lang="ts">
import { useAccountStore } from '@/stores/account';
import { ref, onMounted } from 'vue';
import {useRoute, useRouter} from 'vue-router';
import Modal from "@/components/Modal/Modal.vue";
import JourneyNode from '@/components/JourneyNode.vue'
import Wrapper from '@/components/AppWrapper.vue'
import AddButton from '@/components/AddButton/AddButton.vue'

const accountStore = useAccountStore();
const journeys = ref([]); // Store journey data

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
  const subJourneyId = route.query.journey_id || 0;
  const response = await accountStore.fetchJourney(subJourneyId);

  journeys.value = response[0].nodes || [];
  console.log("Journeys fetched:", journeys);

  title.value = route.query.title;
  status.value = route.query.status;
  if(title.value === undefined){
    title.value = '';
  }
  if(status.value === undefined){
    status.value = '';
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
  <Wrapper :title="title" :status="status" :on-refresh="fetchJourneys">
    <section>
      <ul v-if="journeys.length > 0">
        <li v-for="(node, index) in journeys" :key="index">
          <div v-if="shouldRenderTodayLine(node, index, journeys.length)" class="today-line">
            <span class="line-text">Today {{ formatDate(currentDate) }}</span>
          </div>
          <JourneyNode
            :node="node"
            :is-last="index === journeys.length - 1"
            :format-date="formatDate"
            :get-date-property="getDateProperty"
          />
        </li>
      </ul>

      <p v-else class="min-h-[825px] text-center text-gray-500 font-semibold mt-8">No Nodes available</p>
    </section>
    <AddButton
      @node-added="fetchJourneys"
      @customEvent="handleCustomEvent"
      @createJourney="handleCreateJourneyEvent"
    />
    <modal :on-close="closeModal" :is-visible="isVisible" />
  </Wrapper>
</template>


<style scoped>

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

</style>

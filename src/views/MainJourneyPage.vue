<script setup lang="ts">
import { useAccountStore } from '@/stores/account';
import { ref, onMounted, nextTick } from 'vue';
import {useRoute, useRouter} from 'vue-router';
import Modal from "@/components/Modal/Modal.vue";
import JourneyNode from '@/components/JourneyNode.vue'
import Wrapper from '@/components/AppWrapper.vue'
import AddButton from '@/components/AddButton/AddButton.vue'
import { Separator } from '@/components/ui/separator'
import {Drawer, DrawerTrigger, DrawerContent} from "@/components/ui/drawer";
import VaccinesUser from "@/components/VaccinesUser.vue";
import Vaccines from "@/components/Vaccines.vue";
import NodeDetail from "@/components/NodeDetail.vue";

const accountStore = useAccountStore();
const journeys = ref([]); // Store journey data

const route = useRoute();
const router = useRouter();
const title = ref();
const status = ref();
const isVisible = ref(false);

// Current date
const currentDate = new Date();
const todayLineRef = ref<HTMLElement | null>(null);

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

  await nextTick(() => {
    if (todayLineRef.value) {
      todayLineRef.value.scrollIntoView();
    }
  });

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
  fetchJourneys().then(() => {
    const element = document.getElementById("today-line");
    if (element) {
      element.scrollIntoView({behavior: "smooth"});
    }
  });
});

function handleCreateJourneyEvent() {
  console.log("Create Journey Event received");
  isVisible.value = true; // Open the modal
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

</script>

<template>
  <Drawer>
  <Wrapper :title="title" :status="status" :on-refresh="fetchJourneys">
    <section class="mt-4">
      <ul v-if="journeys.length > 0">
        <li v-for="(node, index) in journeys" :key="index">
          <div
            v-if="shouldRenderTodayLine(node, index, journeys.length)"
            class="m-4"
            id="today-line"
          >
            <p class="text-center text-sm text-gray-500 font-thin">Heute</p>
            <Separator :label="formatDate(currentDate)"/>
          </div>
          <DrawerTrigger class="flex flex-col text-start">
              <JourneyNode
                :node="node"
                :is-last="index === journeys.length - 1"
                :format-date="formatDate"
                :get-date-property="getDateProperty"
              />
          </DrawerTrigger>
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
    <DrawerContent>
      <NodeDetail/>
    </DrawerContent>
  </Drawer>
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

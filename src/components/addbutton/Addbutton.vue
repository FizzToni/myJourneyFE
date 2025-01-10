<script setup lang="ts">
import { ref, computed, defineEmits } from "vue";
import { useRoute,useRouter } from "vue-router";

// Toggle state for showing the popup options
const showOptions = ref(false);

// Access the current route using Vue Router
const route = useRoute();
const router = useRouter();

const status =route.query.status; // Default status
const id = "678175573b069098d0d222a4";
const journey_id = route.query.journey_id;

const emit = defineEmits<{
  (event: "customEvent", status: string): void;
  (event: "createJourney", option: boolean): void;
}>();
function triggerChangeStatusEvent(newStatus: string) {

  emit("customEvent", newStatus); // Emit the event with a payload
}
function triggerCreateJourneyEvent(option: boolean) {

  emit("createJourney", option); // Emit the event with a payload
}
function toggleOptions() {
  showOptions.value = !showOptions.value;
}

// Function to handle option clicks

function handleChangeStatus(option: string, status: string) {
  console.log("Clicked option:", option);
  triggerChangeStatusEvent(status === "active" ? "inactive" : "active");//data[0].status

  const id = "678175573b069098d0d222a4"; // Example ID
  const journey_id = route.query.journey_id; // Extract journey_id from the route

  fetch("https://n8n.tonii.at/webhook/status", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      journey_id: journey_id,
      status: status === "active" ? "inactive" : "active",
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("PUT request successful:", data);
    })
    .catch((error) => {
      console.error("Error in PUT request:", error);
    });

  showOptions.value = false; // Close options after clicking
}



function handleAddNode(option: string) {
  console.log("Clicked Add Node");

  // Add logic for adding a node here
  showOptions.value = false; // Close options after clicking
}

function handleCreateJourney(option: string) {
  console.log("Clicked Create Sub-Journey");
  emit("createJourney", true); // Emit the event with a payload

  // Add logic for creating a sub-journey here

  showOptions.value = false; // Close options after clicking
}


// Computed property to check if the current URL ends with "/main"
const isMainPage = computed(() => route.fullPath.endsWith("/main"));
</script>

<template>
  <div class="main-container">
    <!-- Existing content -->
    <div class="journey-content">
      <!-- Your existing journey list goes here -->
    </div>

    <!-- Floating Action Button and Popup -->
    <div class="fab-container">
      <div class="fab-wrapper">
        <button class="fab" @click="toggleOptions">+</button>
      </div>

      <!-- Popup options -->
      <div v-if="showOptions" class="popup-options">
        <!-- Change active/inactive -->
        <button v-if="!isMainPage" class="option" @click="handleChangeStatus('Change Status', <string>status)">Change Status</button>
        <!-- Add Node -->
        <button class="option" @click="handleAddNode('Add Node')">Add Node</button>
        <!-- Add Sub-Journey -->
        <button class="option" @click="handleCreateJourney('Create Sub-Journey')">Create Sub-Journey</button>
      </div>
    </div>

  </div>
</template>


<style scoped>
/* Main container */
.main-container {
  position: relative;
  height: 100vh; /* Ensure the container takes the full viewport */
  overflow: hidden;
}

/* Floating Action Button (FAB) container */
.fab-container {
  position: fixed;
  bottom: 80px; /* Adjust distance from the bottom */
  right: 20px; /* Adjust distance from the right */
  display: flex;
  flex-direction: column-reverse; /* Reverse direction for options to appear above the button */
  align-items: center; /* Center everything horizontally */
  gap: 10px; /* Space between the FAB and options */
}

/* Wrapper for the FAB to prevent movement */
.fab-wrapper {
  position: relative; /* Ensure the button stays independent of popup options */
}

/* FAB (Floating Action Button) */
.fab {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #0ebe7e; /* Green color */
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: background 0.3s;
  margin-right: 15px;
  margin-bottom: 30px;
}

.fab:hover {
  background: #0aa66f; /* Darker green on hover */
}

/* Popup Options */
.popup-options {
  position: absolute; /* Place options above the button */
  bottom: 70px; /* Distance from the button */
  right: 0; /* Align to the right edge */
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Align the options to the right */
  gap: 8px; /* Space between options */
  width: 180px; /* Set a fixed width for the options */
  z-index: 10; /* Make sure it appears above other content */
  margin-bottom: 30px;
}

.option {
  background: rgba(255, 255, 255, 0); /* Fully transparent background */
  color: #333333; /* Dark text */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  border-radius: 8px; /* Rounded corners */
  padding: 10px 16px; /* Add padding for text spacing */
  font-size: 14px; /* Text size */
  font-weight: 500; /* Slightly bold text for readability */
  text-align: right; /* Align text to the right */
  cursor: pointer; /* Show pointer on hover */
  transition: all 0.3s;
}

.option:hover {
  background: rgba(0, 0, 0, 0.05); /* Subtle hover effect */
  color: #0ebe7e; /* Green text on hover */
}

</style>

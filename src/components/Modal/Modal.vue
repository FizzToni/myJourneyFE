<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-container">
      <button class="close-button" @click="onClose">×</button>
      <slot>
        <div class="input-group">
          <label for="title">Title:</label>
          <input type="text" id="title" v-model="journeyTitle" placeholder="Enter Journey Title" />
        </div>
        <div class="input-group">
          <label for="status">Status:</label>
          <select id="status" v-model="status">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button class="add-node-button" @click="saveJourney">
          Save
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

// Reactive state
const journeyTitle = ref(""); // Name of the node to be added
const status = ref("active"); // Current status dropdown value
const props = defineProps<{
  isVisible: boolean;
  onClose: () => void;
}>();
// Function to handle modal close logic
// Function to send a POST request
async function saveJourney() {
  // Simple ID generation (could be from backend in real cases)
  const nodeData = {
    _id: "678175573b069098d0d222a4",  // Unique ID based on timestamp
    title: journeyTitle.value,
    status: status.value
  };

  try {
    const response = await fetch("https://n8n.tonii.at/webhook/addJourney", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nodeData)
    });

    if (response.ok) {
      const result = await response.json();
      props.onClose();
    } else {
      console.error("Failed to save node.");
    }
  } catch (error) {
    console.error("Error during POST request:", error);
  }
}

</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"); /* Import Font Awesome */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

input,
select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  outline: none;
}

input:focus,
select:focus {
  border-color: #0EBE7E;
}


.add-node-button {
  align-self: flex-end;
  align-items: center;
  gap: 8px;
  background-color: #0EBE7E;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  width: 30%;
}

.add-node-button i {
  font-size: 16px;
}

.add-node-button:hover {
  background-color: #0EBE7E;
}

</style>

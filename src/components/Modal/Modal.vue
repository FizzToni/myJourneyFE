<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-container">
      <button class="close-button" @click="onClose">×</button>
      <slot>
        <div class="input-group">
          <label for="title">Title:</label>
          <input type="text" id="title" v-model="nodeName" placeholder="Enter node name" />
        </div>
        <div class="input-group">
          <label for="status">Status:</label>
          <select id="status" v-model="status">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <section class="node-section">
          <button class="add-node-button" @click="addNode">
            Add Node
          </button>
          <ul class="node-list">
            <li v-for="(node, index) in nodes" :key="index" class="node-item">
              <span>{{ node.name }} ({{ node.status }})</span>
              <button class="delete-node-button" @click="deleteNode(index)">
                <i class="fas fa-trash"></i>
              </button>
            </li>
          </ul>
        </section>
        <button class="add-node-button" @click="">
          Save
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Reactive state
const nodeName = ref(""); // Name of the node to be added
const status = ref("active"); // Current status dropdown value
const nodes = ref<{ name: string; status: string }[]>([]); // Array of nodes

// Function to add a new node
function addNode() {
  if (nodeName.value.trim() !== "") {
    nodes.value.push({ name: nodeName.value, status: status.value });
    nodeName.value = ""; // Clear input field after adding
  } else {
    alert("Please enter a valid node name!");
  }
}

// Function to delete a node
function deleteNode(index: number) {
  nodes.value.splice(index, 1); // Remove node at the specified index
}

defineProps<{
  isVisible: boolean;
  onClose: () => void;
}>();
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
  height: 70vh;
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

.node-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.node-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-height: 150px;
  overflow-y: auto;
}

.node-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
}

.node-item:last-child {
  border-bottom: none;
}

.delete-node-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #f44336; /* Red color for delete icon */
  font-size: 16px;
  padding: 0;
}

.delete-node-button:hover {
  color: darkred;
}

.delete-node-button i {
  pointer-events: none; /* Ensure the icon itself does not interfere with button click */
}
</style>

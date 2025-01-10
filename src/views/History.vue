<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {useRoute, useRouter} from 'vue-router';
import Banner from "@/components/banner/banner.vue";
import Navbar from "@/components/navbar/Navbar.vue";
const route = useRoute();
const router = useRouter();
const active = ref([]);
const inactive = ref([]);

async function fetchData() {
  try {
    const id = '678175573b069098d0d222a4';
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

async function toggleStatus(item: any) {
  console.log('Toggling status for item:', item);
  const isActive = active.value.some((i) => (i.journey_id === item.journey_id && i.title === item.title));
  console.log(isActive)
  console.log(item.journey_id)
  console.log(item.title)
  const newStatus = isActive ? "inactive" : "active";
  console.log(newStatus)
  // Optimistic UI Update: Move item between arrays before confirming with DB
  if (isActive) {
    inactive.value.push(item);
    active.value = active.value.filter((i) => (i.journey_id !== item.journey_id && i.title !== item.title));
  } else {
    active.value.push(item);
    inactive.value = inactive.value.filter((i) => (i.journey_id !== item.journey_id && i.title !== item.title));
  }
  console.log(active.value)
  console.log(inactive.value)

  try {
    // Send the updated status to the database
    const response = await fetch("https://n8n.tonii.at/webhook/status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "678175573b069098d0d222a4",  // Static user ID
        journey_id: item.journey_id,    // Item's unique journey ID
        status: newStatus,              // New status to be updated in DB
      }),
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    console.log(`Status updated to ${newStatus} for item:`, item);

  } catch (error) {
    console.error("Error updating status in DB:", error);
    alert("Failed to update status. Reverting changes...");

    // Revert UI change if API call fails
    if (newStatus === "inactive") {
      active.value.push(item);
      inactive.value = inactive.value.filter((i) => (i.journey_id !== item.journey_id && i.title !== item.title));
    } else {
      inactive.value.push(item);
      active.value = active.value.filter((i) => (i.journey_id !== item.journey_id && i.title !== item.title));
    }
  }
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
            <span @click.stop="toggleStatus(item)" class="status-toggle-icon material-icons">
              sync
            </span>
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
            <span @click.stop="toggleStatus(item)" class="status-toggle-icon material-icons">
              sync
            </span>
          </li>
        </ul>
        <p v-else>No inactive journeys available</p>
      </section>
    </div>

    <!-- Navbar -->
    <Navbar option=""/>
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
  display: flex;
  justify-content: space-between; /* Push the icon to the right */
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.clickable-item:hover {
  background-color: #f0f0f0;
}

.status-toggle-icon {
  font-size: 20px;
  color: #888;
  cursor: pointer;
  transition: transform 0.3s, color 0.3s;
}

.status-toggle-icon:hover {
  transform: rotate(180deg);
  color: #0ebe7e; /* Green color on hover */
}
</style>

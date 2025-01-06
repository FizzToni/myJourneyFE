<script setup lang="ts">
// Define props using the defineProps helper (no need to import)
defineProps<{
  title: string;
  status: string; // 'active' or 'inactive'
  onRefresh: () => void;
}>();

import { computed } from "vue";

// Computed class for dynamic banner styles
function bannerStyleF(status: string) {
  console.log("Banner status:", status);

  return status === "inactive"
    ? {
      background: "linear-gradient(to bottom right, #ccc, #aaa)", // Gray gradient for inactive
      color: "#666", // Darker text for contrast
    }
    : {
      background: "linear-gradient(to bottom right, #0EBE7E, #07D9AD)", // Default green gradient
      color: "white", // White text for default
    };
}
</script>

<template>
  <div>
    <header class="flex banner" :style="bannerStyleF(status)">
      <div class="banner-text">
        <p class="main-title">MyJourney</p>
        <p class="sub-title">{{ title }}</p>
      </div>
      <img
        src="@/assets/avatar.jpg"
        alt="User Profile"
        class="profile-image"
      />
    </header>
  </div>
</template>


<style scoped>
.banner {
  text-align: left;
  padding: 30px 0 30px 30px;
  font-size: 30px;
  font-weight: bold;
  border-radius: 0 0 20px 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* Add shadow */
  user-select: none;
  display: flex;
  align-items: center; /* Vertically align content */
  justify-content: space-between; /* Space out the text and image */
}

.banner-text {
  display: flex;
  flex-direction: column; /* Stack title and subtitle vertically */
}

.main-title {
  font-size: 24px; /* Adjust size for main title */
  margin: 0; /* Remove default margin */
  color: inherit; /* Inherit text color from banner */
}

.sub-title {
  font-size: 18px; /* Adjust size for subtitle */
  margin: 0; /* Remove default margin */
  color: inherit; /* Inherit text color from banner */
}

.profile-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #ccc;
  object-fit: cover;
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 20px;
  margin-right: 30px;
}
</style>

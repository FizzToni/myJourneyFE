<script setup lang="ts">
// Define props using the defineProps helper
defineProps<{
  image: boolean;
  title: string;
  status: string; // 'active' or 'inactive'
  onRefresh: () => void;
}>();

import { computed } from "vue";

// Computed class for dynamic banner styles
const bannerStyle = computed(() => {
  return status === "inactive"
    ? "bg-gradient-to-br from-gray-400 to-gray-600 text-gray-800"
    : "bg-gradient-to-br from-emerald-500 to-emerald-400 text-white";
});
</script>

<template>
  <div
    class="sticky min-h-28 top-0 left-0 w-full flex items-center justify-between p-6 rounded-b-xl shadow-md z-50"
    :class="bannerStyle"
  >
    <div class="flex flex-col min-h-14">
      <p class="text-xl font-bold">MyJourney</p>
      <p class="text-lg">{{ title }}</p>
    </div>
    <img
      v-if="image"
      src="@/assets/avatar.jpg"
      alt="User Profile"
      class="w-16 h-16 rounded-full border object-cover"
    />
  </div>
</template>

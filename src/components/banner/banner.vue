<script setup lang="ts">
// Define props using the defineProps helper (no need to import)
defineProps<{
  title: string;
  onRefresh: () => void;
}>();

// You can define emitted events similarly if needed
defineEmits(['refresh']);
</script>

<template>
  <div>
    <header class="flex banner">
      <h1  @click="onRefresh">{{ title }}</h1>
    </header>
  </div>
</template>

<style scoped>
.banner {
  background: linear-gradient(to bottom right, #0EBE7E, #07D9AD);
  color: white;
  text-align: left;
  padding: 30px 0;
  padding-left: 30px;
  font-size: 30px;
  font-weight: bold;
  border-radius: 0 0 20px 20px;
}
</style>

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
  background: linear-gradient(to bottom right, #0EBE7E, #07D9AD);
  color: white;
  text-align: left;
  padding: 30px 0 30px 30px;
  font-size: 30px;
  font-weight: bold;
  border-radius: 0 0 20px 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* Add shadow */
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

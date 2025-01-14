<template>
  <nav class="sticky bottom-0 left-0 bg-white shadow flex justify-around py-3 rounded-t-xl z-10">
    <ul class="flex w-full justify-around">
      <li
        v-for="item in navItems"
        :key="item.label"
        class="flex flex-col items-center cursor-pointer text-gray-500 transition duration-300"
        :class="{ 'text-green-600': activeItem === item.label }"
        @click="navigateTo(item.route, item.label)"
      >
        <div
          class="flex items-center justify-center w-16 h-8 rounded-full"
          :class="{ 'bg-green-100': activeItem === item.label }"
        >
          <i class="material-symbols-outlined text-xl">{{ item.icon }}</i>
        </div>
        <span class="text-sm font-medium mt-1">{{ item.label }}</span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const navItems = [
  { label: 'Journey', icon: 'timeline', route: '/main' },
  { label: 'Vorsorge', icon: 'volunteer_activism', route: '/overview' },
  { label: 'Account', icon: 'person', route: '/profile' },
];

const activeItem = ref(navItems[0].label);
const router = useRouter();

const navigateTo = (route: string, label: string) => {
  activeItem.value = label;
  router.push(route);
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&display=swap");

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}
</style>

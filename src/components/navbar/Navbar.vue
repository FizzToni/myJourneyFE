<template>
  <nav class="navbar">
    <ul class="navbar-list">
      <li
        v-for="item in navItems"
        :key="item.label"
        :class="['navbar-item', { active: activeItem === item.label }]"
        @click="navigateTo(item.route, item.label)"
      >
        <div class="icon" :class="{ active: activeItem === item.label }">
          <i class="material-symbols-outlined">{{ item.icon }}</i>
        </div>
        <span class="label">{{ item.label }}</span>
      </li>
    </ul>
  </nav>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Navigation items
const navItems = [
  { label: 'Journey', icon: 'timeline', route: '/main' },
  { label: 'Vorsorge', icon: 'volunteer_activism', route: '/precaution' },
  { label: 'Profil', icon: 'person', route: '/profil' },
];

// State to track the active item
const activeItem = ref(navItems[0].label);

// Vue Router instance
const router = useRouter();

// Function to navigate and set the active item
const navigateTo = (route: string, label: string) => {
  activeItem.value = label; // Update the active item
  router.push(route); // Navigate to the route
};
</script>

<style scoped>
.navbar {
  position: fixed; /* Fix the navbar position */
  bottom: 0; /* Place it at the bottom of the viewport */
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: white;
  padding: 10px 0;
  border-radius: 15px 15px 0 0; /* Rounded corners on the top */
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1); /* Shadow on top */
  z-index: 1000; /* Ensure it appears above other content */
}

.navbar-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 40px;
  cursor: pointer;
  color: gray;
  transition: color 0.3s ease;
}

.navbar-item.active .icon,
.navbar-item.active .label {
  color: #0ebe7e;
}

.icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.icon.active {
  background-color: #d6fff2;
  border-radius: 50%;
  padding: 5px;
}

.label {
  font-size: 14px;
  font-weight: 500;
}
</style>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAccountStore } from '@/stores/account';
import { ref, onMounted } from 'vue';

const { user2 } = storeToRefs(useAccountStore());
import {useRoute, useRouter} from 'vue-router';
import Banner from "@/components/banner/banner.vue";
import Navbar from "@/components/navbar/Navbar.vue";

const user = ref<any>(null); // Store user data

const route = useRoute();
const router = useRouter();

async function fetchUser() {
  try {
    const id = '676c39fd5991fae62fcb1a63';

    const response = await fetch(`https://n8n.tonii.at/webhook/user?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    user.value = await response.json();
    user.value = user.value[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    alert('Failed to fetch user data. Check console for details.');
  }
}

onMounted(() => {
  fetchUser();
});

function goToHistory() {
  router.push('/history'); // Navigate to the /history route
}
</script>

<template>
  <div class="main-container bg-gradient-to-br from-green-100 via-white to-blue-100">
    <!-- Banner -->
    <Banner title="Profil" :on-refresh="fetchUser" />
    <div v-if="user">
    <!-- Profile Section -->
      <div class="profile-section">
        <div class="profile-header">
          <!-- User Image -->
          <img
            src="@/assets/avatar.jpg"
            alt="User Profile"
            class="profile-image"
          />
          <!-- Name and Surname -->
          <div class="profile-name">
            <p v-if="user.name" class="name"><strong>{{ user.name }}</strong></p>
            <p v-if="user.surname" class="surname"><strong>{{ user.surname }}</strong></p>
          </div>
        </div>

        <!-- Email and Password -->
        <div class="user-details">
          <p v-if="user.email"><strong>Email:</strong> {{ user.email }}</p>
          <p v-if="user.password"><strong>Password:</strong> ******</p>
        </div>

        <!-- Options -->
        <div class="preferences">
          <div class="preference">
            <label for="vaccination_opt">Vaccination</label>
            <input id="vaccination_opt" type="checkbox" v-model="user.vaccination_opt" />
          </div>
          <div class="preference">
            <label for="bloodwork_opt">Bloodwork</label>
            <input id="bloodwork_opt" type="checkbox" v-model="user.bloodwork_opt" />
          </div>
          <div class="preference">
            <label for="precaution_opt">Precaution</label>
            <input id="precaution_opt" type="checkbox" v-model="user.precaution_opt" />
          </div>
          <div class="preference">
            <label for="plasma_donation_opt">Plasma Donation</label>
            <input id="plasma_donation_opt" type="checkbox" v-model="user.plasma_donation_opt" />
          </div>
        </div>
      </div>
    </div>
    <div class="button-container ">
      <button class="justify-center"  @click="goToHistory">History</button>
    </div>
    <!-- Navbar -->
    <Navbar />
  </div>
</template>

<style scoped>
/* General Layout */
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full viewport height */
}

.profile-section {
  width: 90%;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

.profile-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #ccc;
  object-fit: cover;
}

.profile-name {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
}

.name,
.surname {
  margin: 0;
  font-size: 1.2rem;
}

/* User Details */
.user-details {
  width: 100%;
  margin-bottom: 20px;
}

.user-details p {
  margin: 5px 0;
}

/* Preferences Section */
.preferences {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.preference {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preference label {
  font-weight: bold;
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
}
.button-container {
  display: flex; /* Use flexbox for centering */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  margin: 20px auto; /* Center the container itself and add space above/below */
  border: 2px solid #ccc;
  background: #0EBE7E;
  color: white;
  width: 50%; /* Adjust width as needed */
  padding: 10px; /* Add padding for better clickability */
  text-align: center; /* Center text inside */
  border-radius: 8px; /* Optional: Add rounded corners */
  cursor: pointer; /* Make it look clickable */
  font-weight: bold;
}

.button-container:hover {
  background: #0aa66f; /* Slightly darker green on hover */
}

</style>

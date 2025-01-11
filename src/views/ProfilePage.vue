<script setup lang="ts">
import { useAccountStore } from '@/stores/account';
import { ref, onMounted } from 'vue';

import {useRoute, useRouter} from 'vue-router';
import Banner from "@/components/Banner/Banner.vue";
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import Wrapper from '@/components/AppWrapper.vue'

const user = ref<any>(null); // Store user data

const router = useRouter();

const accountStore = useAccountStore();

async function fetchUser() {
  const response = await accountStore.fetchUserDetails();
  user.value = response[0] || [];
}

onMounted(() => {
  fetchUser();
});


function goToHistory() {
  router.push('/history'); // Navigate to the /history route
}
</script>

<template>
  <Wrapper title="Profil" status="" :on-refresh="fetchUser">
    <Card>
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
    </Card>
    <div class="button-container" @click="goToHistory">
      <button class="justify-center" >History</button>
    </div>
  </Wrapper>
</template>

<style scoped>
/* General Layout */
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full viewport height */
  user-select: none;

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

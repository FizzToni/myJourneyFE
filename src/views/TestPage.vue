<script setup lang="ts">
import { ref, watch } from 'vue';

const inputValue = ref('');
const vaccines = ref<{ name: string; manufacturer: string }[]>([]);
const allVaccines = ref<{
  name: string;
  manufacturer: string;
  recommended_age: number;
  amount_needed: number;
  dosage_schedule: string;
  common_sideeffects: string;
  prevent_desease: string;
  description: string;
}[]>([]); // Für alle Impfstoffe mit erweiterten Informationen
const errorMessage = ref('');

// Funktion zum Abrufen der Impfstoffe basierend auf dem Namen
const fetchVaccines = async () => {
  errorMessage.value = ''; // Fehlernachricht zurücksetzen

  const requestBody = { name: inputValue.value };

  try {
    const response = await fetch('https://n8n.tonii.at/webhook-test/getVaccine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    const resultArray = data?.[0]?.result;
    if (Array.isArray(resultArray)) {
      vaccines.value = resultArray.map((item: any) => ({
        name: item.name,
        manufacturer: item.manufacturer,
      }));
    } else {
      vaccines.value = [];
      errorMessage.value = 'Invalid response format.';
    }
  } catch (error) {
    vaccines.value = [];
    errorMessage.value = 'An error occurred while fetching the data.';
    console.error(error);
  }
};

// Funktion zum Abrufen aller Impfstoffe
const fetchAllVaccines = async () => {
  errorMessage.value = '';

  try {
    const response = await fetch('https://n8n.tonii.at/webhook-test/getAllVaccine', {
      method: 'GET',
    });

    const data = await response.json();

    const resultArray = data;
    if (Array.isArray(resultArray)) {
      allVaccines.value = resultArray.map((item: any) => ({
        name: item.name,
        manufacturer: item.manufacturer,
        recommended_age: item.recommended_age,
        amount_needed: item.amount_needed,
        dosage_schedule: item.dosage_schedule,
        common_sideeffects: item.common_sideeffects,
        prevent_desease: item.prevent_desease,
        description: item.description,
      }));
    } else {
      allVaccines.value = [];
      errorMessage.value = 'Invalid response format.';
    }
  } catch (error) {
    allVaccines.value = [];
    errorMessage.value = 'An error occurred while fetching the data.';
    console.error(error);
  }
};

watch(inputValue, () => {
  if (inputValue.value.trim()) {
    fetchVaccines();
  } else {
    vaccines.value = [];
  }
});
</script>

<template>
  <div class="container">
    <h1>Vaccination Data</h1>

    <div class="input-group">
      <label for="vaccine-name">Enter Vaccine Name:</label>
      <input
        id="vaccine-name"
        type="text"
        v-model="inputValue"
        placeholder="Search"
      />
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-if="vaccines.length > 0" class="results">
      <h2>Results:</h2>
      <ul>
        <li v-for="(vaccine, index) in vaccines" :key="index">
          <strong>Name:</strong> {{ vaccine.name }} <br />
          <strong>Manufacturer:</strong> {{ vaccine.manufacturer }}
        </li>
      </ul>
    </div>

    <div v-else-if="!errorMessage" class="no-results">
      <p>No results to display.</p>
    </div>

    <div class="button-container">
      <button @click="fetchAllVaccines">Get All Vaccines</button>
    </div>

    <div v-if="allVaccines.length > 0" class="all-vaccines">
      <h2>All Vaccines:</h2>
      <ul>
        <li v-for="(vaccine, index) in allVaccines" :key="index">
          <strong>Name:</strong> {{ vaccine.name }} <br />
          <strong>Manufacturer:</strong> {{ vaccine.manufacturer }} <br />
          <strong>Recommended Age:</strong> {{ vaccine.recommended_age }} <br />
          <strong>Amount Needed:</strong> {{ vaccine.amount_needed }} <br />
          <strong>Dosage Schedule:</strong> {{ vaccine.dosage_schedule }} <br />
          <strong>Common Side Effects:</strong> {{ vaccine.common_sideeffects }} <br />
          <strong>Prevents Disease:</strong> {{ vaccine.prevent_desease }} <br />
          <strong>Description:</strong> {{ vaccine.description }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: 'Roboto', sans-serif;
  background-color: #f4f7fc;
  color: #333;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  font-size: 2rem;
  color: #0077cc;
}

.input-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

label {
  font-size: 1rem;
  margin-bottom: 8px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
}

input:focus {
  outline: none;
  border-color: #0077cc;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-size: 1rem;
}

.results, .all-vaccines {
  margin-top: 30px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

button {
  padding: 12px 20px;
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #005fa3;
}

.no-results {
  text-align: center;
  font-size: 1rem;
}

.button-container {
  text-align: center;
  margin-top: 20px;
}
</style>

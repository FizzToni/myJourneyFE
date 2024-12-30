<script setup lang="ts">
import { ref } from 'vue';

const inputValue = ref('');
const vaccines = ref<{ name: string; manufacturer: string }[]>([]);
const errorMessage = ref('');

const fetchVaccines = async () => {
  errorMessage.value = ''; // Reset error message

  // Erstelle den JSON-Body mit dem Namen
  const requestBody = { name: inputValue.value };

  try {
    const response = await fetch('https://n8n.tonii.at/webhook-test/getVaccine', {
      method: 'POST', // Ändere die Methode auf POST
      headers: {
        'Content-Type': 'application/json', // Setze den Content-Type auf JSON
      },
      body: JSON.stringify(requestBody), // Der JSON-Body mit dem Namen
    });

    const data = await response.json();

    // Angenommen, das Antwortformat ist wie oben beschrieben
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
</script>

<template>
  <h1>Vaccination Data</h1>
  <div>
    <label for="vaccine-name">Enter Vaccine Name:</label>
    <input id="vaccine-name" type="text" v-model="inputValue" placeholder="e.g., Polio" />
    <button @click="fetchVaccines">Fetch Vaccines</button>
  </div>

  <div v-if="errorMessage" style="color: red; margin-top: 10px;">
    {{ errorMessage }}
  </div>

  <div v-if="vaccines.length > 0" style="margin-top: 20px;">
    <h2>Results:</h2>
    <ul>
      <li v-for="(vaccine, index) in vaccines" :key="index">
        <strong>Name:</strong> {{ vaccine.name }} <br />
        <strong>Manufacturer:</strong> {{ vaccine.manufacturer }}
      </li>
    </ul>
  </div>

  <div v-else-if="!errorMessage" style="margin-top: 20px;">
    <p>No results to display.</p>
  </div>
</template>

<style scoped>
div {
  margin: 10px 0;
}

input {
  margin-right: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>

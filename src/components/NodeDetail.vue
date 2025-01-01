<script setup>
import { ref } from 'vue';
import { Button } from '@/components/ui/button';

const responseData = ref(null);

const fetchNodeDetails = async () => {

  const id = '6766d85a6d8ba24d19d486a2';
  const journey_id = 1;
  const node_id = 1;

  try {
    const baseUrl = 'https://n8n.tonii.at/webhook/node';
    const response = await fetch(`${baseUrl}?id=${id}&journey_id=${journey_id}&node_id=${node_id}`);
    if (!response.ok) {
      throw new Error(`HTTP error fetching n8n: ${response.status}`);
    }
    responseData.value = await response.json();
  } catch (error) {
    console.error('Error fetching node:', error);
  }
};
</script>

<template>
  <div>
    <Button @click="fetchNodeDetails">
      Node Details
    </Button>
    <div v-if="responseData">
      <h2>Node name:</h2>
      <ul>
        <li v-for="(value, key) in responseData[0]" :key="key">
          <strong>{{ key }}:</strong> {{ value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
</style>

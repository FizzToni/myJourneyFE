<script setup>
import { ref, onMounted } from 'vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/index.ts';

const vaccines = ref([]);
const loading = ref(true);

const fetchVaccines = async () => {
  try {
    const response = await fetch('https://n8n.tonii.at/webhook/getAllVaccine');
    if (!response.ok) {
      throw new Error(`Error fetching vaccines: ${response.status}`);
    }
    vaccines.value = await response.json();
  } catch (error) {
    console.error('Error fetching vaccines:', error);
  } finally {
    loading.value = false;
  }
};

const handleVaccineClick = (id) => {
  console.log(id);
};

onMounted(fetchVaccines);
</script>

<template>
  <div class="p-4">
    <Card>
      <CardHeader>
        <CardTitle>Available Vaccines</CardTitle>
        <CardDescription>Click on a vaccine to see details.</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="text-center">
          Loading vaccines...
        </div>
        <div v-else>
          <ul>
            <li
              v-for="vaccine in vaccines"
              :key="vaccine._id"
              class="p-4 border-b cursor-pointer hover:bg-gray-100"
              @click="handleVaccineClick(vaccine._id)"
            >
              <strong>{{ vaccine.name }}</strong>
              <p>{{ vaccine.description }}</p>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

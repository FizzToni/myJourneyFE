<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/index.ts';

// Definiere das Interface für den Impfstoff
interface Vaccine {
  id: string;
  name: string;
  details?: string;
  date?: string;
  location?: string;
  dose?: string;
}

const vaccines = ref<Vaccine[]>([]);
const loading = ref(true);

const fetchVaccines = async () => {
  try {
    const response = await fetch(
      'https://n8n.tonii.at/webhook/getDataForOverview?id=677ba8958eca95927318b059'
    );
    if (!response.ok) {
      throw new Error(`Error fetching vaccines: ${response.status}`);
    }
    const data = await response.json();
    vaccines.value = data[0]?.vaccines || []; // Nur das `vaccines`-Array extrahieren
  } catch (error) {
    console.error('Error fetching vaccines:', error);
  } finally {
    loading.value = false;
  }
};

// Typisierung für den Parameter `id` hinzufügen
const handleVaccineClick = (id: string) => {
  console.log(id);
  window.location.replace(`/vaccineDetail?id=${id}`); // ID an die URL anhängen
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
              :key="vaccine.id"
              class="p-4 border-b cursor-pointer hover:bg-gray-100"
              @click="handleVaccineClick(vaccine.id)"
            >
              <strong>{{ vaccine.name }}</strong>
              <p>{{ vaccine.details || 'No description available' }}</p>
              <p v-if="vaccine.date">Date: {{ vaccine.date }}</p>
              <p v-if="vaccine.location">Location: {{ vaccine.location }}</p>
              <p v-if="vaccine.dose">Dose: {{ vaccine.dose }}</p>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
</style>

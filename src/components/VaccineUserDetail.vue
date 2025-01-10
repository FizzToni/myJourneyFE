<script setup lang="ts">
import { onMounted, ref, unref } from 'vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/index.ts';

// Definiere das Interface für den Impfstoff
interface Vaccine {
  id: number;
  name: string;
  details: string;
  date: string;
  location: string;
  dose: number;
}

const vaccineId = 7; // Hardcodierte ID der Vaccine

const vaccine = ref<Vaccine | null>(null);

const fetchVaccineData = async () => {
  try {
    const response = await fetch(
      `https://n8n.tonii.at/webhook/getDataForOverview?id=677ba8958eca95927318b059`
    );
    const data = await response.json();

    if (data && data[0]?.vaccines) {
      const selectedVaccine = data[0].vaccines.find((v: Vaccine) => v.id === vaccineId);
      if (selectedVaccine) {
        vaccine.value = selectedVaccine;
      }
    }
  } catch (error) {
    console.error('Error fetching vaccine data:', error);
  }
};

onMounted(() => {
  fetchVaccineData();
});
</script>

<template>
  <div class="p-4">
    <Card v-if="vaccine">
      <CardHeader>
        <CardTitle>{{ unref(vaccine)?.name }}</CardTitle>
        <CardDescription>
          Vaccine Details
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ul>
          <li> {{ unref(vaccine)?.details }}</li>
          <li><strong>Date:</strong> {{ unref(vaccine)?.date }}</li>
          <li><strong>Location:</strong> {{ unref(vaccine)?.location }}</li>
          <li><strong>Dose:</strong> {{ unref(vaccine)?.dose }}</li>
        </ul>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
</style>

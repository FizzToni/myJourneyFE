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
  _id: string;
  name: string;
  manufacturer: string;
  recommended_age: number;
  amount_needed: number;
  dosage_schedule: string;
  common_sideeffects: string;
  prevent_desease: string;
  description: string;
}

const vaccineId = "67631c1aa01c0af22d34aea7";

const vaccine = ref<Vaccine | null>(null);

const fetchVaccineData = async () => {
  try {
    const response = await fetch(`https://n8n.tonii.at/webhook/getAllVaccine`);
    const data = await response.json();

    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i]._id === vaccineId) {
          vaccine.value = data[i];
          break;
        }
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
          <li><strong>Manufacturer:</strong> {{ unref(vaccine)?.manufacturer }}</li>
          <li><strong>Recommended Age:</strong> {{ unref(vaccine)?.recommended_age }} years</li>
          <li><strong>Amount Needed:</strong> {{ unref(vaccine)?.amount_needed }}</li>
          <li><strong>Dosage Schedule:</strong> {{ unref(vaccine)?.dosage_schedule }}</li>
          <li><strong>Common Side Effects:</strong> {{ unref(vaccine)?.common_sideeffects }}</li>
          <li><strong>Prevents:</strong> {{ unref(vaccine)?.prevent_desease }}</li>
          <li><strong>Description:</strong> {{ unref(vaccine)?.description }}</li>
        </ul>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
</style>

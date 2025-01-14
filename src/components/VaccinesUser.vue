<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAccountStore } from "@/stores/account.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/index.ts';
import {ScrollArea} from "@/components/ui/scroll-area";

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
const accountStore = useAccountStore();

const fetchVaccines = async () => {
  const data = await accountStore.fetchOverview();
  vaccines.value = data[0]?.vaccines || [];
  loading.value = false
};

// Typisierung für den Parameter `id` hinzufügen
const handleVaccineClick = (id: string) => {
  console.log(id);
  window.location.replace(`/vaccineUserDetail?id=${id}`); // ID an die URL anhängen
};

onMounted(fetchVaccines);
</script>

<template>
  <ScrollArea class="h-[500px]">
  <div class="p-4">
    <Card>
      <CardHeader>
        <CardTitle>Impfpass</CardTitle>
        <CardDescription>Für mehr Details anklicken</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="text-center">
          Impfungen werden geladen...
        </div>
        <div v-else>
          <ul>
            <li
              v-for="vaccine in vaccines"
              :key="vaccine.id"
              class="p-4 border-b cursor-pointer hover:bg-gray-100"
            >
              <strong>{{ vaccine.name }}</strong>
              <p>{{ vaccine.details || 'No description available' }}</p>
              <p v-if="vaccine.date">Date: {{ vaccine.date }}</p>
              <!--    <p v-if="vaccine.location">Location: {{ vaccine.location }}</p>
              <p v-if="vaccine.dose">Dose: {{ vaccine.dose }}</p>-->
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>
  </ScrollArea>
</template>

<style scoped>
</style>

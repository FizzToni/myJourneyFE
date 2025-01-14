<template>
  <!-- Banner -->
  <AppWrapper title="Overview" status="" :on-refresh="fetchJourneys" >
    <div class="m-2"/>
    <Card class="relative" @click="handleUserVaccineClick">
      <div class="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-ping "/>
      <CardHeader>
          <CardTitle>
            Deine Impfungen
          </CardTitle>
          <CardDescription>
            Behalte deine Impfungen einfach im Blick und bleibe über neue Angebote informiert.
          </CardDescription>
        </CardHeader>

      <CardContent>
        <div class="flex justify-between items-center gap-2">
          <div>
            <h3 class="text-lg font-bold" v-if="vaccines">{{ vaccines.length }}</h3>
            <p class="text-sm">erhaltene Impfungen</p>
          </div>
          <div>
            <h3 class="text-lg font-bold">12</h3>
            <p class="bg-red-500 text-white rounded px-2 py-1 text-sm">neue Verfügbar</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Separator class="my-4"/>

    <div class="flex gap-2 justify-between">
      <Card
        v-for="(item, index) in nodes"
        class="flex-1 min-h-0 w-1/3"
        :key="index"
        @click="item.onClick"
      >
        <CardContent class="">
          <div class="flex flex-col">
            <h3 class="text-lg font-bold">{{ item.number }}</h3>
            <p class="text-sm">{{item.text}}</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <Separator class="my-4"/>

    <div class="flex gap-2 justify-between">
      <Card
        v-for="(journey, index) in journeys"
        :key="index"
        class=""
        @click="handleJourneyClick(journey.journey_id)"
      >
        <CardContent class="">
          <div>
            <h3 class="text-lg font-bold">{{ journey.nodes.length }}</h3>
            <p class="text-sm">{{ journey.title }}</p>
            <p class="text-sm">{{ journey.status }}</p>
          </div>
        </CardContent>
      </Card>
    </div>

  </AppWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AppWrapper from '@/components/AppWrapper.vue';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator'

const nodes = ref<{ number: number; text: string; onClick: () => void }[]>([]);
const journeys = ref<{ status: string; id: string }[]>([]);
const vaccines = ref<any[]>([]); // Adjust type based on actual vaccine structure
const userId = "677ba8958eca95927318b059";

const fetchJourneys = async () => {
  try {
    const response = await fetch(
      `https://n8n.tonii.at/webhook/getDataForOverview?id=${userId}`
    );
    const data = await response.json();

    if (data && data[0] && data[0].journeys) {
      journeys.value = data[0].journeys.filter((journey: any) => journey.status === "active");
      vaccines.value = data[0].vaccines;
    }

    const response2 = await fetch("https://n8n.tonii.at/webhook/getAllVaccine");
    const vaccineData = await response2.json();

    if (vaccineData) {
      nodes.value = [
        {
          number: vaccineData.length,
          text: "Vaccination",
          onClick: handleVaccineClick,
        },
        {
          number: 0,
          text: "Node 2",
          onClick: handlePrecautionClick,
        },
        {
          number: 0,
          text: "Node 3",
          onClick: handleMedicationClick,
        },
      ];
    }
  } catch (error) {
    console.error("Error fetching journeys:", error);
  }
};

const handleUserVaccineClick = () => {
  window.location.replace("/vaccinesUser");
};

const handleVaccineClick = () => {
  window.location.replace("/vaccines");
};

const handlePrecautionClick = () => {
  console.log("User ID:", userId);
  console.log("Precaution popup triggered.");
};

const handleMedicationClick = () => {
  console.log("User ID:", userId);
  console.log("Medication popup triggered.");
};

const handleJourneyClick = (journeyId: string) => {
  console.log("User ID:", userId);
  console.log("Journey ID:", journeyId);
};

onMounted(() => {
  fetchJourneys();
});
</script>

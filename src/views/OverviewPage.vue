<template>
  <Drawer>
    <AppWrapper title="Overview" status="" :on-refresh="fetchJourneys" >
      <div class="m-2"/>
      <DrawerTrigger>
        <Card class="relative" @click="whatThis = 'userVaccine'">
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
                <h3 class="text-lg font-bold">2</h3>
                <p class="bg-red-500 text-white rounded px-2 py-1 text-sm">neue Verfügbar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DrawerTrigger>

      <Separator class="my-4"/>

      <DrawerTrigger>
      <div class="flex gap-2 justify-between">
        <Card
          v-for="(item, index) in nodes"
          class="flex-1 min-h-0 w-1/3"
          :key="index"
          @click="whatThis = 'vaccine'"
        >
          <CardContent class="">
            <div class="flex flex-col">
              <h3 class="text-lg font-bold">{{ item.number }}</h3>
              <p class="text-sm">{{item.text}}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      </DrawerTrigger>


      <Separator class="my-4"/>

      <div class="flex   gap-2 justify-between">
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
    <DrawerContent>
      <Available v-if="whatThis === 'vaccine'" />
      <VaccinesUser v-else />
    </DrawerContent>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';

import AppWrapper from '@/components/AppWrapper.vue';
import { useAccountStore } from "@/stores/account.ts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator'
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import VaccinesUser from "@/components/VaccinesUser.vue";
import Available from "@/components/Vaccines.vue";

const route = useRoute();
const router = useRouter();
const accountStore = useAccountStore();

const nodes = ref<{ number: number; text: string; onClick: () => void }[]>([]);
const journeys = ref<{ status: string; id: string }[]>([]);
const vaccines = ref<any[]>([]); // Adjust type based on actual vaccine structure

const whatThis = ref('');

const fetchJourneys = async () => {

  try {
    const data = await accountStore.fetchOverview()


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
          text: "Impfungen",
          onClick: () => {
            whatThis.value = 'vaccine';
          },
        },
        {
          number: 10,
          text: "Vorsorge",
          onClick: handlePrecautionClick,
        },
        {
          number: 7,
          text: "andere",
          onClick: handleMedicationClick,
        },
      ];
    }
  } catch (error) {
    console.error("Error fetching journeys:", error);
  }
};

const handleUserVaccineClick = () => {
  whatThis.value = 'userVaccine';
};

const handleVaccineClick = () => {
  whatThis.value = 'vaccine';
};

const handlePrecautionClick = () => {
  console.log("Precaution popup triggered.");
};

const handleMedicationClick = () => {
  console.log("Medication popup triggered.");
};

const handleJourneyClick = (journeyId: string) => {
  console.log("Journey ID:", journeyId);
};

onMounted(() => {
  fetchJourneys();
});
</script>

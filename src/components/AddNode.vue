<script setup>
import {ref, computed, onMounted} from 'vue';
import {Button} from '@/components/ui/button/index.ts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/index.ts';
import {Input} from '@/components/ui/input/index.ts';
import {Label} from '@/components/ui/label/index.ts';

// Replace with logic to dynamically get userID.
const USER_ID = '677ba8958eca95927318b059';

// Node types for dropdown
const types = ref(['Vaccination', 'Med. Institution', 'E-Health', 'Other']);
const selectedType = ref(types.value[0]);

const journeys = ref([]); // Holds the journey options
const selectedJourney = ref(null); // Selected journey

// Type mappings for backend node creation.
const reverseTypeMappings = {
  'Med. Institution': 'med_institution',
  'E-Health': 'e_health',
  'Vaccination': 'vaccination',
  'Other': 'other',
};

// Default field sets based on the node type
const fieldTemplates = {
  'Vaccination': [
    {label: 'Name', value: 'vaccineName'},
    {label: 'Details', value: 'here are some extra details'},
    {label: 'Date', value: '2020-01-01'},
    {label: 'Location', value: 'Karlsplatz 1'},
    {label: 'Dose', value: 1},
  ],
  'Med. Institution': [
    {label: 'Name', value: ''},
    {label: 'Reason', value: ''},
    {label: 'Stationary', value: false},
    {label: 'Date', value: ''},
    {label: 'Location', value: ''},
    {label: 'Department', value: ''},
    {label: 'Diagnosis', value: ''},
    {label: 'Treatment', value: ''},
    {label: 'Notes Doctor', value: ''},
    {label: 'Notes Self', value: ''},
  ],
  'E-Health': [
    {label: 'Name', value: ''},
    {label: 'Reason', value: ''},
    {label: 'Date', value: ''},
    {label: 'Location', value: ''},
    {label: 'Department', value: ''},
    {label: 'Diagnosis', value: ''},
    {label: 'Treatment', value: ''},
    {label: 'Notes Doctor', value: ''},
    {label: 'Notes Self', value: ''},
  ],
  'Other': [
    {label: 'Name', value: ''},
    {label: 'Date', value: ''},
    {label: 'Notes Doctor', value: ''},
    {label: 'Notes Self', value: ''},
  ],
};

// Fields computed based on selected type
const fields = computed(() => fieldTemplates[selectedType.value]);

// Helper function to lowercase keys and format the node
const formatNodeData = (fields) => {
  return fields.reduce((acc, field) => {
    acc[field.label.toLowerCase().replace(/ /g, '_')] = field.value;
    return acc;
  }, {});
};

const generateVaccinationData = () => {
  // Collect data for vaccination
  const vaccinationData = {
    name: fields.value[0].value,
    details: fields.value[1].value,
    date: fields.value[2].value,
    location: fields.value[3].value,
    dose: fields.value[4].value,
  };
  return vaccinationData;
};

const generateNodeData = () => {
  const nodeData = formatNodeData(fields.value);
  const idKey = '_id';
  const idValue = null;
  const typeKey = 'type';
  const typeValue = reverseTypeMappings[selectedType.value];
  return {[idKey]: idValue, [typeKey]: typeValue, ...nodeData};
};

const fetchJourneys = async () => {
  const url = `https://n8n.tonii.at/webhook/history?id=${USER_ID}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();

      const journeysData = data[0];
      const activeJourneys = journeysData.active || [];
      const inactiveJourneys = journeysData.inactive || [];

      // Combine and map journeys into a usable format
      journeys.value = [
        ...activeJourneys.map(journey => ({
          title: journey.title,
          id: journey.journey_id,
        })),
        ...inactiveJourneys.map(journey => ({
          title: journey.title,
          id: journey.journey_id,
        })),
      ];

      // Set default selection to the first journey if available
      if (journeys.value.length > 0) {
        selectedJourney.value = journeys.value[0].id;
      }
    } else {
      console.error('Failed to fetch journeys:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching journeys:', error);
  }
};


const handleAddVaccination = async () => {

  const vaccinationData = generateVaccinationData();

  const requestBody = {
    user_id: USER_ID,
    vaccine: vaccinationData, // Include the vaccine data
  };

  const url = 'https://n8n.tonii.at/webhook-test/addVaccie';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Vaccination added:', data);
    } else {
      console.error('Failed to add vaccination:', response.statusText);
    }
  } catch (error) {
    console.error('Error adding vaccination:', error);
  }
};

const handleAddNodeClick = async () => {
  const journey_id = selectedJourney.value;
  const user_id = USER_ID;

  try {
    if (selectedType.value === 'Vaccination') {
      await handleAddVaccination();
    }

    const nodeData = generateNodeData();

    const requestBody = {
      user_id,
      journey_id,
      node: nodeData,
    };

    const url = 'https://n8n.tonii.at/webhook-test/addNode';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Node added:', data);
    } else {
      console.error('Failed to add node:', response.statusText);
    }
  } catch (error) {
    console.error('Error adding node:', error);
  }
};

onMounted(() => {
  fetchJourneys();
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>New Node</CardTitle>
      <CardDescription>Add a new node to your journey.</CardDescription>
    </CardHeader>

    <CardContent>
      <div class="mb-4">
        <Label for="type">Type</Label>
        <select
          v-model="selectedType"
          id="type"
          class="w-full mt-2 p-2 border rounded-md"
        >
          <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>

      <div class="mb-4">
        <Label for="journey">Journey</Label>
        <select
          v-model="selectedJourney"
          id="journey"
          class="w-full mt-2 p-2 border rounded-md"
        >
          <option v-for="journey in journeys" :key="journey.id" :value="journey.id">
            {{ journey.title }}
          </option>
        </select>
      </div>

      <div v-for="(field, index) in fields" :key="index" class="mb-4">
        <Label :for="'field' + index">{{ field.label }}</Label>
        <Input
          v-if="field.label !== 'Dose' && field.label !== 'Date'"
          v-model="field.value"
          :id="'field' + index"
          :type="typeof field.value === 'boolean' ? 'checkbox' : 'text'"
          class="w-full mt-2 p-2 border rounded-md"
          :checked="field.value === true"
          @change="field.value = $event.target.type === 'checkbox' ? $event.target.checked : $event.target.value"
        />

        <!-- Date Picker for 'Date' field -->
        <Input
          v-if="field.label === 'Date'"
          v-model="field.value"
          :id="'field' + index"
          type="date"
          class="w-full mt-2 p-2 border rounded-md"
        />

        <!-- Numeric Input for 'Dose' field -->
        <Input
          v-if="field.label === 'Dose'"
          v-model="field.value"
          :id="'field' + index"
          type="number"
          class="w-full mt-2 p-2 border rounded-md"
          min="1"
          step="1"
        />
      </div>
    </CardContent>

    <CardFooter>
      <Button @click="handleAddNodeClick" class="w-full">Add Node</Button>
    </CardFooter>
  </Card>
</template>

<style scoped>
</style>

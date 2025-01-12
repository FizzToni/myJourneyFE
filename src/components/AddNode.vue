<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button/index.ts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/index.ts';

import { Input } from '@/components/ui/input/index.ts';
import { Label } from '@/components/ui/label/index.ts';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'

// Node types for dropdown
const types = ref(['Vaccination', 'Med. Institution', 'E-Health', 'Other']);
const selectedType = ref(types.value[0]);

// Default field sets based on the node type
const fieldTemplates = {
  'Vaccination': [
    { label: 'Name', value: 'vaccineName' },
    { label: 'Details', value: 'here are some extra details' },
    { label: 'Date', value: '01.01.2020' },
    { label: 'Location', value: 'Karlsplatz 1' },
    { label: 'Dose', value: 1 },
  ],
  'Med. Institution': [
    { label: 'Name', value: '' },
    { label: 'Reason', value: '' },
    { label: 'Stationary', value: false },
    { label: 'Admission Date', value: '' },
    { label: 'Release Date', value: '' },
    { label: 'Location', value: '' },
    { label: 'Department', value: '' },
    { label: 'Diagnosis', value: '' },
    { label: 'Treatment', value: '' },
    { label: 'Notes Doctor', value: '' },
    { label: 'Notes Self', value: '' },
  ],
  'E-Health': [
    { label: 'Name', value: '' },
    { label: 'Reason', value: '' },
    { label: 'Stationary', value: false },
    { label: 'Admission Date', value: '' },
    { label: 'Release Date', value: '' },
    { label: 'Location', value: '' },
    { label: 'Department', value: '' },
    { label: 'Diagnosis', value: '' },
    { label: 'Treatment', value: '' },
    { label: 'Notes Doctor', value: '' },
    { label: 'Notes Self', value: '' },
  ],
  'Other': [
    { label: 'Name', value: '' },
    { label: 'Admission Date', value: '' },
    { label: 'Release Date', value: '' },
    { label: 'Notes Doctor', value: '' },
    { label: 'Notes Self', value: '' },
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

// Handle Add Vaccination
const handleAddVaccination = async () => {
  if (selectedType.value === 'Vaccination') {
    const vaccinationData = generateVaccinationData();

    const requestBody = {
      user_id: '677ba8958eca95927318b059',
      vaccine: vaccinationData,  // Include the vaccine data
    };

    const url = 'https://n8n.tonii.at/webhook/addVaccie';

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
      } else {
        console.error('Failed to add vaccination:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding vaccination:', error);
    }
  }
};

// Function to handle button click based on selected type
const handleAddNodeClick = () => {
  if (selectedType.value === 'Vaccination') {
    handleAddVaccination(); // Handle Vaccination logic
  } else {
    callAddNode(); // Handle other node types
  }
};

// The existing function for other node types
const callAddNode = async () => {
  const url = "https://n8n.tonii.at/webhook-test/addNode";
  const user_id = '677ba8958eca95927318b059';
  const journey_id = 1;
  const nodeData = generateNodeData();

  const requestBody = {
    user_id,
    journey_id,
    node: nodeData,
  };

  console.log("Node Data:", nodeData);

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
      console.log('Json response (should be old and updated user):', data[0]);
    } else {
      console.error('Failed to add node:', response.statusText);
    }
  } catch (error) {
    console.error('Error adding node:', error);
  }
};
</script>

<template>
  <ScrollArea class="h-[500px]">
      <CardHeader>
        <CardTitle>New Node</CardTitle>
        <CardDescription>Add a new node to your journey.</CardDescription>
      </CardHeader>

      <CardContent>
        <div class="mb-4">
          <Label for="type">Type</Label>
          <Select default-value="Vaccination" v-model="selectedType"
          >
            <SelectTrigger
            id="type"
            class="w-full mt-2 p-2 border rounded-md"
            >
              <SelectValue placeholder="Select type"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="type in types" :key="type" :value="type">{{ type }}</SelectItem>
            </SelectContent>
          </Select>
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
  </ScrollArea>
</template>

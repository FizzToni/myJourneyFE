<script setup>
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

// Node types for dropdown
const types = ref(['Vaccination', 'Med. Institution', 'E-Health', 'Other']);
const selectedType = ref(types.value[0]);

// Default field sets based on the node type
const fieldTemplates = {
  'Vaccination': [
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
    { label: 'Vaccine Type', value: '' },
    { label: 'Remaining Doses', value: 0 },
    { label: 'Next Dose From', value: '' },
    { label: 'Next Dose By', value: '' },
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

const generateNodeData = () => {
  const nodeData = formatNodeData(fields.value);
  const idKey = '_id';
  const idValue = null;
  return { [idKey]: idValue, ...nodeData };
};

const callAddNode = async () => {
  const url = "https://n8n.tonii.at/webhook/addNode";
  const user_id = '678175573b069098d0d222a4';
  const journey_id = null;
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

      <div v-for="(field, index) in fields" :key="index" class="mb-4">
        <Label :for="'field' + index">{{ field.label }}</Label>
        <Input
          v-model="field.value"
          :id="'field' + index"
          :type="typeof field.value === 'boolean' ? 'checkbox' : 'text'"
          class="w-full mt-2 p-2 border rounded-md"
          :checked="field.value === true"
          @change="field.value = $event.target.type === 'checkbox' ? $event.target.checked : $event.target.value"
        />
      </div>
    </CardContent>

    <CardFooter>
      <Button @click="callAddNode" class="w-full">Add Node</Button>
    </CardFooter>
  </Card>
</template>

<style scoped>
</style>

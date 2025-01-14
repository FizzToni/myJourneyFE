<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
import {ScrollArea} from "@/components/ui/scroll-area";

const responseData = ref(null);
const isEditMode = ref(false);
const editedFields = ref([]);
const originalFields = ref([]);
const selectedType = ref('');

// Node types for dropdown
const types = ref(['Vaccination', 'Med. Institution', 'E-Health', 'Other']);

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

// Computed fields based on the selected type
const fields = computed(() => {
  const template = fieldTemplates[selectedType.value] || [];
  return template.map((field) => ({
    ...field,
    value:
      editedFields.value.find((f) => f.label === field.label)?.value || field.value,
  }));
});

const typeMappings = {
  'med_institution': 'Med. Institution',
  'e_health': 'E-Health',
  'vaccination': 'Vaccination'
};

const fetchNodeDetails = async () => {
  const id = '677ba8958eca95927318b059';
  const journey_id = 1;
  const node_id = 1;

  try {
    const baseUrl = 'https://n8n.tonii.at/webhook/node';
    const response = await fetch(`${baseUrl}?id=${id}&journey_id=${journey_id}&node_id=${node_id}`);
    if (!response.ok) {
      throw new Error(`HTTP error fetching n8n: ${response.status}`);
    }

    const data = await response.json();
    const filteredData = Object.fromEntries(
      Object.entries(data[0]).filter(([key]) => key !== '_id')
    );

    // Check for mapped types first
    const nodeTypeKey = data[0].type;
    selectedType.value = typeMappings[nodeTypeKey] ||
      Object.keys(fieldTemplates).find((type) =>
        fieldTemplates[type].every((template) =>
          Object.keys(filteredData).includes(
            template.label.toLowerCase().replace(/ /g, '_')
          )
        )
      ) || 'Other';

    responseData.value = [filteredData];
    originalFields.value = Object.entries(filteredData).map(([key, value]) => ({
      label: key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
      value,
    }));
    editedFields.value = JSON.parse(JSON.stringify(originalFields.value));
  } catch (error) {
    console.error('Error fetching node:', error);
  }
};


const generateEditedNode = () => {
  const changes = {};
  for (const field of editedFields.value) {
    const originalField = originalFields.value.find((f) => f.label === field.label);
    if (originalField && field.value !== originalField.value) {
      changes[field.label.toLowerCase().replace(/ /g, '_')] = field.value;
    }
  }
  return changes;
};

const callEditNode = async () => {
  const url = "https://n8n.tonii.at/webhook-test/editNode";
  const user_id = '677ba8958eca95927318b059';
  const journey_id = 1;
  const node_id = 1;
  const edited_data = generateEditedNode();

  const requestBody = {
    user_id,
    journey_id,
    node_id,
    edited_data,
  };

  console.log("Edits made:", edited_data);

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
      console.log('Response:', data[0]);
      // Optional: Reset edit mode or refresh data after saving
      isEditMode.value = false;
      fetchNodeDetails();
    } else {
      console.error('Failed to save node:', response.statusText);
    }
  } catch (error) {
    console.error('Error saving node:', error);
  }
};

onMounted(fetchNodeDetails);
</script>

<template>
  <ScrollArea class="h-[500px]">
  <Card>
    <CardHeader>
      <CardTitle v-if="!isEditMode">Node Details</CardTitle>
      <CardTitle v-else>Edit Node</CardTitle>
      <CardDescription v-if="!isEditMode">
        View the details of the node below.
      </CardDescription>
      <CardDescription v-else>
        Modify the details of your node below.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <div v-if="responseData">
        <!-- Normal View -->
        <div v-if="!isEditMode">
          <ul>
            <li v-for="field in originalFields" :key="field.label">
              <strong>{{ field.label }}:</strong> {{ field.value }}
            </li>
          </ul>
        </div>

        <!-- Edit View -->
        <div v-else>
          <!-- Type Dropdown -->
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

          <!-- Fields for the selected type -->
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
        </div>
      </div>
      <div v-else>
        <p>Loading node details...</p>
      </div>
    </CardContent>

    <CardFooter>
      <div v-if="responseData">
        <Button
          v-if="!isEditMode"
          @click="isEditMode = true"
          class="w-full mt-2"
        >
          Edit Node
        </Button>
        <Button
          v-else
          @click="callEditNode"
          class="w-full mt-2"
        >
          Save Changes
        </Button>
      </div>
    </CardFooter>
  </Card>
  </ScrollArea>
</template>

<style scoped>
</style>

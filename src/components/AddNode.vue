<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAccountStore } from '@/stores/account';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const accountStore = useAccountStore();

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
    { label: 'Date', value: '' },
    { label: 'Location', value: '' },
    { label: 'Diagnosis', value: '' },
    { label: 'Treatment', value: '' },
    { label: 'Notes Doctor', value: '' },
    { label: 'Notes Self', value: '' },
  ],
  'E-Health': [
    { label: 'Name', value: '' },
    { label: 'Reason', value: '' },
    { label: 'Stationary', value: false },
    { label: 'Date', value: '' },
    { label: 'Location', value: '' },
    { label: 'Diagnosis', value: '' },
    { label: 'Treatment', value: '' },
    { label: 'Notes Doctor', value: '' },
    { label: 'Notes Self', value: '' },
  ],
  'Other': [
    { label: 'Name', value: '' },
    { label: 'Date', value: '' },
    { label: 'Location', value: '' },
    { label: 'Notes Doctor', value: '' },
    { label: 'Notes Self', value: '' },
  ],
};

// Fields computed based on selected type
const fields = computed(() => fieldTemplates[selectedType.value]);

// Generate data dynamically for all node types
const generateNodeData = () => {
  const nodeData = fields.value.reduce((acc, field) => {
    let formattedValue = field.value;

    // Handle specific field types
    if (field.label.includes('Date') && formattedValue === '') {
      formattedValue = null; // Handle empty dates
    }
    if (typeof field.value === 'boolean') {
      formattedValue = Boolean(field.value);
    }

    acc[field.label.toLowerCase().replace(/ /g, '_')] = formattedValue;
    return acc;
  }, {});

  return nodeData;
};

// Function to handle button click based on selected type
const handleAddNodeClick = async () => {
  const nodeData = generateNodeData();

  if (selectedType.value === 'Vaccination') {
    await handleAddVaccination(nodeData);
  } else {
    await handleAddGenericNode(nodeData);
  }
  await accountStore.fetchJourney();
  emit("node-added");
};

// Handle Add Vaccination
async function handleAddVaccination(vaccinationData) {
  await accountStore.addVaccine(vaccinationData);
  await handleAddGenericNode(vaccinationData);

  // TODO: handle response
}

// Handle Add for Generic Nodes
async function handleAddGenericNode(nodeData) {
  console.log(nodeData)

  const requestBody = {
    node: nodeData,
  };
  await accountStore.addNodeToJourney(requestBody);

  // TODO: handle response
}
</script>


<template>
  <ScrollArea class="h-[500px]">
      <CardHeader>
        <CardTitle>Neuer Eintrag</CardTitle>
        <CardDescription>Neuen Eintrag in die Journey hinzufügen.</CardDescription>
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

          <!-- TODO: add default date today -->
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

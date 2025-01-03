<script setup>
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Node types for dropdown
const types = ref(['Option 1', 'Option 2', 'Option 3']);
const selectedType = ref(types.value[0]);

// Fields to be included in POST body
const fields = ref([
  { label: 'Name', value: 'node name' },
  { label: 'Date', value: '2024-12-10' },
  { label: 'Notes', value: 'notes' },
  { label: 'Notes Doctor', value: 'notes doctor' },
]);

const generateNodeData = () => {
  return fields.value.reduce((acc, field) => {
    acc[field.label] = field.value;
    return acc;
  }, {});
};

const callAddNode = async () => {
  const url = "https://n8n.tonii.at/webhook-test/addNode";
  const id = '6766d85a6d8ba24d19d486a2';
  const journey_id = 1;
  const nodeData = generateNodeData();

  const requestBody = {
    id,
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
      console.log('Node added:', data);
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
          type="text"
          class="w-full mt-2 p-2 border rounded-md"
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

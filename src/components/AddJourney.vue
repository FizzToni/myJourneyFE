<script setup>
import { ref } from 'vue';
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

// Form state
const name = ref('');
const isActive = ref(true);

const _id = '677ba8958eca95927318b059';

const callAddJourney = async () => {
  const url = "https://n8n.tonii.at/webhook-test/addJourney";

  const requestBody = {
    _id,
    title: name.value,
    status: isActive.value,
    nodes: [],
  };

  console.log("Journey Data:", requestBody);

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
      console.log('Response:', data);
    } else {
      console.error('Failed to add journey:', response.statusText);
    }
  } catch (error) {
    console.error('Error adding journey:', error);
  }
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>New Journey</CardTitle>
      <CardDescription>Create a new journey.</CardDescription>
    </CardHeader>

    <CardContent>
      <div class="mb-4">
        <Label for="name">Name</Label>
        <Input
          v-model="name"
          id="name"
          type="text"
          class="w-full mt-2 p-2 border rounded-md"
        />
      </div>

      <div class="mb-4">
        <Label for="active">Active</Label>
        <Input
          v-model="isActive"
          id="active"
          type="checkbox"
          class="mt-2"
        />
      </div>
    </CardContent>

    <CardFooter>
      <Button @click="callAddJourney" class="w-full">Add Journey</Button>
    </CardFooter>
  </Card>
</template>

<style scoped>
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const responseData = ref(null);
const isEditMode = ref(false);
const editedFields = ref({});

const fetchNodeDetails = async () => {
  const id = '6766d85a6d8ba24d19d486a2';
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

    responseData.value = [filteredData];
    editedFields.value = { ...filteredData };
  } catch (error) {
    console.error('Error fetching node:', error);
  }
};

const saveEditedNode = () => {
  responseData.value[0] = { ...editedFields.value };
  isEditMode.value = false;
};

onMounted(fetchNodeDetails);

</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Node Details</CardTitle>
    </CardHeader>

    <CardContent>
      <div v-if="responseData">
        <!-- Normal view -->
        <div v-if="!isEditMode">
          <ul>
            <li v-for="(value, key) in responseData[0]" :key="key">
              <strong>{{ key }}:</strong> {{ value }}
            </li>
          </ul>
        </div>

        <!-- Edit mode -->
        <div v-else>
          <div
            v-for="(value, key) in editedFields"
            :key="key"
            class="mb-4"
          >
            <Label :for="'field' + key">{{ key }}</Label>
            <Input
              v-model="editedFields[key]"
              :id="'field' + key"
              type="text"
              class="w-full mt-2 p-2 border rounded-md"
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
          @click="saveEditedNode"
          class="w-full mt-2"
        >
          Save Changes
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>

<style scoped>
</style>

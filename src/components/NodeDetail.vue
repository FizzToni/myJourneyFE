<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button } from '@/components/ui/button/index.ts'
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card/index.ts'
import { Input } from '@/components/ui/input/index.ts'
import { Label } from '@/components/ui/label/index.ts'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'

const props = defineProps({
  node: {
    type: Object,
    default: null
  }
});

const isEditMode = ref(false);
const editedFields = ref([]);
const originalFields = ref([]);
const selectedType = ref('');

// Node types for dropdown
const types = ref([
  { key: 'medication', label: 'Medication' },
  { key: 'med_institution', label: 'Med. Institution' },
  { key: 'tooth', label: 'Tooth' },
  { key: 'vaccine', label: 'Vaccine' },
  { key: 'physio', label: 'Physio' },
]);

// Default field sets based on the node type
const fieldTemplates = {
  'medication': [
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
  'med_institution': [
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
  'tooth': [
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
  'vaccine': [
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
  'physio': [
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
  'vaccination': 'Vaccination',
  'medication': 'Medication',
  'tooth': 'Tooth',
  'physio': 'Physio'
};

const initializeFields = () => {
  if (!props.node) return;

  selectedType.value = props.node.type;

  originalFields.value = Object.entries(props.node).map(([key, value]) => ({
    label: key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    value,
  }));
  editedFields.value = JSON.parse(JSON.stringify(originalFields.value));
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
  const node_id = props.node.id;
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
      isEditMode.value = false;
      initializeFields();
    } else {
      console.error('Failed to save node:', response.statusText);
    }
  } catch (error) {
    console.error('Error saving node:', error);
  }
};

watch(() => props.node, initializeFields, { immediate: true });
</script>

<template>
  <ScrollArea class="h-[500px]">
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
        <div v-if="props.node">
          <!-- Normal View -->
          <div v-if="!isEditMode">
            <ul>
              <li v-for="field in originalFields" :key="field.label">
                <div v-if="field.label !== 'Id'" class="flex flex-col gap-2">
                  <Label class="font-semibold mt-4">{{ field.label }}</Label>
                  <Input v-model="field.value" disabled ></Input>
                </div>
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
                <option v-for="type in types" :key="type.key" :value="type.key">{{ type.label }}</option>
              </select>
            </div>

            <!-- Fields for the selected type -->
            <div v-for="(field, index) in fields" :key="index" class="mb-4">
              <Label :for="'field' + index" class="font-semibold">{{ field.label }}</Label>
              <template v-if="typeof field.value === 'boolean'">
                <Checkbox
                  v-model="field.value"
                  :id="'field' + index"
                  class="font-semibold mx-4"
                />
              </template>
              <template v-else>
                <Input
                  v-model="field.value"
                  :id="'field' + index"
                  type="text"
                />
              </template>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Loading node details...</p>
        </div>
      </CardContent>

      <CardFooter>
        <div v-if="props.node">
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
  </ScrollArea>
</template>

<style scoped>
</style>

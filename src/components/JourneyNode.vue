<script setup lang="ts">
import {
  ToothIcon,
  PhysioIcon,
  HealthIcon,
  VaccineIcon,
  MedicationIcon,
  SeparatorIcon,
  LocationIcon
} from '@/components/icons'
import { defineProps } from 'vue';
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";

// Declare props using defineProps
const props = defineProps<{
  node: {
    type: string;
    name: string;
    location: string;
  };
  isLast: boolean;
  formatDate: (date: any) => string;
  getDateProperty: (node: any) => any;
}>();

// Define the getIconComponent function
const getIconComponent = (type: string) => {
  switch (type) {
    case 'medication':
      return MedicationIcon;
    case 'med_institution':
      return HealthIcon;
    case 'tooth':
      return ToothIcon;
    case 'vaccine':
      return VaccineIcon;
    case 'physio':
      return PhysioIcon;

    default:
      return HealthIcon;
  }
};
</script>

<template>
    <div class="flex gap-2 items-center">
      <!-- Icon circle with dynamic component rendering -->
      <span class="flex justify-center  min-w-4 items-center w-16 h-16 bg-white rounded-full drop-shadow-lg">
        <component
          :is="getIconComponent(props.node.type)"
          width="24"
          height="24"
        />

      </span>
      <div class="flex-col">
        <p class="font-medium text-base text-nowrap">
          {{ props.node.name }}
        </p>
        <p
          v-if="props.node.date"
          class="text-sm text-gray-700">
          {{ props.formatDate(props.node.date) }}
        </p>
        <div v-if="props.node.location" class="flex items-center">
          <LocationIcon width="16" height="16" class="inline-block mr-1"/>
          <p
            class="text-sm text-gray-500 truncate max-w-56"
          >
            {{ props.node.location }}
          </p>
        </div>

      </div>
    </div>

    <!-- Separator -->
    <SeparatorIcon width="36" height="25" class="mx-3 my-2"/>
</template>

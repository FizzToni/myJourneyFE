<script setup lang="ts">
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { ref, watch } from 'vue'

// Define the types for vaccine and journey
interface Vaccine {
  _id: string
  name: string
  manufacturer?: string
  recommended_age?: number
  amount_needed?: number
  dosage_schedule?: string
  common_sideeffects?: string
  prevent_desease?: string
  description?: string
}

interface Journey {
  journey_id: number
  title: string
  status?: string
  nodes?: Array<Record<string, any>>
}

const searchResults = ref<{ vaccines: Vaccine[]; journeys: Journey[] }>({ vaccines: [], journeys: [] })
const searchQuery = ref('')

const fetchSearchResults = async (query: string) => {
  try {
    const response = await fetch(`https://n8n.tonii.at/webhook/globalSearch?id=676d90abf0b5e780569b7bde&name=${query}`);

    if (response.ok) {
      const data = await response.json();
      searchResults.value = {
        vaccines: data.flatMap((item: { vaccines?: Vaccine[] }) => item.vaccines || []),
        journeys: data.flatMap((item: { journeys?: Journey[] }) => item.journeys || []),
      }
    } else {
      throw new Error('Error fetching search results');
    }
  } catch (error) {
    console.error('Error fetching search results:', error)
  }
}

watch(searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    fetchSearchResults(newQuery);
  } else {
    searchResults.value = { vaccines: [], journeys: [] }
  }
})

const handleVaccineClick = (vaccineId: string) => {
  console.log('Vaccine ID:', vaccineId);
}

const handleJourneyClick = (journeyId: number) => {
  console.log('Journey ID:', journeyId);
}
</script>

<template>
  <Command>
    <CommandInput v-model="searchQuery" placeholder="Search for vaccines or journeys..." />

    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>

      <CommandGroup v-if="searchResults.vaccines.length" heading="Vaccinations">
        <CommandItem
          v-for="vaccine in searchResults.vaccines"
          :key="vaccine._id"
          :value="vaccine.name"
          @click="handleVaccineClick(vaccine._id)"
        >
          {{ vaccine.name }}
        </CommandItem>
      </CommandGroup>

      <CommandSeparator v-if="searchResults.vaccines.length && searchResults.journeys.length" />

      <CommandGroup v-if="searchResults.journeys.length" heading="Journeys">
        <CommandItem
          v-for="journey in searchResults.journeys"
          :key="journey.journey_id"
          :value="journey.title"
          @click="handleJourneyClick(journey.journey_id)"
        >
          {{ journey.title }}
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>

</template>

<style scoped>
</style>

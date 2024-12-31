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
import {onMounted, ref, watch} from 'vue'
import axios from 'axios'

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
onMounted(() => {
  console.log('Component initialized');
});

// Reactive variables for the search data and input
const searchResults = ref<{ vaccines: Vaccine[]; journeys: Journey[] }>({ vaccines: [], journeys: [] })
const searchQuery = ref('')

// Function to fetch data from the API
const fetchSearchResults = async (query: string) => {
  console.log("hello world");
  try {
    console.log(query);
    const response = await axios.get(`https://n8n.tonii.at/webhook/globalSearch?id=676d90abf0b5e780569b7bde&name=${query}`)
    // Assuming response.data contains the array of results
    searchResults.value = {
      vaccines: response.data.flatMap((item: { vaccines?: Vaccine[] }) => item.vaccines || []),
      journeys: response.data.flatMap((item: { journeys?: Journey[] }) => item.journeys || []),
    }
  } catch (error) {
    console.error('Error fetching search results:', error)
  }
}

// Watch for input changes to fetch data
watch(searchQuery, (newQuery) => {
  console.log("New query value:", newQuery); // Prüfe den neuen Wert
  if (newQuery.trim()) {
    fetchSearchResults(newQuery)
  } else {
    searchResults.value = { vaccines: [], journeys: [] }
  }
})
</script>

<template>
  <Command>
    <CommandInput v-model="searchQuery" placeholder="Search for vaccines or journeys..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>

      <CommandGroup v-if="searchResults.vaccines.length" heading="Vaccinations">
        <CommandItem v-for="vaccine in searchResults.vaccines" :key="vaccine._id" :value="vaccine.name">
          {{ vaccine.name }}
        </CommandItem>
      </CommandGroup>

      <CommandSeparator v-if="searchResults.vaccines.length && searchResults.journeys.length" />

      <CommandGroup v-if="searchResults.journeys.length" heading="Journeys">
        <CommandItem v-for="journey in searchResults.journeys" :key="journey.journey_id" :value="journey.title">
          {{ journey.title }}
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>

<style scoped>
</style>

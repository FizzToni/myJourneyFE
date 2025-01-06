<script setup lang="ts">
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { ref, watch } from 'vue';

interface Vaccine {
  _id: string;
  name: string;
  manufacturer?: string;
  recommended_age?: number;
  amount_needed?: number;
  dosage_schedule?: string;
  common_sideeffects?: string;
  prevent_desease?: string;
  description?: string;
}

interface Journey {
  journey_id: number;
  title: string;
  status?: string;
  nodes?: Array<Record<string, any>>;
}

interface Node {
  _id: number;
  name: string;
  [key: string]: any;
}

const searchResults = ref<{ vaccines: Vaccine[]; journeys: Journey[]; nodes: Node[] }>({
  vaccines: [],
  journeys: [],
  nodes: [],
});
const searchQuery = ref('');

const fetchSearchResults = async (query: string) => {
  try {
    const response = await fetch(`https://n8n.tonii.at/webhook/globalSearch?id=676c39fd5991fae62fcb1a63&name=${query}`);

    if (response.ok) {
      const data = await response.json();
      searchResults.value = {
        //delete .slice(0,5) for more than 5 hits per search
        vaccines: data.flatMap((item: { vaccines?: Vaccine[] }) => item.vaccines || []).slice(0, 5),
        journeys: data.flatMap((item: { journeys?: Journey[] }) => item.journeys || []).slice(0, 5),
        nodes: data.flatMap((item: { nodes?: Node[] }) => item.nodes || []).filter((node: Node) =>
          node.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5),
      };
    } else {
      throw new Error('Error fetching search results');
    }
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
};

watch(searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    fetchSearchResults(newQuery);
  } else {
    searchResults.value = { vaccines: [], journeys: [], nodes: [] };
  }
});

const handleVaccineClick = (vaccineId: string) => {
  console.log('Vaccine ID:', vaccineId);
};

const handleJourneyClick = (journeyId: number) => {
  console.log('Journey ID:', journeyId);
};

const handleNodeClick = (nodeId: number, journeyId: number) => {
  console.log('Node ID:', nodeId);
  console.log('Journey ID:', journeyId);
};
</script>

<template>
  <Command>
    <CommandInput v-model="searchQuery" placeholder="Search for vaccines, journeys, or nodes..." />

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

      <CommandSeparator v-if="(searchResults.vaccines.length || searchResults.journeys.length) && searchResults.nodes.length" />

      <CommandGroup v-if="searchResults.nodes.length" heading="Nodes">
        <CommandItem
          v-for="node in searchResults.nodes"
          :key="node._id"
          :value="node.name"
          @click="handleNodeClick(node._id, node.journeyID)"
        >
          {{ node.name }}
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>

<style scoped>
</style>

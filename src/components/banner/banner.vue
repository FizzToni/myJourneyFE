<script setup lang="ts">
// Define props using the defineProps helper (no need to import)
defineProps<{
  title: string;
  status: string; // 'active' or 'inactive'
  onRefresh: () => void;
}>();

import { computed } from "vue";
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
    const response = await fetch(`https://n8n.tonii.at/webhook/globalSearch?id=677bf13348c5315f7a19a204&name=${query}`);

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
// Computed class for dynamic banner styles
function bannerStyleF(status: string) {
  console.log("Banner status:", status);

  return status === "inactive"
    ? {
      background: "linear-gradient(to bottom right, #ccc, #aaa)", // Gray gradient for inactive
      color: "#666", // Darker text for contrast
    }
    : {
      background: "linear-gradient(to bottom right, #0EBE7E, #07D9AD)", // Default green gradient
      color: "white", // White text for default
    };
}
</script>

<template>
  <div class="page-container">
    <div class="banner-container">
      <header class="flex banner" :style="bannerStyleF(status)">
        <div class="banner-text">
          <p class="main-title">MyJourney</p>
          <p class="sub-title">{{ title }}</p>
        </div>
        <img
          src="@/assets/avatar.jpg"
          alt="User Profile"
          class="profile-image"
        />
      </header>
      <!-- Search Bar -->
      <div class="search-bar-container">
        <Command >
          <CommandInput v-model="searchQuery" placeholder="Search for vaccines, journeys, or nodes..." />

          <CommandList>
            <CommandEmpty v-if="searchQuery.length > 0">No results found.</CommandEmpty>

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
      </div>
    </div>
  </div>
</template>



<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
}

.banner-container {
  position: relative; /* Relative positioning for containing absolutely positioned elements */
}

.banner {
  text-align: left;
  padding: 30px 0 30px 30px;
  font-size: 40px;
  font-weight: bold;
  border-radius: 0 0 20px 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* Add shadow */
  user-select: none;
  display: flex;
  align-items: center; /* Vertically align content */
  justify-content: space-between; /* Space out the text and image */
}

.banner-text {
  display: flex;
  flex-direction: column; /* Stack title and subtitle vertically */
}

.main-title {
  font-size: 30px; /* Adjust size for main title */
  margin: 0; /* Remove default margin */
  color: inherit; /* Inherit text color from banner */
}

.sub-title {
  font-size: 18px; /* Adjust size for subtitle */
  margin: 0; /* Remove default margin */
  color: inherit; /* Inherit text color from banner */
}

.profile-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #ccc;
  object-fit: cover;
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 20px;
  margin-right: 30px;
}

.search-bar-container {
  position: absolute; /* Allow positioning over the banner */
  top: 100%; /* Adjust based on how much overlap you want */
  left: 50%;
  transform: translate(-50%, -45%); /* Center horizontally */
  z-index: 10; /* Ensure it's above the banner */
  width: 70%; /* Adjust width as needed */
  border: 2px solid #ccc; /* Add border */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* Add shadow */
  border-radius: 25px; /* Half of the height to create rounded edges */
  background-color: white; /* Optional: Background color */
  display: flex; /* Center content inside */
  align-items: center;
  overflow: hidden; /* Prevent content from spilling out */
}


</style>


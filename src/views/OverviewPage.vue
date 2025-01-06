<template>
  <div style="height: 10em">
    Header
  </div>
  <div class="safe-area">
    <div class="container" :style="containerStyle">
      <div class="container-content">
        <div class="row space-between">
          <div class="info">
            <h2 class="headline">Vaccination Tracker</h2>
            <p class="description">
              Keep track of your vaccinations easily and stay informed.
            </p>
          </div>
          <i class="material-icons">></i>
        </div>
        <div class="row space-between">
          <div class="info">
            <h3 class="number">15</h3>
            <p class="description">View your complete vaccination history.</p>
          </div>
          <div class="info">
            <h3 class="number">12 new</h3>
            <p class="description">
              Discover more insights and recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div>
    <div
      class="list-view"
      :style="{ display: 'flex', overflowX: 'auto', padding: '8px', margin: '8px 0 0 0', gap: '5px' }"
    >
      <div
        v-for="(item, index) in nodes"
        :key="index"
        class="container"
        :style="{ ...containerStyle, padding: '16px', flex: '0 0 25%' }"
      >
        <div>
          <h3 class="number" :style="numberStyle">{{ item.number }}</h3>
          <p class="description">{{ item.text }}</p>
        </div>
      </div>
    </div>
  </div>

    <div>
      <div
        class="list-view"
        :style="{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px' }"
      >
        <div
          v-for="(journey, index) in journeys"
          :key="index"
          class="journey-card"
          :style="{ ...containerStyle, padding: '16px', flex: '0 0 calc(50% - 16px)' }"
        >
          <div>
            <h3 class="number">{{ journey.nodes.length }}</h3>
            <p class="description" :style="numberStyle">{{ journey.title }}</p>
            <p class="description">{{ journey.status }}</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
let user_id = "";
export default {
  data() {
    return {
      primaryBackground: '#f0f0f0', // Replace with your actual color
      secondaryBackground: '#ffffff', // Replace with your actual color
      textSecondaryColor: '#757575', // Replace with your actual color
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
      borderRadius: '8px',
      nodes: [
        { number: '16', text: 'Vaccination' },
        { number: '12', text: 'Precaution' },
        { number: '9', text: 'Medication' },
      ],
      journeys: [], // Journeys will be fetched from the API
      numberStyle: {
        fontFamily: 'Inter Tight, sans-serif',
        fontSize: '20px',
        margin: '0',
      },
    };
  },
  computed: {
    containerStyle() {
      return {
        backgroundColor: this.secondaryBackground,
        boxShadow: this.boxShadow,
        borderRadius: this.borderRadius,
        margin: '0', // Margin is handled by gap in the parent
      };
    },
  },
  methods: {
    async fetchJourneys() {
      try {
        let adresse = "https://n8n.tonii.at/webhook/getJourneyForOverview?id=" + user_id;
        const response = await fetch(adresse);
        const data = await response.json();
        if (data && data[0] && data[0].journeys) {
          this.journeys = data[0].journeys;
        } else {
          console.error('Unexpected API response structure', data);
        }
      } catch (error) {
        console.error('Error fetching journeys:', error);
      }
    },
  },
  mounted() {
    user_id ="677ba8958eca95927318b059";
    this.fetchJourneys();
  },
};
</script>

<style scoped>
.list-view {
  display: flex;
  flex-wrap: wrap; /* Elemente umbrechen, wenn Platz fehlt */
  gap: 16px; /* Abstand zwischen den Elementen */
  padding: 16px; /* Innenabstand des Containers */
}

.journey-card {
  box-sizing: border-box; /* Padding und Border in Größe einberechnen */
  flex: 0 0 calc(50% - 16px); /* Jede Karte nimmt 50% des verfügbaren Platzes minus Abstand ein */
}

.number {
  font-size: 20px;
  margin: 0;
}

.description {
  font-size: 14px;
  margin: 4px 0 0 0;
}


.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-sizing: border-box; /* Ensure padding is included in width/height */
  flex: 0 0 25%; /* Each container takes 1/4 of the screen width */
}

.safe-area {
  padding: 8px;
}

.container {
  display: flex;
  flex-direction: column;
}

.container-content {
  padding: 0 0 8px 0;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.space-between {
  justify-content: space-between;
}

.info {
  padding: 12px;
}

.headline {
  font-size: 24px;
  font-family: 'Inter Tight', sans-serif;
  margin: 0;
}

.description {
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  margin: 4px 0 0 0;
}

.number {
  font-size: 20px;
  font-family: 'Inter Tight', sans-serif;
  margin: 0;
}

.material-icons {
  font-size: 24px;
  color: black;
}
</style>

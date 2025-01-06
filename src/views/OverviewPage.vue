<template>
  <div class="safe-area">
    <div class="container" :style="containerStyle">
      <div class="container-content" :style="{ gap: '8px' }">
        <div class="row space-between" :style="{ gap: '8px' }">
          <div class="info">
            <div style="display: flex; justify-content: space-between;">
              <h2 class="headline">Vaccination Tracker</h2>
              <i class="material-icons">></i>
            </div>
            <p class="description">
              Keep track of your vaccinations easily and stay informed.
            </p>
          </div>
        </div>
        <div class="row space-between" :style="{ gap: '8px' }">
          <div class="info">
            <h3 class="number">15</h3>
            <p class="description">View your complete vaccination history.</p>
          </div>
          <div class="info">
            <p class="number notification">12 new</p>
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
      :style="{ display: 'flex', overflowX: 'auto', padding: '8px', gap: '8px', flexWrap: 'nowrap' }"
    >
      <div
        v-for="(item, index) in nodes"
        :key="index"
        class="container"
        :style="{ ...containerStyle, padding: '16px', flex: '0 0 calc((100%) * 0.3)' }"
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
      :style="{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px' }"
    >
      <div
        v-for="(journey, index) in journeys"
        :key="index"
        class="journey-card"
        :style="{ ...containerStyle, padding: '16px', flex: '0 0 calc(50% - 8px)' }"
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
      primaryBackground: '#ffffff',
      secondaryBackground: '#cccccc',
      textSecondaryColor: '#757575',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.4)',
      borderRadius: '8px',
      nodes: [
        { number: '16', text: 'Vaccination' },
        { number: '12', text: 'Precaution' },
        { number: '9', text: 'Medication' },
        { number: '10', text: 'Node 4' },
      ],
      journeys: [],
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
        margin: '0',
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
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
}

.journey-card {
  box-sizing: border-box;
  flex: 0 0 calc(50% - 8px);
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
  box-sizing: border-box;
  flex: 0 0 auto;
}

.safe-area {
  padding: 8px;
}

.container {
  display: flex;
  flex-direction: column;
}

.container-content {
  padding: 0;
  gap: 8px;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.space-between {
  justify-content: space-between;
}

.info {
  padding: 8px;
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

.notification {
  font-size: 0.75em;
  display: inline-block;
  padding: 2px;
  background-color: red;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  white-space: nowrap;
}

</style>

<template>
    <!-- Banner -->
    <banner title="Overview" status="" :on-refresh="fetchJourneys"/>

    <div class="actual-content">
      <div class="safe-area">
      <div class="container">
        <div class="container-content">
          <div class="row">
            <div class="info">
              <div class="flex-between">
                <h2 class="headline">Vaccination Tracker</h2>
                <i class="material-icons"
                   @click="handleVaccineClick()">
                  >
                </i>
              </div>
              <p class="description">
                Keep track of your vaccinations easily and stay informed.
              </p>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <h3 class="number" v-if="vaccines">
                {{ vaccines.length }}
              </h3>
              <p class="description">View your complete vaccination history.</p>
            </div>
            <div class="info">
              <p class="notification bg-red">12 new</p>
              <p class="description">
                Discover more insights and recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

        <div class="list-view">
          <div
            v-for="(item, index) in nodes"
            :key="index"
            class="container padded flex-basis-30"
            @click="item.onClick"
          >
            <div>
              <h3 class="number">{{ item.number }}</h3>
              <p class="description">{{ item.text }}</p>
            </div>
          </div>
        </div>

      <div>
      <div class="list-view">
        <div
          v-for="(journey, index) in journeys"
          :key="index"
          class="container journey-card"
          @click="handleJourneyClick(journey.journey_id)"
        >
          <div>
            <h3 class="number">{{ journey.nodes.length }}</h3>
            <p class="description">{{ journey.title }}</p>
            <p class="description">{{ journey.status }}</p>
          </div>
        </div>
      </div>
    </div>

    </div>

    <!-- Navbar -->
    <navbar/>
</template>

<script>
import Banner from "@/components/banner/banner.vue";
import Navbar from "@/components/navbar/Navbar.vue";
import Addbutton from "@/components/addbutton/Addbutton.vue";
import Modal from "@/components/Modal/Modal.vue";

let user_id = ''
export default {
  components: {
    Banner,
    Navbar,
    Addbutton,
    Modal,
  },
  data() {
    return {
      nodes: [],
      journeys: [],
      vaccines: [],
    }
  },
  methods: {
    async fetchJourneys() {
      try {
        let adresse = 'https://n8n.tonii.at/webhook/getDataForOverview?id=' + user_id
        const response = await fetch(adresse)
        const data = await response.json()
        if (data && data[0] && data[0].journeys) {
          for (let i = 0; i < data[0].journeys.length; i++) {
            if (data[0].journeys[i].status === "active"){
              this.journeys.push(data[0].journeys[i]);
            }
          }
          this.vaccines = data[0].vaccines
        }

        adresse = 'https://n8n.tonii.at/webhook/getAllVaccine'
        const response2 = await fetch(adresse)
        const vaccines = await response2.json()
        if (vaccines) {
          this.nodes.push({
            number: vaccines.length,
            text: 'Vaccination',
            onClick: this.handleVaccineClick
          })
          this.nodes.push({
            number: 0,
            text: 'Precaution',
            onClick: this.handlePrecautionClick
          })
          this.nodes.push({
            number: 0,
            text: 'Medication',
            onClick: this.handleMedicationClick
          })
        }
      } catch (error) {
        console.error('Error fetching journeys:', error)
      }
    },
    handleVaccineClick() {
      console.log('User ID:' + user_id)
      console.log('Vaccination popup triggered.')
    },
    handlePrecautionClick() {
      console.log('User ID:' + user_id)
      console.log('Precaution popup triggered.')
    },
    handleMedicationClick() {
      console.log('User ID:' + user_id)
      console.log('Medication popup triggered.')
    },
    handleJourneyClick(journeyId) {
      console.log('User ID:' + user_id)
      console.log('Journey ID:', journeyId)
    },
  },
  mounted() {
    user_id = '677ba8958eca95927318b059'
    this.fetchJourneys()
  }
}
</script>


<style scoped>
.list-view {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  justify-content: space-between;
}

.container {
  background: linear-gradient(to bottom right, #0EBE7E, #07D9AD);
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-sizing: border-box;
  flex: 0 0 auto;
  border-radius: 8px;
}

.container.padded {
  padding: 16px;
}

.container.flex-basis-30 {
  flex: 0 0 calc((100%) * 0.32);
}

.journey-card {
  box-sizing: border-box;
  padding: 16px;
  flex: 0 0 calc(50% - 8px);
}

.number {
  color: black;
  font-size: 20px;
  margin: 0;
}

.safe-area {
  padding: 8px;
}

.container-content {
  padding: 0;
  gap: 8px;
}

.row {
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.info {
  padding: 8px;
}

.flex-between {
  display: flex;
  justify-content: space-between;
}

.headline {
  font-size: 24px;
  margin: 0;
  color: black;
}

.description {
  font-size: 14px;
  margin: 4px 0 0 0;
  color: black;
}

.material-icons {
  font-size: 24px;
}

.notification {
  color: white;
  font-size: 0.75em;
  display: inline-block;
  padding: 2px;
  font-weight: bold;
  border-radius: 8px;
  white-space: nowrap;
}

.notification.bg-red {
  background-color: red;
}

.actual-content {
  /*das muss sich dynamisch anpassen (falls mehr als 6 journeys angezeigt werden)*/
  max-height: calc(100vh - 92px - 123px);
  overflow-y: auto;
  box-sizing: border-box;
}

</style>

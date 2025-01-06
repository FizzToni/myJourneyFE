<template>
  <div>
    <div
      class="list-view"
      :style="{ display: 'flex', overflowX: 'auto', padding: '8px', margin: '8px 0 0 0', gap: '5px' }"
    >
      <div
        v-for="(item, index) in items"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      primaryBackground: "#f0f0f0", // Replace with your actual color
      secondaryBackground: "#ffffff", // Replace with your actual color
      textSecondaryColor: "#757575", // Replace with your actual color
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
      borderRadius: "8px",
      items: [
        { number: "16", text: "Vaccination" },
        { number: "12", text: "Precaution" },
        { number: "9", text: "Medication" },
        { number: "3", text: "Journey 1" },
        { number: "4", text: "Journey 2" },
      ],
    };
  },
  computed: {
    containerStyle() {
      return {
        backgroundColor: this.secondaryBackground,
        boxShadow: this.boxShadow,
        borderRadius: this.borderRadius,
        margin: "0", // Margin is handled by gap in the parent
      };
    },
  },
  numberStyle: {
    fontFamily: "Inter Tight, sans-serif",
    fontSize: "20px",
    margin: "0",
  },
};
</script>

<style scoped>
.list-view {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 5px; /* Space between nodes */
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-sizing: border-box; /* Ensure padding is included in width/height */
  flex: 0 0 25%; /* Each container takes 1/4 of the screen width */
}

.number {
  font-size: 20px;
  margin: 0;
}

.description {
  font-size: 14px;
  margin: 4px 0 0 0;
}

.scaffold {
  width: 100%;
  min-height: 100vh;
}

.safe-area {
  padding: 8px;
}

.column {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.padding {
  padding: 16px 12px 16px 12px;
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
  font-family: "Inter Tight", sans-serif;
  margin: 0;
}

.description {
  font-size: 14px;
  font-family: "Inter", sans-serif;
  margin: 4px 0 0 0;
}

.number {
  font-size: 20px;
  font-family: "Inter Tight", sans-serif;
  margin: 0;
}

.material-icons {
  font-size: 24px;
  color: black;
}
</style>

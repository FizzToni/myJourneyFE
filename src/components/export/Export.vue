<template>
  <div>
    <button @click="getUserJourney(journeyId)">Export Journey</button>

    <!-- Popup Modal -->
    <div v-if="showPopup" class="modal-overlay" @click="closePopup">
      <div class="modal-content" @click.stop>
        <img :src="qrCodeDataUrl" alt="QR Code" />
        <button @click="closePopup">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QRCode from 'qrcode'
import { useAccountStore } from '@/stores/account'  // Import the account store



defineProps<{
  journeyId: string
}>();
// Access the account store
const accountStore = useAccountStore()

// Reactive state variables
const qrCodeDataUrl = ref('')
const showPopup = ref(false)

async function getUserJourney(journeyId: string) {
  const response = await accountStore.fetchJourney(journeyId);
  await generateQRCode(response[0].journey);
}

// Generate QR code with user data
const generateQRCode =
  async function (journey: any){
  try {

    // Create a JSON object with user data
    const jsonData = {
      title: journey.title,
      status: journey.status,
      nodes:journey.nodes,
      timestamp: new Date().toISOString()
    }

    const jsonString = JSON.stringify(jsonData)
    console.log(jsonString);

    //qrCodeDataUrl.value = await QRCode.toString(jsonString)
    showPopup.value = true
  } catch (error) {
    console.error('Error generating QR code:', error)
  }
}

// Close the popup
const closePopup = () => {
  showPopup.value = false
}
</script>

<style scoped>
/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.modal-content img {
  max-width: 100%;
  height: auto;
}

.modal-content button {
  margin-top: 10px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>

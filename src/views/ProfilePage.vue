<script setup lang="ts">
import { useAccountStore } from '@/stores/account';
import { ref, onMounted } from 'vue';
import {useRoute, useRouter} from 'vue-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Wrapper from '@/components/AppWrapper.vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EditIcon, MaximizeIcon } from '@/components/icons'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'

const accountStore = useAccountStore();
const router = useRouter();
const isOpen = ref(false);

const firstName = ref('');
const lastName = ref('');
const birthYear = ref('');
const gender = ref('');
const vaccinesReceived = ref<string[]>([]);
const bloodDetails = ref<string[]>([]);
const otherTrackables = ref<string[]>([]);


async function fetchUser() {
  const response = await accountStore.fetchUserDetails();
  const user = response[0] || {};

  firstName.value = user.name || '';
  lastName.value = user.surname || '';
  birthYear.value = user.birthYear || '';
  gender.value = user.gender || '';
  vaccinesReceived.value = user.vaccines || [];
  bloodDetails.value = user.bloodWork || [];
  otherTrackables.value = user.otherTrackables || [];

}

onMounted(() => {
  fetchUser();
});


function goToHistory() {
  router.push('/history'); // Navigate to the /history route
}
</script>

<template>
  <Wrapper title="Account" status="" :on-refresh="fetchUser" :image="false">
    <Card class="relative mt-10">
      <CardHeader>
        <EditIcon class="absolute top-4 right-4 drop-shadow-md"/>
        <div class="flex w-max m-auto min-h-10">
          <img
            class="profile-image"
            src="@/assets/avatar.jpg"
            alt="Profile Image"
          >
        </div>
      </CardHeader>
      <CardContent class="flex flex-col gap-y-4 mb-2">
        <CardTitle>Persönliche Informationen</CardTitle>
          <div class="grid w-full max-w-sm items-center gap-1.5 text-gray-600">
            <Label for="first_name">Vorname</Label>
            <Input id="first_name" type="text" placeholder="Dein Name" v-model="firstName" />
          </div>
        <div class="grid w-full max-w-sm items-center gap-1.5 text-gray-600">
            <Label for="last_name">Nachname</Label>
            <Input id="last_name" type="text" placeholder="Dein Nachname" v-model="lastName" />
          </div>
        <div class="flex gap-4 ">
          <div class="grid w-full max-w-sm items-center gap-1.5 text-gray-600">
            <Label for="birth_year">Geburtsjahr</Label>
            <Input id="birth_year" type="number" placeholder="yyyy" v-model="birthYear"  />
          </div>
          <div class="grid w-full max-w-sm items-center gap-1.5 text-gray-600">
            <Label for="gender">Geschlecht</Label>
            <Select v-model="gender">
              <SelectTrigger>
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="diverse">diverse</SelectItem>
                  <SelectItem value="female">female</SelectItem>
                  <SelectItem value="male">male</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card class="relative mt-2">
      <Collapsible v-model:open="isOpen">
        <CollapsibleTrigger class="w-full">
          <Button variant="ghost" class="w-full justify-between">
            Vorsorge Einstellungen
            <MaximizeIcon />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent>
            <Label class="text-gray-600">Impfungen</Label>
            <ul class="list-none ml-2 mb-3">
              <li v-if="vaccinesReceived.length === 0" class="text-sm text-gray-500">
                Keine gewählt
              </li>
              <li v-else v-for="(vaccine, index) in vaccinesReceived" :key="index" class="text-sm">
                {{ vaccine }}
              </li>
            </ul>

            <!-- Blood Work -->
            <Label class="text-gray-600">Blutbild</Label>
            <ul class="list-none ml-2 mb-3">
              <li v-if="bloodDetails.length === 0" class="text-sm text-gray-500">
                Keine gewählt
              </li>
              <li v-else v-for="(blood, index) in bloodDetails" :key="index" class="text-sm">
                {{ blood }}
              </li>
            </ul>

            <!-- Other Trackables -->
            <Label class="text-gray-600">Interessen</Label>
            <ul class="list-none ml-2 mb-3">
              <li v-if="otherTrackables.length === 0" class="text-sm text-gray-500">
                Keine gewählt
              </li>
              <li v-else v-for="(trackable, index) in otherTrackables" :key="index" class="text-sm">
                {{ trackable }}
              </li>
            </ul>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>

    <div class="button-container" @click="goToHistory">
      <button class="justify-center" >History</button>
    </div>
  </Wrapper>
</template>

<style scoped>

.profile-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #ccc;
  object-fit: cover;
}



.user-details p {
  margin: 5px 0;
}

.preference label {
  font-weight: bold;
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
}
.button-container {
  display: flex; /* Use flexbox for centering */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  margin: 20px auto; /* Center the container itself and add space above/below */
  border: 2px solid #ccc;
  background: #0EBE7E;
  color: white;
  width: 50%; /* Adjust width as needed */
  padding: 10px; /* Add padding for better clickability */
  text-align: center; /* Center text inside */
  border-radius: 8px; /* Optional: Add rounded corners */
  cursor: pointer; /* Make it look clickable */
  font-weight: bold;
}

.button-container:hover {
  background: #0aa66f; /* Slightly darker green on hover */
}

</style>

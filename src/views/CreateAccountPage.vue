<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Wrapper from '@/components/AppWrapper.vue'
import {ref, watch} from 'vue'
import { useAccountStore } from '@/stores/account';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import router from '@/router'

const currentStep = ref(1)

const firstName = ref('')
const lastName = ref('')
const birthYear = ref('')
const gender = ref('')
const vaccinesReceived = ref<string[]>([])
const bloodDetails = ref<string[]>([])
const otherTrackables = ref<string[]>([])

const accountStore = useAccountStore();

const handleNext = () => {
  currentStep.value++;
};
const handleBack = () => {
  currentStep.value--
}

const handleSave = async () => {
  const userData = {
    name: firstName.value,
    surname: lastName.value,
    birthYear: birthYear.value,
    gender: gender.value,
    vaccines: vaccinesReceived.value,
    bloodWork: bloodDetails.value,
    otherTrackables: otherTrackables.value,
  }
  try {
    await accountStore.setAccountDetails(userData);
    await router.push('/main');

  } catch (error) {
    alert('Failed to set account details. Please try again.')
  }
}


const handleChange = (array: string, value: string) => {
  switch (array) {
    case 'vaccines': {
      const index = vaccinesReceived.value.indexOf(value);
      if (index === -1) {
        vaccinesReceived.value.push(value);
      } else {
        vaccinesReceived.value.splice(index, 1);
      }
      console.log(`Updated vaccines: ${vaccinesReceived.value}`);
      break
    }
    case 'bloodDetails': {
      const index = bloodDetails.value.indexOf(value);
      if (index === -1) {
        bloodDetails.value.push(value);
      } else {
        bloodDetails.value.splice(index, 1);
      }
      console.log(`Updated bloodDetails: ${bloodDetails.value}`);
      break
    }
    case 'otherTrackables': {
      const index = otherTrackables.value.indexOf(value);
      if (index === -1) {
        otherTrackables.value.push(value);
      } else {
        otherTrackables.value.splice(index, 1);
      }
      console.log(`Updated otherTrackables: ${otherTrackables.value}`);
      break
    }
  }
};


const vaccinesList = [
  { id: 'dtap', label: 'DTaP (Diphtheria, Tetanus, Pertussis)' },
  { id: 'mmr', label: 'MMR (Measles, Mumps, Rubella)' },
  { id: 'hepatitis_b', label: 'Hepatitis B' },
  { id: 'hpv', label: 'HPV (Human Papillomavirus)' },
  { id: 'influenza', label: 'Influenza (Flu)' },
  { id: 'varicella', label: 'Varicella (Chickenpox)' },
]

const bloodWorkDetails = [
  { id: 'rbc', label: 'Red Blood Cells (RBC)' },
  { id: 'wbc', label: 'White Blood Cells (WBC)' },
  { id: 'total_cholesterol', label: 'Total Cholesterol' },
  { id: 'fasting_glucose', label: 'Fasting Blood Glucose' },
  { id: 'tsh', label: 'Thyroid-Stimulating Hormone (TSH)' },
  { id: 'vitamin_d', label: 'Vitamin D' },
  { id: 'ferritin', label: 'Ferritin' },
  { id: 'magnesium', label: 'Magnesium' },
]

const otherTrackablesList = [
  { id: 'blood_donation', label: 'Blood donations' },
  { id: 'plasma_donation', label: 'Plasma donations' },
  { id: 'blood_pressure', label: 'Blood pressure' },
  { id: 'heart_rate', label: 'Heart rate' },
  { id: 'weight', label: 'Weight' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'mental_health', label: 'Mental health' },
]
</script>

<template>
  <Wrapper :navbar=false :banner=false>
    <Card class="w-11/12 m-auto">
      <CardHeader>
        <CardTitle>Let's get started</CardTitle>
      </CardHeader>

      <CardContent v-if="currentStep === 1" class="space-y-2">
        <CardDescription>
          Let us get to know you better!
        </CardDescription>
        <div class="space-y-1">
          <Label for="first_name">First name</Label>
          <Input id="first_name" type="text" v-model="firstName" />
        </div>
        <div class="space-y-1">
          <Label for="last_name">Last name</Label>
          <Input id="last_name" type="text" v-model="lastName" />
        </div>
        <div class="space-y-1">
          <Label for="birth_year">Birth Year</Label>
          <Input id="birth_year" type="number" v-model="birthYear" />
        </div>
        <div class="space-y-1">
          <Label for="gender">Gender</Label>
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
      </CardContent>

      <CardContent v-if="currentStep === 2" class="space-y-4">
        <CardDescription>
          What vaccines have you received?
        </CardDescription>
        <div class="space-y-4">
          <div
            v-for="vaccine in vaccinesList"
            :key="vaccine.id"
            class="flex items-center space-x-2"
          >
            <Checkbox
              :id="vaccine.id"
              :value="vaccine.id"
              :checked="vaccinesReceived.includes(vaccine.id)"
              @update:checked="handleChange('vaccines' ,vaccine.id)"
            />
            <Label :for="vaccine.id" class="label">{{ vaccine.label }}</Label>
          </div>
        </div>
      </CardContent>

      <CardContent v-if="currentStep === 3" class="space-y-4">
        <CardDescription>
          What blood details do you want to track?
        </CardDescription>
        <div class="space-y-4">
          <div
            v-for="blood in bloodWorkDetails"
            :key="blood.id"
            class="flex items-center space-x-2"
          >
            <Checkbox
              :id="blood.id"
              :value="blood.id"
              :checked="bloodDetails.includes(blood.id)"
              @update:checked="handleChange('bloodDetails' ,blood.id)"
            />
            <Label :for="blood.id" class="label">{{ blood.label }}</Label>
          </div>
        </div>
      </CardContent>

      <CardContent v-if="currentStep === 4" class="space-y-4">
        <CardDescription>
          Any other details you want to track?
        </CardDescription>
        <div class="space-y-4">
          <div
            v-for="other in otherTrackablesList"
            :key="other.id"
            class="flex items-center space-x-2"
          >
            <Checkbox
              :id="other.id"
              :value="other.id"
              :checked="otherTrackables.includes(other.id)"
              @update:checked="handleChange('otherTrackables' ,other.id)"
            />
            <Label :for="other.id" class="label">{{ other.label }}</Label>
          </div>
        </div>
      </CardContent>

      <!-- Footer -->
      <CardFooter class="flex justify-between">
        <Button v-if="currentStep < 4" @click="handleNext">Next</Button>
        <Button v-if="currentStep === 4" @click="handleSave">Save</Button>
        <Button v-if="currentStep > 1" @click="handleBack" variant="ghost">Back</Button>
      </CardFooter>
    </Card>
  </Wrapper>
</template>

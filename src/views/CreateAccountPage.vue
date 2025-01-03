<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Background from '@/components/Background.vue'
import { ref } from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

const firstName = ref('')
const lastName = ref('')
const birthYear = ref('')
const gender = ref('')
const currentStep = ref(1)
const vaccinesReceived = ref<string[]>([])
const bloodDetails = ref<string[]>([])
const otherTrackables = ref<string[]>([])


const handleNext = () => {
  currentStep.value++
}
const handleBack = () => {
  currentStep.value--
}

const handleSave = () => {
  const userData = {
    personalDetails: {
      firstName: firstName.value,
      lastName: lastName.value,
      birthYear: birthYear.value,
      gender: gender.value,
    },
    vaccines: vaccinesReceived.value,
    bloodWork: bloodDetails.value,
    otherTrackables: otherTrackables.value,
  }

  console.log(JSON.stringify(userData, null, 2))
}

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
  <Background>
    <Card class="w-10/12">
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
          <Select>
            <SelectTrigger>
              <SelectValue v-model="gender"/>
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
              type="checkbox"
              :id="vaccine.id"
              v-model="vaccinesReceived"
              :value="vaccine.id"
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
              type="checkbox"
              :id="blood.id"
              v-model="bloodDetails"
              :value="blood.id"
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
              type="checkbox"
              :id="other.id"
              v-model="otherTrackables"
              :value="other.id"
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
  </Background>
</template>

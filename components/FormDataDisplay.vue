<template>
  <div class="space-y-4">
    <!-- Intake Form Data (5 Steps) -->
    <div v-if="intakeData" class="space-y-4">
      <div class="border-b border-[#333] pb-4">
        <h5 class="text-white font-semibold mb-3">📋 Intake Form (5 Steps)</h5>

        <!-- Step 1: Service Selection -->
        <div class="bg-[#161616] rounded p-4 mb-3">
          <p class="text-[#999999] text-xs mb-2">Step 1: Service & Complexity</p>
          <div class="space-y-2 text-sm">
            <p v-if="intakeData.service" class="text-white">
              <span class="text-[#999999]">Service:</span> {{ intakeData.service }}
            </p>
            <p v-if="intakeData.complexity" class="text-white">
              <span class="text-[#999999]">Complexity:</span> {{ intakeData.complexity }}
            </p>
          </div>
        </div>

        <!-- Step 2: Package & Features -->
        <div class="bg-[#161616] rounded p-4 mb-3">
          <p class="text-[#999999] text-xs mb-2">Step 2: Package & Features</p>
          <div class="space-y-2 text-sm">
            <p v-if="intakeData.packageLevel" class="text-white">
              <span class="text-[#999999]">Package:</span> {{ intakeData.packageLevel }}
            </p>
            <div v-if="intakeData.selectedFeatures?.length">
              <p class="text-[#999999] text-xs mb-1">Features:</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="feature in intakeData.selectedFeatures"
                  :key="feature"
                  class="bg-[#0033ff]/20 text-[#0033ff] px-2 py-1 rounded text-xs"
                >
                  {{ feature }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Budget & Timeline -->
        <div class="bg-[#161616] rounded p-4 mb-3">
          <p class="text-[#999999] text-xs mb-2">Step 3: Budget & Timeline</p>
          <div class="space-y-2 text-sm">
            <p v-if="intakeData.budget" class="text-white">
              <span class="text-[#999999]">Budget Range:</span> {{ intakeData.budget }}
            </p>
            <p v-if="intakeData.timeline" class="text-white">
              <span class="text-[#999999]">Timeline:</span> {{ intakeData.timeline }}
            </p>
            <p v-if="intakeData.rushFee" class="text-white">
              <span class="text-[#999999]">Rush Fee:</span> {{ intakeData.rushFee }}
            </p>
          </div>
        </div>

        <!-- Step 4: Contact Information -->
        <div class="bg-[#161616] rounded p-4 mb-3">
          <p class="text-[#999999] text-xs mb-2">Step 4: Contact Information</p>
          <div class="space-y-2 text-sm">
            <p v-if="intakeData.fullName" class="text-white">
              <span class="text-[#999999]">Name:</span> {{ intakeData.fullName }}
            </p>
            <p v-if="intakeData.email" class="text-white">
              <span class="text-[#999999]">Email:</span> {{ intakeData.email }}
            </p>
            <p v-if="intakeData.phone" class="text-white">
              <span class="text-[#999999]">Phone:</span> {{ intakeData.phone }}
            </p>
            <p v-if="intakeData.companyName" class="text-white">
              <span class="text-[#999999]">Company:</span> {{ intakeData.companyName }}
            </p>
          </div>
        </div>

        <!-- Step 5: Additional Details -->
        <div class="bg-[#161616] rounded p-4">
          <p class="text-[#999999] text-xs mb-2">Step 5: Project Details</p>
          <div class="space-y-2 text-sm">
            <p v-if="intakeData.description" class="text-white">
              <span class="text-[#999999]">Description:</span>
            </p>
            <p v-if="intakeData.description" class="text-[#999999] text-xs bg-[#0f0f0f] rounded p-2">
              {{ intakeData.description }}
            </p>
            <p v-if="intakeData.contactMethod" class="text-white">
              <span class="text-[#999999]">Preferred Contact:</span> {{ intakeData.contactMethod }}
            </p>
            <p v-if="intakeData.newsletter" class="text-white">
              <span class="text-[#999999]">Newsletter:</span> {{ intakeData.newsletter ? 'Yes' : 'No' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Billing Data -->
    <div v-if="billingData" class="space-y-4">
      <div class="border-b border-[#333] pb-4">
        <h5 class="text-white font-semibold mb-3">💳 Billing Information</h5>

        <div class="bg-[#161616] rounded p-4 space-y-2 text-sm">
          <p v-if="billingData.fullName" class="text-white">
            <span class="text-[#999999]">Full Name:</span> {{ billingData.fullName }}
          </p>
          <p v-if="billingData.street" class="text-white">
            <span class="text-[#999999]">Street:</span> {{ billingData.street }}
          </p>
          <p v-if="billingData.apartment" class="text-white">
            <span class="text-[#999999]">Apartment:</span> {{ billingData.apartment }}
          </p>
          <p v-if="billingData.city" class="text-white">
            <span class="text-[#999999]">City:</span> {{ billingData.city }}
          </p>
          <p v-if="billingData.postal" class="text-white">
            <span class="text-[#999999]">Postal Code:</span> {{ billingData.postal }}
          </p>
          <p v-if="billingData.country" class="text-white">
            <span class="text-[#999999]">Country:</span> {{ billingData.country }}
          </p>
          <p v-if="billingData.company" class="text-white">
            <span class="text-[#999999]">Company:</span> {{ billingData.company }}
          </p>
        </div>
      </div>
    </div>

    <!-- Metadata -->
    <div v-if="data?.timestamp" class="text-xs text-[#999999] pt-4 border-t border-[#333]">
      <p>Submitted: {{ formatDate(data.timestamp) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: any
}>()

const intakeData = computed(() => {
  return props.data?.intakeFormData || {}
})

const billingData = computed(() => {
  return props.data?.billingData || {}
})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
</script>

<template>
  <div class="fixed inset-0 flex flex-col bg-gradient-to-br from-green-100 via-white to-blue-100">
    <Banner
      v-if="banner"
      :image="image"
      :title="title"
      :status="status"
      :on-refresh="onRefresh"
    />

    <!-- Scrollable Middle Content -->
    <div class="flex-grow w-screen overflow-y-auto overflow-x-hidden flex flex-col px-6 py-2">
      <slot></slot>
    </div>

    <Navbar v-if="navbar" />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/NavBar/Navbar.vue'
import Banner from '@/components/Banner/Banner.vue'

// Props
defineProps({
  image: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  },
  onRefresh: {
    type: Function,
    default: null
  },
  banner: {
    type: Boolean,
    default: true
  },
  navbar: {
    type: Boolean,
    default: true
  }
})
</script>

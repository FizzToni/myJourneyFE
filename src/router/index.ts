import { createRouter, createWebHistory } from 'vue-router'
import AuthPage from '@/views/AuthPage.vue'
import MainJourneyPage from '@/views/MainJourneyPage.vue'
import TestPage from "@/views/TestPage.vue";
import History from "@/views/History.vue";
import Overview from '@/views/Overview.vue'

const routes = [
  { path: '/', redirect: '/login' }, // default to login page
  { path: '/login', name: 'Login', component: AuthPage },
  { path: '/main', name: 'Main', component: MainJourneyPage },
  { path: '/test', name: 'Test', component: TestPage },
  { path: '/history', name: 'History', component: History },
  { path: '/overview', name: 'Overview', component: Overview }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

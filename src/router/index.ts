import { createRouter, createWebHistory } from 'vue-router'
import AuthPage from '@/views/AuthPage.vue'
import MainJourneyPage from '@/views/MainJourneyPage.vue'
import History from "@/views/History.vue";
import OverviewPage from '@/views/OverviewPage.vue'
import GlobalSearch from '@/views/GlobalSearch.vue'

const routes = [
  { path: '/', redirect: '/login' }, // default to login page
  { path: '/login', name: 'Login', component: AuthPage },
  { path: '/main', name: 'Main', component: MainJourneyPage },
  { path: '/search', name: 'Search', component: GlobalSearch },
  { path: '/history', name: 'History', component: History },
  { path: '/overview', name: 'Overview', component: OverviewPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

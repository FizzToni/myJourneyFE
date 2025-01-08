import { createRouter, createWebHistory } from 'vue-router'
import AuthPage from '@/views/AuthPage.vue'
import MainJourneyPage from '@/views/MainJourneyPage.vue'
import History from "@/views/History.vue";
import ProfilPage from "@/views/ProfilPage.vue";
import GlobalSearch from '@/views/GlobalSearch.vue'
import CreateAccountPage from '@/views/CreateAccountPage.vue'

const routes = [
  { path: '/', redirect: '/login' }, // default to login page
  { path: '/login', name: 'Login', component: AuthPage },
  { path: '/main', name: 'Main', component: MainJourneyPage },
  { path: '/history', name: 'History', component: History },
  { path: '/profil', name: 'Profil', component: ProfilPage },
  { path: '/search', name: 'Search', component: GlobalSearch },
  { path: '/history', name: 'History', component: History }
  { path: '/history', name: 'History', component: History },
  { path: '/account/create', name: 'CreateAccount', component: CreateAccountPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

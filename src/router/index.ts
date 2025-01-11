import { createRouter, createWebHistory } from 'vue-router'
import AuthPage from '@/views/AuthPage.vue'
import MainJourneyPage from '@/views/MainJourneyPage.vue'
import History from "@/views/History.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import GlobalSearch from '@/views/GlobalSearch.vue'
import CreateAccountPage from '@/views/CreateAccountPage.vue'

const routes = [
  { path: '/', redirect: '/login' }, // default to login page
  { path: '/login', name: 'Login', component: AuthPage },
  { path: '/main', name: 'Main', component: MainJourneyPage },
  { path: '/history', name: 'History', component: History },
  { path: '/profile', name: 'Profile', component: ProfilePage },
  { path: '/search', name: 'Search', component: GlobalSearch },
  { path: '/account/create', name: 'CreateAccount', component: CreateAccountPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

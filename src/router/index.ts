import { createRouter, createWebHistory } from 'vue-router'
import { useAccountStore } from '@/stores/account'

import AuthPage from '@/views/AuthPage.vue'
import MainJourneyPage from '@/views/MainJourneyPage.vue'
import History from "@/views/History.vue";
import OverviewPage from '@/views/OverviewPage.vue'
import ProfilePage from "@/views/ProfilePage.vue";
import GlobalSearch from '@/views/GlobalSearch.vue'
import CreateAccountPage from '@/views/CreateAccountPage.vue'
import NodeDetail from '@/components/NodeDetail.vue'
import AddNode from "@/components/AddNode.vue";
import AddJourney from "@/components/AddJourney.vue";

const routes = [
  { path: '/', redirect: '/login' }, // default to login page
  { path: '/login', name: 'Login', component: AuthPage },
  { path: '/node', name: 'Node', component: NodeDetail },
  { path: '/addNode', name: 'AddNode', component: AddNode },
  { path: '/addJourney', name: 'AddJourney', component: AddJourney },
  { path: '/main', name: 'Main', component: MainJourneyPage },
  { path: '/history', name: 'History', component: History },
  { path: '/profile', name: 'Profile', component: ProfilePage },
  { path: '/search', name: 'Search', component: GlobalSearch },
  { path: '/overview', name: 'Overview', component: OverviewPage },
  { path: '/account/create', name: 'CreateAccount', component: CreateAccountPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useAccountStore()

  if (to.name !== 'Login' && !userStore.user.account_id) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import AuthPage from '@/views/AuthPage.vue'
import MainJourneyPage from '@/views/MainJourneyPage.vue'
import History from "@/views/History.vue";
import OverviewPage from '@/views/OverviewPage.vue'
import ProfilPage from "@/views/ProfilPage.vue";
import GlobalSearch from '@/views/GlobalSearch.vue'
import NodeDetail from '@/components/NodeDetail.vue'
import AddNode from "@/components/AddNode.vue";
import AddJourney from "@/components/AddJourney.vue";
import Vaccines from '@/components/Vaccines.vue'
import VaccineDetail from '@/components/VaccineDetail.vue'
import VaccinesUser from '@/components/VaccinesUser.vue'
import VaccineUserDetail from '@/components/VaccineUserDetail.vue'

const routes = [
  { path: '/', redirect: '/login' }, // default to login page
  { path: '/login', name: 'Login', component: AuthPage },
  { path: '/node', name: 'Node', component: NodeDetail },
  { path: '/addNode', name: 'AddNode', component: AddNode },
  { path: '/addJourney', name: 'AddJourney', component: AddJourney },
  { path: '/main', name: 'Main', component: MainJourneyPage },
  { path: '/history', name: 'History', component: History },
  { path: '/profil', name: 'Profil', component: ProfilPage },
  { path: '/search', name: 'Search', component: GlobalSearch },
  { path: '/overview', name: 'Overview', component: OverviewPage },
  { path: '/vaccines', name: 'Vaccines', component: Vaccines },
  { path: '/vaccineDetail', name: 'VaccineDetail', component: VaccineDetail },
  { path: '/vaccineUserDetail', name: 'VaccineUserDetail', component: VaccineUserDetail },
  { path: '/vaccinesUser', name: 'VaccinesUser', component: VaccinesUser },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

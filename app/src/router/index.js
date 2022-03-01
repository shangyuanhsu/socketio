import { createRouter, createWebHashHistory } from 'vue-router'
import MsgView from '../views/MsgView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component:LoginView
  },
  {
    path: '/home',
    name: 'home',
    component: MsgView
  },
 
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

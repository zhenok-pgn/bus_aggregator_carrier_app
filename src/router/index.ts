import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/AuthenticatedLayout.vue'),
    children: [
      { path: '', component: () => import('../views/HomeView.vue') },
      { path: '/organization', component: () => import('../views/OrganizationView.vue') },
      { path: '/trips', component: () => import('../views/TripsView.vue') },
      { path: '/routes', component: () => import('../views/RoutesView.vue') },
      { path: '/sold-tickets', component: () => import('../views/SoldTicketsView.vue') },
      { path: '/transport', component: () => import('../views/TransportView.vue') },
      { path: '/settings', component: () => import('../views/SettingsView.vue') },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { loginForm: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// check for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.loginForm && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router

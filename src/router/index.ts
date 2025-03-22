import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/AuthenticatedLayout.vue'),
    children: [
      { path: '', component: () => import('../modules/home/views/HomeView.vue') },
      {
        path: '/organization',
        component: () => import('../modules/organization/views/OrganizationView.vue'),
      },
      { path: '/trips', component: () => import('../modules/trips/views/TripsView.vue') },
      {
        path: '/routes',
        component: () => import('../layouts/RoutesLayout.vue'),
        children: [
          {
            path: '',
            name: 'routes-list',
            component: () => import('../modules/routes/views/RoutesView.vue'),
          },
          {
            path: 'add/:routeIdParam',
            name: 'add-route',
            component: () => import('../modules/routes/views/AddRouteView.vue'),
            props: true,
          },
          {
            path: 'add-return',
            name: 'add-return-route',
            component: () => import('../modules/routes/views/AddReturnRouteView.vue'),
          },
        ],
      },
      {
        path: '/sold-tickets',
        component: () => import('../modules/tickets/views/SoldTicketsView.vue'),
      },
      {
        path: '/transport',
        component: () => import('../modules/transport/views/TransportView.vue'),
      },
      { path: '/settings', component: () => import('../modules/settings/views/SettingsView.vue') },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../modules/auth/views/LoginView.vue'),
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

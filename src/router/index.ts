import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { headerButtonType, type IHeaderButton } from '@/interfaces/headerButton'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/AuthenticatedLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('../modules/home/views/HomeView.vue'),
        meta: { pageHeader: 'Главная' },
      },
      {
        path: '/organization',
        component: () => import('../modules/organization/views/OrganizationView.vue'),
        meta: { pageHeader: 'Организация' },
      },
      {
        path: '/trips',
        meta: { pageHeader: 'Рейсы' },
        children: [
          {
            path: '',
            name: 'trips-list',
            component: () => import('../modules/trips/views/TripsListView.vue'),
            meta: {
              headerButtons: [
                {
                  name: 'Запланировать рейсы',
                  to: { name: 'add-trips' },
                  type: headerButtonType.add,
                },
              ] as IHeaderButton[],
            },
          },
          {
            path: 'add',
            name: 'add-trips',
            component: () => import('../modules/trips/views/TripAddView.vue'),
            meta: {
              pageHeader: 'Добавить рейсы',
              backButton: {
                name: 'назад к рейсам',
                to: '.',
                type: headerButtonType.back,
              } as IHeaderButton,
            },
          },
          {
            path: 'edit/:tripIdParam',
            name: 'edit-trip',
            component: () => import('../modules/trips/views/TripEditView.vue'),
            meta: {
              pageHeader: 'Редактировать рейс',
              backButton: {
                name: 'назад к рейсам',
                to: '..',
                type: headerButtonType.back,
              } as IHeaderButton,
            },
            props: true,
          },
        ],
      },
      {
        path: '/routes',
        meta: { pageHeader: 'Маршруты' },
        children: [
          {
            path: '',
            name: 'routes-list',
            component: () => import('../modules/routes/views/RoutesListView.vue'),
            meta: {
              headerButtons: [
                {
                  name: 'Добавить',
                  to: { name: 'add-route' },
                  type: headerButtonType.add,
                },
                {
                  name: 'Добавить обратный маршрут',
                  to: { name: 'add-return-route' },
                  type: headerButtonType.add,
                },
              ] as IHeaderButton[],
            },
          },
          {
            path: 'add',
            name: 'add-route',
            component: () => import('../modules/routes/views/RouteAddView.vue'),
            meta: {
              pageHeader: 'Добавить маршрут',
              backButton: {
                name: 'назад к маршрутам',
                to: '.',
                type: headerButtonType.back,
              } as IHeaderButton,
            },
          },
          {
            path: 'edit/:routeIdParam',
            name: 'edit-route',
            component: () => import('../modules/routes/views/RouteAddView.vue'),
            meta: {
              pageHeader: 'Редактировать маршрут',
              backButton: {
                name: 'назад к маршрутам',
                to: '..',
                type: headerButtonType.back,
              } as IHeaderButton,
            },
            props: true,
          },
          {
            path: 'add-return',
            name: 'add-return-route',
            component: () => import('../modules/routes/views/RouteAddReturnView.vue'),
            meta: {
              pageHeader: 'Добавить обратный маршрут',
              backButton: {
                name: 'назад к маршрутам',
                to: '.',
                type: headerButtonType.back,
              } as IHeaderButton,
            },
          },
        ],
      },
      {
        path: '/sold-tickets',
        component: () => import('../modules/tickets/views/SoldTicketsView.vue'),
        meta: { pageHeader: 'Проданные билеты' },
      },
      {
        path: '/buses',
        meta: { pageHeader: 'Автобусы' },
        children: [
          {
            path: '',
            name: 'buses-list',
            component: () => import('../modules/transport/buses/views/BusesListView.vue'),
            meta: {
              headerButtons: [
                {
                  name: 'Добавить',
                  to: { name: 'bus-add' },
                  type: headerButtonType.add,
                },
              ] as IHeaderButton[],
            },
          },
          {
            path: 'add',
            name: 'bus-add',
            component: () => import('../modules/transport/buses/views/BusAddView.vue'),
            meta: {
              pageHeader: 'Добавить автобус',
              backButton: {
                name: 'назад к автобусам',
                to: '.',
                type: headerButtonType.back,
              } as IHeaderButton,
            },
          },
        ],
      },
      {
        path: '/drivers',
        meta: { pageHeader: 'Водители' },
        children: [
          {
            path: '',
            name: 'drivers-list',
            component: () => import('../modules/transport/drivers/views/DriversListView.vue'),
            meta: {
              headerButtons: [
                {
                  name: 'Добавить',
                  to: { name: 'driver-add' },
                  type: headerButtonType.add,
                },
              ] as IHeaderButton[],
            },
          },
          {
            path: 'add',
            name: 'driver-add',
            component: () => import('../modules/transport/drivers/views/DriverAddView.vue'),
            meta: {
              pageHeader: 'Добавить водителя',
              backButton: {
                name: 'назад к водителям',
                to: '.',
                type: headerButtonType.back,
              } as IHeaderButton,
            },
          },
        ],
      },
      {
        path: '/settings',
        meta: { pageHeader: 'Настройки' },
        component: () => import('../modules/settings/views/SettingsView.vue'),
      },
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
  history: createWebHistory('/carrier/'), //(import.meta.env.BASE_URL),
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

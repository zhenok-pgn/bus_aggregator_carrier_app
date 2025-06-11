import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../modules/auth/stores/auth'
import { headerButtonType, type IHeaderButton } from '@/interfaces/headerButton'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/AuthenticatedLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('../modules/organization/views/OrganizationView.vue'),
        meta: { pageHeader: 'Информация о перевозчике' },
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
      /*{
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
      },*/
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
            component: () => import('../modules/routes/views/RouteAddViewSnd.vue'),
            meta: {
              pageHeader: 'Добавить маршрут',
              backButton: {
                name: 'назад',
                to: { name: 'routes-list' },
                type: headerButtonType.back,
                needDialog: true,
              } as IHeaderButton,
            },
            children: [
              { path: '', name: 'add-route', redirect: { name: 'add-route-step1' } },
              {
                path: 'step1',
                name: 'add-route-step1',
                component: () => import('../modules/routes/views/RouteAddViewSndPage1.vue'),
                meta: { title: 'Страница 1' },
              },
              {
                path: 'step2',
                children: [
                  {
                    path: '',
                    name: 'add-route-step2',
                    component: () => import('../modules/routes/views/RouteAddViewSndPage2.vue'),
                    meta: {
                      title: 'Страница 2',
                      headerButtons: [
                        {
                          name: 'Добавить',
                          to: { name: 'add-route-step2-add' },
                          type: headerButtonType.add,
                        },
                      ] as IHeaderButton[],
                    },
                  },
                  {
                    path: 'edit/:scheduleIdParam',
                    name: 'add-route-step2-edit',
                    component: () => import('../modules/routes/views/RouteAddViewSndPage2_1.vue'),
                    meta: {
                      title: 'Страница 2.1',
                      pageHeader: 'Редактировать расписание',
                      backButton: {
                        name: 'назад',
                        to: { name: 'add-route-step2' },
                        type: headerButtonType.back,
                        needDialog: true,
                      } as IHeaderButton,
                    },
                    props: true,
                  },
                  {
                    path: 'add',
                    name: 'add-route-step2-add',
                    component: () => import('../modules/routes/views/RouteAddViewSndPage2_1.vue'),
                    meta: {
                      title: 'Страница 2.1',
                      pageHeader: 'Редактировать расписание',
                      backButton: {
                        name: 'назад',
                        to: { name: 'add-route-step2' },
                        type: headerButtonType.back,
                        needDialog: true,
                      } as IHeaderButton,
                    },
                  },
                ],
              },
              {
                path: 'step3',
                name: 'add-route-step3',
                component: () => import('../modules/routes/views/RouteAddViewSndPage3.vue'),
                meta: { title: 'Страница 3' },
              },
            ],
          },
          {
            path: 'edit/:routeIdParam',
            component: () => import('../modules/routes/views/RouteAddViewSnd.vue'),
            meta: {
              pageHeader: 'Добавить маршрут',
              backButton: {
                name: 'назад',
                to: { name: 'routes-list' },
                type: headerButtonType.back,
                needDialog: true,
              } as IHeaderButton,
            },
            children: [
              { path: '', name: 'edit-route', redirect: { name: 'edit-route-step1' } },
              {
                path: 'step1',
                name: 'edit-route-step1',
                component: () => import('../modules/routes/views/RouteAddViewSndPage1.vue'),
                meta: { title: 'Страница 1' },
              },
              {
                path: 'step2',
                children: [
                  {
                    path: '',
                    name: 'edit-route-step2',
                    component: () => import('../modules/routes/views/RouteAddViewSndPage2.vue'),
                    meta: {
                      title: 'Страница 2',
                      headerButtons: [
                        {
                          name: 'Добавить',
                          to: { name: 'edit-route-step2-add' },
                          type: headerButtonType.add,
                        },
                      ] as IHeaderButton[],
                    },
                  },
                  {
                    path: 'edit/:scheduleIdParam',
                    name: 'edit-route-step2-edit',
                    component: () => import('../modules/routes/views/RouteAddViewSndPage2_1.vue'),
                    meta: {
                      title: 'Страница 2.1',
                      pageHeader: 'Редактировать расписание',
                      backButton: {
                        name: 'назад',
                        to: { name: 'edit-route-step2' },
                        type: headerButtonType.back,
                        needDialog: true,
                      } as IHeaderButton,
                    },
                    props: true,
                  },
                  {
                    path: 'add',
                    name: 'edit-route-step2-add',
                    component: () => import('../modules/routes/views/RouteAddViewSndPage2_1.vue'),
                    meta: {
                      title: 'Страница 2.1',
                      pageHeader: 'Редактировать расписание',
                      backButton: {
                        name: 'назад',
                        to: { name: 'edit-route-step2' },
                        type: headerButtonType.back,
                        needDialog: true,
                      } as IHeaderButton,
                    },
                  },
                ],
              },
              {
                path: 'step3',
                name: 'edit-route-step3',
                component: () => import('../modules/routes/views/RouteAddViewSndPage3.vue'),
                meta: { title: 'Страница 3' },
              },
            ],
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
                to: { name: 'buses-list' },
                type: headerButtonType.back,
              } as IHeaderButton,
            },
          },
          {
            path: 'edit/:busIdParam',
            name: 'bus-edit',
            component: () => import('../modules/transport/buses/views/BusAddView.vue'),
            meta: {
              pageHeader: 'Редактировать автобус',
              backButton: {
                name: 'назад к автобусам',
                to: { name: 'buses-list' },
                type: headerButtonType.back,
              } as IHeaderButton,
            },
            props: true,
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
                to: { name: 'drivers-list' },
                type: headerButtonType.back,
              } as IHeaderButton,
            },
          },
          {
            path: 'edit/:driverIdParam',
            name: 'driver-edit',
            component: () => import('../modules/transport/drivers/views/DriverAddView.vue'),
            meta: {
              pageHeader: 'Редактировать водителя',
              backButton: {
                name: 'назад к водителям',
                to: { name: 'drivers-list' },
                type: headerButtonType.back,
              } as IHeaderButton,
            },
            props: true,
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
  if (to.meta.requiresAuth) {
    if (authStore.isAuthenticated) {
      authStore
        .fetchUser()
        .then(() => next())
        .catch(() => {
          authStore.isAuthenticated = false
          next('/login')
        })
    } else {
      next('/login')
    }
  } else if (to.meta.loginForm && authStore.isAuthenticated) {
    // Если авторизован и пытается на форму входа
    next('/') // Возвращаем обратно или на главную
  } else {
    next()
  }
})

export default router

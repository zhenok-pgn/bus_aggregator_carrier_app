import type { IRouteSummary, Route, RouteStop, IRouteExisted } from '@/interfaces/route'
import { defineStore } from 'pinia'

// Массив краткой информации о маршрутах
export const useRoutesStore = defineStore('routes', {
  state: (): { routes: IRouteSummary[] } => ({
    routes: [],
  }),
  actions: {
    setRoutes(routes: IRouteSummary[]) {
      this.routes = routes
    },
    clearRoutes() {
      this.routes = []
    },
  },
  getters: {},
})

// Полная информация о текущем маршрутe при редактировании
export const useRouteStore = defineStore('curRoute', {
  state: (): { route: Route | null } => ({
    route: null,
  }),
  actions: {
    setRoute(route: Route) {
      this.route = route
    },
    clearRoute() {
      this.route = null
    },
  },
  getters: {
    isAlreadyCreated(): boolean {
      return this.route !== null
    },
    isSavedInDb(): boolean {
      return this.isAlreadyCreated && 'id' in this.route
    },
  },
  persist: true,
  // При перезагрузке страницы данные не будут потеряны
})

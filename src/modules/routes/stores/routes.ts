import {
  type IRouteSummary,
  type IRouteStop,
  type IRoute,
  type IRouteSegmentSchedule,
  createBusStop,
} from '@/interfaces/route'
import { TimeOnly } from '@/utils/dateTime'
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
  state: () => ({
    route: null as null | IRoute,
    routeStops: null as null | IRouteStop[],
    isAlreadyCreated: false,
    //route: null,
  }),
  actions: {
    setRoute(route: IRoute) {
      this.route = route
      if (this.route.routeSchedules.length > 0) {
        this.restoreRouteStopsFromSegmentSchedules(0)
        this.clearRouteStopsSchedule()
      } else {
        const routeStops = [createBusStop(1), createBusStop(2)]
        this.setBusStops(routeStops)
      }
      this.isAlreadyCreated = true
    },
    updateSegmentPrices(price: number, segmentNumber: string) {
      if (this.route && this.route.routeSchedules) {
        this.route.routeSchedules.forEach((schedule) => {
          const segment = schedule.routeSegmentSchedules.find(
            (s) => s.segmentNumber === segmentNumber,
          )
          if (segment) {
            segment.price = price
          }
        })
      }
    },
    setBusStops(busStops: IRouteStop[]) {
      this.routeStops = busStops
      if (this.route?.routeSchedules) {
        this.route.routeSchedules.forEach((schedule, index) => {
          this.buildUpdatedSegmentSchedules(index, true)
        })
      }
    },
    buildUpdatedSegmentSchedules(scheduleIndex: number, isAddedNewStop = false) {
      const sortedStops = [...(this.routeStops || [])].sort((a, b) => a.order - b.order)
      const updatedSchedules: IRouteSegmentSchedule[] = []

      for (let i = 0; i < sortedStops.length - 1; i++) {
        const from = sortedStops[i]

        for (let j = i + 1; j < sortedStops.length; j++) {
          const to = sortedStops[j]

          // Ищем уже существующий сегмент с теми же остановками
          const existing = this.route?.routeSchedules[scheduleIndex].routeSegmentSchedules.find(
            (s) =>
              s.routeSegment.from.id === from.busStop.id && s.routeSegment.to.id === to.busStop.id,
          )

          const newSchedule: IRouteSegmentSchedule = {
            id: existing?.id ?? crypto.randomUUID(),
            segmentNumber: `${from.order}-${to.order}`,
            routeSegment: {
              id: existing?.routeSegment.id ?? crypto.randomUUID(),
              from: from.busStop,
              to: to.busStop,
            },
            // Используем существующее время, если оно есть, иначе используем текущее
            departureTime: isAddedNewStop
              ? existing?.departureTime || new TimeOnly().toString()
              : from.departureTime,
            arrivalTime: isAddedNewStop
              ? existing?.arrivalTime || new TimeOnly().toString()
              : to.arrivalTime,
            arrivalDayNumber: isAddedNewStop
              ? existing?.arrivalDayNumber || 0
              : to.arrivalDayNumber,
            price: existing?.price ?? 0,
            departureDayNumber: null,
          }

          updatedSchedules.push(newSchedule)
        }
      }

      if (this.route && this.route.routeSchedules[scheduleIndex]) {
        this.route.routeSchedules[scheduleIndex].routeSegmentSchedules = updatedSchedules
      }

      if (!isAddedNewStop) {
        this.clearRouteStopsSchedule()
      }
    },
    restoreRouteStopsFromSegmentSchedules(scheduleIndex: number) {
      const segments = this.route?.routeSchedules[scheduleIndex]?.routeSegmentSchedules
      if (!segments || segments.length === 0) return

      const stopMap = new Map<string, IRouteStop>()

      for (const seg of segments) {
        const fromId = seg.routeSegment.from.id
        const toId = seg.routeSegment.to.id

        const fromOrder = parseInt(seg.segmentNumber.split('-')[0])
        const toOrder = parseInt(seg.segmentNumber.split('-')[1])

        // Обновляем отправление из from
        if (!stopMap.has(fromId)) {
          stopMap.set(fromId, {
            busStop: seg.routeSegment.from,
            order: fromOrder,
            departureTime: seg.departureTime,
            arrivalTime: '', // позже может быть заполнено другим сегментом
            arrivalDayNumber: 0,
          })
        } else {
          stopMap.get(fromId)!.departureTime = seg.departureTime
        }

        // Обновляем прибытие в to
        if (!stopMap.has(toId)) {
          stopMap.set(toId, {
            busStop: seg.routeSegment.to,
            order: toOrder,
            departureTime: '', // позже может быть заполнено другим сегментом
            arrivalTime: seg.arrivalTime,
            arrivalDayNumber: seg.arrivalDayNumber,
          })
        } else {
          stopMap.get(toId)!.arrivalTime = seg.arrivalTime
          stopMap.get(toId)!.arrivalDayNumber = seg.arrivalDayNumber
        }
      }

      // Преобразуем в массив и сортируем по order
      const restoredStops = Array.from(stopMap.values()).sort((a, b) => a.order - b.order)

      // Обновляем routeStops
      this.routeStops = restoredStops
    },
    clearRoute() {
      this.route = null
      this.routeStops = null
      this.isAlreadyCreated = false
    },
    clearRouteStopsSchedule() {
      this.routeStops?.forEach((stop) => {
        stop.departureTime = ''
        stop.arrivalTime = ''
        stop.arrivalDayNumber = 0
      })
    },
  },
  persist: true,
  // При перезагрузке страницы данные не будут потеряны
})

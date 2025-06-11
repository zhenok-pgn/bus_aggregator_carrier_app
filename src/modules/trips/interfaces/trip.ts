import type { IRouteSegmentSchedule, IRouteSummary } from '@/interfaces/route'
import type { IBus, IDriver } from '@/modules/transport/interfaces/transport'
import type { IBaseObject } from '@/utils/baseObject'
import { DateOnly } from '@/utils/dateTime'

export interface ITrip extends IBaseObject {
  departureDate: string
  schedule: IRouteSegmentSchedule
  route: IRouteSummary
  bus: IBus
  driver: IDriver
  tripStatus: string
}

export interface ITripPlanRequest {
  routeScheduleId: string
  busId: string
  driverId: string
  fromPlanning: string
  toPlanning: string
}

export const TripStatusLocale: Record<string, string> = {
  Cancelled: 'Отменён',
  Scheduled: 'Запланирован',
  InProgress: 'В пути',
  Finished: 'Завершён',
}

export const TripStatusColor: Record<string, string> = {
  Cancelled: 'red',
  Scheduled: 'grey',
  InProgress: 'orange',
  Finished: 'green',
}

export const createTripPlanRequest = () => {
  return {
    routeScheduleId: '',
    busId: '',
    driverId: '',
    fromPlanning: new DateOnly().toString(),
    toPlanning: new DateOnly().toString(),
  }
}

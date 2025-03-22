import type { ICarrier } from './carrier'
import type { IBaseObject } from './baseObject'

//Короткая информация
export interface IRouteSummary {
  id: number
  name: string
  number: number
  /*stopsCount: number
  tarffisCount: number
  schedulesCount: number
  travelTimeInMinutes: number
  distanceInKm: number*/
}

//Полная информация
export interface IRouteNew extends IBaseObject {
  name: string
  number: number
  carrier: ICarrier
  stops: RouteStop[]
  tariffs: Tariff[]
  schedules: RouteSchedule[]
}

export interface IRouteExisted extends IBaseObject {
  id: number
  name: string
  number: number
  carrier: ICarrier
  stops: RouteStop[]
  tariffs: Tariff[]
  schedules: RouteSchedule[]
}

export interface IRouteStopNew extends IBaseObject {
  busStop: BusStop
  boardingTimeInMinutes: number
  travelTimeInMinutes: number
  distanceInKm: number
  order: number
}

export interface IRouteStopExisted extends IBaseObject {
  id: number
  busStop: BusStop
  boardingTimeInMinutes: number
  travelTimeInMinutes: number
  distanceInKm: number
  order: number
}

export interface ISegmentPriceNew extends IBaseObject {
  from: RouteStop
  to: RouteStop
  price: number
}

export interface ISegmentPriceExisted extends IBaseObject {
  id: number
  from: RouteStop
  to: RouteStop
  price: number
}

export interface IBusStopNew extends IBaseObject {
  name: string
}

export interface IBusStopExisted extends IBaseObject {
  id: number
  name: string
}

export interface IRouteScheduleNew extends IBaseObject {}

export interface IRouteScheduleExisted extends IBaseObject {
  id: number
}

export interface ITariffNew extends IBaseObject {
  name: string
  prices: SegmentPrice[]
}

export interface ITariffExisted extends IBaseObject {
  id: number
  name: string
  prices: SegmentPrice[]
}

export type Route = IRouteNew | IRouteExisted
export type RouteStop = IRouteStopNew | IRouteStopExisted
export type BusStop = IBusStopNew | IBusStopExisted
export type RouteSchedule = IRouteScheduleNew | IRouteScheduleExisted
export type Tariff = ITariffNew | ITariffExisted
export type SegmentPrice = ISegmentPriceNew | ISegmentPriceExisted

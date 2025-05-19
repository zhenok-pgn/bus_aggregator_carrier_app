import type { IMapPlace } from './IMapPlace'

export interface ITripSearchRequest {
  from: IMapPlace
  to: IMapPlace
  passangersCount: number
  date: string
}

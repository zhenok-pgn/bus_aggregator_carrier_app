import type { ISelectedAddress } from './ISelectedAddress'
import type { IRoute } from './IRoute'
import type { ICarrier } from './ICarrier'

export interface ITrip {
  id: number
  from: ISelectedAddress
  to: ISelectedAddress
  route: IRoute
  carrier: ICarrier
  dispatchDate: string
  arrivalDate: string
  price: number
}

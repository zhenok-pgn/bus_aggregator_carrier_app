import type { IBaseObject } from '../../../utils/baseObject'

export interface ICarrier extends IBaseObject {
  name: string
  inn: string
  ogrn: string
  address: string
  phone: string
  email: string
  website: string
}

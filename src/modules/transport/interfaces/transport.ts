import { useAuthStore } from '@/modules/auth/stores/auth'
import type { IBaseObject } from '@/utils/baseObject'
import { DateOnly } from '@/utils/dateTime'

export interface IDriver extends IBaseObject {
  userName: string
  password: string
  surname: string
  name: string
  patronymic: string
  licenseNumber: string
  employeeNumber: string
  dayOfBirth: string
  carrierId: string
}

export interface IBus extends IBaseObject {
  model: string
  stateNumber: string
  vin: string
  carrierId: string
  seats: string[]
}

export const createDriver = (): IDriver => {
  return {
    id: crypto.randomUUID(),
    userName: '',
    password: '',
    surname: '',
    name: '',
    patronymic: '',
    licenseNumber: '',
    employeeNumber: '',
    dayOfBirth: new DateOnly().toString(),
    carrierId: useAuthStore().user!.id,
  }
}

export const createBus = (): IBus => {
  return {
    id: crypto.randomUUID(),
    model: '',
    stateNumber: '',
    vin: '',
    carrierId: useAuthStore().user!.id,
    seats: [],
  }
}

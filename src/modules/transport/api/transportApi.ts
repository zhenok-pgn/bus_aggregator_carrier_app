import axios from '@/plugins/axios'

export const driversApi = {
  getDrivers: () => axios.get('/drivers'),
  getDriverById: (id: string) => axios.get(`/drivers/${id}`),
  createDriver: (data: any) => axios.post('/drivers', data),
  updateDriver: (id: string, data: any) => axios.put(`/drivers/${id}`, data),
  deleteDriver: (id: string) => axios.delete(`/drivers/${id}`),
}

export const busesApi = {
  getBuses: () => axios.get('/buses'),
  getBusById: (id: string) => axios.get(`/buses/${id}`),
  createBus: (data: any) => axios.post('/buses', data),
  updateBus: (id: string, data: any) => axios.put(`/buses/${id}`, data),
  deleteBus: (id: string) => axios.delete(`/buses/${id}`),
}

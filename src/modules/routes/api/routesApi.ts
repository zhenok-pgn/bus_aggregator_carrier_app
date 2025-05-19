import axios from '@/plugins/axios'

export const routesApi = {
  getRoutes: () => axios.get('/routes'),
  getRouteById: (id: string) => axios.get(`/routes/${id}`),
  createRoute: (data: any) => axios.post('/routes', data),
  updateRoute: (id: string, data: any) => axios.put(`/routes/${id}`, data),
  deleteRoute: (id: string) => axios.delete(`/routes/${id}`),
}

export const routeSchedulesApi = {
  getRouteSchedules: () => axios.get('/routes/schedules'),
}

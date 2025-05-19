import { useAuthStore } from '@/modules/auth/stores/auth'
import axios from '@/plugins/axios'
import qs from 'qs'

export const tripsApi = {
  getTrips: (filteredOptions) =>
    axios.get('/trips', {
      params: {
        departureDateFrom: filteredOptions.startDate,
        departureDateTo: filteredOptions.endDate,
        routes: filteredOptions.selectedRoutes,
        carrierId: useAuthStore().user!.id,
      },

      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    }),
  getTripById: (id: string) => axios.get(`/trips/${id}`),
  createTrip: (data: any) => axios.post('/trips', data),
  updateTrip: (id: string, data: any) => axios.put(`/trips/${id}`, data),
}

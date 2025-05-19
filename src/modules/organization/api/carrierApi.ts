import axios from '@/plugins/axios'

export const carriersApi = {
  getCarrierById: (id: string) => axios.get(`/carriers/${id}`),
}

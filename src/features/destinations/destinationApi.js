import { api } from '@/services/api'

export const destinationApi = {
  list: (params) => api.get('/destinations', params),
  bySlug: (slug) => api.get(`/destinations/slug/${slug}`),
  byId: (id) => api.get(`/destinations/${id}`),
  create: (payload) => api.post('/destinations', payload),
  update: (id, payload) => api.put(`/destinations/${id}`, payload),
  remove: (id) => api.delete(`/destinations/${id}`),
}

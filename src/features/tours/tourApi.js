import { api } from '@/services/api'

export const tourApi = {
  list: (params) => api.get('/tours', params),
  bySlug: (slug) => api.get(`/tours/slug/${slug}`),
  byId: (id) => api.get(`/tours/${id}`),
  create: (payload) => api.post('/tours', payload),
  update: (id, payload) => api.put(`/tours/${id}`, payload),
  remove: (id) => api.delete(`/tours/${id}`),
  setStatus: (id, status) => api.patch(`/tours/${id}/status`, { status }),
  featured: () => api.get('/tours', { featured: true, limit: 6 }),
}

import { api } from '@/services/api'

export const categoryApi = {
  list: (params) => api.get('/categories', params),
  byId: (id) => api.get(`/categories/${id}`),
  create: (payload) => api.post('/categories', payload),
  update: (id, payload) => api.put(`/categories/${id}`, payload),
  remove: (id) => api.delete(`/categories/${id}`),
}

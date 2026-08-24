import { api } from '@/services/api'

export const mediaApi = {
  list: (params) => api.get('/media', params),
  byId: (id) => api.get(`/media/${id}`),
  update: (id, payload) => api.put(`/media/${id}`, payload),
  remove: (id) => api.delete(`/media/${id}`),
  removeMany: (ids) => api.post('/media/bulk-delete', { ids }),
}

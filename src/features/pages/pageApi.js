import { api } from '@/services/api'

export const pageApi = {
  list: () => api.get('/pages'),
  bySlug: (slug) => api.get(`/pages/${slug}`),
  update: (slug, payload) => api.put(`/pages/${slug}`, payload),
  create: (payload) => api.post('/pages', payload),
  remove: (slug) => api.delete(`/pages/${slug}`),
  getSettings: (group) => api.get(`/settings/${group}`),
  updateSettings: (group, payload) => api.put(`/settings/${group}`, payload),
}

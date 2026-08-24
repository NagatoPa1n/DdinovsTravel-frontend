import { api, tokenStore } from '@/services/api'

export const authApi = {
  async login(credentials) {
    const data = await api.post('/auth/login', credentials)
    if (data?.token) tokenStore.set(data.token)
    return data
  },
  me: () => api.get('/auth/me'),
  updateProfile: (payload) => api.put('/auth/profile', payload),
  changePassword: (payload) => api.put('/auth/password', payload),
  logout() {
    tokenStore.clear()
    return api.post('/auth/logout').catch(() => null)
  },
}

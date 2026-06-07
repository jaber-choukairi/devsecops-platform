import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  auth: {
    username: 'admin',
    password: 'admin'
  }
})

export const ticketService = {
  getAll: () =>
    api.get('/tickets').then(response => response.data),

  getById: (id) =>
    api.get(`/tickets/${id}`).then(response => response.data),

  create: (data) =>
    api.post('/tickets', data).then(response => response.data),

  update: (id, data) =>
    api.put(`/tickets/${id}`, data).then(response => response.data),

  changeStatus: (id, status) =>
    api.patch(`/tickets/${id}/status`, null, { params: { status } })
      .then(response => response.data),

  changePriority: (id, priority) =>
    api.patch(`/tickets/${id}/priority`, null, { params: { priority } })
      .then(response => response.data),

  delete: (id) =>
    api.delete(`/tickets/${id}`),

  filterByStatus: (status) =>
    api.get('/tickets/filter/status', { params: { status } })
      .then(response => response.data),

  filterByPriority: (priority) =>
    api.get('/tickets/filter/priority', { params: { priority } })
      .then(response => response.data),

  search: (keyword) =>
    api.get('/tickets/search', { params: { keyword } })
      .then(response => response.data),
}

export default api
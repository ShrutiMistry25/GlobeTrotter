import client from './client';

export const authApi = {
  signup: (data) => client.post('/auth/signup', data).then((r) => r.data),
  login: (data) => client.post('/auth/login', data).then((r) => r.data),
  forgotPassword: (email) => client.post('/auth/forgot-password', { email }).then((r) => r.data),
  resetPassword: (token, password) => client.post('/auth/reset-password', { token, password }).then((r) => r.data)
};

export const userApi = {
  me: () => client.get('/users/me').then((r) => r.data.user),
  updateMe: (data) => client.put('/users/me', data).then((r) => r.data),
  deleteMe: () => client.delete('/users/me').then((r) => r.data),
  savedDestinations: () => client.get('/users/me/saved-destinations').then((r) => r.data.destinations),
  saveDestination: (cityId) => client.post(`/users/me/saved-destinations/${cityId}`).then((r) => r.data),
  removeDestination: (cityId) => client.delete(`/users/me/saved-destinations/${cityId}`).then((r) => r.data)
};

export const cityApi = {
  search: (params) => client.get('/cities', { params }).then((r) => r.data),
  regions: () => client.get('/cities/regions').then((r) => r.data.regions),
  top: (limit = 6) => client.get('/cities/top', { params: { limit } }).then((r) => r.data.cities)
};

export const activityApi = {
  search: (params) => client.get('/activities', { params }).then((r) => r.data)
};

export const tripApi = {
  list: () => client.get('/trips').then((r) => r.data.trips),
  get: (id) => client.get(`/trips/${id}`).then((r) => r.data),
  create: (data) => client.post('/trips', data).then((r) => r.data),
  update: (id, data) => client.put(`/trips/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/trips/${id}`).then((r) => r.data),
  addStop: (id, data) => client.post(`/trips/${id}/stops`, data).then((r) => r.data),
  updateStop: (id, stopId, data) => client.put(`/trips/${id}/stops/${stopId}`, data).then((r) => r.data),
  removeStop: (id, stopId) => client.delete(`/trips/${id}/stops/${stopId}`).then((r) => r.data),
  reorderStops: (id, stopIds) => client.put(`/trips/${id}/stops/reorder`, { stopIds }).then((r) => r.data.stops),
  addActivity: (id, stopId, data) =>
    client.post(`/trips/${id}/stops/${stopId}/activities`, data).then((r) => r.data),
  updateActivity: (id, stopId, activityId, data) =>
    client.put(`/trips/${id}/stops/${stopId}/activities/${activityId}`, data).then((r) => r.data),
  removeActivity: (id, stopId, activityId) =>
    client.delete(`/trips/${id}/stops/${stopId}/activities/${activityId}`).then((r) => r.data),
  budget: (id) => client.get(`/trips/${id}/budget`).then((r) => r.data),
  expenses: (id) => client.get(`/trips/${id}/expenses`).then((r) => r.data.expenses),
  addExpense: (id, data) => client.post(`/trips/${id}/expenses`, data).then((r) => r.data),
  removeExpense: (id, expenseId) => client.delete(`/trips/${id}/expenses/${expenseId}`).then((r) => r.data),
  enableShare: (id) => client.post(`/trips/${id}/share`).then((r) => r.data),
  disableShare: (id) => client.delete(`/trips/${id}/share`).then((r) => r.data)
};

export const publicApi = {
  getTrip: (slug) => client.get(`/public/trips/${slug}`).then((r) => r.data.trip),
  copyTrip: (slug) => client.post(`/public/trips/${slug}/copy`).then((r) => r.data)
};

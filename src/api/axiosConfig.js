import axios from "axios"

import { triggerLogout } from "src/auth/logoutHandler"

const baseURL = import.meta.env.VITE_BASE_URL

let accessToken = null

const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
})


api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// response interceptor
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config

    // don't retry login requests
    if (originalRequest.url.includes("/clinic/login")) {
      return Promise.reject(err)
    }

    // only try refresh if we got 401 and haven't retried yet
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // call refresh endpoint
        const resp = await api.post("/clinic/refresh-token")

        // destructure accessToken from resp.data
        const { accessToken: newToken } = resp.data || {}

        if (newToken) {
          accessToken = newToken
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest) // retry request
        }

        // if no token in response → logout
        triggerLogout()
      } catch (refreshError) {
        triggerLogout()
      }
    }

    return Promise.reject(err)
  },
)

export const setAccessToken = (token) => {
  accessToken = token
}

export default api

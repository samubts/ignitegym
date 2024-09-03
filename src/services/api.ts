import axios, { AxiosResponse } from "axios"

import { FormDataProps } from "@screens/Profile"

import { AppError } from "@utils/AppError"

const api = axios.create({
  baseURL: "http://192.168.1.106:3333"
})

const userService = {
  getUsers: async (): Promise<AxiosResponse> => {
    const response = await api.get('/users')
    return response
  },
  getUserById: async (id: string): Promise<AxiosResponse> => {
    const response = await api.get(`/users/${id}`)
    return response
  },
  createUser: async (data: {
    name: string
    email: string
    password: string
  }): Promise<AxiosResponse> => {
    const response = await api.post('/users', data)
    return response
  },
  updateUserData: async (data: FormDataProps): Promise<AxiosResponse> => {
    const response = await api.put('/users', data)
    return response
  },
  updateImageProfile: async (data: FormData): Promise<AxiosResponse> => {
    console.log('Data: ', data)

    const response = await api.patch('/users/avatar', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  },
  sigIn: async (data: {
    email: string
    password: string
  }): Promise<AxiosResponse> => {
    const response = await api.post('/sessions', data)
    return response
  },
}
api.interceptors.response.use(response => response, error => {
  if(error.message && error.response.data) {
    return Promise.reject(new AppError(error.response.data.message))
  } else {
    return Promise.reject(error)
  }
})

export { api, userService }
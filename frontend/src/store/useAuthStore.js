import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check');
      set({ authUser: response.data })

    } catch (err) {
      console.log(`Error in check auth: ${err} `)
      set({ authUser: null })

    } finally {
      set({ isCheckingAuth: false })
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true })
    try {
      const response = await axiosInstance.post('/auth/login', data);
      set({authUser: response.data})

      toast.success("Logged In successfully")
    } catch (err) {
      toast.error(err.response.data.message)
    } finally {
      set({ isLoggingIn: false })
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      const response = await axiosInstance.post("/auth/signup", data)
      set({ authUser: response.data })
      toast.success("Account created successfully")

    } catch (err) {
      toast.error(err.response.data.message)
    } finally {
      set({ isSigningUp: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null })
      toast.success("Logged out successfully")
    } catch (err) {
      toast.error(err.response.data.message)
    }
  }

}))
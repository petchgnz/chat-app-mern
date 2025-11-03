import { axiosInstance } from '../lib/axios.js'
import { create } from 'zustand'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/useAuthStore.js'

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data ?? [] });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true })
    try {
      const res = await axiosInstance.get(`/messages/${userId}`)
      set({ messages: res.data })

    } catch (err) {
      toast.error(err.response.data.message)

    } finally {
      set({ isMessagesLoading: false })
    }
  },

  sendMessages: async (messageData) => {
    const { selectedUser, messages } = get()
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
      set({ messages: [...messages, res.data] })
    } catch (err) {
      toast.error(err.response.data.message)
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get()
    if(!selectedUser) return;

    const socket = useAuthStore.getState().socket

    socket.on("newMessage", (messagesData) => {
      if (messagesData.senderId !== selectedUser._id) return;

      set({
        messages: [...get().messages, messagesData]
      })
    })
  },
  
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket
    socket.off("newMessage")
  },

  setSelectedUser: (selectedUser) => set({ selectedUser })
}))
import create from 'zustand';

const useStore = create(set => ({
  user: {},
  selectedChat: {},
  chats: [],
  updateUser: newUser =>
    set((state) => ({
      user: {
        ...newUser
      }
    })),
  setSelectedChat: chat =>
    set((state) => ({
      selectedChat: {
        ...chat
      }
    })),
  updateChats: newChat =>
    set((state) => ({
      chats: newChat
    })),
}));

export const useUserStore = useStore;

import { create } from "zustand";

interface ChatStore {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const useChatStore = create<ChatStore>((set) => ({
  selectedIndex: 0, // 초기값 설정
  setSelectedIndex: (index: number) => set({ selectedIndex: index }),
}));

export default useChatStore;

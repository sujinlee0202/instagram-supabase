import { create } from "zustand";

interface ChatStore {
  selectedIndexState: string;
  setSelectedIndexState: (index: string) => void;
  selectedUserIndex: number;
  setSelectedUserIndex: (index: number) => void;
  presenceState: any;
  setPresenceState: (state: any) => void;
}

const useChatStore = create<ChatStore>((set) => ({
  selectedIndexState: "0",
  setSelectedIndexState: (index: string) => set({ selectedIndexState: index }),
  selectedUserIndex: 0,
  setSelectedUserIndex: (index: number) => set({ selectedUserIndex: index }),
  presenceState: "",
  setPresenceState: (state: any) => set({ presenceState: state }),
}));

export default useChatStore;

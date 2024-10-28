import { create } from "zustand";
import { persist } from "zustand/middleware";
type Store = {
  token: any;
  saveToken: (data: any) => void;
};

const useToken = create<Store>()(
  persist(
    (set) => ({
      token: "",
      saveToken: (payload) => {
        set({ token: payload });
      },
    }),
    {
      name: "auth",
      skipHydration: true,
    }
  )
);
export default useToken;

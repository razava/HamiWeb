import { create } from "zustand";
import { persist } from "zustand/middleware";
type Store = {
  data: any;
  saveData: (data: any) => void;
};

// const useData = create<Store>()(persist((set: any) => ({
//   data: "",
//   saveData: (payload) => set((state: any) => ({ data: payload })),{
//             name: 'auth',
//             skipHydration: true,
//         })
// }));

const useData = create<Store>()(
    persist(
        (set) => ({
            data: "",
            saveData: (payload) => {
                set({ data:payload });
            },
        }),
        {
            name: 'auth',
            skipHydration: true,
        }
    )
);
export default useData;

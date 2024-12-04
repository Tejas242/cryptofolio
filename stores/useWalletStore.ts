import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

interface WalletState {
  address: string | null;
  balance: string | null;
  connecting: boolean;
  setAddress: (address: string | null) => void;
  setBalance: (balance: string | null) => void;
  setConnecting: (connecting: boolean) => void;
}

const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      balance: null,
      connecting: false,
      setAddress: (address) => set({ address }),
      setBalance: (balance) => set({ balance }),
      setConnecting: (connecting) => set({ connecting }),
    }),
    {
      name: "wallet-storage",
      getStorage: () => ({
        setItem: SecureStore.setItemAsync,
        getItem: SecureStore.getItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      }),
    },
  ),
);

export default useWalletStore;

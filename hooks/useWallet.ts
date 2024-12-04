import { useWalletConnectModal } from "@walletconnect/modal-react-native";
import { ethers } from "ethers";
import { useCallback } from "react";

export function useWallet() {
  const { provider, address, isConnected } = useWalletConnectModal();

  const getBalance = useCallback(async () => {
    if (!provider || !address) return null;

    try {
      const balance = await provider.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error("Error getting balance:", error);
      return null;
    }
  }, [provider, address]);

  const signMessage = useCallback(
    async (message: string) => {
      if (!provider || !address) return null;

      try {
        const signature = await provider.request({
          method: "personal_sign",
          params: [message, address],
        });
        return signature;
      } catch (error) {
        console.error("Error signing message:", error);
        return null;
      }
    },
    [provider, address],
  );

  return {
    address,
    isConnected,
    getBalance,
    signMessage,
  };
}

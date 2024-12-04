import { useWalletConnectModal } from "@walletconnect/modal-react-native";
import { ethers } from "ethers";

export class Web3Service {
  private static instance: Web3Service;
  private provider: any;
  private modalHook: ReturnType<typeof useWalletConnectModal> | null = null;

  private constructor() {
    this.provider = null;
  }

  public static getInstance(): Web3Service {
    if (!Web3Service.instance) {
      Web3Service.instance = new Web3Service();
    }
    return Web3Service.instance;
  }

  setModalHook(hook: ReturnType<typeof useWalletConnectModal>) {
    this.modalHook = hook;
  }

  async connect() {
    try {
      if (!this.modalHook) throw new Error("Modal hook not initialized");
      await this.modalHook.open();
      return this.modalHook.provider;
    } catch (error) {
      console.error("Connection error:", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (!this.modalHook) throw new Error("Modal hook not initialized");
      await this.modalHook.provider?.disconnect();
    } catch (error) {
      console.error("Disconnect error:", error);
      throw error;
    }
  }

  async getAccounts() {
    try {
      if (!this.modalHook?.provider)
        throw new Error("Provider not initialized");
      const ethersProvider = new ethers.providers.Web3Provider(
        this.modalHook.provider,
      );
      return await ethersProvider.listAccounts();
    } catch (error) {
      console.error("Error getting accounts:", error);
      throw error;
    }
  }

  async getBalance(address: string) {
    try {
      if (!this.modalHook?.provider)
        throw new Error("Provider not initialized");
      const ethersProvider = new ethers.providers.Web3Provider(
        this.modalHook.provider,
      );
      const balance = await ethersProvider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }

  async signMessage(message: string) {
    try {
      if (!this.modalHook?.provider)
        throw new Error("Provider not initialized");
      const ethersProvider = new ethers.providers.Web3Provider(
        this.modalHook.provider,
      );
      const signer = ethersProvider.getSigner();
      return await signer.signMessage(message);
    } catch (error) {
      console.error("Error signing message:", error);
      throw error;
    }
  }

  async sendTransaction(to: string, value: string) {
    try {
      if (!this.modalHook?.provider)
        throw new Error("Provider not initialized");
      const ethersProvider = new ethers.providers.Web3Provider(
        this.modalHook.provider,
      );
      const signer = ethersProvider.getSigner();
      return await signer.sendTransaction({
        to,
        value: ethers.utils.parseEther(value),
      });
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  }
}

export const web3Service = Web3Service.getInstance();

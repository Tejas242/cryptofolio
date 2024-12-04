import { StyleSheet, Pressable } from "react-native";
import { useWalletConnectModal } from "@walletconnect/modal-react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { web3Service } from "@/app/api/web3";
import { useEffect } from "react";

export default function WalletScreen() {
  const modalHook = useWalletConnectModal();
  const { isConnected, address, provider } = modalHook;
  const colorScheme = useColorScheme();

  useEffect(() => {
    web3Service.setModalHook(modalHook);
  }, [modalHook]);

  const handleConnect = async () => {
    try {
      if (isConnected) {
        await web3Service.disconnect();
      } else {
        await web3Service.connect();
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <IconSymbol
          name="wallet.pass"
          size={24}
          color={Colors[colorScheme ?? "light"].text}
        />
        <ThemedText type="title">Wallet</ThemedText>
      </ThemedView>

      <ThemedView style={styles.contentContainer}>
        <ThemedText type="subtitle">
          {isConnected ? "Connected Address" : "Connect Your Wallet"}
        </ThemedText>

        {isConnected && address && (
          <ThemedText style={styles.address}>{address}</ThemedText>
        )}

        <ThemedView style={styles.buttonContainer}>
          <Pressable
            onPress={handleConnect}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: Colors[colorScheme ?? "light"].tint,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText style={styles.buttonText}>
              {isConnected ? "Disconnect" : "Connect Wallet"}
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  address: {
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

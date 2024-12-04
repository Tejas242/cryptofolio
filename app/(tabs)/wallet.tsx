import { StyleSheet, Pressable, View, Dimensions } from "react-native";
import { useWalletConnectModal } from "@walletconnect/modal-react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { web3Service } from "@/app/api/web3";
import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function WalletScreen() {
  const modalHook = useWalletConnectModal();
  const { isConnected, address, getBalance } = useWallet();
  const colorScheme = useColorScheme();
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    web3Service.setModalHook(modalHook);
  }, [modalHook]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected) {
        setIsLoading(true);
        const bal = await getBalance();
        setBalance(bal);
        setIsLoading(false);
      }
    };
    fetchBalance();
  }, [isConnected, getBalance]);

  const handleConnect = async () => {
    try {
      if (isConnected) {
        await web3Service.disconnect();
        setBalance(null);
      } else {
        await web3Service.connect();
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Wallet</ThemedText>
          {isConnected && (
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.connectedBadge}
            >
              <View style={styles.dot} />
              <ThemedText style={styles.connectedText}>Connected</ThemedText>
            </MotiView>
          )}
        </View>

        <View style={styles.contentContainer}>
          {isConnected ? (
            <Animated.View
              entering={FadeIn.duration(500)}
              style={styles.walletContainer}
            >
              <LinearGradient
                colors={["#4F46E5", "#7C3AED"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.balanceCard}
              >
                <View>
                  <ThemedText style={styles.balanceLabel}>
                    Total Balance
                  </ThemedText>
                  <MotiView
                    animate={{ opacity: isLoading ? 0.7 : 1 }}
                    transition={{ type: "timing", duration: 500, loop: true }}
                  >
                    <ThemedText style={styles.balanceAmount}>
                      {balance ? `${parseFloat(balance).toFixed(4)}` : "---"}
                    </ThemedText>
                  </MotiView>
                  <ThemedText style={styles.ethLabel}>ETH</ThemedText>
                </View>
                <View style={styles.addressContainer}>
                  <ThemedText style={styles.addressLabel}>
                    {formatAddress(address!)}
                  </ThemedText>
                  <Ionicons name="copy-outline" size={16} color="white" />
                </View>
              </LinearGradient>

              <Pressable
                onPress={handleConnect}
                style={({ pressed }) => [
                  styles.disconnectButton,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Ionicons
                  name="power"
                  size={20}
                  color={Colors[colorScheme].error}
                />
                <ThemedText style={styles.disconnectText}>
                  Disconnect Wallet
                </ThemedText>
              </Pressable>
            </Animated.View>
          ) : (
            <View style={styles.connectContainer}>
              <View style={styles.connectContent}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="wallet-outline"
                    size={32}
                    color={Colors[colorScheme].text}
                  />
                </View>
                <ThemedText style={styles.connectTitle}>
                  Connect Your Wallet
                </ThemedText>
                <ThemedText style={styles.connectSubtitle}>
                  Connect your crypto wallet to manage your assets
                </ThemedText>
              </View>
              <Pressable
                onPress={handleConnect}
                style={({ pressed }) => [
                  styles.connectButton,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <LinearGradient
                  colors={["#4F46E5", "#7C3AED"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.connectGradient}
                >
                  <ThemedText style={styles.connectButtonText}>
                    Connect Wallet
                  </ThemedText>
                </LinearGradient>
              </Pressable>
            </View>
          )}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  connectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },
  connectedText: {
    color: "#22C55E",
    fontSize: 12,
    fontWeight: "500",
  },
  walletContainer: {
    width: "100%",
  },
  balanceCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginBottom: 24,
  },
  balanceAmount: {
    lineHeight: 40,
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  ethLabel: {
    color: "white",
    fontSize: 16,
    opacity: 0.8,
    marginTop: 4,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    borderRadius: 12,
  },
  addressLabel: {
    color: "white",
    fontSize: 14,
  },
  disconnectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  disconnectText: {
    color: Colors.light.error,
    fontSize: 16,
    fontWeight: "600",
  },
  connectContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  connectContent: {
    alignItems: "center",
    marginTop: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(79, 70, 229, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  connectTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  connectSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    maxWidth: width * 0.8,
  },
  connectButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 32,
  },
  connectGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  connectButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

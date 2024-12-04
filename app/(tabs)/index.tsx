import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useCryptoData } from "@/hooks/useCryptoData";
import CoinCard from "@/components/CoinCard";
import { useRouter } from "expo-router";
import { useCallback } from "react";

export default function MarketScreen() {
  const { data: coins, isLoading, refetch } = useCryptoData();
  const router = useRouter();

  const handleCoinPress = useCallback(
    (coinId: string) => {
      if (!coinId) {
        console.warn("No coin ID provided");
        return;
      }

      try {
        console.log("Navigating to coin:", coinId);
        router.push({
          pathname: "/modals/coin-details",
          params: { id: coinId },
        });
      } catch (error) {
        console.error("Navigation error:", error);
      }
    },
    [router],
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.listContainer}>
        <FlashList
          data={coins || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CoinCard
              coin={item}
              onPress={() => handleCoinPress(item.id)}
              isLoading={isLoading}
            />
          )}
          estimatedItemSize={80}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    height: "100%",
  },
});

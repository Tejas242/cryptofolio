import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { coinGeckoApi } from "../api/coingecko";

export default function ExploreScreen() {
  const { data: trendingCoins } = useQuery({
    queryKey: ["trending-coins"],
    queryFn: () => coinGeckoApi.getTrendingCoins(),
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Trending</ThemedText>
      {/* Add trending coins list */}
      <ThemedView style={styles.newsSection}>
        <ThemedText type="subtitle">Latest News</ThemedText>
        {/* Add crypto news feed */}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  newsSection: {
    marginTop: 24,
  },
});

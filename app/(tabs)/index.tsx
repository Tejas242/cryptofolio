import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { FlashList } from "@shopify/flash-list";
import { useCryptoData } from "@/hooks/useCryptoData";
import CoinCard from "@/components/CoinCard";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { MotiView } from "moti";

const SORT_OPTIONS = ["Market Cap", "Price", "24h %"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

export default function MarketScreen() {
  const { data: coins, isLoading, refetch } = useCryptoData();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState<SortOption>("Market Cap");

  const handleCoinPress = useCallback(
    (coinId: string) => {
      if (!coinId) return;
      router.push({
        pathname: "/modals/coin-details",
        params: { id: coinId },
      });
    },
    [router],
  );

  const filteredCoins = coins?.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedCoins = [...(filteredCoins || [])].sort((a, b) => {
    switch (selectedSort) {
      case "Market Cap":
        return b.market_cap - a.market_cap;
      case "Price":
        return b.current_price - a.current_price;
      case "24h %":
        return b.price_change_percentage_24h - a.price_change_percentage_24h;
      default:
        return 0;
    }
  });

  const marketStats = {
    totalMarketCap: coins?.reduce((sum, coin) => sum + coin.market_cap, 0) || 0,
    topGainer: coins?.reduce((max, coin) =>
      coin.price_change_percentage_24h >
      (max?.price_change_percentage_24h || -Infinity)
        ? coin
        : max,
    ),
    topLoser: coins?.reduce((min, coin) =>
      coin.price_change_percentage_24h <
      (min?.price_change_percentage_24h || Infinity)
        ? coin
        : min,
    ),
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Market</ThemedText>
        </View>

        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
          style={styles.statsContainer}
        >
          <View style={styles.statsRow}>
            <ThemedText style={styles.statsLabel}>Market Cap</ThemedText>
            <ThemedText style={styles.statsValue}>
              ${(marketStats.totalMarketCap / 1e9).toFixed(2)}B
            </ThemedText>
          </View>
          {marketStats.topGainer && (
            <View style={styles.statsRow}>
              <ThemedText style={styles.statsLabel}>Top Gainer</ThemedText>
              <ThemedText
                style={[
                  styles.statsValue,
                  { color: Colors[colorScheme].success },
                ]}
              >
                {marketStats.topGainer.symbol.toUpperCase()}(
                {marketStats.topGainer.price_change_percentage_24h.toFixed(2)}%)
              </ThemedText>
            </View>
          )}
        </MotiView>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={20}
              color={Colors[colorScheme].text}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search coins..."
              placeholderTextColor={Colors[colorScheme].tabIconDefault}
              style={[styles.searchInput, { color: Colors[colorScheme].text }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.sortContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sortOptions}
          >
            {SORT_OPTIONS.map((option) => (
              <Pressable
                key={option}
                onPress={() => setSelectedSort(option)}
                style={[
                  styles.sortButton,
                  selectedSort === option && {
                    backgroundColor: Colors[colorScheme].tint + "20",
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.sortButtonText,
                    selectedSort === option && {
                      color: Colors[colorScheme].tint,
                    },
                  ]}
                >
                  {option}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.listContainer}>
          <FlashList
            data={sortedCoins}
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
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statsContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 16,
    gap: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  statsValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  sortContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sortOptions: {
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContainer: {
    flex: 1,
    height: "100%",
  },
});

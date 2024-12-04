import React from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { coinGeckoApi } from "../api/coingecko";
import PriceChart from "@/components/PriceChart";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { CoinDetails } from "@/types/coin";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function CoinDetailsModal() {
  const colorScheme = useColorScheme() ?? "light";
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: coinData,
    isLoading,
    error,
  } = useQuery<CoinDetails | null>({
    queryKey: ["coin-details", id],
    queryFn: () => coinGeckoApi.getCoinDetails(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
      </ThemedView>
    );
  }

  if (error || !coinData) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>
          {error ? "Error loading coin details" : "No data available"}
        </ThemedText>
      </ThemedView>
    );
  }

  const imageUrl =
    typeof coinData.image === "string"
      ? coinData.image
      : coinData.image?.large || coinData.image?.small || "";

  const currentPrice = coinData.market_data?.current_price?.usd;
  const priceChange = coinData.market_data?.price_change_percentage_24h;
  const marketCap = coinData.market_data?.market_cap?.usd;
  const sparklineData = coinData.market_data?.sparkline_7d?.price || [];

  const priceChangeColor =
    (priceChange ?? 0) >= 0
      ? Colors[colorScheme].success
      : Colors[colorScheme].error;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <ThemedView
        style={[
          styles.header,
          { borderBottomColor: Colors[colorScheme].border },
        ]}
      >
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
        )}
        <ThemedView style={styles.headerInfo}>
          <ThemedText style={styles.title}>{coinData.name}</ThemedText>
          <ThemedText style={styles.symbol}>
            {coinData.symbol.toUpperCase()}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView
        style={[
          styles.priceContainer,
          { borderBottomColor: Colors[colorScheme].border },
        ]}
      >
        <ThemedText style={styles.price}>
          ${currentPrice?.toLocaleString() ?? "N/A"}
        </ThemedText>
        {priceChange != null && (
          <ThemedText style={[styles.priceChange, { color: priceChangeColor }]}>
            {priceChange.toFixed(2)}%
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.chartContainer}>
        <ThemedText style={styles.chartTitle}>Price Chart (7D)</ThemedText>
        {sparklineData.length > 0 ? (
          <PriceChart
            data={sparklineData.filter(
              (price): price is number =>
                typeof price === "number" && !isNaN(price),
            )}
          />
        ) : (
          <ThemedText style={styles.noDataText}>
            No chart data available
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.descriptionContainer}>
        <ThemedText style={styles.sectionTitle}>About</ThemedText>
        <ThemedText style={styles.description}>
          {coinData.description?.en || "No description available"}
        </ThemedText>
      </ThemedView>

      <ThemedView
        style={[
          styles.statsContainer,
          {
            backgroundColor: Colors[colorScheme].cardBackground,
            borderColor: Colors[colorScheme].border,
          },
        ]}
      >
        <ThemedText style={styles.sectionTitle}>Market Stats</ThemedText>
        <ThemedView
          style={[
            styles.stat,
            { borderBottomColor: Colors[colorScheme].border },
          ]}
        >
          <ThemedText>Market Cap Rank</ThemedText>
          <ThemedText>#{coinData.market_cap_rank ?? "N/A"}</ThemedText>
        </ThemedView>
        <ThemedView
          style={[
            styles.stat,
            { borderBottomColor: Colors[colorScheme].border },
          ]}
        >
          <ThemedText>Market Cap</ThemedText>
          <ThemedText>${marketCap?.toLocaleString() ?? "N/A"}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    margin: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  symbol: {
    fontSize: 16,
    opacity: 0.7,
  },
  priceContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
  },
  priceChange: {
    fontSize: 18,
    marginTop: 4,
  },
  chartContainer: {
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  noDataText: {
    textAlign: "center",
    padding: 20,
    opacity: 0.7,
  },
  descriptionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    lineHeight: 22,
  },
  statsContainer: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  stat: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
});

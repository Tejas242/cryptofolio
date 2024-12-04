import {
  StyleSheet,
  View,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { coinGeckoApi } from "../api/coingecko";
import { newsApi } from "../api/news";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { useRouter } from "expo-router";
import { formatDistanceToNow } from "date-fns";
import { Linking } from "react-native";

const categories = [
  {
    id: "defi",
    name: "DeFi",
    icon: "🏦",
    query: "decentralized-finance-defi",
  },
  {
    id: "nft",
    name: "NFTs",
    icon: "🎨",
    query: "non-fungible-tokens-nft",
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: "🎮",
    query: "gaming",
  },
  {
    id: "layer1",
    name: "Layer 1",
    icon: "⛓️",
    query: "layer-1",
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: trendingCoins, isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trending-coins"],
    queryFn: () => coinGeckoApi.getTrendingCoins(),
  });

  const { data: news, isLoading: isLoadingNews } = useQuery({
    queryKey: ["crypto-updates"],
    queryFn: () => newsApi.getLatestNews(),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  const handleCoinPress = (coinId: string) => {
    router.push({
      pathname: "/modals/coin-details",
      params: { id: coinId },
    });
  };

  const handleCategoryPress = (categoryId: string, query: string) => {
    setSelectedCategory(categoryId);
    // TODO: implement category-specific coin filtering here
    router.push({
      pathname: "/category",
      params: { category: query },
    });
  };

  const handleNewsPress = (url: string) => {
    // Open news article in browser or in-app browser
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Explore</ThemedText>
        </View>

        <View style={styles.searchContainer}>
          <ThemedView style={styles.searchBar}>
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
          </ThemedView>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.categoriesContainer}>
            <ThemedText style={styles.sectionTitle}>Categories</ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            >
              {categories.map((category) => (
                <Pressable
                  key={category.id}
                  style={({ pressed }) => [
                    styles.categoryCard,
                    { opacity: pressed ? 0.8 : 1 },
                    selectedCategory === category.id && styles.selectedCategory,
                  ]}
                  onPress={() =>
                    handleCategoryPress(category.id, category.query)
                  }
                >
                  <LinearGradient
                    colors={["#4F46E5", "#7C3AED"]}
                    style={styles.categoryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <ThemedText style={styles.categoryIcon}>
                      {category.icon}
                    </ThemedText>
                    <ThemedText style={styles.categoryName}>
                      {category.name}
                    </ThemedText>
                  </LinearGradient>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.trendingSection}>
            <ThemedText style={styles.sectionTitle}>Trending</ThemedText>
            {isLoadingTrending ? (
              <View style={styles.loadingContainer}>
                {[1, 2, 3].map((i) => (
                  <MotiView
                    key={i}
                    style={[
                      styles.trendingCard,
                      { backgroundColor: Colors[colorScheme].border },
                    ]}
                    animate={{ opacity: [0.5, 1] }}
                    transition={{ type: "timing", duration: 1000, loop: true }}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.trendingList}>
                {trendingCoins?.map((coin) => (
                  <Pressable
                    key={coin.id}
                    style={({ pressed }) => [
                      styles.trendingCard,
                      { opacity: pressed ? 0.8 : 1 },
                    ]}
                    onPress={() => handleCoinPress(coin.id)}
                  >
                    <Image
                      source={{ uri: coin.thumb }}
                      style={styles.coinImage}
                    />
                    <View style={styles.coinInfo}>
                      <ThemedText style={styles.coinName}>
                        {coin.name}
                      </ThemedText>
                      <ThemedText style={styles.coinSymbol}>
                        {coin.symbol.toUpperCase()}
                      </ThemedText>
                    </View>
                    <View style={styles.btcPriceContainer}>
                      <ThemedText style={styles.btcPrice}>
                        {coin.price_btc.toFixed(8)} BTC
                      </ThemedText>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={styles.newsSection}>
            <ThemedText style={styles.sectionTitle}>Latest Updates</ThemedText>
            {isLoadingNews ? (
              <View style={styles.loadingContainer}>
                {[1, 2, 3].map((i) => (
                  <MotiView
                    key={i}
                    style={[
                      styles.newsCard,
                      { backgroundColor: Colors[colorScheme].border },
                    ]}
                    animate={{ opacity: [0.5, 1] }}
                    transition={{ type: "timing", duration: 1000, loop: true }}
                  />
                ))}
              </View>
            ) : (
              news?.map((item) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.newsCard,
                    { opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.newsImage}
                    contentFit="cover"
                  />
                  <View style={styles.newsContent}>
                    <View style={styles.projectInfo}>
                      <ThemedText style={styles.projectName}>
                        {item.project.name}
                      </ThemedText>
                      <View
                        style={[
                          styles.categoryBadge,
                          { backgroundColor: Colors[colorScheme].tint + "20" },
                        ]}
                      >
                        <ThemedText style={styles.categoryText}>
                          {item.category}
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText numberOfLines={2} style={styles.updateText}>
                      {item.title}
                    </ThemedText>
                    <View style={styles.newsMetadata}>
                      <ThemedText style={styles.newsTime}>
                        {formatDistanceToNow(new Date(item.publishedAt), {
                          addSuffix: true,
                        })}
                      </ThemedText>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </ScrollView>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  scrollContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    width: 100,
    height: 100,
    borderRadius: 16,
    overflow: "hidden",
  },
  categoryGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  trendingSection: {
    marginBottom: 24,
  },
  loadingContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  trendingList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  trendingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 16,
    height: 72,
  },
  coinImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  coinInfo: {
    flex: 1,
    marginLeft: 12,
  },
  coinName: {
    fontSize: 16,
    fontWeight: "600",
  },
  coinSymbol: {
    fontSize: 14,
    opacity: 0.6,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: "#4F46E5",
  },
  btcPriceContainer: {
    alignItems: "flex-end",
  },
  btcPrice: {
    fontSize: 14,
    opacity: 0.8,
  },
  newsMetadata: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  newsSource: {
    fontSize: 12,
    opacity: 0.8,
  },
  priceChange: {
    fontSize: 14,
    fontWeight: "500",
  },
  newsSection: {
    gap: 12,
  },
  newsCard: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    height: 100,
  },
  newsImage: {
    width: 100,
    height: "100%",
  },
  newsContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  projectInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  projectName: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "500",
  },
  updateText: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
  newsMetadata: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
  },
  newsTime: {
    fontSize: 11,
    opacity: 0.5,
  },
});

import { View, StyleSheet, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

import { Image } from "expo-image";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Coin } from "@/types/coin";
import { MotiView } from "moti";

interface CoinCardProps {
  coin: Coin;
  onPress: () => void;
  isLoading?: boolean;
}

const CoinCardSkeleton = () => {
  const colorScheme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <MotiView
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{
          type: "timing",
          duration: 1000,
          loop: true,
        }}
        style={[
          styles.skeletonBase,
          styles.image,
          { backgroundColor: Colors[colorScheme].border },
        ]}
      />
      <View style={styles.infoContainer}>
        <MotiView
          from={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "timing",
            duration: 1000,
            loop: true,
          }}
          style={[
            styles.skeletonBase,
            {
              height: 20,
              width: 120,
              backgroundColor: Colors[colorScheme].border,
            },
          ]}
        />
        <MotiView
          from={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "timing",
            duration: 1000,
            loop: true,
          }}
          style={[
            styles.skeletonBase,
            {
              height: 16,
              width: 80,
              marginTop: 4,
              backgroundColor: Colors[colorScheme].border,
            },
          ]}
        />
      </View>
      <View style={styles.priceContainer}>
        <MotiView
          from={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "timing",
            duration: 1000,
            loop: true,
          }}
          style={[
            styles.skeletonBase,
            {
              height: 20,
              width: 100,
              backgroundColor: Colors[colorScheme].border,
            },
          ]}
        />
        <MotiView
          from={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "timing",
            duration: 1000,
            loop: true,
          }}
          style={[
            styles.skeletonBase,
            {
              height: 16,
              width: 60,
              marginTop: 4,
              backgroundColor: Colors[colorScheme].border,
            },
          ]}
        />
      </View>
    </ThemedView>
  );
};

export default function CoinCard({ coin, onPress, isLoading }: CoinCardProps) {
  const colorScheme = useColorScheme();

  if (isLoading) {
    return <CoinCardSkeleton />;
  }

  const priceChangeColor =
    coin.price_change_percentage_24h >= 0
      ? Colors[colorScheme].success
      : Colors[colorScheme].error;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <ThemedView style={styles.container}>
        <View style={styles.leftContainer}>
          <Image
            source={{ uri: coin.image }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.infoContainer}>
            <ThemedText style={styles.name}>{coin.name}</ThemedText>
            <ThemedText style={styles.symbol}>
              {coin.symbol.toUpperCase()}
            </ThemedText>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <ThemedText style={styles.price}>
            ${coin.current_price.toLocaleString()}
          </ThemedText>
          <View
            style={[
              styles.changeBadge,
              { backgroundColor: priceChangeColor + "20" },
            ]}
          >
            <ThemedText
              style={[styles.changeText, { color: priceChangeColor }]}
            >
              {coin.price_change_percentage_24h >= 0 ? "+" : ""}
              {coin.price_change_percentage_24h.toFixed(
                2,
              )}%
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginHorizontal: 20,
    marginVertical: 6,
  },
  container: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 16,
    justifyContent: "space-between",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  infoContainer: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  symbol: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  skeletonBase: {
    borderRadius: 4,
  },
});

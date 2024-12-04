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
        <Image
          source={{ uri: coin.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.infoContainer}>
          <ThemedText type="defaultSemiBold">{coin.name}</ThemedText>
          <ThemedText style={styles.symbol}>
            {coin.symbol.toUpperCase()}
          </ThemedText>
        </View>
        <View style={styles.priceContainer}>
          <ThemedText type="defaultSemiBold">
            ${coin.current_price.toLocaleString()}
          </ThemedText>
          <ThemedText style={{ color: priceChangeColor }}>
            {coin.price_change_percentage_24h.toFixed(2)}%
          </ThemedText>
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  skeletonBase: {
    borderRadius: 4,
  },
  pressable: {
    width: "100%",
  },
  container: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  symbol: {
    opacity: 0.6,
    fontSize: 14,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
});

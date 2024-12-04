import React, { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletConnectModal } from "@walletconnect/modal-react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const projectId = process.env.EXPO_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

const providerMetadata = {
  name: "CryptoFolio",
  description: "Crypto Portfolio Tracker",
  url: "https://your-cryptofolio-website.com",
  icons: ["https://your-cryptofolio-icon.com"],
  redirect: {
    native: "cryptofolio://",
    universal: "your-cryptofolio-website.com",
  },
} as const;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modals/coin-details"
            options={{
              presentation: "modal",
              title: "Coin details",
            }}
          />
        </Stack>
        <WalletConnectModal
          projectId={projectId}
          providerMetadata={providerMetadata}
        />
        <StatusBar style="auto" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

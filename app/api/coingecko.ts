import axios from "axios";
import {
  Coin,
  CoinDetails,
  TrendingCoin,
  TrendingResponse,
} from "@/types/coin";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

const api = axios.create({
  baseURL: COINGECKO_API,
  timeout: 10000,
});

export const coinGeckoApi = {
  getCoinList: async (): Promise<Coin[]> => {
    try {
      const { data } = await api.get("/coins/markets", {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 100,
          sparkline: true,
        },
      });
      return data || [];
    } catch (error) {
      console.error("Error fetching coin list:", error);
      return [];
    }
  },

  getCoinDetails: async (coinId: string): Promise<CoinDetails | null> => {
    if (!coinId) {
      console.error("No coin ID provided");
      return null;
    }

    try {
      console.log(`Fetching details for coin: ${coinId}`);
      const { data } = await api.get(`/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          sparkline: true,
        },
      });

      if (!data) {
        console.error("No data received from API");
        return null;
      }

      // Transform the data to match our interface
      const transformedData: CoinDetails = {
        id: data.id,
        symbol: data.symbol,
        name: data.name,
        image: data.image || {
          large: "",
          small: "",
          thumb: "",
        },
        description: data.description,
        market_data: data.market_data
          ? {
              current_price: {
                usd: data.market_data.current_price?.usd || 0,
              },
              market_cap: {
                usd: data.market_data.market_cap?.usd || 0,
              },
              price_change_percentage_24h:
                data.market_data.price_change_percentage_24h || 0,
              sparkline_7d: {
                price: data.market_data.sparkline_7d?.price || [],
              },
            }
          : undefined,
        market_cap_rank: data.market_cap_rank,
      };

      return transformedData;
    } catch (error) {
      console.error("Error fetching coin details:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Status:", error.response?.status);
      }
      return null;
    }
  },
  getTrendingCoins: async (): Promise<TrendingCoin[]> => {
    try {
      const { data } = await api.get<TrendingResponse>("/search/trending");

      // Transform the response to match our interface
      return data.coins.map(({ item }) => ({
        id: item.id,
        coin_id: item.coin_id,
        name: item.name,
        symbol: item.symbol,
        thumb: item.thumb,
        small: item.small,
        large: item.large,
        price_btc: item.price_btc,
        score: item.score,
        price_change_24h: 0, // This data is not provided by the trending endpoint
      }));
    } catch (error) {
      console.error("Error fetching trending coins:", error);
      return [];
    }
  },
};

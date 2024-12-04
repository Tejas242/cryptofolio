import axios from "axios";
import { NewsItem } from "@/types/news";
import { coinGeckoApi } from "./coingecko";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

export const newsApi = {
  getLatestNews: async (): Promise<NewsItem[]> => {
    try {
      const { data } = await axios.get(`${COINGECKO_API}/status_updates`, {
        params: {
          per_page: 10,
          category: "general",
        },
      });

      return data.status_updates.map((item: any) => ({
        id: item.id,
        title: item.description.split("\n")[0], // First line as title
        description: item.description,
        project: item.project,
        imageUrl: item.project.image?.large || item.project.image?.thumb,
        publishedAt: item.created_at,
        user: item.user,
        category: item.category,
      }));
    } catch (error) {
      console.error("Error fetching news:", error);
      return [];
    }
  },
};

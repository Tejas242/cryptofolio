export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
}

export interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  image: {
    large: string;
    small: string;
    thumb: string;
  };
  description?: {
    en: string;
  };
  market_data?: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    price_change_percentage_24h: number;
    sparkline_7d?: {
      price: number[];
    };
  };
  market_cap_rank?: number;
}

export interface TrendingCoin {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  thumb: string;
  small: string;
  large: string;
  price_btc: number;
  score: number;
  price_change_24h?: number;
}

export interface TrendingResponse {
  coins: Array<{
    item: TrendingCoin;
  }>;
}

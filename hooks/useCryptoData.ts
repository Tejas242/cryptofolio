import { useQuery, useQueryClient } from "@tanstack/react-query";
import { coinGeckoApi } from "@/app/api/coingecko";
import { Coin } from "@/types/coin";

const QUERY_KEY = ["crypto-markets"] as const;

export function useCryptoData() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Coin[]>({
    queryKey: QUERY_KEY,
    queryFn: coinGeckoApi.getCoinList,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  };

  return {
    data,
    isLoading,
    refetch,
  };
}

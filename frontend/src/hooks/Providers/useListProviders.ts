import { useState } from "react";
import { getProviders } from "@api";
import { ProviderResponse } from "@types";

type UseProvidersResult = {
    data: ProviderResponse[] | null;
    loading: boolean;
    error: string | null;
}

export const useListProviders = (): [UseProvidersResult, () => Promise<void>] => {
    const [data, setData] = useState<ProviderResponse[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const resolve = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getProviders();
        setData(result);
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Could not load providers");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
  
    return [{ data, loading, error }, resolve];
  };
  
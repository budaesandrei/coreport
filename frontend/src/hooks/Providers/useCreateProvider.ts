import { useState } from "react";
import { createProvider } from "@api";
import { ProviderCreateRequest, ProviderResponse } from "@types";

type UseCreateProviderResult = {
  loading: boolean;
  error: string | null;
}

export const useCreateProvider = (): [
  UseCreateProviderResult,
  (request: ProviderCreateRequest) => Promise<ProviderResponse>
] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = async (request: ProviderCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createProvider(request);
      return result;
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not create provider");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [{ loading, error }, resolve];
};

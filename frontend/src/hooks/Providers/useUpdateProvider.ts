import { useState } from "react";
import { updateProvider } from "@api";
import { ProviderUpdateRequest, ProviderResponse } from "@types";

type UseUpdateProviderResult = {
  loading: boolean;
  error: string | null;
}

export const useUpdateProvider = (): [
  UseUpdateProviderResult,
  (id: number, request: ProviderUpdateRequest) => Promise<ProviderResponse>
] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = async (id: number, request: ProviderUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateProvider(id, request);
      return result;
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not update provider");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [{ loading, error }, resolve];
};

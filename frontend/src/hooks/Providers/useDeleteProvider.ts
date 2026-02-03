import { useState } from "react";
import { deleteProvider } from "@api";

type UseDeleteProviderResult = {
  loading: boolean;
  error: string | null;
}

export const useDeleteProvider = (): [
  UseDeleteProviderResult,
  (id: number) => Promise<void>
] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProvider(id);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not delete provider");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [{ loading, error }, resolve];
};

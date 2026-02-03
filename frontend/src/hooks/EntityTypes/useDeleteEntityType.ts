import { useState } from "react";
import { deleteEntityType } from "@api";

type UseDeleteEntityTypeResult = {
  loading: boolean;
  error: string | null;
}

export const useDeleteEntityType = (): [
  UseDeleteEntityTypeResult,
  (id: number) => Promise<void>
] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteEntityType(id);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not delete entity type");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [{ loading, error }, resolve];
};

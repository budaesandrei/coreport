import { useState } from "react";
import { deleteEntityAttribute } from "@api";

type UseDeleteEntityAttributeResult = {
  loading: boolean;
  error: string | null;
}

export const useDeleteEntityAttribute = (): [
  UseDeleteEntityAttributeResult,
  (entityTypeId: number, id: number) => Promise<void>
] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = async (entityTypeId: number, id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteEntityAttribute(entityTypeId, id);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not delete entity attribute");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [{ loading, error }, resolve];
};

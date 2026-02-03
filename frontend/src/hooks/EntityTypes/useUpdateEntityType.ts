import { useState } from "react";
import { updateEntityType } from "@api";
import { EntityTypeUpdateRequest, EntityTypeResponse } from "@types";

type UseUpdateEntityTypeResult = {
  loading: boolean;
  error: string | null;
}

export const useUpdateEntityType = (): [
  UseUpdateEntityTypeResult,
  (id: number, request: EntityTypeUpdateRequest) => Promise<EntityTypeResponse>
] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = async (id: number, request: EntityTypeUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateEntityType(id, request);
      return result;
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not update entity type");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [{ loading, error }, resolve];
};

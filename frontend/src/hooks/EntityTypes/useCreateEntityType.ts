import { useState } from "react";
import { createEntityType } from "@api";
import { EntityTypeCreateRequest, EntityTypeResponse } from "@types";

type UseCreateEntityTypeResult = {
  loading: boolean;
  error: string | null;
}

export const useCreateEntityType = (): [
  UseCreateEntityTypeResult,
  (request: EntityTypeCreateRequest) => Promise<EntityTypeResponse>
] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = async (request: EntityTypeCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createEntityType(request);
      return result;
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not create entity type");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [{ loading, error }, resolve];
};

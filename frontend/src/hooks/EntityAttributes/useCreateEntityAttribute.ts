import { useState } from "react";
import { createEntityAttribute } from "@api";
import { EntityAttributeCreateRequest, EntityAttributeResponse } from "@types";

type UseCreateEntityAttributeResult = {
  loading: boolean;
  error: string | null;
}

export const useCreateEntityAttribute = (): [
  UseCreateEntityAttributeResult,
  (entityTypeId: number, request: EntityAttributeCreateRequest) => Promise<EntityAttributeResponse>
] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = async (entityTypeId: number, request: EntityAttributeCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createEntityAttribute(entityTypeId, request);
      return result;
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not create entity attribute");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [{ loading, error }, resolve];
};

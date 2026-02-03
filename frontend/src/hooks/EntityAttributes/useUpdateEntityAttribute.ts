import { useState } from "react";
import { updateEntityAttribute } from "@api";
import { EntityAttributeUpdateRequest, EntityAttributeResponse } from "@types";

type UseUpdateEntityAttributeResult = {
  loading: boolean;
  error: string | null;
}

export const useUpdateEntityAttribute = (): [
  UseUpdateEntityAttributeResult,
  (entityTypeId: number, id: number, request: EntityAttributeUpdateRequest) => Promise<EntityAttributeResponse>
] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = async (entityTypeId: number, id: number, request: EntityAttributeUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateEntityAttribute(entityTypeId, id, request);
      return result;
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not update entity attribute");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [{ loading, error }, resolve];
};

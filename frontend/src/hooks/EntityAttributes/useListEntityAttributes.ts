import { useState } from "react";
import { getEntityAttributes } from "@api";
import { EntityAttributeResponse } from "@types";

type UseEntityAttributesResult = {
    data: EntityAttributeResponse[] | null;
    loading: boolean;
    error: string | null;
}

export const useListEntityAttributes = (): [UseEntityAttributesResult, (entityTypeId: number) => Promise<void>] => {
    const [data, setData] = useState<EntityAttributeResponse[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const resolve = async (entityTypeId: number) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getEntityAttributes(entityTypeId);
        setData(result);
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Could not load entity attributes");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
  
    return [{ data, loading, error }, resolve];
  };
  
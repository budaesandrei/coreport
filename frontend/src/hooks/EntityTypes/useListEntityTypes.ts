import { useState } from "react";
import { getEntityTypes } from "@api";
import { EntityTypeResponse } from "@types";

type UseEntityTypesResult = {
    data: EntityTypeResponse[] | null;
    loading: boolean;
    error: string | null;
}

export const useListEntityTypes = (): [UseEntityTypesResult, () => Promise<void>] => {
    const [data, setData] = useState<EntityTypeResponse[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const resolve = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getEntityTypes();
        setData(result);
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Could not load entity types");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
  
    return [{ data, loading, error }, resolve];
  };
  
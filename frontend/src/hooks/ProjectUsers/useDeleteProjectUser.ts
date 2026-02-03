import { useState } from "react";
import { deleteProjectUser } from "@api";

type UseDeleteProjectUserResult = {
  loading: boolean;
  error: string | null;
}

export const useDeleteProjectUser = (): [
  UseDeleteProjectUserResult,
  (id: number) => Promise<void>
] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProjectUser(id);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not delete user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [{ loading, error }, resolve];
};

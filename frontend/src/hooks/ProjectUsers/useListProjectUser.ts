import { useState } from "react";
import { getProjectUsers } from "@api";
import { ProjectUserResponse } from "@types";

type UseProjectUserResult = {
  data: ProjectUserResponse[] | null;
  loading: boolean;
  error: string | null;
};

export const useListProjectUser = (): [
  UseProjectUserResult,
  () => Promise<void>
] => {
  const [data, setData] = useState<ProjectUserResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getProjectUsers();
      setData(result);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not load users");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return [{ data, loading, error }, resolve];
};

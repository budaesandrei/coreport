import { useState } from "react";
import { updateProjectUser } from "@api";
import { ProjectUserUpdateRequest, ProjectUserResponse } from "@types";

type UseUpdateProjectUserResult = {
  loading: boolean;
  error: string | null;
}

export const useUpdateProjectUser = (): [
  UseUpdateProjectUserResult,
  (id: number, request: ProjectUserUpdateRequest) => Promise<ProjectUserResponse>
] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = async (id: number, request: ProjectUserUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateProjectUser(id, request);
      return result;
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not update user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [{ loading, error }, resolve];
};

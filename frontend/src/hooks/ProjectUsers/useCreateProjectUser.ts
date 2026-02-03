import { useState } from "react";
import { createProjectUser } from "@api";
import { ProjectUserCreateRequest, ProjectUserResponse } from "@types";

type UseCreateProjectUserResult = {
  loading: boolean;
  error: string | null;
}

export const useCreateProjectUser = (): [
  UseCreateProjectUserResult,
  (request: ProjectUserCreateRequest) => Promise<ProjectUserResponse>
] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = async (request: ProjectUserCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createProjectUser(request);
      return result;
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not create user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [{ loading, error }, resolve];
};

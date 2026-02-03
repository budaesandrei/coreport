import { useState } from "react";
import { getProjectByName } from "@api";
import { ProjectInfoResponse, ProjectResolveRequest } from "@types";

type UseProjectInfoResult = {
    data: ProjectInfoResponse | null;
    loading: boolean;
    error: string | null;
}

export const useProjectInfo = (): [
    UseProjectInfoResult,
    (request: ProjectResolveRequest) => Promise<void>
  ] => {
    const [data, setData] = useState<ProjectInfoResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const resolve = async (request: ProjectResolveRequest) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getProjectByName(request);
        setData(result);
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Could not load project info");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
  
    return [{ data, loading, error }, resolve];
  };
  
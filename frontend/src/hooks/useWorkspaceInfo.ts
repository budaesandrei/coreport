import { useState } from "react";
import { resolveWorkspaceByName } from "@api";
import { WorkspaceInfoResponse, WorkspaceResolveRequest } from "@types";

type UseWorkspaceInfoResult = {
  data: WorkspaceInfoResponse | null;
  loading: boolean;
  error: string | null;
};

export const useWorkspaceInfo = (): [
  UseWorkspaceInfoResult,
  (request: WorkspaceResolveRequest) => Promise<void>
] => {
  const [data, setData] = useState<WorkspaceInfoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = async (request: WorkspaceResolveRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await resolveWorkspaceByName(request);
      setData(result);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not load workspace info");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return [{ data, loading, error }, resolve];
};

import { useEffect, useState, useRef } from "react";
import { patchAcceptInvitationByToken } from "@api";
import { InvitationResponse } from "@types";

type UseAcceptInvitationResult = {
  data: InvitationResponse | null;
  loading: boolean;
  error: string | null;
}

export const useAcceptInvitation = (): UseAcceptInvitationResult => {
  const [data, setData] = useState<InvitationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [token] = useState(() => localStorage.getItem("invite_token"));
  const hasAcceptedRef = useRef(false);

  useEffect(() => {
    const accept = async () => {
      if (!token) {
        setError("Missing token");
        setLoading(false);
        return;
      }

      if (hasAcceptedRef.current) return;
      hasAcceptedRef.current = true;

      try {
        const data = await patchAcceptInvitationByToken(token);
        setData(data);
        localStorage.removeItem("invite_token");
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Could not load invitation");
      } finally {
        setLoading(false);
      }
    };

    accept();
  }, [token]);

  return { data, loading, error };
};
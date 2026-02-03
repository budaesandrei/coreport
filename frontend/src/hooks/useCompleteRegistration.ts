import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getInvitationByToken } from "@api";
import { InvitationResponse } from "@types";

type UseCompleteRegistrationResult = {
  token: string | null;
  data: InvitationResponse | null;
  loading: boolean;
  error: string | null;
}

export const useCompleteRegistration = (): UseCompleteRegistrationResult => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<InvitationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get("token");

  useEffect(() => {
    const fetch = async () => {
      if (!token) {
        setError("Missing token");
        setLoading(false);
        return;
      }

      try {
        const data = await getInvitationByToken(token);
        setData(data);
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Could not load invitation");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [token]);

  return { token, data, loading, error };
};

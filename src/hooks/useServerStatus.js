import { useCallback, useState } from "react";
import { getServerStatus } from "../services/api";

export function useServerStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true); // true = show "Checking…" from first paint
  const [error, setError] = useState(null);

  const checkStatus = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await getServerStatus();
      setStatus(data.status);
      return data.status;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Unable to reach the server.";
      setStatus(null);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const isOnline = status === "online";

  return {
    status,
    loading,
    error,
    isOnline,
    checkStatus,
  };
}

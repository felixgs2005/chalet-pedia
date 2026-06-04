import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  fetchMessagesForUser,
  groupMessageThreads,
} from "../services/messagesFirestore";

export function useMessageThreads() {
  const { currentUser } = useAuth();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    if (!currentUser?.uid) {
      setThreads([]);
      setLoading(false);
      return Promise.resolve([]);
    }

    setLoading(true);
    setError(null);

    return fetchMessagesForUser(currentUser.uid)
      .then((messages) => {
        const grouped = groupMessageThreads(messages, currentUser.uid);
        setThreads(grouped);
        return grouped;
      })
      .catch((err) => {
        setError(err);
        setThreads([]);
        return [];
      })
      .finally(() => setLoading(false));
  }, [currentUser?.uid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { threads, loading, error, refresh };
}

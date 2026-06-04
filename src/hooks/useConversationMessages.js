import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchMessagesForConversation } from "../services/messagesFirestore";

export function useConversationMessages(conversationKey) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    if (!conversationKey || !currentUser?.uid) {
      setMessages([]);
      setLoading(false);
      return Promise.resolve([]);
    }

    setLoading(true);
    setError(null);

    return fetchMessagesForConversation(conversationKey, currentUser.uid)
      .then((list) => {
        setMessages(list);
        return list;
      })
      .catch((err) => {
        setError(err);
        setMessages([]);
        return [];
      })
      .finally(() => setLoading(false));
  }, [conversationKey, currentUser?.uid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { messages, loading, error, refresh };
}

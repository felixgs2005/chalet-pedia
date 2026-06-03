import { useCallback, useState } from "react";
import { sharePage } from "../utils/sharePage";

export function useSharePage() {
  const [feedback, setFeedback] = useState("");

  const share = useCallback(async (options) => {
    const result = await sharePage(options);
    if (result.cancelled) return;
    if (result.message) {
      setFeedback(result.message);
      window.setTimeout(() => setFeedback(""), 2800);
    }
  }, []);

  return { share, feedback };
}

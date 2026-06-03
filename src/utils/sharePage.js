/**
 * Partage natif (Web Share API) avec repli : copie du lien dans le presse-papiers.
 */
export async function sharePage({ title, text, url } = {}) {
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  if (navigator.share) {
    try {
      await navigator.share({
        title: title || document.title,
        text: text || "",
        url: shareUrl,
      });
      return { ok: true, method: "native" };
    } catch (err) {
      if (err?.name === "AbortError") {
        return { ok: false, cancelled: true };
      }
    }
  }

  try {
    await navigator.clipboard.writeText(shareUrl);
    return {
      ok: true,
      method: "clipboard",
      message: "Lien copié dans le presse-papiers.",
    };
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = shareUrl;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return { ok: true, method: "clipboard", message: "Lien copié." };
  }
}

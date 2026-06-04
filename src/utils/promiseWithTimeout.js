/**
 * Rejette si la promesse ne se résout pas avant le délai (évite « Envoi en cours… » infini).
 */
export function promiseWithTimeout(promise, ms, message = "Délai dépassé.") {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(message));
    }, ms);

    promise
      .then((value) => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        window.clearTimeout(timer);
        reject(err);
      });
  });
}

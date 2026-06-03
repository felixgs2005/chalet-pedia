/** Message bref après copie du lien (repli sans menu natif). */
export default function ShareToast({ message }) {
  if (!message) return null;
  return (
    <div className="share-toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}

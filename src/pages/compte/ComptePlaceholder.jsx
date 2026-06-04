import { Link } from "react-router-dom";

export default function ComptePlaceholder({ title }) {
  return (
    <div className="compte-reglages">
      <div className="compte-reglages__inner">
        <h1 className="compte-reglages__title">{title}</h1>
        <p className="compte-reglages__loading">Cette section sera disponible prochainement.</p>
        <Link to="/compte/reglages/" className="compte-reglages__back">
          ← Retour aux réglages
        </Link>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SUBSCRIPTION_PLANS } from "../config/subscriptionPlans";
import { planStatusLabel } from "../utils/subscriptions";

/**
 * Affichage lorsqu'un abonnement est requis.
 * variant="card" — carte type page Abonnements (photo 2)
 * variant="prompt" — bloc formulaire chalets (photo 3)
 */
export default function SubscriptionPrompt({
  plan = "chalets",
  variant = "prompt",
  showStatus = false,
  subscriptions: subscriptionsProp,
  onNavigate,
}) {
  const { subscriptions: authSubscriptions } = useAuth();
  const subscriptions = subscriptionsProp ?? authSubscriptions;
  const config = SUBSCRIPTION_PLANS[plan] || SUBSCRIPTION_PLANS.chalets;

  const actions = (
    <div className="subscription-prompt__actions">
      <Link
        to="/compte/abonnement/"
        className="btn btn-primary"
        onClick={onNavigate}
      >
        Voir les abonnements
      </Link>
      <Link to="/" className="btn btn-ghost" onClick={onNavigate}>
        Retour à l'accueil
      </Link>
    </div>
  );

  if (variant === "card") {
    return (
      <div className="subscription-prompt subscription-prompt--card">
        <article className="subscription-card subscription-prompt__card">
          <div className="subscription-card__head">
            <h2 className="subscription-card__title">{config.name}</h2>
            <p className="subscription-card__price">
              <span>{config.priceLabel}</span>
              <small>{config.periodLabel}</small>
            </p>
          </div>
          <p className="subscription-card__desc">{config.description}</p>
          <p className="subscription-card__billing">{config.billingNote}</p>
          <ul className="subscription-card__features">
            {config.features.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {showStatus ? (
            <p className="subscription-card__status">
              Statut : <strong>{planStatusLabel(subscriptions, plan)}</strong>
            </p>
          ) : null}
          {actions}
        </article>
      </div>
    );
  }

  return (
    <div className="subscription-prompt">
      <div className="subscription-prompt__card">
        <p className="kicker">Abonnement requis</p>
        <h1 className="subscription-prompt__title">{config.headline}</h1>
        <p className="subscription-prompt__text">{config.description}</p>
        <p className="subscription-prompt__price">
          <strong>{config.priceLabel}</strong> {config.periodLabel}
        </p>
        <p className="subscription-prompt__billing">{config.billingNote}</p>
        <ul className="subscription-prompt__features">
          {config.features.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {actions}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { SUBSCRIPTION_PLANS } from "../config/subscriptionPlans";

/** Message lorsqu'un abonnement est requis pour publier. */
export default function SubscriptionPrompt({ plan = "chalets" }) {
  const config = SUBSCRIPTION_PLANS[plan] || SUBSCRIPTION_PLANS.chalets;

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
        <div className="subscription-prompt__actions">
          <Link to="/compte/abonnement/" className="btn btn-primary">
            Voir les abonnements
          </Link>
          <Link to="/" className="btn btn-ghost">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

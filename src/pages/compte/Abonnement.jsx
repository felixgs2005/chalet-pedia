import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  SUBSCRIPTION_PLAN_LIST,
  SUBSCRIPTION_PLANS,
} from "../../config/subscriptionPlans";
import {
  formatSubscriptionEndDate,
  hasChaletsSubscription,
  hasServicesSubscription,
  isPlanActive,
  planStatusLabel,
} from "../../utils/subscriptions";
import {
  openBillingPortal,
  startSubscriptionCheckout,
} from "../../services/stripeCheckout";

export default function Abonnement() {
  const { currentUser, userProfile, profileLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState("");
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const subscriptions = userProfile?.subscriptions || null;
  const hasStripeCustomer = Boolean(userProfile?.stripeCustomerId);

  useEffect(() => {
    if (searchParams.get("success") === "1") {
      const plan = searchParams.get("plan");
      const label = plan ? SUBSCRIPTION_PLANS[plan]?.name : "Abonnement";
      setSuccess(`${label || "Abonnement"} activé ou en cours d'activation. Merci !`);
      setSearchParams({}, { replace: true });
    } else if (searchParams.get("canceled") === "1") {
      setError("Paiement annulé. Vous pouvez réessayer quand vous voulez.");
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSubscribe = async (planId) => {
    setError("");
    setSuccess("");
    setLoadingPlan(planId);
    try {
      await startSubscriptionCheckout(planId);
    } catch (err) {
      setError(err.message || "Impossible de démarrer le paiement.");
      setLoadingPlan("");
    }
  };

  const handlePortal = async () => {
    setError("");
    setPortalLoading(true);
    try {
      await openBillingPortal();
    } catch (err) {
      setError(err.message || "Impossible d'ouvrir le portail Stripe.");
      setPortalLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="compte-reglages">
        <div className="compte-reglages__inner">
          <p className="compte-reglages__loading">Chargement…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="compte-reglages subscription-page">
      <div className="compte-reglages__inner compte-reglages__inner--wide">
        <h1 className="compte-reglages__title">Abonnements</h1>
        <p className="subscription-page__intro">
            Pour publier sur ChaletPedia, choisissez l'abonnement correspondant à
            vos annonces. Chaque abonnement se renouvelle automatiquement chaque
            année par prélèvement sur la carte enregistrée chez Stripe. Vous pouvez
            annuler ou modifier la facturation à tout moment depuis cette page.
        </p>

        {error ? (
          <div className="compte-reglages__alert compte-reglages__alert--error" role="alert">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="compte-reglages__alert compte-reglages__alert--success" role="status">
            {success}
          </div>
        ) : null}

        <div className="subscription-grid">
          {SUBSCRIPTION_PLAN_LIST.map((plan) => {
            const active = isPlanActive(subscriptions, plan.id);
            const sub = subscriptions?.[plan.id];
            const endLabel = formatSubscriptionEndDate(sub?.currentPeriodEnd);

            return (
              <article
                key={plan.id}
                className={`subscription-card${active ? " subscription-card--active" : ""}`}
              >
                <div className="subscription-card__head">
                  <h2 className="subscription-card__title">{plan.name}</h2>
                  <p className="subscription-card__price">
                    <span>{plan.priceLabel}</span>
                    <small>{plan.periodLabel}</small>
                  </p>
                </div>
                <p className="subscription-card__desc">{plan.description}</p>
                <p className="subscription-card__billing">{plan.billingNote}</p>
                <ul className="subscription-card__features">
                  {plan.features.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="subscription-card__status">
                  Statut : <strong>{planStatusLabel(subscriptions, plan.id)}</strong>
                  {active && endLabel ? (
                    <span className="subscription-card__renew">
                      {" "}
                      — renouvellement le {endLabel}
                    </span>
                  ) : null}
                </p>
                {active ? (
                  <button
                    type="button"
                    className="btn btn-secondary subscription-card__btn"
                    disabled={!hasStripeCustomer || portalLoading}
                    onClick={handlePortal}
                  >
                    {portalLoading ? "Ouverture…" : "Gérer la facturation"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary subscription-card__btn"
                    disabled={loadingPlan === plan.id}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {loadingPlan === plan.id ? "Redirection…" : "S'abonner"}
                  </button>
                )}
              </article>
            );
          })}
        </div>

        <section className="subscription-page__links">
          <h2 className="subscription-page__links-title">Publier une annonce</h2>
          <ul className="subscription-page__link-list">
            <li>
              {hasChaletsSubscription(subscriptions) ? (
                <Link to="/submit-listing/details/">Annoncer un chalet</Link>
              ) : (
                <span className="subscription-page__locked">
                  Annoncer un chalet — abonnement chalets requis
                </span>
              )}
            </li>
            <li>
              {hasServicesSubscription(subscriptions) ? (
                <Link to="/chalets/services/?inscrire=1">Inscrire un service</Link>
              ) : (
                <span className="subscription-page__locked">
                  Inscrire un service — abonnement services requis
                </span>
              )}
            </li>
          </ul>
        </section>

        {currentUser?.email ? (
          <p className="subscription-page__account">
            Compte connecté : {currentUser.email}
          </p>
        ) : null}
      </div>
    </div>
  );
}

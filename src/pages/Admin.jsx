import React, { useEffect, useState } from "react";
import { fetchAllChalets, approveListing, rejectListing } from "../services/adminFirestore";
import "../styles/admin.css";

function listingLabel(item) {
  return item.nom || item.titre || item.slug || item.id;
}

function collectionLabel(collection) {
  return collection === "ventes" ? "À vendre" : "À louer";
}

export default function Admin() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAllChalets()
      .then((data) => {
        if (!cancelled) setListings(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function byStatut(statutMatch) {
    return listings.filter((l) => {
      const s = String(l.statut || "").toLowerCase();
      return statutMatch(s);
    });
  }

  const pending = byStatut((s) => /en[_ ]?attente|pending/.test(s));
  const active = byStatut((s) => /publi|published/.test(s) || s === "");
  const rejected = listings.length - pending.length - active.length;

  async function handleApprove(item) {
    const key = `${item._collection}-${item.id}`;
    setActionId(key);
    setError(null);
    try {
      await approveListing(item._collection, item.slug || item.id);
      setListings((prev) =>
        prev.map((p) => (p.id === item.id && p._collection === item._collection ? { ...p, statut: "publié" } : p))
      );
    } catch (e) {
      console.error(e);
      setError(e.message || String(e));
    } finally {
      setActionId(null);
    }
  }

  async function handleReject(item) {
    const key = `${item._collection}-${item.id}`;
    setActionId(key);
    setError(null);
    try {
      await rejectListing(item._collection, item.slug || item.id);
      setListings((prev) =>
        prev.map((p) => (p.id === item.id && p._collection === item._collection ? { ...p, statut: "rejeté" } : p))
      );
    } catch (e) {
      console.error(e);
      setError(e.message || String(e));
    } finally {
      setActionId(null);
    }
  }

  if (loading) {
    return (
      <div className="admin-dashboard admin-dashboard--loading">
        <div className="admin-dashboard__loader" aria-hidden="true" />
        <p>Chargement des annonces…</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__hero">
        <div className="admin-dashboard__hero-inner">
          <p className="admin-dashboard__kicker">Administration</p>
          <h1 className="admin-dashboard__title">Gestion des annonces</h1>
          <p className="admin-dashboard__subtitle">
            Validez les nouvelles soumissions et consultez les annonces publiées sur la plateforme.
          </p>
        </div>
      </header>

      <div className="admin-dashboard__body">
        {error ? (
          <div className="admin-dashboard__alert" role="alert">
            {error}
          </div>
        ) : null}

        <div className="admin-stats">
          <article className="admin-stat admin-stat--pending">
            <span className="admin-stat__value">{pending.length}</span>
            <span className="admin-stat__label">En attente</span>
          </article>
          <article className="admin-stat admin-stat--active">
            <span className="admin-stat__value">{active.length}</span>
            <span className="admin-stat__label">Publiées</span>
          </article>
          <article className="admin-stat admin-stat--total">
            <span className="admin-stat__value">{listings.length}</span>
            <span className="admin-stat__label">Total</span>
          </article>
          {rejected > 0 ? (
            <article className="admin-stat admin-stat--rejected">
              <span className="admin-stat__value">{rejected}</span>
              <span className="admin-stat__label">Refusées</span>
            </article>
          ) : null}
        </div>

        <section className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <h2 className="admin-panel__title">Annonces en attente</h2>
              <p className="admin-panel__desc">Soumissions à valider avant publication.</p>
            </div>
            <span className="admin-panel__count">{pending.length}</span>
          </div>

          {pending.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty__icon" aria-hidden="true">✓</span>
              <p>Aucune annonce en attente pour le moment.</p>
            </div>
          ) : (
            <ul className="admin-cards">
              {pending.map((item) => {
                const key = `${item._collection}-${item.id}`;
                const busy = actionId === key;
                return (
                  <li key={key} className="admin-card admin-card--pending">
                    <div className="admin-card__main">
                      <div className="admin-card__badges">
                        <span className="admin-badge admin-badge--type">
                          {collectionLabel(item._collection)}
                        </span>
                        <span className="admin-badge admin-badge--pending">En attente</span>
                      </div>
                      <h3 className="admin-card__title">{listingLabel(item)}</h3>
                      {(item.region || item.regionLabel) ? (
                        <p className="admin-card__region">{item.region || item.regionLabel}</p>
                      ) : null}
                      <p className="admin-card__slug">{item.slug || item.id}</p>
                    </div>
                    <div className="admin-card__actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--accept"
                        disabled={busy}
                        onClick={() => handleApprove(item)}
                      >
                        {busy ? "…" : "Accepter"}
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--reject"
                        disabled={busy}
                        onClick={() => handleReject(item)}
                      >
                        Refuser
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <h2 className="admin-panel__title">Annonces actives</h2>
              <p className="admin-panel__desc">Annonces visibles sur ChaletPedia.</p>
            </div>
            <span className="admin-panel__count admin-panel__count--active">{active.length}</span>
          </div>

          {active.length === 0 ? (
            <div className="admin-empty">
              <p>Aucune annonce active pour le moment.</p>
            </div>
          ) : (
            <ul className="admin-cards">
              {active.map((item) => (
                <li key={`${item._collection}-${item.id}`} className="admin-card admin-card--active">
                  <div className="admin-card__main">
                    <div className="admin-card__badges">
                      <span className="admin-badge admin-badge--type">
                        {collectionLabel(item._collection)}
                      </span>
                      <span className="admin-badge admin-badge--published">Publié</span>
                    </div>
                    <h3 className="admin-card__title">{listingLabel(item)}</h3>
                    {(item.region || item.regionLabel) ? (
                      <p className="admin-card__region">{item.region || item.regionLabel}</p>
                    ) : null}
                    <p className="admin-card__slug">{item.slug || item.id}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminListingDetailModal from "../components/admin/AdminListingDetailModal";
import {
  approveListing,
  deleteListing,
  fetchAllListingsForAdmin,
  filterPendingListings,
  filterPublishedListings,
  filterRejectedListings,
  getListingPublicPath,
  rejectListing,
} from "../services/adminFirestore";
import { getListingPrimaryImage } from "../utils/serviceImages";
import { mapFirebaseError } from "../utils/firebaseErrors";
import "../styles/admin.css";

const MODERATION_ACTIONS = {
  approve: { update: approveListing, statut: "publié" },
  reject: { update: rejectListing, statut: "rejeté" },
};

const TABS = [
  { id: "list", label: "Liste d'annonces" },
  { id: "manage", label: "Gérer annonces" },
  { id: "rejected", label: "Refusées" },
];

function listingLabel(item) {
  return item.nom || item.titre || item.slug || item.id;
}

function collectionLabel(collection) {
  if (collection === "ventes") return "À vendre";
  if (collection === "services") return "Service";
  return "À louer";
}

function matchesSearch(item, query) {
  if (!query) return true;
  const haystack = [
    listingLabel(item),
    item.region,
    item.regionLabel,
    item.localisation,
    item.adresse,
    item.slug,
    item.id,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function AdminListingThumb({ item }) {
  const src = getListingPrimaryImage(item);
  if (!src) return null;

  return (
    <div className="admin-card__media">
      <img
        src={src}
        alt=""
        className="admin-card__thumb"
        onError={(e) => {
          e.currentTarget.parentElement.hidden = true;
        }}
      />
    </div>
  );
}

export default function Admin() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [activeTab, setActiveTab] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [detailItem, setDetailItem] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAllListingsForAdmin()
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

  const published = useMemo(() => filterPublishedListings(listings), [listings]);
  const pending = useMemo(() => filterPendingListings(listings), [listings]);
  const rejected = useMemo(() => filterRejectedListings(listings), [listings]);

  const filteredPublished = useMemo(
    () => published.filter((item) => matchesSearch(item, searchQuery.trim())),
    [published, searchQuery]
  );

  async function handleModeration(item, action) {
    const { update, statut } = MODERATION_ACTIONS[action];
    const key = `${item._collection}-${item.id}`;
    setActionId(key);
    setError(null);
    try {
      await update(item);
      setListings((prev) =>
        prev.map((p) =>
          p.id === item.id && p._collection === item._collection ? { ...p, statut } : p
        )
      );
      setDetailItem(null);
    } catch (e) {
      console.error(e);
      setError(mapFirebaseError(e));
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(item) {
    const label = listingLabel(item);
    if (
      !window.confirm(
        `Supprimer définitivement « ${label} » ? Cette action est irréversible.`
      )
    ) {
      return;
    }

    const key = `${item._collection}-${item.id}`;
    setActionId(key);
    setError(null);
    try {
      await deleteListing(item);
      setListings((prev) =>
        prev.filter((p) => !(p.id === item.id && p._collection === item._collection))
      );
      setDetailItem(null);
    } catch (e) {
      console.error(e);
      setError(mapFirebaseError(e));
      window.scrollTo({ top: 0, behavior: "smooth" });
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
            Consultez les annonces publiées sur le site et modérez les nouvelles soumissions.
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
          <article className="admin-stat admin-stat--active">
            <span className="admin-stat__value">{published.length}</span>
            <span className="admin-stat__label">Sur le site</span>
          </article>
          <article className="admin-stat admin-stat--pending">
            <span className="admin-stat__value">{pending.length}</span>
            <span className="admin-stat__label">En attente</span>
          </article>
          <article className="admin-stat admin-stat--rejected">
            <span className="admin-stat__value">{rejected.length}</span>
            <span className="admin-stat__label">Refusées</span>
          </article>
          <article className="admin-stat admin-stat--total">
            <span className="admin-stat__value">{listings.length}</span>
            <span className="admin-stat__label">Total</span>
          </article>
        </div>

        <div className="admin-tabs" role="tablist" aria-label="Sections du dashboard">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`admin-tabs__btn${activeTab === tab.id ? " admin-tabs__btn--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "list" ? (
          <section className="admin-panel" role="tabpanel">
            <div className="admin-panel__head">
              <div>
                <h2 className="admin-panel__title">Liste d&apos;annonces</h2>
                <p className="admin-panel__desc">
                  Annonces publiées et visibles sur ChaletPedia.
                </p>
              </div>
              <span className="admin-panel__count admin-panel__count--active">
                {filteredPublished.length}
              </span>
            </div>

            <div className="admin-toolbar">
              <input
                type="search"
                className="admin-toolbar__search"
                placeholder="Rechercher par titre, région ou slug…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Rechercher une annonce publiée"
              />
            </div>

            {filteredPublished.length === 0 ? (
              <div className="admin-empty">
                <p>
                  {published.length === 0
                    ? "Aucune annonce publiée sur le site pour le moment."
                    : "Aucun résultat pour cette recherche."}
                </p>
              </div>
            ) : (
              <ul className="admin-cards">
                {filteredPublished.map((item) => (
                  <li key={`${item._collection}-${item.id}`} className="admin-card admin-card--active">
                    <div className="admin-card__main">
                      <div className="admin-card__badges">
                        <span className="admin-badge admin-badge--type">
                          {collectionLabel(item._collection)}
                        </span>
                        <span className="admin-badge admin-badge--published">Publiée</span>
                      </div>
                      <h3 className="admin-card__title">{listingLabel(item)}</h3>
                      {(item.region || item.regionLabel || item.localisation) ? (
                        <p className="admin-card__region">
                          {item.region || item.regionLabel || item.localisation}
                          {item.categorySlug ? ` · ${item.categorySlug}` : ""}
                        </p>
                      ) : item.categorySlug ? (
                        <p className="admin-card__region">{item.categorySlug}</p>
                      ) : null}
                      <p className="admin-card__slug">{item.slug || item.id}</p>
                    </div>
                    <div className="admin-card__actions">
                      <Link
                        to={getListingPublicPath(item)}
                        className="admin-btn admin-btn--ghost"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Voir sur le site
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : activeTab === "manage" ? (
          <section className="admin-panel" role="tabpanel">
            <div className="admin-panel__head">
              <div>
                <h2 className="admin-panel__title">Gérer annonces</h2>
                <p className="admin-panel__desc">
                  Annonces en attente de validation — consultez les détails, acceptez ou refusez.
                </p>
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
                      <AdminListingThumb item={item} />
                      <div className="admin-card__main">
                        <div className="admin-card__badges">
                          <span className="admin-badge admin-badge--type">
                            {collectionLabel(item._collection)}
                          </span>
                          <span className="admin-badge admin-badge--pending">En attente</span>
                        </div>
                        <h3 className="admin-card__title">{listingLabel(item)}</h3>
                        {(item.region || item.regionLabel || item.localisation) ? (
                          <p className="admin-card__region">
                            {item.region || item.regionLabel || item.localisation}
                            {item.categorySlug ? ` · ${item.categorySlug}` : ""}
                          </p>
                        ) : item.categorySlug ? (
                          <p className="admin-card__region">{item.categorySlug}</p>
                        ) : null}
                        <p className="admin-card__slug">{item.slug || item.id}</p>
                      </div>
                      <div className="admin-card__actions admin-card__actions--manage">
                        <button
                          type="button"
                          className="admin-btn admin-btn--ghost"
                          disabled={busy}
                          onClick={() => setDetailItem(item)}
                        >
                          Voir détails
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--accept"
                          disabled={busy}
                          onClick={() => handleModeration(item, "approve")}
                        >
                          {busy ? "…" : "Accepter"}
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--reject"
                          disabled={busy}
                          onClick={() => handleModeration(item, "reject")}
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
        ) : (
          <section className="admin-panel" role="tabpanel">
            <div className="admin-panel__head">
              <div>
                <h2 className="admin-panel__title">Annonces refusées</h2>
                <p className="admin-panel__desc">
                  Annonces rejetées — consultez les détails, republiez ou supprimez définitivement.
                </p>
              </div>
              <span className="admin-panel__count admin-panel__count--rejected">{rejected.length}</span>
            </div>

            {rejected.length === 0 ? (
              <div className="admin-empty">
                <p>Aucune annonce refusée pour le moment.</p>
              </div>
            ) : (
              <ul className="admin-cards">
                {rejected.map((item) => {
                  const key = `${item._collection}-${item.id}`;
                  const busy = actionId === key;
                  return (
                    <li key={key} className="admin-card admin-card--rejected">
                      <AdminListingThumb item={item} />
                      <div className="admin-card__main">
                        <div className="admin-card__badges">
                          <span className="admin-badge admin-badge--type">
                            {collectionLabel(item._collection)}
                          </span>
                          <span className="admin-badge admin-badge--rejected">Refusée</span>
                        </div>
                        <h3 className="admin-card__title">{listingLabel(item)}</h3>
                        {(item.region || item.regionLabel || item.localisation) ? (
                          <p className="admin-card__region">
                            {item.region || item.regionLabel || item.localisation}
                            {item.categorySlug ? ` · ${item.categorySlug}` : ""}
                          </p>
                        ) : item.categorySlug ? (
                          <p className="admin-card__region">{item.categorySlug}</p>
                        ) : null}
                        <p className="admin-card__slug">{item.slug || item.id}</p>
                      </div>
                      <div className="admin-card__actions admin-card__actions--manage">
                        <button
                          type="button"
                          className="admin-btn admin-btn--ghost"
                          disabled={busy}
                          onClick={() => setDetailItem(item)}
                        >
                          Voir détails
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--accept"
                          disabled={busy}
                          onClick={() => handleModeration(item, "approve")}
                        >
                          {busy ? "…" : "Republier"}
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--delete"
                          disabled={busy}
                          onClick={() => handleDelete(item)}
                        >
                          {busy ? "…" : "Supprimer"}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}
      </div>

      <AdminListingDetailModal
        item={detailItem}
        open={Boolean(detailItem)}
        onClose={() => setDetailItem(null)}
      />
    </div>
  );
}

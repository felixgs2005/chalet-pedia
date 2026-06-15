import React, { useEffect, useState } from "react";
import { fetchAllChalets, approveListing, rejectListing } from "../services/adminFirestore";
import "../styles/admin.css";

export default function Admin() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    return () => (cancelled = true);
  }, []);

  function byStatut(statutMatch) {
    return listings.filter((l) => {
      const s = String(l.statut || "").toLowerCase();
      return statutMatch(s);
    });
  }

  const pending = byStatut((s) => /en[_ ]?attente|pending/.test(s));
  const active = byStatut((s) => /publi|published/.test(s) || s === "");

  async function handleApprove(item) {
    try {
      await approveListing(item._collection, item.slug || item.id);
      setListings((prev) => prev.map((p) => (p.id === item.id ? { ...p, statut: "publié" } : p)));
    } catch (e) {
      console.error(e);
      setError(e.message || String(e));
    }
  }

  async function handleReject(item) {
    try {
      await rejectListing(item._collection, item.slug || item.id);
      setListings((prev) => prev.map((p) => (p.id === item.id ? { ...p, statut: "rejeté" } : p)));
    } catch (e) {
      console.error(e);
      setError(e.message || String(e));
    }
  }

  if (loading) return <div className="admin-page__loading">Chargement des annonces…</div>;
  if (error) return <div className="admin-page__error">Erreur: {error}</div>;

  return (
    <div className="admin-page">
      <h1>Administration — Annonces</h1>

      <section className="admin-section admin-section--pending">
        <h2>Annonces en attente</h2>
        {pending.length === 0 && <div className="admin-empty">Aucune annonce en attente.</div>}
        <ul className="admin-list">
          {pending.map((p) => (
            <li key={p.id} className="admin-list__item">
              <div className="admin-list__meta">
                <div>
                  <strong className="admin-list__title">{p.nom || p.titre || p.slug || p.id}</strong>
                  <div className="admin-list__region">{p.region || p.regionLabel}</div>
                  <div className="admin-list__slug">{p.slug || p.id}</div>
                </div>
                <div className="admin-actions">
                  <button className="btn btn-accept" onClick={() => handleApprove(p)}>Accepter</button>
                  <button className="btn btn-reject" onClick={() => handleReject(p)}>Refuser</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-section admin-section--active">
        <h2>Annonces actives</h2>
        {active.length === 0 && <div className="admin-empty">Aucune annonce active.</div>}
        <ul className="admin-list">
          {active.map((p) => (
            <li key={p.id} className="admin-list__item">
              <div className="admin-list__meta">
                <div>
                  <strong className="admin-list__title">{p.nom || p.titre || p.slug || p.id}</strong>
                  <div className="admin-list__region">{p.region || p.regionLabel}</div>
                  <div className="admin-list__slug">{p.slug || p.id}</div>
                </div>
                <div>
                  <span className="admin-status">Publié</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { fetchAllChalets, approveListing, rejectListing } from "../services/adminFirestore";

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

  if (loading) return <div style={{ padding: 40 }}>Chargement des annonces…</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>Erreur: {error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Administration — Annonces</h1>

      <section style={{ marginTop: 24 }}>
        <h2>Annonces en attente</h2>
        {pending.length === 0 && <div>Aucune annonce en attente.</div>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {pending.map((p) => (
            <li key={p.id} style={{ padding: 12, borderBottom: "1px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{p.nom || p.titre || p.slug || p.id}</strong>
                  <div style={{ fontSize: 13, color: "#666" }}>{p.region || p.regionLabel}</div>
                  <div style={{ fontSize: 12, color: "#444" }}>{p.slug || p.id}</div>
                </div>
                <div>
                  <button onClick={() => handleApprove(p)} style={{ marginRight: 8 }}>Accepter</button>
                  <button onClick={() => handleReject(p)} style={{ color: "#900" }}>Refuser</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Annonces actives</h2>
        {active.length === 0 && <div>Aucune annonce active.</div>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {active.map((p) => (
            <li key={p.id} style={{ padding: 12, borderBottom: "1px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{p.nom || p.titre || p.slug || p.id}</strong>
                  <div style={{ fontSize: 13, color: "#666" }}>{p.region || p.regionLabel}</div>
                  <div style={{ fontSize: 12, color: "#444" }}>{p.slug || p.id}</div>
                </div>
                <div>
                  <span style={{ fontSize: 13, color: "#0a0" }}>Publié</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

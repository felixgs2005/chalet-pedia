import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { saveUserProfile } from "../services/userProfileFirestore";

export default function DevCreateAdmin() {
  const { signup, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await signup(email, password);
      const uid = res.user.uid;
      await saveUserProfile(uid, { membre: "Administrateur", role: "admin", courriel: email });
      setMessage("Compte administrateur créé. Vous êtes connecté.");
    } catch (err) {
      setMessage(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Dev — Créer un compte admin</h1>
      <p style={{ color: "#a00" }}>Page de développement : supprimer en production.</p>
      <form onSubmit={handleCreate} style={{ maxWidth: 480 }}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <label>Mot de passe</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="text" required />
        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>Créer admin</button>
        </div>
      </form>
      {message && <div style={{ marginTop: 12 }}>{message}</div>}
    </div>
  );
}

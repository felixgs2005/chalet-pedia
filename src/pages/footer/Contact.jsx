// src/pages/Contact.jsx
// ============================================================
// PAGE CONTACT (/contact/)
// Formulaire de contact pour support, partenariats et questions.
// ============================================================

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    sujet: "support",
    message: "",
    consentement: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const sujetOptions = [
    { value: "support", label: "Support technique" },
    { value: "proprietaire", label: "Annoncer un chalet" },
    { value: "partenariat", label: "Demande de partenariat" },
    { value: "publicite", label: "Publicité" },
    { value: "signalement", label: "Signalement d'annonce" },
    { value: "autre", label: "Autre" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        nom: "",
        email: "",
        sujet: "support",
        message: "",
        consentement: false,
      });
      
      // Réinitialiser après 5 secondes
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: "✉️",
      titre: "Support technique",
      detail: "support@chaletpedia.com",
      desc: "Problèmes techniques, bugs, assistance utilisateur",
    },
    {
      icon: "🏠",
      titre: "Annonces & propriétaires",
      detail: "annonces@chaletpedia.com",
      desc: "Pour annoncer votre chalet ou gérer vos annonces",
    },
    {
      icon: "🤝",
      titre: "Partenariats",
      detail: "partenariats@chaletpedia.com",
      desc: "Collaborations, intégrations, projets spéciaux",
    },
    {
      icon: "📢",
      titre: "Publicité",
      detail: "publicite@chaletpedia.com",
      desc: "Espaces publicitaires, collaborations médias",
    },
  ];

  return (
    <div className="contact-page">
      {/* ── HERO ── */}
      <section className="contact-hero">
        <div className="contact-hero-kicker">BESOIN D'AIDE · CHALETPEDIA</div>
        <h1 className="contact-hero-title">Contactez-nous</h1>
        <p className="contact-hero-sub">
          Nous sommes là pour vous aider. Écrivez-nous et notre équipe vous
          répondra dans les plus brefs délais.
        </p>
      </section>

      {/* ── CONTENU ── */}
      <div className="contact-content">
        <div className="contact-grid">
          {/* Colonne gauche : Informations */}
          <div className="contact-info-col">
            <div className="contact-info-card">
              <h2 className="contact-info-title">Nos coordonnées</h2>
              <p className="contact-info-desc">
                Selon votre besoin, choisissez le bon contact pour une réponse
                plus rapide.
              </p>

              <div className="contact-info-list">
                {contactInfo.map((info) => (
                  <div key={info.titre} className="contact-info-item">
                    <div className="contact-info-icon">{info.icon}</div>
                    <div className="contact-info-detail">
                      <h3>{info.titre}</h3>
                      <a
                        href={`mailto:${info.detail}`}
                        className="contact-info-email"
                      >
                        {info.detail}
                      </a>
                      <p>{info.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-info-note">
                <strong>Heures d'ouverture :</strong> Lundi à vendredi, 9h à
                17h. Réponse sous 24h ouvrables.
              </div>
            </div>

            <div className="contact-urgent-card">
              <div className="contact-urgent-icon" aria-hidden="true">🚨</div>
              <h3 className="contact-urgent-title">Urgence sécurité</h3>
              <p className="contact-urgent-desc">
                Si vous suspectez une fraude ou un danger immédiat lié à une
                annonce, contactez-nous immédiatement.
              </p>
              <a
                href="mailto:urgence@chaletpedia.com"
                className="contact-urgent-btn"
              >
                Signaler une urgence →
              </a>
            </div>
          </div>

          {/* Colonne droite : Formulaire */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              <h2 className="contact-form-title">Envoyez-nous un message</h2>
              <p className="contact-form-desc">
                Remplissez le formulaire ci-dessous et nous vous répondrons
                rapidement.
              </p>

              {submitStatus === "success" && (
                <div className="contact-success">
                  <div className="contact-success-icon">✓</div>
                  <div className="contact-success-text">
                    <strong>Message envoyé !</strong>
                    <p>
                      Nous vous répondrons dans les 24h ouvrables. Merci pour
                      votre message.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nom" className="form-label">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Adresse email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="sujet" className="form-label">
                    Sujet *
                  </label>
                  <select
                    id="sujet"
                    name="sujet"
                    value={formData.sujet}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    {sujetOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="form-textarea"
                    placeholder="Décrivez votre demande ou question..."
                    rows="6"
                  />
                </div>

                <div className="form-group">
                  <label className="form-checkbox">
                    <input
                      type="checkbox"
                      name="consentement"
                      checked={formData.consentement}
                      onChange={handleChange}
                      required
                    />
                    <span>
                      J'accepte que mes données soient traitées conformément à
                      la politique de confidentialité de ChaletPedia. *
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="form-submit"
                  disabled={isSubmitting || !formData.consentement}
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer le message →"}
                </button>
              </form>
            </div>

            <div className="contact-form-note">
              <p>
                <strong>Note :</strong> Pour les demandes de réservation ou les
                questions sur un chalet spécifique, contactez directement le
                propriétaire via la fiche du chalet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA FAQ ── */}
      <section className="contact-faq-cta">
        <div className="contact-faq-cta-inner">
          <h2 className="contact-faq-title">Besoin d'une réponse rapide ?</h2>
          <p className="contact-faq-sub">
            Consultez notre FAQ pour trouver des réponses aux questions les plus
            fréquentes.
          </p>
          <a href="/faq/" className="contact-faq-btn">
            Voir la FAQ →
          </a>
        </div>
      </section>
    </div>
  );
}

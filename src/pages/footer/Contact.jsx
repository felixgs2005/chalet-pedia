// src/pages/Contact.jsx
// ============================================================
// PAGE CONTACT (/contact/)
// Formulaire de contact pour support, partenariats et questions.
// ============================================================

import { useState } from "react";
import { submitContactForm } from "../../services/submitContactForm";
import ContactFormFields from "../../components/ContactFormFields";

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
  const [submitError, setSubmitError] = useState("");

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
    setSubmitError("");
    setSubmitStatus(null);

    try {
      await submitContactForm(formData);
      setSubmitStatus("success");
      setFormData({
        nom: "",
        email: "",
        sujet: "support",
        message: "",
        consentement: false,
      });
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (err) {
      setSubmitError(
        err.message || "Impossible d'envoyer le message. Réessayez plus tard."
      );
    } finally {
      setIsSubmitting(false);
    }
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

              {submitError && (
                <div className="contact-success" style={{ borderColor: "#c0392b", background: "#fdecea" }}>
                  <div className="contact-success-text">
                    <strong>Erreur</strong>
                    <p>{submitError}</p>
                  </div>
                </div>
              )}

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
                <ContactFormFields formData={formData} onChange={handleChange} />

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

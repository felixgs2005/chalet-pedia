// src/pages/FAQ.jsx
// ============================================================
// PAGE FAQ (/faq/)
// Foire aux questions pour les locataires et propriétaires.
// ============================================================

import { useState } from "react";

const faqSections = [
  {
    id: "locataires",
    titre: "Pour les locataires",
    questions: [
      {
        q: "Comment réserver un chalet sur ChaletPedia ?",
        r: "Parcourez nos chalets disponibles, cliquez sur celui qui vous intéresse et suivez le processus de réservation. Vous pouvez contacter directement le propriétaire via notre messagerie interne pour poser vos questions avant de réserver.",
      },
      {
        q: "Quels sont les modes de paiement acceptés ?",
        r: "Cela dépend du propriétaire. La plupart acceptent les virements bancaires, PayPal ou Stripe. Le mode de paiement est indiqué sur la fiche de chaque chalet. ChaletPedia ne prend pas de commission sur les réservations.",
      },
      {
        q: "Puis-je annuler ma réservation ?",
        r: "Les conditions d'annulation sont définies par chaque propriétaire et indiquées clairement dans la fiche du chalet. Nous recommandons de toujours vérifier ces conditions avant de réserver.",
      },
      {
        q: "Les chalets sont-ils vérifiés ?",
        r: "Oui, tous les chalets sont vérifiés avant publication. Nous exigeons un numéro CITQ valide et des photos authentiques. ChaletPedia procède également à des vérifications manuelles.",
      },
      {
        q: "Que faire en cas de problème pendant mon séjour ?",
        r: "Contactez d'abord le propriétaire via les coordonnées fournies. Si le problème persiste, écrivez-nous à support@chaletpedia.com avec les détails de votre réservation.",
      },
    ],
  },
  {
    id: "proprietaires",
    titre: "Pour les propriétaires",
    questions: [
      {
        q: "Comment annoncer mon chalet sur ChaletPedia ?",
        r: "Cliquez sur 'Annoncer mon chalet' en haut de la page, remplissez le formulaire avec les photos et informations requises, et soumettez votre fiche. Notre équipe la validera sous 48h.",
      },
      {
        q: "Quel est le coût pour annoncer mon chalet ?",
        r: "L'annonce de base est gratuite. Nous offrons des options payantes pour booster votre annonce (meilleure visibilité, mise en avant sur la page d'accueil). Aucune commission sur les réservations.",
      },
      {
        q: "Quels documents dois-je fournir ?",
        r: "Un numéro CITQ valide, une preuve de propriété (ou autorisation de location), et des photos de qualité montrant toutes les pièces et équipements.",
      },
      {
        q: "Comment gérer les réservations ?",
        r: "Vous recevrez les demandes directement via notre messagerie. Vous pouvez accepter ou refuser les réservations, définir vos propres conditions et calendrier de disponibilité.",
      },
      {
        q: "Comment optimiser mes chances de location ?",
        r: "Mettez des photos professionnelles, décrivez bien votre chalet, proposez un prix compétitif, et répondez rapidement aux demandes. Consultez nos astuces dans la section Académie.",
      },
    ],
  },
  {
    id: "generales",
    titre: "Questions générales",
    questions: [
      {
        q: "ChaletPedia prend-il une commission ?",
        r: "Non, ChaletPedia ne prend aucune commission sur les réservations. L'annonce de base est gratuite. Nous offrons des services optionnels payants pour la visibilité.",
      },
      {
        q: "Comment contacter ChaletPedia ?",
        r: "Par email à info@chaletpedia.com ou via notre formulaire de contact. Notre équipe répond sous 24h ouvrables.",
      },
      {
        q: "Mes données personnelles sont-elles protégées ?",
        r: "Oui, nous respectons la loi 25 sur la protection des renseignements personnels. Consultez notre politique de confidentialité pour plus de détails.",
      },
      {
        q: "ChaletPedia est-il disponible en anglais ?",
        r: "Actuellement, la plateforme est uniquement en français. Nous travaillons sur une version anglaise pour l'année prochaine.",
      },
      {
        q: "Comment signaler un problème ou une fraude ?",
        r: "Contactez-nous immédiatement à support@chaletpedia.com avec les détails. Nous enquêterons et prendrons les mesures nécessaires.",
      },
    ],
  },
];

export default function FAQ() {
  const [openSections, setOpenSections] = useState({});
  const [openQuestions, setOpenQuestions] = useState({});

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const toggleQuestion = (sectionId, questionIndex) => {
    const key = `${sectionId}-${questionIndex}`;
    setOpenQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="faq-page">
      {/* ── HERO ── */}
      <section className="faq-hero">
        <div className="faq-hero-kicker">SUPPORT · CHALETPEDIA</div>
        <h1 className="faq-hero-title">
          Foire aux <span className="faq-hero-accent">Questions</span>
        </h1>
        <p className="faq-hero-sub">
          Réponses rapides aux questions les plus fréquentes sur la location de
          chalets au Québec.
        </p>
      </section>

      {/* ── CONTENU ── */}
      <section className="faq-content">
        <div className="faq-content-inner">
          <div className="faq-search-wrap">
            <input
              type="search"
              placeholder="Rechercher une question..."
              className="faq-search-input"
            />
            <button type="button" className="faq-search-btn">
              🔍
            </button>
          </div>

          <div className="faq-sections">
            {faqSections.map((section) => (
              <div key={section.id} className="faq-section">
                <button
                  className="faq-section-header"
                  onClick={() => toggleSection(section.id)}
                >
                  <h2 className="faq-section-title">{section.titre}</h2>
                  <span className="faq-section-toggle">
                    {openSections[section.id] ? "−" : "+"}
                  </span>
                </button>
                
                {(openSections[section.id] === undefined || openSections[section.id]) && (
                  <div className="faq-section-content">
                    {section.questions.map((item, idx) => {
                      const key = `${section.id}-${idx}`;
                      const isOpen = openQuestions[key];
                      return (
                        <div key={key} className="faq-item">
                          <button
                            className="faq-question"
                            onClick={() => toggleQuestion(section.id, idx)}
                          >
                            <span className="faq-q-mark" aria-hidden="true">?</span>
                            <span className="faq-q-text">{item.q}</span>
                            <span className="faq-chevron">
                              {isOpen ? "−" : "+"}
                            </span>
                          </button>
                          {isOpen && (
                            <div className="faq-answer">
                              <p>{item.r}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── CTA CONTACT ── */}
          <div className="faq-contact-cta">
            <div className="faq-contact-icon" aria-hidden="true">✉️</div>
            <h3 className="faq-contact-title">Toujours bloqué ?</h3>
            <p className="faq-contact-sub">
              Si vous ne trouvez pas la réponse à votre question, n'hésitez pas
              à nous contacter directement. Notre équipe répond sous 24h.
            </p>
            <a href="mailto:info@chaletpedia.com" className="faq-contact-btn">
              Nous contacter →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// src/pages/footer/APropos.jsx
// ============================================================
// PAGE À PROPOS (/a-propos/)
// Présentation de ChaletPedia, sa mission, ses valeurs et équipe.
// ============================================================

import { Link } from "react-router-dom";

const VALEURS = [
  {
    icon: "🎯",
    titre: "Simplifier",
    desc: "Rendre accessible la location de chalets pour tous, propriétaires comme locataires.",
  },
  {
    icon: "🤝",
    titre: "Connecter",
    desc: "Créer des liens authentiques entre passionnés de chalets et voyageurs en quête d'aventure.",
  },
  {
    icon: "🌟",
    titre: "Inspirer",
    desc: "Partager connaissances, astuces et expériences pour transformer chaque séjour en souvenir.",
  },
  {
    icon: "🌿",
    titre: "Respecter",
    desc: "Promouvoir le tourisme responsable et la préservation des terroirs québécois.",
  },
];

const EQUIPE = [
  {
    nom: "Nicolas Roy",
    role: "Fondateur & Visionnaire",
    bio: "Passionné par les chalets depuis l'enfance, Nicolas a créé ChaletPedia pour démocratiser l'accès aux plus beaux chalets du Québec.",
  },
  {
    nom: "Marie-Claire Hébert",
    role: "Directrice Marketing",
    bio: "Experte en stratégie numérique, Marie-Claire pilote la croissance de la plateforme et forge les partenariats clés.",
  },
  {
    nom: "Julien Deschamps",
    role: "Responsable Développement",
    bio: "Développeur full-stack passionné, Julien améliore constantement l'expérience utilisateur et la performance.",
  },
];

const JALONS = [
  { an: "2020", titre: "Naissance de l'idée", desc: "Nicolas rêve de simplifier la location de chalets au Québec." },
  { an: "2021", titre: "Lancement officiel", desc: "ChaletPedia accueille ses premiers 50 chalets et 1 000 utilisateurs." },
  { an: "2022", titre: "Première expansion", desc: "La plateforme atteint 5 000 chalets et 50 000 visites mensuelles." },
  { an: "2023", titre: "Services premium", desc: "Lancement des formations, promotions et services marketing." },
  { an: "2024", titre: "Devenir la référence", desc: "ChaletPedia s'impose comme la plateforme #1 des chalets québécois." },
  { an: "2025", titre: "Croissance continue", desc: "Expansion vers les services et consolidation de l'écosystème." },
];

const STATS = [
  { num: "15 000+", label: "chalets listés" },
  { num: "250 000+", label: "visites mensuelles" },
  { num: "50+", label: "guides et ressources" },
  { num: "2 000+", label: "propriétaires satisfaits" },
];

export default function APropos() {
  return (
    <div className="apropos-page">

      {/* ── HERO ── */}
      <section className="apropos-hero">
        <div className="apropos-hero-inner">
          <div className="apropos-hero-kicker">QUI SOMMES-NOUS</div>
          <h1 className="apropos-hero-title">ChaletPedia</h1>
          <p className="apropos-hero-sub">
            L'écosystème complet pour louer, découvrir et sublimer les chalets
            du Québec. Une communauté de passionnés, une plateforme conçue pour
            l'authenticité.
          </p>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="apropos-mission">
        <div className="apropos-mission-inner">
          <h2 className="apropos-section-title">Notre mission</h2>
          <div className="apropos-mission-text">
            <p>
              ChaletPedia existe pour transformer la façon dont les Québécois
              découvrent et louent des chalets. Nous croyons que chaque location
              devrait être simple, transparente et sécurisée.
            </p>
            <p>
              Depuis nos débuts, nous construisons une plateforme qui met au cœur
              les besoins des propriétaires et des locataires, en offrant outils,
              formations et ressources pour rendre chaque séjour inoubliable.
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="apropos-stats">
        {STATS.map((s) => (
          <div key={s.label} className="apropos-stat">
            <span className="apropos-stat-num">{s.num}</span>
            <span className="apropos-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── VALEURS ── */}
      <section className="apropos-values">
        <div className="apropos-values-inner">
          <h2 className="apropos-section-title">Nos valeurs</h2>
          <p className="apropos-section-sub">
            Quatre piliers qui guident nos décisions et notre croissance.
          </p>
          <div className="apropos-values-grid">
            {VALEURS.map((v) => (
              <div key={v.titre} className="apropos-value-card">
                <div className="apropos-value-icon">{v.icon}</div>
                <h3 className="apropos-value-titre">{v.titre}</h3>
                <p className="apropos-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ÉQUIPE ── */}
      <section className="apropos-team">
        <div className="apropos-team-inner">
          <h2 className="apropos-section-title">L'équipe derrière ChaletPedia</h2>
          <p className="apropos-section-sub">
            Des passionnés qui travaillent quotidiennement pour sublimer votre
            expérience de location.
          </p>
          <div className="apropos-team-grid">
            {EQUIPE.map((member) => (
              <div key={member.nom} className="apropos-member-card">
                <div className="apropos-member-avatar">
                  {member.nom
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="apropos-member-nom">{member.nom}</h3>
                <div className="apropos-member-role">{member.role}</div>
                <p className="apropos-member-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHRONOLOGIE ── */}
      <section className="apropos-timeline">
        <div className="apropos-timeline-inner">
          <h2 className="apropos-section-title">Notre histoire</h2>
          <p className="apropos-section-sub">
            Retracez les moments clés qui ont façonné ChaletPedia.
          </p>
          <div className="apropos-timeline-list">
            {JALONS.map((jalon, idx) => (
              <div key={jalon.an} className="apropos-timeline-item">
                <div className="apropos-timeline-dot" />
                <div className="apropos-timeline-year">{jalon.an}</div>
                <div className="apropos-timeline-content">
                  <h3 className="apropos-timeline-titre">{jalon.titre}</h3>
                  <p className="apropos-timeline-desc">{jalon.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISION ── */}
      <section className="apropos-vision">
        <div className="apropos-vision-inner">
          <h2 className="apropos-vision-title">Notre vision pour demain</h2>
          <div className="apropos-vision-content">
            <p>
              ChaletPedia ne se contente pas de faire la location facile —
              nous bâtissons un écosystème complet où propriétaires et locataires
              peuvent apprendre, grandir et prospérer ensemble.
            </p>
            <p>
              Nous rêvons d'un Québec où chaque chalet est une fenêtre ouverte
              sur l'authenticité, où chaque séjour crée des souvenirs
              inoubliables, et où chaque propriétaire peut vivre de sa passion.
            </p>
            <p>
              C'est notre promesse. C'est votre ChaletPedia.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA CONTACT ── */}
      <section className="apropos-contact-cta">
        <div className="apropos-contact-cta-inner">
          <h2 className="apropos-contact-title">Rejoignez la communauté</h2>
          <p className="apropos-contact-sub">
            Que vous soyez propriétaire, locataire ou simplement curieux,
            contactez-nous. Nous aimerions vous connaître.
          </p>
          <Link to="/contact/" className="apropos-contact-btn">
            Nous contacter →
          </Link>
        </div>
      </section>

    </div>
  );
}

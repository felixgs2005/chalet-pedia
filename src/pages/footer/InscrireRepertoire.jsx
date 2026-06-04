// src/pages/footer/InscrireRepertoire.jsx
// Page : /inscrivez-votre-entreprise-dans-le-repertoire/
// Contenu aligné sur chaletpedia.com/inscrivez-votre-entreprise-dans-le-repertoire/

import { Link } from "react-router-dom";

const STATS = [
  { num: "2,3 M", label: "visiteurs annuels" },
  { num: "65 000", label: "abonnés Facebook" },
  { num: "5 min", label: "pour publier votre annonce" },
  { num: "47 $", label: "par année seulement" },
];

const AVANTAGES = [
  {
    icon: "📈",
    titre: "Augmenter vos revenus",
    desc: "Touchez des propriétaires et des vacanciers qui cherchent activement vos services autour des chalets.",
  },
  {
    icon: "👁️",
    titre: "Grande visibilité",
    desc: "Répertoire de services pour chalets au Québec, fréquenté par une audience qualifiée toute l'année.",
  },
  {
    icon: "📱",
    titre: "Populaire sur les réseaux",
    desc: "Présence sur nos médias sociaux pour amplifier la portée de votre entreprise auprès de la communauté.",
  },
  {
    icon: "⚡",
    titre: "Inscription rapide",
    desc: "Votre annonce en ligne en quelques minutes, modifiable facilement par la suite.",
  },
];

const POURQUOI = [
  {
    titre: "Visibilité ciblée",
    desc: "Notre site est fréquenté par des passionnés de chalets, des vacanciers et des propriétaires. Vous vous positionnez devant un public qualifié, avide de découvrir vos services.",
  },
  {
    titre: "Accès à de nouvelles opportunités",
    desc: "Constructeurs, fournisseurs d'équipements, experts en aménagement : atteignez des clients qui cherchent précisément ce que vous proposez.",
  },
  {
    titre: "Annuaire facile à naviguer",
    desc: "Interface conviviale : les visiteurs trouvent vos informations et prennent contact sans effort supplémentaire.",
  },
  {
    titre: "Mise en avant de votre expertise",
    desc: "Partagez vos réalisations, compétences et valeurs pour inspirer confiance auprès de futurs clients.",
  },
  {
    titre: "Options d'inscription flexibles",
    desc: "Plusieurs formules adaptées à votre entreprise et à votre budget, avec bannières et contenus supplémentaires si désiré.",
  },
];

export default function InscrireRepertoire() {
  return (
    <div className="promo-page inscrire-page">
      <section className="promo-hero">
        <div className="promo-hero-inner">
          <div className="promo-hero-kicker">RÉPERTOIRE · CHALETPEDIA</div>
          <h1 className="promo-hero-title">Inscrivez votre entreprise</h1>
          <p className="promo-hero-sub">
            Affichez vos services de construction, d&apos;ameublement ou d&apos;entretien ménager
            pour chalets dans notre répertoire — pour aussi peu que{" "}
            <strong>47 $ par année</strong>. Inscription facile et rapide, service attentionné et
            conseils personnalisés.
          </p>
          <p className="inscrire-hero-login">
            Déjà un compte ? <Link to="/auth">Connectez-vous</Link>
          </p>
          <Link to="/chalets/services/?inscrire=1" className="promo-hero-cta">
            Publier mon annonce →
          </Link>
        </div>
      </section>

      <div className="promo-stats-band">
        {STATS.map((s) => (
          <div key={s.label} className="promo-stat">
            <span className="promo-stat-num">{s.num}</span>
            <span className="promo-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <section className="inscrire-intro">
        <div className="inscrire-intro-inner">
          <p>
            Dans un monde où la concurrence est de plus en plus féroce, il est essentiel de se
            démarquer et de toucher le public approprié. Vous êtes une entreprise de services, un
            constructeur ou un fournisseur travaillant autour des chalets ? Ne laissez pas passer
            cette occasion d&apos;accroître votre visibilité et d&apos;attirer de nouveaux clients.
          </p>
        </div>
      </section>

      <section className="promo-strategy">
        <div className="promo-strategy-inner">
          <div className="promo-strategy-text">
            <div className="promo-strategy-kicker">Pourquoi vous inscrire ?</div>
            <h2 className="promo-strategy-title">Notre annuaire de services</h2>
            <p className="promo-strategy-desc">
              Rejoindre ChaletPedia, c&apos;est vous donner les moyens d&apos;étendre votre réseau
              et de transformer vos prospects en clients fidèles.
            </p>
            <ol className="inscrire-pourquoi-list">
              {POURQUOI.map((item, idx) => (
                <li key={item.titre}>
                  <strong>
                    {idx + 1}. {item.titre}
                  </strong>
                  <span>{item.desc}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="promo-strategy-atouts">
            {AVANTAGES.map((a) => (
              <div key={a.titre} className="promo-atout-card">
                <span className="promo-atout-icon">{a.icon}</span>
                <div>
                  <h3 className="promo-atout-titre">{a.titre}</h3>
                  <p className="promo-atout-desc">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="inscrire-categories">
        <div className="inscrire-categories-inner">
          <h2 className="promo-services-title">Catégories du répertoire</h2>
          <p className="promo-services-sub">
            Choisissez la catégorie qui correspond à votre activité et rejoignez les entreprises
            déjà référencées.
          </p>
          <div className="inscrire-categories-grid">
            <Link to="/chalets/construction/" className="inscrire-cat-card">
              <span className="inscrire-cat-label">Construction</span>
              <span className="inscrire-cat-desc">Rénovation, agrandissement, design</span>
            </Link>
            <Link to="/chalets/decoration/" className="inscrire-cat-card">
              <span className="inscrire-cat-label">Décoration</span>
              <span className="inscrire-cat-desc">Mobilier, aménagement, style</span>
            </Link>
            <Link to="/chalets/entretien/" className="inscrire-cat-card">
              <span className="inscrire-cat-label">Entretien</span>
              <span className="inscrire-cat-desc">Ménage, entretien saisonnier</span>
            </Link>
            <Link to="/chalets/multimedia/" className="inscrire-cat-card">
              <span className="inscrire-cat-label">Multimédia</span>
              <span className="inscrire-cat-desc">Photo, vidéo, marketing visuel</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="inscrire-feedback">
        <div className="inscrire-feedback-inner">
          <span className="inscrire-feedback-emoji" aria-hidden="true">
            👋
          </span>
          <h2 className="inscrire-feedback-title">Vous avez des commentaires ?</h2>
          <p className="inscrire-feedback-desc">
            Aidez-nous à améliorer la précision de nos résultats et n&apos;hésitez pas à nous
            donner des idées pour de futures améliorations.
          </p>
          <a href="mailto:info@chaletpedia.com" className="inscrire-feedback-link">
            Donnez votre avis →
          </a>
        </div>
      </section>

      <section className="promo-final-cta">
        <div className="promo-final-inner">
          <div className="promo-final-kicker">PRÊT À FAIRE LE GRAND SAUT ?</div>
          <h2 className="promo-final-title">Publiez vos services pour chalets</h2>
          <p className="promo-final-sub">
            Inscrivez dès aujourd&apos;hui votre entreprise dans notre annuaire. Ensemble, faisons
            de cette saison un succès pour votre entreprise — rejoignez la communauté ChaletPedia
            et donnez un coup de fouet à votre visibilité.
          </p>
          <Link to="/chalets/services/?inscrire=1" className="promo-final-btn">
            Publier mon annonce →
          </Link>
        </div>
      </section>
    </div>
  );
}

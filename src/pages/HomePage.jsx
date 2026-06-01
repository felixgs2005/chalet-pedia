// src/pages/HomePage.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ChaletCard from "../components/ChaletCard";
import { chalets } from "../data/chalets";
import { articles } from "../data/articles";

// --- FAQ Data ---
const faqLocataires = [
  { q: "Y a-t-il vraiment 0 % de commission pour moi ?", a: "Oui. Le prix affiché par le propriétaire est exactement celui que vous payez. Chaletpedia ne prélève aucun frais sur votre réservation, contrairement à Airbnb ou Vrbo qui ajoutent 15 à 20 % de frais de service." },
  { q: "Comment se fait le paiement du chalet ?", a: "Le paiement se fait directement au propriétaire, selon la méthode qu'il propose : virement Interac, dépôt ou plateforme de paiement sécurisée. Aucune transaction ne transite par Chaletpedia." },
  { q: "Les chalets sont-ils vérifiés ?", a: "Chaque annonce est validée par notre équipe avant publication. Nous vérifions l'identité du propriétaire, l'existence réelle du chalet et la qualité des photos." },
];
const faqProprietaires = [
  { q: "Combien coûte une annonce ?", a: "L'inscription d'un chalet est entièrement gratuite. Vous pouvez ensuite choisir un forfait Pro optionnel pour augmenter votre visibilité. Les forfaits commencent à environ 19 $ par mois." },
  { q: "Combien Chaletpedia prend-il sur mes revenus ?", a: "Zéro. Aucune commission sur vos réservations. Vous gardez 100 % du prix que vous fixez." },
  { q: "Comment fonctionne la gestion des réservations ?", a: "Vous gardez le contrôle total. Les locataires vous contactent directement, vous fixez vos disponibilités, vos tarifs et vos conditions d'annulation." },
];

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span className="faq-q-text">{item.q}</span>
        <span className={`faq-toggle${open ? " open" : ""}`}>{open ? "−" : "+"}</span>
      </button>
      {open && <div className="faq-answer">{item.a}</div>}
    </div>
  );
}

// --- Counter animation ---
function AnimatedNumber({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const duration = 1400;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          setVal(Math.floor(progress * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function HomePage() {
  const [faqTab, setFaqTab] = useState("locataires");
  const coupsDeCoeur = chalets.slice(0, 3);
  const favoris = chalets.filter((c) => !c.isFavori).slice(0, 6);

  return (
    <div>
      {/* HERO VIDEO */}
      <div className="hero-video-wrap">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/video/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay" />
      </div>

      {/* HERO */}
      <div className="hero">
        <h1 className="hero-title">
          Votre chalet de rêve <span className="accent">à 0 % de commission.</span>
        </h1>
        <p className="hero-sub">
          Directement auprès du propriétaire. <strong>Sans intermédiaire.</strong>
        </p>

        {/* SEARCH BAR */}
        <div className="search-bar">
          <div className="search-field">
            <div className="label">Catégorie</div>
            <select>
              <option>Toutes les catégories</option>
              <option>Chalets à louer</option>
              <option>Chalets à vendre</option>
            </select>
          </div>
          <div className="search-field" style={{ borderRight: "none" }}>
            <div className="label">Rechercher</div>
            <input type="text" placeholder="Région, localisation..." />
          </div>
          <button className="search-btn">⌕ Rechercher</button>
        </div>

        {/* CHIPS */}
        <div className="hero-chips">
          {[
            { icon: "🏔", label: "Près du ski" },
            { icon: "💦", label: "Bord de l'eau" },
            { icon: "♨", label: "Avec spa" },
            { icon: "🐕", label: "Animaux ok" },
            { icon: "🔥", label: "Avec foyer" },
            { icon: "🏠", label: "Style A-frame" },
            { icon: "✨", label: "Luxe" },
          ].map((c) => (
            <div className="chip" key={c.label}>
              <span className="chip-icon">{c.icon}</span>{c.label}
            </div>
          ))}
        </div>

        {/* STATS */}
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num"><AnimatedNumber target={1468} /></span>
            <span className="hero-stat-label">chalets</span>
          </div>
          <div className="hero-stat-sep" />
          <div className="hero-stat">
            <span className="hero-stat-num"><AnimatedNumber target={17} /></span>
            <span className="hero-stat-label">régions du Québec</span>
          </div>
          <div className="hero-stat-sep" />
          <div className="hero-stat">
            <span className="hero-stat-num">0 %</span>
            <span className="hero-stat-label">de commission</span>
          </div>
        </div>
      </div>

      {/* COUPS DE CŒUR */}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="kicker">N°02 · COUPS DE CŒUR</div>
            <h2 className="section-title">Nos chalets coups de cœur.</h2>
          </div>
          <Link to="/chalets/chalet-a-louer/" className="section-link">Voir tous les chalets →</Link>
        </div>
        <div className="chalets-grid">
          {coupsDeCoeur.map((c) => (
            <ChaletCard key={c.id} chalet={c} />
          ))}
        </div>
      </section>

      {/* POURQUOI */}
      <section className="pourquoi">
        <div className="pourquoi-head">
          <div className="kicker">N°03 · POURQUOI CHALETPEDIA</div>
          <h2 className="section-title">Sans algorithme. Sans commission.</h2>
        </div>
        <div className="pourquoi-grid">
          {[
            { num: "01", title: "Zéro commission", text: "Le prix affiché est le prix payé. Économisez 15 à 20 % par rapport aux géants comme Airbnb ou Vrbo." },
            { num: "02", title: "Contact direct", text: "Parlez au propriétaire. Posez vos questions, négociez les dates, organisez la remise des clés — sans filtre." },
            { num: "03", title: "100 % québécois", text: "Des chalets vérifiés un par un, dans les 17 régions du Québec. Une équipe locale, joignable en français." },
          ].map((item) => (
            <div className="pourquoi-card" key={item.num}>
              <div className="pourquoi-num">{item.num}</div>
              <div className="pourquoi-title">{item.title}</div>
              <p className="pourquoi-text">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RÉGIONS */}
      <section className="regions-section">
        <div className="regions-head">
          <div>
            <div className="kicker-brut">N°04 · LES 17 RÉGIONS</div>
            <h2 className="section-title-brut">Choisir son coin de pays.</h2>
          </div>
          <Link to="/chalets/chalet-a-louer/" className="link-brut">[ VOIR LA CARTE → ]</Link>
        </div>
        <div className="regions-grid">
          <div
            className="region-big"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80')" }}
          >
            <div className="badge-brut">[ 6 CHALETS ]</div>
            <div>
              <div className="region-name lg">LAURENTIDES</div>
              <p className="region-desc">Montagnes, lacs et stations de ski à 1h de Montréal.</p>
            </div>
          </div>
          <div className="region-col">
            <div
              className="region-cell border-bottom"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80')" }}
            >
              <div className="badge-brut-sm">[ 4 ]</div>
              <div className="region-name md">GASPÉSIE</div>
            </div>
            <div
              className="region-cell"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80')" }}
            >
              <div className="badge-brut-sm">[ 2 ]</div>
              <div className="region-name md">MAURICIE</div>
            </div>
          </div>
          <div className="region-col">
            <div
              className="region-cell border-bottom"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&q=80')" }}
            >
              <div className="badge-brut-sm">[ 2 ]</div>
              <div className="region-name sm">SAGUENAY-<br />LAC-ST-JEAN</div>
            </div>
            <div className="region-cell cta">
              <div className="region-name xs" style={{ fontSize: 12, letterSpacing: "0.18em", fontFamily: "inherit" }}>+13</div>
              <div className="region-name sm">AUTRES RÉGIONS</div>
              <span className="region-link">VOIR TOUT →</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROPRIÉTAIRES */}
      <section className="proprietaires">
        <div className="prop-grid">
          <div>
            <div className="kicker" style={{ color: "#fff" }}>N°05 · PROPRIÉTAIRES</div>
            <h2 className="prop-title">Vous avez un chalet ? <span className="accent" style={{ opacity: 0.85 }}>Faites-le travailler.</span></h2>
            <p className="prop-text">
              1 200 propriétaires louent déjà sur Chaletpedia — sans verser un sou de commission. Inscription gratuite, paiements directs, calendrier sous votre contrôle.
            </p>
            <div className="prop-buttons">
              <a href="/annoncez-votre-chalet/" className="btn-light">Annoncer mon chalet →</a>
              <a href="/promotions/" className="btn-outline">Voir les forfaits Pro</a>
            </div>
          </div>
          <div />
        </div>
      </section>

      {/* JOURNAL */}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="kicker">N°06 · LE JOURNAL</div>
            <h2 className="section-title">Pour louer mieux,<br/> pour louer plus.</h2>
          </div>
          <Link to="/blogue/" className="section-link">Tous les articles →</Link>
        </div>
        <div className="journal-grid">
          {articles.slice(0, 3).map((art) => (
            <Link className="article" key={art.id} to={`/blogue/${art.slug}`}>
              <div className="article-img" style={{ backgroundImage: `url('${art.image}')` }} />
              <div className="article-body">
                <div className="article-cat">{art.categorie}</div>
                <div className="article-title">{art.titre}</div>
                <div className="article-date">{art.date}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAVORIS 
      <section className="section">
        <div className="section-head">
          <div>
            <div className="kicker">N°07 · VOS CHALETS FAVORIS</div>
            <h2 className="section-title">Consultez nos propriétés les mieux notées.</h2>
          </div>
          <Link to="/chalets/chalet-a-louer/" className="section-link">Voir tous les chalets →</Link>
        </div>
        <div className="chalets-grid">
          {favoris.map((c) => (
            <ChaletCard key={c.id} chalet={c} />
          ))}
        </div>
      </section>*/}

      {/* COMMENT ÇA MARCHE */}
      <section className="process">
        <div className="process-head">
          <h2 className="section-title">3 étapes, zéro casse-tête.</h2>
        </div>
        <div className="process-grid">
          {[
            { num: "01", step: "01", title: "EXPLOREZ", bigTitle: "LE CHALET QUI VOUS RESSEMBLE.", text: "1 468 chalets vérifiés. Filtrez par envie, trouvez le bon en quelques clics." },
            { num: "02", step: "02", title: "DISCUTEZ", bigTitle: "LE PROPRIÉTAIRE, EN PERSONNE.", text: "Une vraie conversation, pas un robot. La personne qui connaît son chalet vous répond directement." },
            { num: "03", step: "03", title: "RÉSERVEZ", bigTitle: "LE PRIX JUSTE. POINT.", text: "Aucune commission, aucun frais caché. Économisez 15 à 20 % vs les géants du secteur." },
          ].map((item) => (
            <div className="process-step" key={item.num}>
              <div className="process-num">{item.num}</div>
              <div className="process-circle">{item.step}</div>
              <div className="process-title">{item.title}</div>
              <div className="process-bigTitle">{item.bigTitle}</div>
              <p className="process-text">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <div className="faq-container">
          <div className="faq-head">
            <div className="kicker" style={{ display: "inline-block" }}>F.A.Q</div>
            <h2 className="section-title" style={{ fontSize: 36 }}>Les questions qu'on nous pose le plus souvent.</h2>
          </div>
          <div className="faq-tabs">
            <button className={`faq-tab${faqTab === "locataires" ? " active" : ""}`} onClick={() => setFaqTab("locataires")}>
              🔍 Je veux louer un chalet
            </button>
            <button className={`faq-tab${faqTab === "proprietaires" ? " active" : ""}`} onClick={() => setFaqTab("proprietaires")}>
              🏡 Je veux louer mon chalet
            </button>
          </div>
          <div>
            {(faqTab === "locataires" ? faqLocataires : faqProprietaires).map((item, i) => (
              <FAQItem key={i} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

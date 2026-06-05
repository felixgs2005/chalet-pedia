// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">

        {/* ── Colonne 1 : Brand ── */}
        <div className="footer-brand-col">
          <div className="footer-logo">
            CHALET<span>PEDIA</span>
          </div>
          <p className="footer-desc">
            Trouvez un chalet à louer en toute simplicité pour vos prochaines
            vacances au Québec.
          </p>
          <Link to="/a-propos/" className="footer-cta">
            En savoir plus →
          </Link>
        </div>

        {/* ── Colonne 2 : Propriétaires ── */}
        <div className="footer-nav-col">
          <div className="footer-col-title">Propriétaires</div>
          <Link to="/submit-listing/details/" className="footer-link">
            Annoncez votre chalet
          </Link>
          <Link to="/chalets/services/?inscrire=1" className="footer-link">
            Inscrire ses services
          </Link>
          <Link to="/promotions/" className="footer-link">
            Booster une annonce
          </Link>
          <Link to="/publicite/" className="footer-link">
            Espace publicitaire
          </Link>
        </div>

        {/* ── Colonne 3 : Outils & Ressources ── */}
        <div className="footer-nav-col">
          <div className="footer-col-title">Outils &amp; Ressources</div>
          <span className="footer-link footer-link-static">
            Formations
          </span>
          <Link to="/academie/astuces/" className="footer-link">
            Guides pratiques
          </Link>
          <Link to="/academie/astuces/Wikia" className="footer-link">
            Wiki Chalet
          </Link>
        </div>

        {/* ── Colonne 4 : Besoin d'aide? ── */}
        <div className="footer-nav-col">
          <div className="footer-col-title">Besoin d&apos;aide?</div>
          <Link to="/faq/" className="footer-link">
            F.A.Q
          </Link>
          <Link to="/contact/" className="footer-link">
            Contact
          </Link>
        </div>

      </div>

      <div className="footer-bottom">
        <span>© 2025 ChaletPedia. Tous droits réservés.</span>
        <div className="footer-bottom-links">
          <Link to="/politique-de-confidentialite/">Politique de confidentialité</Link>
          <Link to="/conditions-utilisation/">Conditions d'utilisation</Link>
        </div>
      </div>
    </footer>
  );
}

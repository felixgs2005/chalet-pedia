// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">
            CHALET<span>PEDIA</span>
          </div>
          <p className="footer-desc">
            La marketplace québécoise pour louer un chalet directement auprès du propriétaire. Sans commission. Sans intermédiaire.
          </p>
          <a href="/annoncez-votre-chalet/" className="footer-cta">
            Annoncer mon chalet →
          </a>
        </div>

        <div>
          <div className="footer-col-title">Propriétaires</div>
          <a href="/annoncez-votre-chalet/" className="footer-link">Annoncer un chalet</a>
          <a href="/inscrivez-votre-entreprise-dans-le-repertoire/" className="footer-link">Inscrire un service</a>
          <a href="/promotions/" className="footer-link">Booster une annonce</a>
          <a href="/publicite/" className="footer-link">Espace publicitaire</a>
        </div>

        <div>
          <div className="footer-col-title">Ressources</div>
          <Link to="/blogue/" className="footer-link">Le journal</Link>
          <Link to="/academie/astuces/" className="footer-link">Astuces</Link>
          <a href="/guides/" className="footer-link">Guides pratiques</a>
          <a href="#" className="footer-link">Formations</a>
          <a href="#" className="footer-link">Wiki Chalet</a>
        </div>

        <div>
          <div className="footer-col-title">Aide</div>
          <a href="/faq/" className="footer-link">F.A.Q</a>
          <a href="/contact/" className="footer-link">Contact</a>
          <a href="/politique-de-confidentialite/" className="footer-link">Confidentialité</a>
          <a href="/conditions-utilisation/" className="footer-link">Conditions</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 CHALETPEDIA · TOUS DROITS RÉSERVÉS</span>
        <div className="footer-bottom-links">
          <a href="/politique-de-confidentialite/">Politique de confidentialité</a>
          <a href="/conditions-utilisation/">Conditions d'utilisation</a>
        </div>
      </div>
    </footer>
  );
}

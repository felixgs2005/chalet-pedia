// src/App.jsx
import { BrowserRouter, Routes, Route, ScrollRestoration } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ChaletPage from "./pages/ChaletPage";
import ALouer from "./pages/ALouer";
import Vente from "./pages/Vente";
import VentePage from "./pages/VentePage";
import Blogue from "./pages/Blogue";
import Astuces from "./pages/Astuces";
import ArticlePage from "./pages/ArticlePage";
import AuthPage from "./pages/auth";
import AccueilServices from "./pages/AccueilServices";
import Construction from "./pages/Construction";
import Decoration from "./pages/Decoration";
import Entretien from "./pages/Entretien";
import Multimedia from "./pages/Multimedia";
import ServiceDetail from "./pages/ServiceDetail";
import Wikia from "./pages/Wikia";
import FAQ from "./pages/footer/FAQ";
import Contact from "./pages/footer/Contact";
import Promotions from "./pages/footer/Promotions";
import Publicite from "./pages/footer/Publicite";
import PolitiqueConfidentialite from "./pages/footer/PolitiqueConfidentialite";
import ConditionsUtilisation from "./pages/footer/ConditionsUtilisation";
import APropos from "./pages/footer/APropos";
import "./styles/global.css";
import "./styles/footer-pages.css";

function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/chalet/:slug" element={<ChaletPage />} />
          <Route path="/chalets/chalet-a-louer/" element={<ALouer />} />
          <Route path="/chalets/chalets-a-vendre/" element={<Vente />} />
          <Route path="/chalets/chalets-a-vendre/:slug" element={<VentePage />} />
          {/* URLs type chaletpedia.com : /chalets/chalets-a-louer-laurentides/ */}
          <Route path="/chalets/:pageSlug" element={<ALouer />} />
          <Route path="/blogue/" element={<Blogue />} />
          <Route path="/blogue/:slug" element={<ArticlePage />} />
          <Route path="/academie/astuces/" element={<Astuces />} />
          <Route path="/academie/astuces/Wikia" element={<Wikia />} />
          <Route path="/academie/astuces/:slug" element={<ArticlePage />} />
          <Route path="/chalets/services/" element={<AccueilServices />} />
          <Route path="/chalets/construction/" element={<Construction />} />
          <Route path="/chalets/decoration/" element={<Decoration />} />
          <Route path="/chalets/entretien/" element={<Entretien />} />
          <Route path="/chalets/multimedia/" element={<Multimedia />} />
          {/* Détail d'une annonce de service : /chalets/construction/ova-chalet-design */}
          <Route path="/chalets/:categorie/:slug" element={<ServiceDetail />} />
          {/* Pages footer */}
          <Route path="/faq/" element={<FAQ />} />
          <Route path="/contact/" element={<Contact />} />
          <Route path="/promotions/" element={<Promotions />} />
          <Route path="/publicite/" element={<Publicite />} />
          <Route path="/politique-de-confidentialite/" element={<PolitiqueConfidentialite />} />
          <Route path="/conditions-utilisation/" element={<ConditionsUtilisation />} />
          <Route path="/a-propos/" element={<APropos />} />
          <Route
            path="*"
            element={
              <div style={{ padding: "80px 32px", textAlign: "center" }}>
                <div className="kicker">404</div>
                <h1 className="section-title" style={{ fontSize: 48, marginTop: 12 }}>Page introuvable</h1>
              </div>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

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
import ArticlePage from "./pages/ArticlePage";
import AuthPage from "./pages/auth";
import "./styles/global.css";

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
          <Route path="/blogue/" element={<Blogue />} />
          <Route path="/blogue/:slug" element={<ArticlePage />} />
          {/* Ajoutez d'autres routes ici au besoin */}
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

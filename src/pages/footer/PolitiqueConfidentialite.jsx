// src/pages/PolitiqueConfidentialite.jsx
// ============================================================
// PAGE POLITIQUE DE CONFIDENTIALITÉ (/politique-de-confidentialite/)
// Conformément à la loi 25 sur la protection des renseignements personnels.
// ============================================================

export default function PolitiqueConfidentialite() {
  const sections = [
    {
      id: "intro",
      titre: "Introduction",
      contenu: `
        ChaletPedia s'engage à protéger la confidentialité de vos renseignements
        personnels. Cette politique décrit comment nous collectons, utilisons,
        divulguons et protégeons vos données dans le cadre de nos services.
        En utilisant ChaletPedia, vous consentez aux pratiques décrites dans
        cette politique.
      `,
    },
    {
      id: "collecte",
      titre: "Quelles données collectons-nous ?",
      contenu: `
        Nous collectons les données suivantes :
        - **Informations de compte** : nom, prénom, adresse email, téléphone
        - **Informations de profil** : photo, description, préférences
        - **Données de transaction** : dates de réservation, communications
        - **Données techniques** : adresse IP, navigateur, appareil, pages visitées
        - **Contenu généré** : avis, messages, photos téléchargées
      `,
    },
    {
      id: "utilisation",
      titre: "Comment utilisons-nous vos données ?",
      contenu: `
        Vos données sont utilisées pour :
        - Fournir et améliorer nos services
        - Faciliter les transactions entre propriétaires et locataires
        - Communiquer avec vous (confirmations, mises à jour, support)
        - Personnaliser votre expérience utilisateur
        - Respecter nos obligations légales
        - Prévenir la fraude et assurer la sécurité
      `,
    },
    {
      id: "partage",
      titre: "Partage de vos données",
      contenu: `
        Nous ne vendons pas vos données. Nous pouvons les partager avec :
        - **Autres utilisateurs** : pour faciliter les transactions (nom, photo, avis)
        - **Prestataires de services** : hébergement, paiement, analyse (sous contrat)
        - **Autorités légales** : si requis par la loi ou pour prévenir la fraude
        - **Successeurs** : en cas de fusion, acquisition ou vente
      `,
    },
    {
      id: "protection",
      titre: "Protection de vos données",
      contenu: `
        Nous mettons en œuvre des mesures de sécurité techniques et
        organisationnelles appropriées pour protéger vos données contre
        l'accès non autorisé, la modification, la divulgation ou la destruction.
        Ces mesures incluent le chiffrement SSL, le contrôle d'accès et la
        surveillance régulière de nos systèmes.
      `,
    },
    {
      id: "droits",
      titre: "Vos droits",
      contenu: `
        Conformément à la loi 25, vous avez les droits suivants :
        - **Accès** : consulter les données que nous détenons sur vous
        - **Rectification** : corriger des données inexactes
        - **Effacement** : demander la suppression de vos données
        - **Portabilité** : recevoir vos données dans un format structuré
        - **Opposition** : vous opposer au traitement dans certains cas
        Pour exercer ces droits, contactez-nous à privacy@chaletpedia.com.
      `,
    },
    {
      id: "cookies",
      titre: "Cookies et technologies similaires",
      contenu: `
        Nous utilisons des cookies pour :
        - Maintenir votre session connectée
        - Mémoriser vos préférences
        - Analyser l'utilisation de notre site
        - Personnaliser le contenu et les publicités
        Vous pouvez contrôler les cookies via les paramètres de votre navigateur.
      `,
    },
    {
      id: "mineurs",
      titre: "Protection des mineurs",
      contenu: `
        Nos services ne sont pas destinés aux personnes de moins de 18 ans.
        Nous ne collectons pas sciemment de données personnelles de mineurs.
        Si vous apprenez qu'un mineur nous a fourni des données, contactez-nous
        immédiatement.
      `,
    },
    {
      id: "international",
      titre: "Transfert international",
      contenu: `
        Vos données peuvent être traitées au Canada et dans d'autres pays où
        nos prestataires opèrent. Ces pays peuvent avoir des lois sur la
        protection des données différentes. Nous nous assurons que ces
        transferts respectent les standards appropriés de protection.
      `,
    },
    {
      id: "modifications",
      titre: "Modifications de cette politique",
      contenu: `
        Nous pouvons modifier cette politique occasionnellement. Nous vous
        informerons des changements significatifs par email ou via une
        notification sur notre site. La date de la dernière mise à jour est
        indiquée ci-dessous.
      `,
    },
    {
      id: "contact",
      titre: "Nous contacter",
      contenu: `
        Pour toute question concernant cette politique ou la protection de vos
        données, contactez notre délégué à la protection des données :
        
        **ChaletPedia Inc.**
        Département protection des données
        privacy@chaletpedia.com
        
        Dernière mise à jour : 2 juin 2026
      `,
    },
  ];

  return (
    <div className="politique-page">
      {/* ── HERO ── */}
      <section className="politique-hero">
        <div className="politique-hero-kicker">LEGAL · CHALETPEDIA</div>
        <h1 className="politique-hero-title">Politique de confidentialité</h1>
        <p className="politique-hero-sub">
          Comment nous protégeons vos données personnelles conformément à la
          loi 25 sur la protection des renseignements personnels.
        </p>
      </section>

      {/* ── CONTENU ── */}
      <section className="politique-content">
        <div className="politique-content-inner">
          <div className="politique-intro">
            <p>
              Cette politique s'applique à tous les services offerts par
              ChaletPedia Inc. (« ChaletPedia », « nous », « notre ») via notre
              site web et applications mobiles.
            </p>
          </div>

          <div className="politique-sections">
            {sections.map((section) => (
              <div key={section.id} className="politique-section">
                <h2 className="politique-section-title">{section.titre}</h2>
                <div className="politique-section-content">
                  {section.contenu.split('\n').map((paragraph, idx) => (
                    paragraph.trim() ? (
                      <p key={idx}>{paragraph.trim()}</p>
                    ) : null
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="politique-consentement">
            <p>
              <strong>Consentement :</strong> En utilisant ChaletPedia, vous
              consentez à la collecte, à l'utilisation et à la divulgation de
              vos renseignements personnels conformément à la présente politique.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

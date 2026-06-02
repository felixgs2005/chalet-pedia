// src/pages/ConditionsUtilisation.jsx
// ============================================================
// PAGE CONDITIONS D'UTILISATION (/conditions-utilisation/)
// Conditions générales d'utilisation de ChaletPedia.
// ============================================================

export default function ConditionsUtilisation() {
  const sections = [
    {
      id: "acceptation",
      titre: "Acceptation des conditions",
      contenu: `
        En accédant ou en utilisant ChaletPedia (« le Service »), vous acceptez
        d'être lié par les présentes conditions d'utilisation (« Conditions »).
        Si vous n'acceptez pas ces Conditions, vous ne devez pas utiliser le
        Service.
        
        Nous nous réservons le droit de modifier ces Conditions à tout moment.
        Les modifications entrent en vigueur dès leur publication. Votre
        utilisation continue du Service après publication constitue votre
        acceptation des Conditions modifiées.
      `,
    },
    {
      id: "description",
      titre: "Description du service",
      contenu: `
        ChaletPedia est une plateforme en ligne qui met en relation des
        propriétaires de chalets (« Propriétaires ») avec des personnes
        souhaitant louer un chalet (« Locataires »).
        
        ChaletPedia agit uniquement comme intermédiaire et n'est pas partie aux
        transactions entre Propriétaires et Locataires. Nous ne garantissons pas
        la qualité, la sécurité ou la légalité des annonces publiées.
        
        Les transactions sont conclues directement entre les utilisateurs.
        ChaletPedia ne prend aucune commission sur les réservations.
      `,
    },
    {
      id: "compte",
      titre: "Création et sécurité du compte",
      contenu: `
        Pour utiliser certaines fonctionnalités, vous devez créer un compte.
        Vous devez fournir des informations exactes, complètes et à jour.
        
        Vous êtes responsable de la confidentialité de votre mot de passe et de
        toutes les activités effectuées via votre compte. Vous devez nous
        informer immédiatement de toute utilisation non autorisée.
        
        Vous devez avoir au moins 18 ans pour créer un compte et utiliser le
        Service.
      `,
    },
    {
      id: "proprietaires",
      titre: "Obligations des propriétaires",
      contenu: `
        En publiant une annonce, vous déclarez et garantissez que :
        - Vous êtes légalement autorisé à louer le chalet
        - Vous détenez un numéro CITQ valide (si requis)
        - Les informations fournies sont exactes et complètes
        - Les photos représentent fidèlement le chalet
        - Vous respectez toutes les lois et réglementations applicables
        
        Vous acceptez de répondre aux demandes de réservation dans des délais
        raisonnables et de respecter les réservations confirmées.
        
        Vous êtes responsable de définir vos propres conditions d'annulation et
        de les communiquer clairement.
      `,
    },
    {
      id: "locataires",
      titre: "Obligations des locataires",
      contenu: `
        En effectuant une réservation, vous acceptez de :
        - Fournir des informations exactes
        - Respecter les conditions établies par le Propriétaire
        - Traiter le chalet avec soin et respect
        - Respecter les heures d'arrivée et de départ
        - Payer les frais de dommages éventuels
        
        Vous êtes responsable de vérifier que le chalet répond à vos besoins
        avant de réserver.
      `,
    },
    {
      id: "paiements",
      titre: "Paiements et frais",
      contenu: `
        ChaletPedia n'intervient pas dans les transactions financières entre
        utilisateurs. Les paiements sont effectués directement entre
        Propriétaires et Locataires selon les modalités qu'ils conviennent.
        
        ChaletPedia peut offrir des services payants optionnels (promotion
        d'annonces, etc.). Ces services sont clairement identifiés et leur
        tarification est transparente.
      `,
    },
    {
      id: "contenu",
      titre: "Contenu utilisateur",
      contenu: `
        Vous conservez les droits sur le contenu que vous publiez. En publiant
        du contenu, vous nous accordez une licence mondiale, non exclusive,
        gratuite pour l'utiliser, le reproduire, le modifier et le diffuser
        dans le cadre du Service.
        
        Vous êtes seul responsable du contenu que vous publiez et de ses
        conséquences.
        
        Nous nous réservons le droit de supprimer tout contenu qui, à notre
        discrétion, enfreint ces Conditions ou qui est inapproprié.
      `,
    },
    {
      id: "interdictions",
      titre: "Comportements interdits",
      contenu: `
        Vous vous engagez à ne pas :
        - Publier de fausses informations ou de contenu trompeur
        - Harceler, menacer ou intimider d'autres utilisateurs
        - Utiliser le Service à des fins illégales
        - Contourner ou désactiver les mesures de sécurité
        - Utiliser des robots, spiders ou autres moyens automatisés
        - Violer les droits de propriété intellectuelle d'autrui
        - Publier de contenu discriminatoire, haineux ou obscène
      `,
    },
    {
      id: "responsabilite",
      titre: "Limitation de responsabilité",
      contenu: `
        Dans la mesure maximale permise par la loi, ChaletPedia et ses
        dirigeants, employés et agents ne seront pas responsables des :
        - Dommages indirects, accessoires, spéciaux ou consécutifs
        - Pertes de données, d'utilisation, de bénéfices ou de bonne volonté
        - Coûts de procuration de biens ou services de remplacement
        
        Notre responsabilité totale envers vous pour toute réclamation sera
        limitée au montant que vous avez payé pour utiliser le Service au cours
        des 12 derniers mois, ou 100 $ CAD si vous n'avez rien payé.
      `,
    },
    {
      id: "indemnisation",
      titre: "Indemnisation",
      contenu: `
        Vous acceptez d'indemniser, de défendre et de dégager de toute
        responsabilité ChaletPedia et ses dirigeants, employés et agents contre
        toute réclamation, perte, responsabilité, dommage ou coût (y compris les
        honoraires d'avocats) résultant de votre utilisation du Service ou de
        votre violation de ces Conditions.
      `,
    },
    {
      id: "resiliation",
      titre: "Résiliation",
      contenu: `
        Nous pouvons résilier ou suspendre votre accès au Service à tout
        moment, sans préavis, pour quelque raison que ce soit, y compris si
        vous violez ces Conditions.
        
        Vous pouvez résilier votre compte à tout moment en nous contactant.
        Les dispositions qui, par leur nature, doivent survivre à la résiliation
        survivront, y compris celles relatives à la propriété, aux garanties,
        à l'indemnisation et aux limitations de responsabilité.
      `,
    },
    {
      id: "loi",
      titre: "Droit applicable et litiges",
      contenu: `
        Ces Conditions sont régies par les lois de la province de Québec et les
        lois du Canada applicables.
        
        Tout litige découlant de ou lié à ces Conditions sera soumis à la
        compétence exclusive des tribunaux de la province de Québec, district
        judiciaire de Montréal.
        
        Vous renoncez à toute objection à cette juridiction et à ce lieu.
      `,
    },
    {
      id: "divers",
      titre: "Dispositions diverses",
      contenu: `
        Ces Conditions constituent l'accord complet entre vous et ChaletPedia
        concernant le Service.
        
        Si une disposition est jugée invalide ou inapplicable, les autres
        dispositions resteront en vigueur.
        
        Notre incapacité à faire appliquer un droit ou une disposition ne
        constitue pas une renonciation à ce droit ou à cette disposition.
        
        Vous ne pouvez pas céder vos droits ou obligations sans notre
        consentement écrit préalable.
      `,
    },
    {
      id: "contact",
      titre: "Nous contacter",
      contenu: `
        Pour toute question concernant ces Conditions, contactez-nous à :
        
        **ChaletPedia Inc.**
        Service juridique
        legal@chaletpedia.com
        
        Dernière mise à jour : 2 juin 2026
      `,
    },
  ];

  return (
    <div className="conditions-page">
      {/* ── HERO ── */}
      <section className="conditions-hero">
        <div className="conditions-hero-kicker">LEGAL · CHALETPEDIA</div>
        <h1 className="conditions-hero-title">Conditions d'utilisation</h1>
        <p className="conditions-hero-sub">
          Les règles qui régissent votre utilisation de ChaletPedia. Veuillez
          les lire attentivement.
        </p>
      </section>

      {/* ── CONTENU ── */}
      <section className="conditions-content">
        <div className="conditions-content-inner">
          <div className="conditions-avis">
            <div className="conditions-avis-icon" aria-hidden="true">⚠️</div>
            <p className="conditions-avis-text">
              <strong>Attention :</strong> Ces conditions sont juridiquement
              contraignantes. En utilisant ChaletPedia, vous acceptez d'être lié
              par ces conditions.
            </p>
          </div>

          <div className="conditions-sections">
            {sections.map((section) => (
              <div key={section.id} className="conditions-section">
                <h2 className="conditions-section-title">
                  {section.id}. {section.titre}
                </h2>
                <div className="conditions-section-content">
                  {section.contenu.split('\n').map((paragraph, idx) => (
                    paragraph.trim() ? (
                      <p key={idx}>{paragraph.trim()}</p>
                    ) : null
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="conditions-acceptation">
            <p>
              En utilisant ChaletPedia, vous reconnaissez avoir lu, compris et
              accepté l'intégralité de ces Conditions d'utilisation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

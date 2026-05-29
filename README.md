# Chaletpedia — Projet React

## Structure du projet

```
chaletpedia/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.jsx       — Navigation (même sur toutes les pages)
│   │   ├── Footer.jsx       — Pied de page
│   │   └── ChaletCard.jsx   — Carte chalet réutilisable
│   ├── pages/
│   │   ├── HomePage.jsx     — Page d'accueil complète
│   │   └── ChaletPage.jsx   — Page chalet DYNAMIQUE (une seule page pour tous les chalets)
│   ├── data/
│   │   └── chalets.js       — ⭐ FICHIER CENTRAL — modifiez ici pour ajouter/éditer des chalets
│   ├── styles/
│   │   └── global.css       — Tous les styles (fidèle à la maquette originale)
│   ├── App.jsx              — Routing principal
│   └── index.js             — Point d'entrée
└── package.json
```

## Comment ajouter un chalet

**Modifiez uniquement `src/data/chalets.js`** — La page se génère automatiquement !

```js
{
  id: "mon-chalet-unique",          // ID unique (pas d'espace ni caractères spéciaux)
  slug: "mon-chalet-unique-slug",   // Slug URL (ex: le-chalet-des-bois)
  nom: "Le Chalet des Bois",
  sousTitre: "Vue sur le lac",
  region: "Laurentides",
  regionLabel: "LAURENTIDES",       // Affiché dans le badge
  localisation: "Ville, Québec",
  invites: 8,
  chambres: 3,
  sdb: 2,
  prixNuit: 250,                    // null si prix sur demande
  badge: "LAURENTIDES",
  dateAjout: "janvier 1, 2026",
  isFavori: false,
  images: [
    "https://...url-de-l-image-1...",
    "https://...url-de-l-image-2...",
    // ...
  ],
  description: "Description en français...",
  descriptionEn: "English description...",
  caracteristiques: ["Spa", "Foyer", "Vue lac", "Animaux permis"],
  proprietaire: { initiales: "AB", nom: "André B.", membre: "Membre depuis 2024" },
  citq: "291-24-12345",
}
```

La page `/chalet/mon-chalet-unique-slug` sera automatiquement disponible.

## Installation et démarrage

```bash
npm install
npm start
```

## Construction pour la production

```bash
npm run build
```

## Routes disponibles

- `/` — Page d'accueil
- `/chalet/:slug` — Page dynamique d'un chalet (ex: `/chalet/domaine-prive-de-kanata`)

## Design

Le design reproduit fidèlement le style du projet Vercel existant :
- Polices : Archivo Black (titres) + Inter (corps)
- Couleurs : #1F4D3A (vert forêt), #F8F5EE (beige chaud), #0F0F0F (noir)
- Responsive : mobile, tablette et desktop

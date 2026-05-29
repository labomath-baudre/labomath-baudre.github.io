# LaboMath — Lycée de Baudre

Site web du LaboMath du Lycée de Baudre.

🔗 [labomath-baudre.github.io](https://labomath-baudre.github.io)

## À propos

Le LaboMath rassemble des ressources mathématiques destinées :

- aux élèves de Seconde, Première et Terminale (voie générale et technologique) ;
- aux étudiants de BTS ;
- aux bacheliers professionnels accédant à un BTS (passerelle Bac → BTS).

Les ressources comprennent fiches d'automatismes, cahiers de consolidation et supports de cours, en accès libre.

## Structure du dépôt

```
.
├── _config.yml              # Configuration Jekyll
├── _layouts/
│   └── default.html         # Gabarit HTML commun
├── index.md                 # Page d'accueil
├── seconde/
│   ├── index.md             # Page Seconde
│   └── docs/                # PDF des fiches Seconde
├── premiere/
│   ├── index.md
│   └── docs/
├── terminale/
│   ├── index.md
│   └── docs/
├── passerelle/
│   ├── index.md
│   └── docs/
├── bts/
│   ├── index.md
│   └── docs/
├── assets/
│   └── css/
│       └── style.css        # Feuille de style
├── .gitignore
└── README.md
```

## Aspects techniques

Site statique généré par [Jekyll](https://jekyllrb.com), hébergé sur [GitHub Pages](https://pages.github.com).

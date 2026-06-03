/* LaboMath — app.js
   Script principal de l'application : ARBRE, état, moteur UI, drag&drop,
   génération de PDF, gestion des aperçus, etc.
   Anciennement inline dans automatismes.html, sorti pour garantir l'ordre
   de chargement (s'exécute APRÈS helpers.js et tous les gen_*.js grâce à defer). */

const ARBRE = [
  // ===== PRÉREQUIS DU COLLÈGE =====
  { id: 'prerequis', titre: 'PRÉREQUIS DU COLLÈGE', profils: ['seconde','premiere_stmg','premiere_sti2d'], enfants: [
    { id: 'calcul_mental', titre: 'Calcul mental', enfants: [
      { id: 'cm_tables', titre: 'Tables de multiplication', actif: true },
      { id: 'cm_add', titre: 'Additions mentales', actif: true },
      { id: 'cm_sous', titre: 'Soustractions mentales', actif: true },
      { id: 'cm_mult10', titre: 'Multiplications par 10, 100, 0,1, 0,01', actif: true },
      { id: 'cm_compl', titre: 'Compléments à 10, 100, 1000', actif: true }
    ]},
    { id: 'relatifs', titre: 'Nombres relatifs', enfants: [
      { id: 'rel_add', titre: 'Addition de relatifs', actif: true },
      { id: 'rel_sous', titre: 'Soustraction de relatifs', actif: true },
      { id: 'rel_mult', titre: 'Multiplication de relatifs', actif: true },
      { id: 'rel_div', titre: 'Division de relatifs', actif: true },
      { id: 'rel_signes', titre: 'Règles de signes', actif: true }
    ]},
    { id: 'priorites', titre: 'Priorités opératoires', enfants: [
      { id: 'pri_paren', titre: 'Calcul avec parenthèses', actif: true },
      { id: 'pri_puiss', titre: 'Calcul avec puissances', actif: true },
      { id: 'pri_complexe', titre: 'Expressions complexes', actif: true }
    ]},
    { id: 'geom_rap', titre: 'Géométrie classique', enfants: [
      { id: 'gr_perim', titre: 'Périmètres', actif: true },
      { id: 'gr_aire', titre: 'Aires de figures usuelles', actif: true },
      { id: 'gr_vol', titre: 'Volumes de solides usuels', actif: true },
      { id: 'gr_pyth', titre: 'Théorème de Pythagore', actif: true },
      { id: 'gr_thales', titre: 'Théorème de Thalès', actif: true }
    ]}
  ]},

  // ===== CN. CALCUL NUMÉRIQUE =====
  { id: 'cn', titre: 'CN. CALCUL NUMÉRIQUE', profils: ['seconde','premiere_stmg','premiere_sti2d'], enfants: [
    { id: 'cn01', titre: 'CN01 — Comparer deux nombres', enfants: [
      { id: 'cn01_diff', titre: 'Par différence', actif: true },
      { id: 'cn01_quot', titre: 'Par quotient', actif: true }
    ]},
    { id: 'cn02_fractions', titre: 'CN02 — Opérations sur fractions', enfants: [
      { id: 'fs_add_mm', titre: 'Addition (même dénominateur)', actif: true },
      { id: 'fs_add_diff', titre: 'Addition (dénominateurs simples)', actif: true },
      { id: 'fs_mult', titre: 'Multiplication', actif: true },
      { id: 'fs_simpl', titre: 'Simplification', actif: true },
      { id: 'fs_dnb', titre: "Fraction d'un nombre", actif: true }
    ]},
    { id: 'cn03_puiss', titre: 'CN03 — Opérations sur puissances', enfants: [
      { id: 'cn03_prod', titre: 'Produit de puissances', actif: true },
      { id: 'cn03_quot', titre: 'Quotient de puissances', actif: true },
      { id: 'cn03_puiss_puiss', titre: "Puissance d'une puissance", actif: true }
    ]},
    { id: 'cn04_ecritures', titre: 'CN04 — Passer d\'une écriture à une autre', enfants: [
      { id: 'cn04_dec_frac', titre: 'Décimal ↔ fraction', actif: true },
      { id: 'cn04_dec_pct', titre: 'Décimal ↔ pourcentage', actif: true },
      { id: 'cn04_frac_pct', titre: 'Fraction ↔ pourcentage', actif: true }
    ]},
    { id: 'cn05_ordre', titre: 'CN05 — Ordre de grandeur', enfants: [
      { id: 'esc_ordre', titre: 'Ordre de grandeur (écriture scientifique)', actif: true },
      { id: 'cn05_estim', titre: 'Estimer un ordre de grandeur', actif: true }
    ]},
    { id: 'cn06_racines', titre: 'CN06 — Racines carrées', enfants: [
      { id: 'cn06_simpl', titre: 'Simplifier √(a²) et √(a·b)', actif: true },
      { id: 'cn06_calcul', titre: "Calculs avec √ (sommes et produits)", actif: true },
      { id: 'cn06_ecrire', titre: 'Écrire sous la forme a√b', actif: true }
    ]},
    { id: 'cn07_conv', titre: 'CN07 — Conversions d\'unités', enfants: [
      { id: 'conv_long', titre: 'Longueurs (mm, cm, m, km)', actif: true },
      { id: 'conv_masse', titre: 'Masses (mg, g, kg, t)', actif: true },
      { id: 'conv_cap', titre: 'Capacités (mL, cL, L)', actif: true },
      { id: 'conv_duree', titre: 'Durées (h, min, s)', actif: true },
      { id: 'conv_aire', titre: 'Aires (cm², m², km², ha)', actif: true },
      { id: 'conv_vol', titre: 'Volumes (cm³, m³, L)', actif: true }
    ]},
    { id: 'ec_scient', titre: 'Écriture scientifique', enfants: [
      { id: 'esc_vers', titre: 'Décimale → scientifique', actif: true },
      { id: 'esc_de', titre: 'Scientifique → décimale', actif: true }
    ]}
  ]},

  // ===== CA. CALCUL ALGÉBRIQUE =====
  { id: 'ca', titre: 'CA. CALCUL ALGÉBRIQUE', profils: ['seconde','premiere_stmg','premiere_sti2d'], enfants: [
    { id: 'ca01_litteral', titre: 'CA01 — Calcul littéral élémentaire', enfants: [
      { id: 'ca01_op_add', titre: 'Opposé d\'une somme : −(a+b)', actif: true },
      { id: 'ca01_simpl', titre: 'Simplifications : 0×a, 1×a, x/1, a/0...', actif: true },
      { id: 'ca01_fract', titre: 'Manipulations de fractions littérales', actif: true }
    ]},
    { id: 'ca02_dev', titre: 'CA02 — Développer, factoriser', enfants: [
      { id: 'ca02_dev_simple', titre: 'Développer k(ax+b)', actif: true },
      { id: 'ca02_dev_double', titre: 'Développer (ax+b)(cx+d)', actif: true },
      { id: 'ca02_ident_dev', titre: 'Identités remarquables (développer)', actif: true },
      { id: 'ca02_ident_fact', titre: 'Identités remarquables (factoriser)', actif: true },
      { id: 'ca02_reduire', titre: 'Réduire une expression', actif: true },
      { id: 'ca02_fact_simple', titre: 'Factoriser (facteur commun)', actif: true }
    ]},
    { id: 'ca03_eq', titre: 'CA03 — Équations et inéquations', enfants: [
      { id: 'ca03_eq1', titre: 'Équation ax + b = cx + d', actif: true },
      { id: 'ca03_eq_carre', titre: 'Équation x² = a', actif: true },
      { id: 'ca03_eq_rat', titre: 'Équation a/x = b', actif: true },
      { id: 'ca03_ineq', titre: 'Inéquation du 1er degré', actif: true }
    ]},
    { id: 'ca04_isoler', titre: 'CA04 — Isoler une variable', enfants: [
      { id: 'ca04_formule', titre: 'Isoler dans une formule (V = πr²h...)', actif: true },
      { id: 'ca04_avec_carre', titre: 'Isoler avec un carré', actif: true }
    ]},
    { id: 'ca05_appli', titre: 'CA05 — Application numérique d\'une formule', enfants: [
      { id: 'ca05_calc', titre: 'Calculer une expression pour x = ...', actif: true },
      { id: 'ca05_formule', titre: 'Appliquer une formule (sciences)', actif: true }
    ]},
    { id: 'ca06_produit', titre: 'CA06 — Équation produit nul', enfants: [
      { id: 'ca06_simple', titre: '(x−a)(x−b) = 0', actif: true },
      { id: 'ca06_factoriser', titre: 'Factoriser puis résoudre', actif: true }
    ]},
    { id: 'ca07_signe', titre: 'CA07 — Signe d\'une expression', enfants: [
      { id: 'ca07_affine', titre: 'Signe de ax + b', actif: true },
      { id: 'ca07_trinome', titre: 'Signe d\'un trinôme factorisé', actif: true },
      { id: 'ca07_degre3', titre: 'Signe d\'un produit de 3 facteurs (1re Techno)', actif: true }
    ]}
  ]},

  // ===== PP. PROPORTIONS ET POURCENTAGES =====
  { id: 'pp', titre: 'PP. PROPORTIONS ET POURCENTAGES', profils: ['seconde','premiere_stmg','premiere_sti2d'], enfants: [
    { id: 'pp01_pct', titre: 'PP01 — Calculer un pourcentage', enfants: [
      { id: 'pr_pct', titre: 'Pourcentages simples (10, 25, 50%...)', actif: true },
      { id: 'pp01_app', titre: 'Appliquer un pourcentage', actif: true }
    ]},
    { id: 'pp02_formes', titre: 'PP02 — Proportion (décimale, fractionnaire)', enfants: [
      { id: 'pp02_dec', titre: 'Proportion sous forme décimale', actif: true },
      { id: 'pp02_frac', titre: 'Proportion sous forme fractionnaire', actif: true }
    ]},
    { id: 'pp03_partie_tout', titre: 'PP03 — Partie et tout', enfants: [
      { id: 'pp03_partie', titre: 'Trouver la partie connaissant le tout', actif: true },
      { id: 'pp03_tout', titre: 'Trouver le tout connaissant la partie', actif: true }
    ]},
    { id: 'pp_extra', titre: 'Échelles et proportionnalité', enfants: [
      { id: 'pr_ech', titre: 'Échelles', actif: true },
      { id: 'pr_vit', titre: 'Vitesse moyenne (d = v × t)', actif: true }
    ]}
  ]},

  // ===== EV. ÉVOLUTIONS ET VARIATIONS =====
  { id: 'ev', titre: 'EV. ÉVOLUTIONS ET VARIATIONS', profils: ['seconde','premiere_stmg','premiere_sti2d'], enfants: [
    { id: 'ev01_coef', titre: 'EV01 — Augmentation/diminution → coefficient', enfants: [
      { id: 'ev01_aug', titre: 'Augmenter de t% ↔ ×(1+t/100)', actif: true },
      { id: 'ev01_dim', titre: 'Diminuer de t% ↔ ×(1−t/100)', actif: true }
    ]},
    { id: 'ev02_appli', titre: 'EV02 — Appliquer un taux d\'évolution', enfants: [
      { id: 'ev02_finale', titre: 'Calculer la valeur finale', actif: true },
      { id: 'ev02_initiale', titre: 'Calculer la valeur initiale', actif: true }
    ]},
    { id: 'ev03_calc', titre: 'EV03 — Calculer un taux d\'évolution', enfants: [
      { id: 'ev03_calc', titre: 'Calculer un taux', actif: true }
    ]},
    { id: 'ev04_succ', titre: 'EV04 — Évolutions successives', enfants: [
      { id: 'ev04_2evol', titre: 'Taux global de deux évolutions', actif: true }
    ]},
    { id: 'ev05_rec', titre: 'EV05 — Évolution réciproque', enfants: [
      { id: 'ev05_rec', titre: 'Taux pour revenir à la valeur initiale', actif: true }
    ]},
    { id: 'ev06_indice', titre: 'EV06 — Indices base 100 (1re Techno)', enfants: [
      { id: 'ev06_calcul', titre: "Calculer un indice", actif: true },
      { id: 'ev06_interp', titre: "Interpréter un indice", actif: true },
      { id: 'ev06_indice_taux', titre: "Passer indice ↔ taux d'évolution", actif: true }
    ]}
  ]},

  // ===== FR. FONCTIONS ET REPRÉSENTATIONS =====
  { id: 'fr', titre: 'FR. FONCTIONS ET REPRÉSENTATIONS', profils: ['seconde','premiere_stmg','premiere_sti2d'], enfants: [
    { id: 'fr_affine', titre: 'Fonction affine', enfants: [
      { id: 'affine_image', titre: 'Calculer une image', actif: true },
      { id: 'affine_antecedent', titre: 'Trouver un antécédent', actif: true },
      { id: 'affine_coefs', titre: 'Identifier les coefficients', actif: true },
      { id: 'affine_par_points', titre: 'Déterminer f à partir de 2 points', actif: true },
      { id: 'affine_variation', titre: 'Sens de variation', actif: true }
    ]},
    { id: 'fr_carre', titre: 'Fonction carré', enfants: [
      { id: 'carre_image', titre: 'Calculer une image', actif: true },
      { id: 'carre_antecedents', titre: 'Trouver les antécédents', actif: true },
      { id: 'carre_comparaison', titre: 'Comparaison (positifs)', actif: true },
      { id: 'carre_comparaison_neg', titre: 'Comparaison (négatifs)', actif: true },
      { id: 'carre_calcul', titre: "Calcul mental d'un carré", actif: true }
    ]},
    { id: 'fr01_graphique', titre: 'FR01 — Images et antécédents (graphique)', enfants: [
      { id: 'fr01_image_g', titre: 'Lire une image graphiquement', actif: true },
      { id: 'fr01_ant_g', titre: 'Lire un antécédent graphiquement', actif: true }
    ]},
    { id: 'fr02_appart', titre: 'FR02 — Appartenance d\'un point à une courbe', enfants: [
      { id: 'fr02_appart', titre: 'Tester l\'appartenance d\'un point', actif: true }
    ]},
    { id: 'fr03_image_calc', titre: 'FR03 — Calculer une image par une formule', enfants: [
      { id: 'fr03_image_aff', titre: 'Image par une fonction affine', actif: true },
      { id: 'fr03_image_carre', titre: 'Image par une fonction du second degré', actif: true },
      { id: 'fr03_image_div', titre: 'Image par une fonction rationnelle', actif: true }
    ]},
    { id: 'fr04_graph_eq', titre: 'FR04 — Résolution graphique d\'équations/inéquations', enfants: [
      { id: 'fr04_eq', titre: 'f(x) = k graphiquement', actif: true },
      { id: 'fr04_ineq', titre: 'f(x) < k ou f(x) > g(x) graphiquement', actif: true }
    ]},
    { id: 'fr05_signe_g', titre: 'FR05 — Signe ou variations (graphique)', enfants: [
      { id: 'fr05_signe', titre: 'Signe d\'une fonction graphiquement', actif: true },
      { id: 'fr05_var', titre: 'Tableau de variations (lecture)', actif: true }
    ]},
    { id: 'fr06_droite', titre: 'FR06/FR07 — Équations de droites', enfants: [
      { id: 'fr06_tracer', titre: 'Tracer une droite (équation donnée)', actif: true },
      { id: 'fr07_lire', titre: 'Lire l\'équation d\'une droite graphique', actif: true }
    ]},
    { id: 'fr08_coef', titre: 'FR08 — Coefficient directeur', enfants: [
      { id: 'fr08_2pts', titre: 'À partir de 2 points', actif: true }
    ]}
  ]},

  // ===== ST. STATISTIQUES =====
  { id: 'st', titre: 'ST. STATISTIQUES', profils: ['seconde','premiere_stmg','premiere_sti2d'], enfants: [
    { id: 'st01_graphs', titre: 'ST01 — Lire et commenter des graphiques', enfants: [
      { id: 'lt_tab', titre: 'Lecture dans un tableau', actif: true },
      { id: 'lt_circ', titre: 'Diagramme circulaire', actif: true },
      { id: 'lt_bar', titre: 'Diagramme en barres', actif: true }
    ]},
    { id: 'st02_indic', titre: 'ST02 — Indicateurs statistiques', enfants: [
      { id: 'st02_moy', titre: 'Moyenne (simple)', actif: true },
      { id: 'st02_moy_pond', titre: 'Moyenne pondérée', actif: true },
      { id: 'st02_med', titre: 'Médiane', actif: true },
      { id: 'st02_quart', titre: 'Quartiles', actif: true }
    ]},
    { id: 'st03_boites', titre: 'ST03 — Boîtes à moustaches', enfants: [
      { id: 'st03_boite', titre: 'Comparaison par boîte à moustaches', actif: true }
    ]}
  ]},

  // ===== PR. PROBABILITÉS =====
  { id: 'pr', titre: 'PR. PROBABILITÉS', profils: ['seconde','premiere_stmg','premiere_sti2d'], enfants: [
    { id: 'pr04_equi', titre: 'PR01–PR04 — Probabilités élémentaires', enfants: [
      { id: 'pr04_equi', titre: 'Équiprobabilité (cardinal)', actif: true },
      { id: 'pr02_contraire', titre: 'Événement contraire', actif: true },
      { id: 'pr03_somme', titre: 'Somme des probabilités d\'issues', actif: true }
    ]},
    { id: 'pr05_cond', titre: 'PR05–PR06 — Probabilités conditionnelles', enfants: [
      { id: 'pr05_tab', titre: 'À partir d\'un tableau croisé', actif: true },
      { id: 'pr05_arbre', titre: 'À partir d\'un arbre pondéré', actif: true }
    ]}
  ]},

  // ===== GÉOMÉTRIE (BONUS, hors programme automatismes officiels) =====
  { id: 'geo', titre: 'GÉOMÉTRIE (bonus, hors automatismes officiels)', profils: ['seconde','premiere_stmg','premiere_sti2d'], enfants: [
    { id: 'geo_vecteurs', titre: 'Vecteurs', enfants: [
      { id: 'vec_coords', titre: "Coordonnées d'un vecteur", actif: true },
      { id: 'vec_somme', titre: 'Somme de vecteurs', actif: true },
      { id: 'vec_colin', titre: 'Colinéarité', actif: true },
      { id: 'vec_norme', titre: "Norme d'un vecteur", actif: true }
    ]},
    { id: 'geo_trigo', titre: 'Trigonométrie', enfants: [
      { id: 'trigo_long', titre: "Calcul d'une longueur", actif: true },
      { id: 'trigo_angle', titre: "Calcul d'un angle", actif: true },
      { id: 'trigo_rapports', titre: 'Identifier sin/cos/tan', actif: true }
    ]},
    { id: 'geo_reperage', titre: 'Repérage', enfants: [
      { id: 'rep_dist', titre: 'Distance entre 2 points', actif: true },
      { id: 'rep_milieu', titre: "Milieu d'un segment", actif: true }
    ]}
  ]},

  // ===== SUITES (1re Techno) =====
  { id: 'su', titre: 'SUITES NUMÉRIQUES (1re Techno)', profils: ['premiere_stmg','premiere_sti2d'], enfants: [
    { id: 'su_general', titre: 'SU — Suites générales', enfants: [
      { id: 'su_terme_fonc', titre: 'Calculer un terme (formule explicite)', actif: true },
      { id: 'su_terme_rec', titre: 'Calculer un terme (récurrence)', actif: true },
      { id: 'su_var_sens', titre: 'Sens de variation', actif: true },
      { id: 'su_repr_graph', titre: 'Représentation graphique', actif: true }
    ]},
    { id: 'su_arith', titre: 'SA — Suites arithmétiques', enfants: [
      { id: 'sa_reconnaitre', titre: 'Reconnaître une suite arithmétique', actif: true },
      { id: 'sa_raison', titre: 'Calculer la raison', actif: true },
      { id: 'sa_terme', titre: 'Calculer un terme', actif: true },
      { id: 'sa_sens', titre: 'Sens de variation', actif: true }
    ]},
    { id: 'su_geom', titre: 'SG — Suites géométriques', enfants: [
      { id: 'sg_reconnaitre', titre: 'Reconnaître une suite géométrique', actif: true },
      { id: 'sg_raison', titre: 'Calculer la raison', actif: true },
      { id: 'sg_terme', titre: 'Calculer un terme', actif: true },
      { id: 'sg_sens', titre: 'Sens de variation', actif: true }
    ]}
  ]},

  // ===== POLYNÔMES (1re Techno) =====
  { id: 'poly', titre: 'POLYNÔMES (1re Techno)', profils: ['premiere_stmg','premiere_sti2d'], enfants: [
    { id: 'poly_2', titre: 'P2 — Polynômes degré 2', enfants: [
      { id: 'p2_image_ax2', titre: 'Image par $x \\mapsto ax^2$', actif: true },
      { id: 'p2_image_axb', titre: 'Image par $x \\mapsto ax^2 + b$', actif: true },
      { id: 'p2_racines', titre: 'Racines d\'un polynôme factorisé', actif: true },
      { id: 'p2_signe', titre: 'Signe d\'un polynôme factorisé', actif: true },
      { id: 'p2_reconnaitre', titre: 'Associer parabole et expression', actif: true },
      { id: 'p2_symetrie', titre: 'Axe de symétrie et extremum', actif: true }
    ]},
    { id: 'poly_3', titre: 'P3 — Polynômes degré 3', enfants: [
      { id: 'p3_image', titre: 'Image par $x \\mapsto ax^3 + b$', actif: true },
      { id: 'p3_racines', titre: 'Racines d\'un polynôme factorisé', actif: true },
      { id: 'p3_cube_eq', titre: 'Résoudre $x^3 = c$, racine cubique', actif: true }
    ]}
  ]},

  // ===== DÉRIVATION (1re Techno) =====
  { id: 'deriv', titre: 'DÉRIVATION (1re Techno)', profils: ['premiere_stmg','premiere_sti2d'], enfants: [
    { id: 'deriv_th', titre: 'DE — Dérivation', enfants: [
      { id: 'de_taux', titre: 'Taux de variation entre 2 points', actif: true },
      { id: 'de_nombre_derive', titre: 'Nombre dérivé (pente de la tangente)', actif: true },
      { id: 'de_tangente_eq', titre: 'Équation de la tangente', actif: true },
      { id: 'de_fonc_derivee', titre: 'Calculer la fonction dérivée', actif: true },
      { id: 'de_signe_derivee', titre: 'Signe de $f\'$ et variations de $f$', actif: true }
    ]}
  ]},

  // ===== STATS / PROBAS (1re Techno) =====
  { id: 'sp', titre: 'STATS / PROBAS (1re Techno)', profils: ['premiere_stmg','premiere_sti2d'], enfants: [
    { id: 'sp_tc', titre: 'TC — Tableaux croisés', enfants: [
      { id: 'tc_lire', titre: 'Lire un tableau croisé', actif: true },
      { id: 'tc_freq_cond', titre: 'Fréquence conditionnelle', actif: true },
      { id: 'tc_completer', titre: 'Compléter un tableau croisé', actif: true }
    ]},
    { id: 'sp_pc', titre: 'PC — Probabilités conditionnelles', enfants: [
      { id: 'pc_tableau', titre: '$P_A(B)$ via un tableau d\'effectifs', actif: true },
      { id: 'pc_independance', titre: 'Tester l\'indépendance de 2 événements', actif: true }
    ]},
    { id: 'sp_ar', titre: 'AR — Arbres de probabilités', enfants: [
      { id: 'ar_2epreuves', titre: '2 épreuves successives (arbre)', actif: true },
      { id: 'ar_bernoulli', titre: 'Répétition d\'épreuves (Bernoulli)', actif: true }
    ]},
    { id: 'sp_va', titre: 'VA — Variables aléatoires', enfants: [
      { id: 'va_loi', titre: 'Loi de probabilité', actif: true },
      { id: 'va_esperance', titre: 'Espérance', actif: true },
      { id: 'va_bernoulli', titre: 'Loi de Bernoulli', actif: true }
    ]}
  ]},

  // ===== TERMINALE SPÉCIALITÉ MATHS =====
  { id: 'tspe', titre: 'TERMINALE SPÉ MATHS', profils: ['terminale_spe'], enfants: [
    { id: 'tspe_ln', titre: 'LN — Logarithme népérien', enfants: [
      { id: 'ln_simplifier', titre: 'Simplifier $\\ln(ab)$, $\\ln(a^n)$, etc.', actif: true },
      { id: 'ln_equation', titre: 'Résoudre $\\ln(x) = k$', actif: true },
      { id: 'ln_inequation', titre: 'Résoudre $\\ln(x) < k$ ou $> k$', actif: true },
      { id: 'ln_limites', titre: 'Limites et croissances comparées', actif: true },
      { id: 'ln_derivee', titre: 'Dériver $\\ln(u(x))$', actif: true },
      { id: 'ln_eq_exp', titre: 'Équations mixtes ln / exp', actif: true }
    ]},
    { id: 'tspe_ex', titre: 'EX — Exponentielle (révisions Tle)', enfants: [
      { id: 'ex_simplifier', titre: 'Simplifier $e^{a+b}$, $(e^a)^n$, etc.', actif: true },
      { id: 'ex_equation', titre: 'Résoudre $e^x = k$', actif: true },
      { id: 'ex_inequation', titre: 'Résoudre $e^x < k$ ou $> k$', actif: true },
      { id: 'ex_limites', titre: 'Limites et croissances comparées', actif: true },
      { id: 'ex_derivee', titre: 'Dériver $e^{u(x)}$', actif: true }
    ]},
    { id: 'tspe_cb', titre: 'CB — Combinatoire', enfants: [
      { id: 'cb_factorielle', titre: 'Factorielles $n!$ et simplifications', actif: true },
      { id: 'cb_kuplets', titre: 'k-uplets, permutations', actif: true },
      { id: 'cb_binomial', titre: 'Coefficient binomial $\\binom{n}{k}$', actif: true },
      { id: 'cb_pascal', titre: 'Triangle de Pascal et relations', actif: true }
    ]},
    { id: 'tspe_su', titre: 'SU — Suites (limites)', enfants: [
      { id: 'tsu_limite', titre: 'Limite d\'une suite simple', actif: true },
      { id: 'tsu_comparaison', titre: 'Théorèmes de comparaison', actif: true },
      { id: 'tsu_qn', titre: 'Limite de $q^n$', actif: true },
      { id: 'tsu_recurrente', titre: 'Suite récurrente $u_{n+1} = f(u_n)$', actif: true },
      { id: 'tsu_croiss_comp', titre: 'Croissances comparées (suites)', actif: true }
    ]},
    { id: 'tspe_lim', titre: 'LIM — Limites de fonctions', enfants: [
      { id: 'lim_infini', titre: 'Limites en $\\pm\\infty$', actif: true },
      { id: 'lim_point', titre: 'Limites en un point', actif: true },
      { id: 'lim_fi', titre: 'Formes indéterminées', actif: true },
      { id: 'lim_asymptote', titre: 'Asymptotes (horizontale, verticale)', actif: true }
    ]},
    { id: 'tspe_dc', titre: 'DC — Dérivation (compléments)', enfants: [
      { id: 'dc_composee', titre: 'Dérivée d\'une composée', actif: true },
      { id: 'dc_seconde', titre: 'Dérivée seconde', actif: true },
      { id: 'dc_convexite', titre: 'Convexité / concavité', actif: true },
      { id: 'dc_inflexion', titre: 'Point d\'inflexion', actif: true }
    ]},
    { id: 'tspe_bi', titre: 'BI — Loi binomiale', enfants: [
      { id: 'bi_proba', titre: 'Calculer $P(X = k)$', actif: true },
      { id: 'bi_esperance', titre: 'Espérance et variance', actif: true },
      { id: 'bi_proba_cumulee', titre: 'Calculer $P(X \\leq k)$', actif: true },
      { id: 'bi_application', titre: 'Applications contextualisées', actif: true }
    ]},
    { id: 'tspe_pr', titre: 'PR — Primitives', enfants: [
      { id: 'pr_usuelles', titre: 'Primitives des fonctions usuelles', actif: true },
      { id: 'pr_uprime_un', titre: "Primitive de $u' u^n$", actif: true },
      { id: 'pr_uprime_eu', titre: "Primitive de $u' e^u$", actif: true },
      { id: 'pr_uprime_sur_u', titre: "Primitive de $u' / u$", actif: true }
    ]},
    { id: 'tspe_ed', titre: 'ED — Équations différentielles', enfants: [
      { id: 'ed_yp_ay', titre: "Résoudre $y' = ay$", actif: true },
      { id: 'ed_yp_ayb', titre: "Résoudre $y' = ay + b$", actif: true },
      { id: 'ed_cauchy', titre: 'Condition initiale (problème de Cauchy)', actif: true }
    ]},
    { id: 'tspe_in', titre: 'IN — Intégration', enfants: [
      { id: 'in_calcul', titre: "Calcul d'une intégrale", actif: true },
      { id: 'in_proprietes', titre: 'Propriétés (linéarité, Chasles)', actif: true },
      { id: 'in_aire', titre: 'Aire sous une courbe', actif: true },
      { id: 'in_ipp', titre: 'Intégration par parties', actif: true }
    ]},
    { id: 'tspe_co', titre: 'CO — Continuité, TVI', enfants: [
      { id: 'co_continuite', titre: 'Continuité en un point', actif: true },
      { id: 'co_tvi', titre: "Théorème des valeurs intermédiaires", actif: true },
      { id: 'co_tvi_corollaire', titre: 'Corollaire (existence et unicité)', actif: true }
    ]},
    { id: 'tspe_tr', titre: 'TR — Trigonométrie', enfants: [
      { id: 'tr_valeurs', titre: 'Valeurs remarquables', actif: true },
      { id: 'tr_equations', titre: 'Équations $\\cos(x) = a$, $\\sin(x) = a$', actif: true },
      { id: 'tr_derivees', titre: 'Dérivées de $\\sin$ et $\\cos$', actif: true },
      { id: 'tr_periodicite', titre: 'Périodicité et parité', actif: true }
    ]},
    { id: 'tspe_va', titre: 'VA — Sommes de v.a., LGN', enfants: [
      { id: 'va_lineaire', titre: 'Espérance et variance de $aX + b$', actif: true },
      { id: 'va_somme', titre: 'Espérance et variance d\'une somme', actif: true },
      { id: 'va_lgn', titre: 'Loi des grands nombres', actif: true }
    ]},
    { id: 'tspe_ge', titre: 'GE — Vecteurs, droites, plans', enfants: [
      { id: 'ge_coords', titre: 'Coordonnées d\'un vecteur, d\'un milieu', actif: true },
      { id: 'ge_norme', titre: 'Norme d\'un vecteur, distance', actif: true },
      { id: 'ge_colineaires', titre: 'Vecteurs colinéaires', actif: true },
      { id: 'ge_parametrique', titre: 'Représentation paramétrique d\'une droite', actif: true },
      { id: 'ge_cart_plan', titre: 'Équation cartésienne d\'un plan', actif: true }
    ]},
    { id: 'tspe_or', titre: 'OR — Orthogonalité, distances', enfants: [
      { id: 'or_pscalaire', titre: 'Produit scalaire dans l\'espace', actif: true },
      { id: 'or_orthogonal', titre: 'Vecteurs orthogonaux', actif: true },
      { id: 'or_normal', titre: 'Vecteur normal à un plan', actif: true },
      { id: 'or_distance', titre: 'Distance d\'un point à un plan', actif: true }
    ]}
  ]},

  // ===== PYTHON =====
  { id: 'py', titre: 'PY. PYTHON (programmation)', profils: ['seconde','premiere_stmg','premiere_sti2d','terminale_spe'], enfants: [
    { id: 'py_calcul_th', titre: 'Calculs avec Python', enfants: [
      { id: 'py_calcul', titre: 'Évaluer une expression', actif: true }
    ]},
    { id: 'py_var_th', titre: 'Variables et affectations', enfants: [
      { id: 'py_var', titre: 'Variables et réaffectations', actif: true }
    ]},
    { id: 'py_fonc_th', titre: 'Fonctions', enfants: [
      { id: 'py_fonction', titre: 'Définir et appeler une fonction', actif: true }
    ]},
    { id: 'py_cond_th', titre: 'Conditions (if/else)', enfants: [
      { id: 'py_if', titre: 'Structures conditionnelles', actif: true }
    ]},
    { id: 'py_for_th', titre: 'Boucles for', enfants: [
      { id: 'py_for', titre: 'Boucles avec range', actif: true }
    ]},
    { id: 'py_while_th', titre: 'Boucles while', enfants: [
      { id: 'py_while', titre: 'Boucles conditionnelles', actif: true }
    ]},
    { id: 'py_listes_th', titre: 'Listes (1re Techno)', enfants: [
      { id: 'py_listes', titre: 'Manipuler des listes', actif: true },
      { id: 'py_listes_iter', titre: 'Parcourir une liste avec for', actif: true }
    ]},
    { id: 'py_accu_th', titre: 'Accumulateurs et compteurs (1re Techno)', enfants: [
      { id: 'py_accumulateur', titre: 'Somme / produit avec accumulateur', actif: true },
      { id: 'py_compteur', titre: 'Compter selon une condition', actif: true }
    ]},
    { id: 'py_alea_th', titre: 'Simulation aléatoire (1re Techno)', enfants: [
      { id: 'py_bernoulli', titre: 'Simulation d\'une épreuve de Bernoulli', actif: true },
      { id: 'py_repetition', titre: 'Répétition d\'épreuves (n essais)', actif: true }
    ]},
    { id: 'py_tspe_th', titre: 'Algorithmes (Terminale spé)', enfants: [
      { id: 'py_suite_rec', titre: 'Suite récurrente $u_{n+1} = f(u_n)$', actif: true },
      { id: 'py_seuil', titre: 'Recherche de seuil', actif: true },
      { id: 'py_somme_suite', titre: 'Somme des termes d\'une suite', actif: true },
      { id: 'py_dichotomie', titre: 'Dichotomie (racine d\'une équation)', actif: true },
      { id: 'py_rectangles', titre: 'Intégration par rectangles', actif: true },
      { id: 'py_marche', titre: 'Marche aléatoire 1D', actif: true }
    ]}
  ]},

  // ===== RÉVISIONS — CONTRÔLES & BAC (Terminale spé) =====
  // Questions de révision plus consistantes que les automatismes (1 à 3 sous-questions),
  // accompagnées d'un rappel de cours optionnel groupé en tête de fiche.
  { id: 'revisions', titre: 'RÉVISIONS — Contrôles & Bac', profils: ['terminale_spe'], enfants: [
   { id: 'rev_annales', titre: 'Annales — questions rapides (type bac)', enfants: [
      { id: 'rev_annales_qcm', titre: 'QCM (4 propositions)', enfants: [
        { id: 'rev_annales_qcm_primitive_xex', titre: 'Primitive de $x\,e^{x}$', actif: true },
        { id: 'rev_annales_qcm_limite_geom', titre: 'Limite d\'un quotient de puissances', actif: true },
        { id: 'rev_annales_qcm_binom_param', titre: 'Paramètres d\'une loi binomiale', actif: true },
        { id: 'rev_annales_qcm_derivee_xln', titre: 'Dérivée d\'un produit avec $\\ln$', actif: true },
        { id: 'rev_annales_qcm_asymptote', titre: 'Asymptote (équation)', actif: true },
        { id: 'rev_annales_qcm_convexite_fss', titre: 'Convexité par signe de $f\'\'$', actif: true },
        { id: 'rev_annales_qcm_tvi', titre: 'Continuité et TVI', actif: true },
        { id: 'rev_annales_qcm_tangente_horiz', titre: 'Tangente horizontale (point critique)', actif: true },
        { id: 'rev_annales_qcm_solution_ed', titre: 'Solution d\'une équation différentielle', actif: true }
      ]},
      { id: 'rev_annales_vraifaux', titre: 'Vrai / Faux à justifier', enfants: [
        { id: 'rev_annales_vf_convexe', titre: 'Convexité de $e^{x} - x$', actif: true },
        { id: 'rev_annales_vf_croissance', titre: 'Croissances comparées (exp/poly)', actif: true },
        { id: 'rev_annales_vf_bornee', titre: 'Suite bornée avec $(-1)^{n}$', actif: true },
        { id: 'rev_annales_vf_eq_exp', titre: 'Équation produit avec $e^{x}$', actif: true },
        { id: 'rev_annales_vf_asymptote', titre: 'Limite et asymptote', actif: true },
        { id: 'rev_annales_vf_tvi', titre: 'Application du TVI', actif: true },
        { id: 'rev_annales_vf_indep', titre: 'Indépendance d\'événements', actif: true },
        { id: 'rev_annales_vf_ipp_resultat', titre: 'Résultat d\'une intégration par parties', actif: true }
      ]},
      { id: 'rev_annales_suite_contexte', titre: 'Suite en contexte (arbre, limite)', enfants: [
        { id: 'rev_annales_suite_aux_geom', titre: 'Suite auxiliaire géométrique ($p_{n+1}=ap_n+b$)', actif: true },
        { id: 'rev_annales_suite_arith_geom_encadrement', titre: 'Suite arithmético-géométrique : encadrement', actif: true }
      ]},
      { id: 'rev_annales_binom_contexte', titre: 'Loi binomiale en contexte', enfants: [
        { id: 'rev_annales_binom_identifier', titre: 'Identifier la loi $\\mathcal{B}(n\\,;\\,p)$', actif: true }
      ]},
      { id: 'rev_annales_recurrence', titre: 'Récurrence (type bac)', enfants: [
        { id: 'rev_annales_recur_minoration', titre: 'Minoration $u_n \\geqslant u_0$', actif: true },
        { id: 'rev_annales_recur_encadrement', titre: 'Encadrement $m \\leqslant u_n \\leqslant M$', actif: true },
        { id: 'rev_annales_recur_monotonie', titre: 'Monotonie $u_{n+1} > u_n$', actif: true }
      ]},
      { id: 'rev_annales_espace', titre: 'Géométrie dans l\'espace (type bac)', enfants: [
        { id: 'rev_annales_esp_normal_plan', titre: 'Vecteur normal à un plan', actif: true },
        { id: 'rev_annales_esp_distance', titre: 'Distance d\'un point à un plan', actif: true },
        { id: 'rev_annales_esp_volume', titre: 'Volume d\'un tétraèdre $OABC$', actif: true },
        { id: 'rev_annales_esp_param', titre: 'Représentation paramétrique d\'une droite', actif: true },
        { id: 'rev_annales_esp_eq_plan', titre: 'Équation cartésienne d\'un plan', actif: true },
        { id: 'rev_annales_esp_intersection', titre: 'Intersection d\'une droite et d\'un plan', actif: true },
        { id: 'rev_annales_esp_projete', titre: 'Projeté orthogonal sur un plan', actif: true },
        { id: 'rev_annales_esp_pos_droites', titre: 'Position relative de deux droites', actif: true },
        { id: 'rev_annales_esp_sphere', titre: 'Sphère (appartenance d\'un point)', actif: true }
      ]},
      { id: 'rev_annales_python', titre: 'Lecture de script Python', enfants: [
        { id: 'rev_annales_py_seuil', titre: 'Recherche de seuil (suite géométrique)', actif: true },
        { id: 'rev_annales_py_somme', titre: 'Boucle <code>for</code> avec somme accumulée', actif: true },
        { id: 'rev_annales_py_dicho', titre: 'Recherche dichotomique', actif: true },
        { id: 'rev_annales_py_completer', titre: 'Compléter un script (à trous)', actif: true }
      ]},
      { id: 'rev_annales_lecture', titre: 'Lecture graphique', enfants: [
        { id: 'rev_annales_lec_tangente', titre: 'Coefficient directeur d\'une tangente', actif: true },
        { id: 'rev_annales_lec_inflexion', titre: 'Point d\'inflexion', actif: true },
        { id: 'rev_annales_lec_variation_fprime', titre: 'Variations de $f$ à partir de $f\'$', actif: true },
        { id: 'rev_annales_lec_signe_fss', titre: 'Signe de $f\'\'$ par lecture', actif: true }
      ]},
      { id: 'rev_annales_proba', titre: 'Probabilités (type bac)', enfants: [
        { id: 'rev_annales_proba_arbre_cond', titre: 'Probabilité conditionnelle par arbre', actif: true },
        { id: 'rev_annales_proba_totales', titre: 'Formule des probabilités totales', actif: true },
        { id: 'rev_annales_proba_binom_calc', titre: '$P(X \\geqslant k)$ à la calculatrice', actif: true },
        { id: 'rev_annales_proba_esp_va', titre: 'Espérance d\'une variable aléatoire', actif: true }
      ]},
      { id: 'rev_annales_conc', titre: 'Concentration & loi des grands nombres', enfants: [
        { id: 'rev_annales_conc_tcheb', titre: 'Bienaymé-Tchebychev (sur $X$)', actif: true },
        { id: 'rev_annales_conc_tcheb_moy', titre: 'Inégalité de concentration (sur $M_n$)', actif: true },
        { id: 'rev_annales_conc_lgn', titre: 'Loi des grands nombres', actif: true }
      ]},
      { id: 'rev_annales_ed', titre: 'Équations différentielles (type bac)', enfants: [
        { id: 'rev_annales_ed_verif_solution', titre: 'Vérifier qu\'une fonction est solution', actif: true },
        { id: 'rev_annales_ed_resoudre_homogene', titre: 'Résoudre $y\' = ay$ avec condition initiale', actif: true },
        { id: 'rev_annales_ed_resoudre_complete', titre: 'Résoudre $y\' = ay + b$ avec condition initiale', actif: true },
        { id: 'rev_bac_ed_homogene', titre: '$y\' = ay$ : résolution complète', actif: true },
        { id: 'rev_bac_ed_complete_const', titre: '$y\' = ay + b$ : résolution complète', actif: true },
        { id: 'rev_bac_ed_verifier', titre: 'Vérification : tous types', actif: true },
        { id: 'rev_bac_ed_part_constante', titre: 'Solution particulière constante', actif: true },
        { id: 'rev_bac_ed_part_donnee', titre: 'Second membre variable ($g$ donnée)', actif: true },
        { id: 'rev_bac_ed_contexte', titre: 'Modélisation (Newton, perfusion, RC)', actif: true },
        { id: 'rev_bac_ed_asymptote', titre: 'Comportement asymptotique', actif: true }
      ]},
     { id: 'rev_annales_int', titre: 'Intégrales — calcul (type bac)', enfants: [
        { id: 'rev_annales_int_primitive_directe', titre: 'Calcul direct par primitive', actif: true },
        { id: 'rev_annales_int_ipp', titre: 'Intégration par parties', actif: true },
        { id: 'rev_annales_int_aire', titre: 'Aire sous une courbe ou entre deux courbes', actif: true },
        { id: 'rev_annales_int_valeur_moyenne', titre: 'Valeur moyenne d\'une fonction', actif: true },
        { id: 'rev_bac_int_polynome', titre: 'Intégrale d\'un polynôme', actif: true },
        { id: 'rev_bac_int_exp_simple', titre: 'Intégrale avec exponentielle ($e^{ax+b}$)', actif: true },
        { id: 'rev_bac_int_ipp_polyexp', titre: 'IPP : polynôme × exponentielle', actif: true },
        { id: 'rev_bac_int_ipp_xln', titre: 'IPP : produit avec $\\ln$', actif: true },
        { id: 'rev_bac_int_aire_courbes', titre: 'Aire entre deux courbes', actif: true },
        { id: 'rev_bac_int_moyenne_bac', titre: 'Valeur moyenne (en contexte)', actif: true },
        { id: 'rev_bac_int_primitive_verif', titre: 'Vérifier qu\'une fonction est primitive', actif: true },
        { id: 'rev_bac_int_encadrement', titre: 'Encadrement d\'une intégrale', actif: true }
      ]},
      { id: 'rev_annales_etude', titre: 'Étude approfondie de fonction', enfants: [
        { id: 'rev_annales_tvi_etude_complete', titre: 'TVI : existence et encadrement de $\\alpha$', actif: true }
      ]}
    ]},
    { id: 'rev_suites', titre: 'Suites', enfants: [
      { id: 'rev_suites_recurrence', titre: 'Récurrence (démonstration)', actif: true },
      { id: 'rev_suites_limite', titre: 'Limite et convergence', actif: true },
      { id: 'rev_suites_variation', titre: 'Sens de variation', actif: true },
      { id: 'rev_suites_somme', titre: 'Somme de termes (géométrique)', actif: true },
      { id: 'rev_suites_geom_explicite', titre: 'Terme général d\'une suite géométrique', actif: true }
    ]},
    { id: 'rev_explog', titre: 'Exponentielle & logarithme', enfants: [
      { id: 'rev_explog_simplifier', titre: 'Simplifier une expression avec $e^x$', actif: true },
      { id: 'rev_explog_equation', titre: 'Résoudre une équation ($e^x = k$, $\\ln x = k$)', actif: true },
      { id: 'rev_explog_derivee', titre: 'Dériver ($e^{u}$, produit)', actif: true },
      { id: 'rev_explog_limite', titre: 'Limites et croissances comparées', actif: true },
      { id: 'rev_explog_proprietes_ln', titre: 'Propriétés du logarithme', actif: true }
    ]},
    { id: 'rev_proba', titre: 'Probabilités', enfants: [
      { id: 'rev_proba_binom_calcul', titre: 'Loi binomiale — calcul de $P(X=k)$', actif: true },
      { id: 'rev_proba_binom_esperance', titre: 'Loi binomiale — espérance et variance', actif: true },
      { id: 'rev_proba_conditionnelle', titre: 'Probabilité conditionnelle $P_A(B)$', actif: true },
      { id: 'rev_proba_totales', titre: 'Formule des probabilités totales', actif: true },
      { id: 'rev_proba_esperance_va', titre: 'Espérance d\'une variable aléatoire', actif: true }
    ]},
    { id: 'rev_lim', titre: 'Limites & continuité', enfants: [
      { id: 'rev_lim_rationnelle', titre: 'Limite d\'une fonction rationnelle', actif: true },
      { id: 'rev_lim_asymptote', titre: 'Asymptotes', actif: true },
      { id: 'rev_lim_tvi', titre: 'Théorème des valeurs intermédiaires', actif: true }
    ]},
    { id: 'rev_deriv', titre: 'Dérivation & convexité', enfants: [
      { id: 'rev_deriv_calcul', titre: 'Calcul de dérivées', actif: true },
      { id: 'rev_deriv_tangente', titre: 'Équation de la tangente', actif: true },
      { id: 'rev_deriv_convexite', titre: 'Convexité et point d\'inflexion', actif: true }
    ]},
    { id: 'rev_integ', titre: 'Intégration', enfants: [
      { id: 'rev_integ_polynome', titre: 'Intégrale d\'un polynôme', actif: true },
      { id: 'rev_integ_exp', titre: 'Intégrale avec exponentielle', actif: true },
      { id: 'rev_integ_aire', titre: 'Aire sous une courbe', actif: true },
      { id: 'rev_integ_moyenne', titre: 'Valeur moyenne d\'une fonction', actif: true }
    ]},
    { id: 'rev_espace', titre: 'Géométrie dans l\'espace', enfants: [
      { id: 'rev_espace_scalaire', titre: 'Produit scalaire dans l\'espace', actif: true },
      { id: 'rev_espace_norme', titre: 'Distance entre deux points', actif: true },
      { id: 'rev_espace_plan', titre: 'Équation cartésienne d\'un plan', actif: true },
      { id: 'rev_espace_droite', titre: 'Représentation paramétrique d\'une droite', actif: true },
      { id: 'rev_espace_colineaire', titre: 'Colinéarité de vecteurs', actif: true },
      { id: 'rev_espace_volume', titre: 'Volume d\'un tétraèdre', actif: true },
      { id: 'rev_espace_projete', titre: 'Projeté orthogonal (plan, droite)', actif: true },
      { id: 'rev_espace_position_droites', titre: 'Position relative de deux droites', actif: true },
      { id: 'rev_espace_intersection', titre: 'Intersection droite-plan', actif: true },
      { id: 'rev_espace_plans', titre: 'Plans parallèles / perpendiculaires', actif: true },
      { id: 'rev_espace_sphere', titre: 'Sphère (appartenance d\'un point)', actif: true }
    ]},
    { id: 'rev_repere', titre: 'Géométrie repérée & vecteurs (plan)', enfants: [
      { id: 'rev_repere_vecteur', titre: 'Coordonnées d\'un vecteur, milieu', actif: true },
      { id: 'rev_repere_scalaire', titre: 'Produit scalaire dans le plan', actif: true },
      { id: 'rev_repere_droite', titre: 'Équation réduite d\'une droite', actif: true }
    ]},
    { id: 'rev_concentration', titre: 'Concentration & loi des grands nombres', enfants: [
      { id: 'rev_conc_esp_var', titre: 'Espérance et variance', actif: true },
      { id: 'rev_conc_tchebychev', titre: 'Inégalité de Bienaymé-Tchebychev', actif: true },
      { id: 'rev_conc_concentration', titre: 'Inégalité de concentration', actif: true },
      { id: 'rev_conc_lgn', titre: 'Loi des grands nombres', actif: true }
    ]}
  ]}
];

const etat = {};

// === Helpers (rand, pick, qcm, creerRepere…) chargés via js/helpers.js ===
// === Générateurs chargés via js/gen_*.js — agrégés dans window.LM_GEN ===
// Tous les fichiers js/ sont chargés en `defer` (cf. <head>), donc
// disponibles ici au moment où le script inline s'exécute.
const generateurs = window.LM_GEN;

function aDesEnfantsActifs(noeud) {
  if (!noeud.enfants) return noeud.actif;
  return noeud.enfants.some(aDesEnfantsActifs);
}

function construireArbre() {
  const racine = document.getElementById('arbre');
  racine.innerHTML = '';
  const profil = profilSelectionne();
  // Le bloc "Sujet type bac" n'a de sens que pour Terminale spé (où vivent les annales)
  const blocBac = document.getElementById('bloc-sujet-bac');
  if (blocBac) blocBac.style.display = (profil === 'terminale_spe') ? 'block' : 'none';
  // Ne montrer que les thèmes racines correspondant au profil sélectionné
  // (les thèmes sans champ "profils" sont visibles partout, par sécurité)
  // Filtrage supplémentaire par mode (cf. modeActif lu depuis ?mode=) :
  //   • mode 'automatismes' (défaut) → on cache la branche 'revisions'
  //   • mode 'annales'              → on ne montre QUE la branche 'revisions'
  for (const theme of ARBRE) {
    if (theme.profils && !theme.profils.includes(profil)) continue;
    if (modeActif === 'automatismes' && theme.id === 'revisions') continue;
    if (modeActif === 'annales' && theme.id !== 'revisions') continue;
    racine.appendChild(rendreNoeud(theme, 1));
  }
  // En Terminale spé, on déplie d'emblée le module RÉVISIONS et ses sous-thèmes
  // pour que les rubriques élémentaires (Volume d'un tétraèdre, Inégalité de
  // Bienaymé-Tchebychev, etc.) soient visibles sans avoir à cliquer.
  if (profil === 'terminale_spe') {
    const moduleRev = racine.querySelector('.noeud[data-id="revisions"]');
    if (moduleRev) {
      // Déplier le module lui-même et tous ses sous-thèmes (pas les feuilles, qui n'ont pas d'enfants)
      moduleRev.querySelectorAll('.enfants').forEach(e => e.style.display = 'block');
      moduleRev.querySelectorAll('.triangle:not(.vide)').forEach(t => t.classList.add('ouvert'));
    }
  }
}

// Reconstruire l'arbre quand on change de profil
// (avec remise à zéro des compteurs : les thèmes invisibles ne doivent pas
// continuer à contribuer à la fiche)
function onChangementProfil() {
  // Sauvegarder l'état des cases cochées et compteurs avant reconstruction
  // (les cases cochées d'un autre profil seront perdues lors du switch, c'est voulu)
  document.querySelectorAll('.compteur .valeur').forEach(el => {
    el.textContent = '0';
    el.classList.add('zero');
  });
  construireArbre();
  majTotal();
}

function rendreNoeud(noeud, niveau) {
  const div = document.createElement('div');
  div.className = `noeud niveau-${niveau}`;
  div.dataset.id = noeud.id;
  const estFeuille = !noeud.enfants;
  const actif = aDesEnfantsActifs(noeud);
  const ligne = document.createElement('div');
  ligne.className = 'ligne';
  const triangle = document.createElement('span');
  triangle.className = 'triangle';
  if (estFeuille) { triangle.classList.add('vide'); triangle.textContent = ''; }
  else { triangle.textContent = '▶'; triangle.addEventListener('click', () => basculerOuvert(div, triangle)); }
  ligne.appendChild(triangle);

  const case_ = document.createElement('input');
  case_.type = 'checkbox';
  case_.className = 'case';
  case_.id = `case-${noeud.id}`;
  case_.dataset.id = noeud.id;
  case_.disabled = !actif;
  case_.addEventListener('change', () => cocherChange(noeud));
  ligne.appendChild(case_);

  const libelle = document.createElement('label');
  libelle.className = 'libelle';
  libelle.htmlFor = case_.id;
  libelle.textContent = noeud.titre;
  if (!actif) {
    libelle.classList.add('bientot');
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = 'bientôt';
    libelle.appendChild(badge);
  }
  ligne.appendChild(libelle);

  if (actif) {
    const compteur = document.createElement('span');
    compteur.className = 'compteur';
    compteur.innerHTML = `<button type="button" data-action="moins">−</button><span class="valeur zero" data-valeur>0</span><button type="button" data-action="plus">+</button>`;
    compteur.querySelector('[data-action="moins"]').addEventListener('click', () => modifierCompteur(noeud, -1));
    compteur.querySelector('[data-action="plus"]').addEventListener('click', () => modifierCompteur(noeud, +1));
    ligne.appendChild(compteur);
  }
  div.appendChild(ligne);

  if (!estFeuille) {
    const enfants = document.createElement('div');
    enfants.className = 'enfants';
    enfants.style.display = 'none';
    for (const e of noeud.enfants) enfants.appendChild(rendreNoeud(e, niveau + 1));
    div.appendChild(enfants);
  }
  return div;
}

function basculerOuvert(div, triangle) {
  const enfants = div.querySelector('.enfants');
  if (!enfants) return;
  const ouvert = enfants.style.display !== 'none';
  enfants.style.display = ouvert ? 'none' : 'block';
  triangle.classList.toggle('ouvert', !ouvert);
}

function modifierCompteur(noeud, delta) {
  if (estDescendantDeCoche(noeud)) return;
  if (!aDesEnfantsActifs(noeud)) return;
  const courant = etat[noeud.id] || 0;
  const nv = Math.max(0, courant + delta);
  etat[noeud.id] = nv;
  const div = document.querySelector(`.noeud[data-id="${noeud.id}"]`);
  const valeur = div.querySelector(':scope > .ligne .valeur');
  if (valeur) { valeur.textContent = nv; valeur.classList.toggle('zero', nv === 0); }
  const case_ = div.querySelector(':scope > .ligne .case');
  if (case_) {
    case_.checked = nv > 0;
    if (nv > 0 && noeud.enfants) verrouillerDescendants(noeud, true);
    if (nv === 0 && noeud.enfants) verrouillerDescendants(noeud, false);
  }
  majTotal();
}

function cocherChange(noeud) {
  const div = document.querySelector(`.noeud[data-id="${noeud.id}"]`);
  const case_ = div.querySelector(':scope > .ligne .case');
  if (case_.checked) {
    if (!(etat[noeud.id] > 0)) {
      etat[noeud.id] = 1;
      const valeur = div.querySelector(':scope > .ligne .valeur');
      if (valeur) { valeur.textContent = 1; valeur.classList.remove('zero'); }
    }
    if (noeud.enfants) verrouillerDescendants(noeud, true);
  } else {
    etat[noeud.id] = 0;
    const valeur = div.querySelector(':scope > .ligne .valeur');
    if (valeur) { valeur.textContent = 0; valeur.classList.add('zero'); }
    if (noeud.enfants) verrouillerDescendants(noeud, false);
  }
  majTotal();
}

function verrouillerDescendants(noeud, verrou) {
  if (!noeud.enfants) return;
  for (const e of noeud.enfants) {
    const divE = document.querySelector(`.noeud[data-id="${e.id}"]`);
    if (!divE) continue;
    const caseE = divE.querySelector(':scope > .ligne .case');
    const libE = divE.querySelector(':scope > .ligne .libelle');
    if (caseE) {
      if (verrou) {
        caseE.disabled = true;
        if (libE) libE.classList.add('parent-coche');
        if (caseE.checked) {
          caseE.checked = false;
          etat[e.id] = 0;
          const v = divE.querySelector(':scope > .ligne .valeur');
          if (v) { v.textContent = 0; v.classList.add('zero'); }
        }
      } else {
        if (aDesEnfantsActifs(e)) caseE.disabled = false;
        if (libE) libE.classList.remove('parent-coche');
      }
    }
    verrouillerDescendants(e, verrou);
  }
}

function estDescendantDeCoche(noeud) {
  function chercher(arbre, idCible, chemin) {
    for (const n of arbre) {
      const nc = [...chemin, n];
      if (n.id === idCible) return nc;
      if (n.enfants) { const r = chercher(n.enfants, idCible, nc); if (r) return r; }
    }
    return null;
  }
  const chemin = chercher(ARBRE, noeud.id, []);
  if (!chemin) return false;
  for (let i = 0; i < chemin.length - 1; i++) {
    if ((etat[chemin[i].id] || 0) > 0) return true;
  }
  return false;
}

function majTotal() {
  let total = 0;
  function visiter(noeud, parentCoche) {
    const c = etat[noeud.id] || 0;
    if (c > 0 && !parentCoche) total += c;
    if (noeud.enfants) {
      const monStatut = parentCoche || (c > 0);
      for (const e of noeud.enfants) visiter(e, monStatut);
    }
  }
  for (const t of ARBRE) visiter(t, false);
  document.getElementById('total-questions').textContent = total;
  document.getElementById('total-s').textContent = total > 1 ? 's' : '';
}

function recolterFeuillesActives(noeud) {
  if (!noeud.enfants) return noeud.actif ? [noeud.id] : [];
  const r = [];
  for (const e of noeud.enfants) r.push(...recolterFeuillesActives(e));
  return r;
}

// Retrouve le libellé (titre) d'un générateur à partir de son id, en parcourant l'arbre.
// Renvoie aussi le libellé du parent (pour avoir « CA02 — Développer (3x+2)(...) »)
function libelleGenerateur(id) {
  function chercher(noeud, parent) {
    if (noeud.id === id) {
      return { titre: noeud.titre, parent: parent ? parent.titre : null };
    }
    if (noeud.enfants) {
      for (const e of noeud.enfants) {
        const r = chercher(e, noeud);
        if (r) return r;
      }
    }
    return null;
  }
  for (const t of ARBRE) {
    const r = chercher(t, null);
    if (r) return r;
  }
  return { titre: id, parent: null };
}

function collecterGenerateurs() {
  const blocs = [];
  function visiter(noeud, parentCoche) {
    const c = etat[noeud.id] || 0;
    if (c > 0 && !parentCoche) {
      const gens = recolterFeuillesActives(noeud);
      if (gens.length > 0) blocs.push({ generateurs: gens, nombre: c });
    }
    if (noeud.enfants) {
      const monStatut = parentCoche || (c > 0);
      for (const e of noeud.enfants) visiter(e, monStatut);
    }
  }
  for (const t of ARBRE) visiter(t, false);
  return blocs;
}

function genererListeExercices(blocs, difficulte) {
  const exercices = [];
  for (const b of blocs) {
    const tirages = [];
    if (b.nombre <= b.generateurs.length) {
      const pool = b.generateurs.slice();
      while (tirages.length < b.nombre) {
        const idx = Math.floor(Math.random() * pool.length);
        tirages.push(pool[idx]);
        pool.splice(idx, 1);
      }
    } else {
      while (tirages.length < b.nombre) {
        const restant = b.generateurs.slice();
        while (restant.length > 0 && tirages.length < b.nombre) {
          const idx = Math.floor(Math.random() * restant.length);
          tirages.push(restant[idx]);
          restant.splice(idx, 1);
        }
      }
    }
    for (const id of tirages) {
      const g = generateurs[id];
      if (g) {
        const q = g(difficulte);
        // Conserver l'id du générateur pour permettre la régénération unitaire dans l'aperçu
        exercices.push({ ...q, _generateurId: id });
      }
    }
  }
  for (let i = exercices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [exercices[i], exercices[j]] = [exercices[j], exercices[i]];
  }
  return exercices;
}

// Liste des thèmes cochés au plus haut niveau (pour le sous-titre PDF)
// Libellé optionnel imposé pour le sous-titre PDF (ex. "Sujet type bac").
// Quand il est défini, il remplace la liste des thèmes cochés.
let sujetBacLabel = null;

function thèmesChoisis() {
  if (sujetBacLabel) return [sujetBacLabel];
  const noms = [];
  function visiter(noeud, parentCoche) {
    const c = etat[noeud.id] || 0;
    if (c > 0 && !parentCoche) noms.push(noeud.titre);
    if (noeud.enfants) {
      const monStatut = parentCoche || (c > 0);
      for (const e of noeud.enfants) visiter(e, monStatut);
    }
  }
  for (const t of ARBRE) visiter(t, false);
  return noms;
}

// Convertit l'identifiant de profil en libellé lisible pour le PDF
function libelleProfil(idProfil) {
  switch (idProfil) {
    case 'seconde': return 'Seconde';
    case 'premiere_ss': return 'Première — Sans spécialité';
    case 'premiere_spe': return 'Première — Spécialité maths';
    case 'premiere_stmg': return 'Première STMG';
    case 'premiere_sti2d': return 'Première STI2D';
    case 'terminale_spe': return 'Terminale — Spécialité maths';
    default: return 'Seconde';
  }
}

function profilSelectionne() {
  const r = document.querySelector('input[name="profil"]:checked');
  return r ? r.value : 'seconde';
}

// Coefficient multiplicateur global appliqué à toutes les hauteurs d'espace
// de réponse. Lu sur les boutons radio "taille-reponse" du panneau de gauche.
//   Aucun  → 0     (aucun espace : ni brouillon ni cadre-réponse)
//   Petit  → 0.5   (compact : la moitié de la valeur calculée)
//   Moyen  → 0.85  (standard, intermédiaire)
//   Grand  → 1.2   (aéré : un peu plus que la valeur calculée)
// Défaut "Petit" car le calibrage natif était jugé trop généreux.
function coefficientTailleReponse() {
  const sel = document.querySelector('input[name="taille-reponse"]:checked');
  const v = sel ? sel.value : 'petit';
  // ?? au lieu de || : en JS, 0 est falsy donc `0 || 0.5` retourne 0.5,
  // ce qui empêchait "Aucun" (valeur 0) de réellement supprimer l'espace.
  return { aucun: 0, petit: 0.5, moyen: 0.85, grand: 1.2 }[v] ?? 0.5;
}

// Mesure approximative du nombre de lignes manuscrites nécessaires pour
// recopier/rédiger un corrigé. Sert de base à toutes les estimations d'espace.
//   • <br> = saut de ligne explicite
//   • un segment trop long est compté pour plusieurs lignes (retour automatique)
//   • on retire balises HTML et délimiteurs $ pour mesurer le contenu net
function lignesCorrige(corrige) {
  const CHARS_PAR_LIGNE = 68;
  const segments = corrige.split(/<br\s*\/?>/i);
  let lignes = 0;
  for (let seg of segments) {
    const net = seg.replace(/<[^>]+>/g, '').replace(/\$/g, '').replace(/\s+/g, ' ').trim();
    if (net.length === 0) continue;
    lignes += Math.max(1, Math.ceil(net.length / CHARS_PAR_LIGNE));
  }
  return Math.max(1, lignes);
}

// HTML pour la page 1 : énoncés
// Estime la hauteur (en pixels) à réserver pour le brouillon AVANT le cadre-réponse,
// en se fondant sur la LONGUEUR DU CORRIGÉ (nombre de lignes manuscrites estimé).
// Logique : on calcule la place totale nécessaire pour la rédaction puis on retire la
// hauteur du cadre-réponse final (≈ 48 px) ; le reste constitue le brouillon.
// Le coefficient global Petit/Moyen/Grand est appliqué en fin de calcul.
function estimerEspaceCalcul(ex, difficulte) {
  if (!ex || !ex.corrige) return 0;

  const LIGNE_PX = 26;             // hauteur d'une ligne manuscrite
  const FACTEUR_ELEVE = 1.25;      // l'élève rédige un peu plus espacé que le corrigé
  const CADRE_PX = 48;             // hauteur du cadre-réponse final
  // Hauteur totale estimée pour rédiger la réponse complète
  const lignes = lignesCorrige(ex.corrige);
  let total = lignes * LIGNE_PX * FACTEUR_ELEVE;
  // Bonus difficulté : un peu plus pour les exos durs (raisonnement plus posé)
  total += (difficulte - 1) * 4;
  // Si l'exercice a une figure ou un tableau, l'élève écrit moins
  if (ex.svg || ex.tableau) total -= 15;
  // Le brouillon = total - cadre-réponse final
  let espace = Math.round(total - CADRE_PX);

  // Bonus pour certains types d'exos qui demandent de poser un calcul écrit
  // ÉCRIT ailleurs que dans le cadre, même si le corrigé final est compact.
  if (ex._generateurId) {
    const id = ex._generateurId;
    if (id.startsWith('ca')) espace = Math.max(espace, 35);
    if (id.startsWith('eq')) espace = Math.max(espace, 40);
    if (id.startsWith('ev')) espace = Math.max(espace, 30);
    if (id.startsWith('su') || id.startsWith('sa') || id.startsWith('sg')) {
      if (id.includes('terme') || id.includes('rec')) espace = Math.max(espace, 40);
    }
    if (id.startsWith('p2_image') || id.startsWith('p3_image')) espace = Math.max(espace, 30);
    if (id === 'de_tangente_eq' || id === 'de_fonc_derivee') espace = Math.max(espace, 35);
    // Python : cas particuliers selon le type de question
    if (id.startsWith('py')) {
      const demandeEcriture = ex.enonce && /Écrire|écrire un programme|écrire une fonction/i.test(ex.enonce);
      const aTrous = ex.code && ex.code.includes('___');
      if (demandeEcriture) espace = 160;        // 10-12 lignes de code
      else if (aTrous) espace = 0;              // pas de place : l'élève écrit directement dans les trous
      else espace = Math.min(espace, 30);       // sinon : peu d'écriture
    }
  }

  // Appliquer le coefficient global Petit/Moyen/Grand
  espace = Math.round(espace * coefficientTailleReponse());
  // Bornes
  espace = Math.max(0, Math.min(180, espace));
  return espace;
}

// Espace de réponse OUVERT (sans cadre) pour les questions de révision / type bac.
// Plutôt qu'une hauteur forfaitaire, on estime la place qu'occuperait la rédaction
// manuscrite de la réponse en mesurant la longueur réelle du corrigé : on compte le
// nombre de lignes qu'il occuperait (segments séparés par <br>, chacun pouvant être
// coupé en plusieurs lignes selon sa longueur), puis on convertit en hauteur en
// tenant compte du fait qu'un élève écrit un peu plus espacé que le corrigé modèle.
function estimerEspaceReponse(ex, difficulte) {
  const id = ex && ex._generateurId ? ex._generateurId : '';
  if (!id.startsWith('rev_')) return -1; // -1 = pas une révision → comportement normal (cadre)
  // Cas spécial : exo "compléter un script Python" (les trous sont dans l'énoncé,
  // l'élève écrit directement dans le code, pas besoin d'espace en dessous).
  const aTrous = (ex.enonce && ex.enonce.includes('____')) || (ex.code && ex.code.includes('____'));
  if (aTrous) return 0;
  const coef = coefficientTailleReponse();
  if (!ex.corrige) return Math.round(60 * coef);

  const LIGNE_PX = 26;            // hauteur d'une ligne manuscrite
  const FACTEUR_ELEVE = 1.25;     // l'élève rédige un peu plus espacé que le corrigé

  // Nombre de lignes manuscrites estimé d'après le corrigé (helper unifié)
  const lignes = lignesCorrige(ex.corrige);

  // Conversion en hauteur, avec la marge "écriture élève"
  let h = Math.round(lignes * LIGNE_PX * FACTEUR_ELEVE);

  // Les démonstrations par récurrence demandent un peu plus (initialisation, hérédité,
  // conclusion : l'élève structure et espace davantage que le corrigé condensé).
  if (id.includes('recurrence')) h = Math.round(h * 1.15);

  // Coefficient global Petit/Moyen/Grand
  h = Math.round(h * coef);

  // Bornes raisonnables : ni trop serré, ni une demi-page inutile
  h = Math.max(36, Math.min(260, h));
  return h;
}
// On échappe d'abord le HTML, puis on applique des règles regex dans l'ordre :
// 1) Commentaires (# ...) — englobants
// 2) Chaînes de caractères ("..." ou '...')
// 3) Nombres
// 4) Mots-clés Python
function colorerCodePython(code) {
  // Liste des mots-clés et fonctions/types built-in les plus courants à mettre en valeur
  const motsCles = ['def', 'return', 'for', 'while', 'if', 'elif', 'else', 'in', 'and', 'or', 'not',
                    'from', 'import', 'True', 'False', 'None', 'pass', 'break', 'continue',
                    'print', 'range', 'len', 'abs', 'int', 'float', 'str', 'list'];
  // 1) Échapper le HTML (les balises < et > et &)
  let txt = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // 2) Protéger les portions colorées avec des jetons temporaires (\u0001 etc.)
  const tokens = [];
  const placeholder = (cls, contenu) => {
    const i = tokens.length;
    tokens.push(`<span class="${cls}">${contenu}</span>`);
    return `\u0001${i}\u0001`;
  };
  // a) Commentaires (priorité haute)
  txt = txt.replace(/(#[^\n]*)/g, (_, m) => placeholder('py-com', m));
  // b) Chaînes de caractères "..." et '...'
  txt = txt.replace(/("[^"]*"|'[^']*')/g, (_, m) => placeholder('py-str', m));
  // c) Nombres (entiers et flottants)
  txt = txt.replace(/\b(\d+\.?\d*)\b/g, (_, m) => placeholder('py-num', m));
  // d) Mots-clés (en respectant les frontières de mots)
  const regexMots = new RegExp('\\b(' + motsCles.join('|') + ')\\b', 'g');
  txt = txt.replace(regexMots, (_, m) => placeholder('py-kw', m));
  // 3) Remplacer les jetons par leur contenu coloré
  txt = txt.replace(/\u0001(\d+)\u0001/g, (_, i) => tokens[parseInt(i, 10)]);
  return txt;
}

// Construit l'encadré "Mémo" groupé en tête de fiche, à partir des champs
// `rappel` des exercices. Dédoublonne : un même rappel partagé par plusieurs
// exercices n'apparaît qu'une fois. Vide (chaîne) si l'option est décochée
// ou si aucun exercice ne porte de rappel.
function composerMemoRappels(exercices) {
  const caseRappels = document.getElementById('rappels-cours');
  if (caseRappels && !caseRappels.checked) return '';
  // Collecte ordonnée + dédoublonnage des rappels non vides
  const vus = new Set();
  const rappels = [];
  for (const ex of exercices) {
    if (ex && ex.rappel) {
      const clef = ex.rappel.trim();
      if (clef && !vus.has(clef)) {
        vus.add(clef);
        rappels.push(ex.rappel);
      }
    }
  }
  if (rappels.length === 0) return '';
  const items = rappels.map(r => `<li style="margin-bottom: 6px;">${r}</li>`).join('');
  return `<div class="memo-rappels" style="border: 1px solid #c9b896; border-left: 4px solid #c9b896; background: #faf6ec; border-radius: 4px; padding: 12px 16px 12px 18px; margin-bottom: 18px; font-size: 13.5px; color: #4a443c;">
    <div style="font-family: 'Crimson Pro', Georgia, serif; font-weight: 600; font-size: 15px; color: #1e3a5f; margin-bottom: 8px;">Mémo — rappels de cours</div>
    <ul style="margin: 0; padding-left: 20px;">${items}</ul>
  </div>`;
}

function composerHTMLEnonces(exercices, difficulte) {
  const dateFr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const etoiles = '★'.repeat(difficulte);
  const themes = thèmesChoisis().join(' · ');
  const profil = libelleProfil(profilSelectionne());
  // Sous-titre structuré : chapitres sur une ligne, métadonnées en dessous
  const sousTitre = themes
    ? `<div style="margin-bottom: 4px;">${themes}</div><div style="font-size: 13px; color: #8a8275;">Fiche générée le ${dateFr} &nbsp;·&nbsp; Difficulté : ${etoiles}</div>`
    : `Fiche générée le ${dateFr} &nbsp;·&nbsp; Difficulté : ${etoiles}`;
  // Logo SVG inline (sobre, dans la charte du site)
  const logoSVG = `<svg width="42" height="42" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
    <circle cx="21" cy="21" r="20" fill="#1e3a5f" stroke="#c9b896" stroke-width="1.5"/>
    <text x="21" y="28" text-anchor="middle" font-family="'Crimson Pro', Georgia, serif" font-size="20" font-weight="600" fill="#f5efe4">∑</text>
  </svg>`;
  // Cadre "Nom / Classe / Date" pour version imprimée
  const cadreEleve = `<div class="cadre-eleve" style="display: flex; gap: 20px; margin-bottom: 18px; font-size: 13px; color: #4a443c;">
    <div style="flex: 2;"><strong>Nom :</strong> <span style="border-bottom: 1px solid #b8b0a1; display: inline-block; min-width: 200px; height: 18px;"></span></div>
    <div style="flex: 1;"><strong>Classe :</strong> <span style="border-bottom: 1px solid #b8b0a1; display: inline-block; min-width: 80px; height: 18px;"></span></div>
    <div style="flex: 1;"><strong>Date :</strong> <span style="border-bottom: 1px solid #b8b0a1; display: inline-block; min-width: 80px; height: 18px;"></span></div>
  </div>`;
  let html = `<div class="entete-pdf" style="display: flex; gap: 16px; align-items: flex-start;">
    ${logoSVG}
    <div style="flex: 1;">
      <h2>Automatismes — ${profil}</h2>
      <div class="sous">${sousTitre}</div>
    </div>
  </div>${cadreEleve}${composerMemoRappels(exercices)}`;
  exercices.forEach((ex, i) => {
    // Insertion SVG inline (MathJax ignorera le contenu grâce à skipHtmlTags: ['svg'])
    const svgHTML = ex.svg ? `<div class="graphique">${ex.svg}</div>` : '';
    const codeHTML = ex.code ? `<div class="code-python">${colorerCodePython(ex.code)}</div>` : '';
    const tableauHTML = ex.tableau ? `<div class="tableau-zone">${ex.tableau}</div>` : '';
    // Espace de réponse : pour les questions de révision / type bac, on n'enferme
    // pas la réponse dans un petit cadre — on laisse un espace ouvert et généreux,
    // dimensionné selon le type de question. Pour les automatismes, on garde le
    // cadre-réponse habituel précédé d'un espace de brouillon.
    const espaceReponse = estimerEspaceReponse(ex, difficulte);
    const coefTaille = coefficientTailleReponse();
    // Détection des exos avec un SCRIPT AFFICHÉ (à lire, analyser ou compléter) :
    //   - automatismes py_* : le code est dans ex.code (affiché en bloc à droite)
    //   - annales rev_annales_py_* : le code est dans ex.enonce sous forme <pre>...
    // Pour ces exos, l'élève écrit directement dans/à côté du code, on ne laisse
    // pas d'espace de réponse en dessous.
    // Exception : les exos qui demandent d'ÉCRIRE un programme (py_bernoulli, py_repetition)
    // n'ont ni ex.code ni <pre> dans l'énoncé, donc ils ne sont pas concernés.
    const exoAvecScriptAffiche = !!ex.code || (ex.enonce && ex.enonce.includes('<pre>'));
    let zoneReponseHTML;
    if (coefTaille === 0) {
      // L'utilisateur a choisi "Aucun" : on n'affiche ni brouillon, ni cadre-réponse
      zoneReponseHTML = '';
    } else if (exoAvecScriptAffiche) {
      // Exo avec script Python à lire/compléter : l'élève écrit dans/à côté du code
      zoneReponseHTML = '';
    } else if (espaceReponse > 0) {
      // Question de révision : espace ouvert sans cadre
      zoneReponseHTML = `<div class="reponse-ouverte" style="height: ${espaceReponse}px;"></div>`;
    } else {
      // Automatisme : brouillon dimensionné + cadre-réponse
      const hauteurBrouillon = estimerEspaceCalcul(ex, difficulte);
      const brouillonHTML = hauteurBrouillon > 0
        ? `<div class="zone-brouillon" style="height: ${hauteurBrouillon}px;"></div>`
        : '';
      zoneReponseHTML = `${brouillonHTML}<div class="reponse-cadre"></div>`;
    }
    html += `<div class="exercice"><span class="num">${i+1}</span><div class="partie-texte"><span class="enonce">${ex.enonce}</span>${tableauHTML}${zoneReponseHTML}</div>${svgHTML}${codeHTML}</div>`;
  });
  html += `<div class="pied-pdf">LaboMath — Lycée de Baudre · Agen</div>`;
  return html;
}

// HTML pour la page 2 : corrigés
function composerHTMLCorriges(exercices, difficulte) {
  const dateFr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const etoiles = '★'.repeat(difficulte);
  const profil = libelleProfil(profilSelectionne());
  // Logo SVG inline (même que page 1)
  const logoSVG = `<svg width="42" height="42" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
    <circle cx="21" cy="21" r="20" fill="#1e3a5f" stroke="#c9b896" stroke-width="1.5"/>
    <text x="21" y="28" text-anchor="middle" font-family="'Crimson Pro', Georgia, serif" font-size="20" font-weight="600" fill="#f5efe4">∑</text>
  </svg>`;
  let html = `<div class="entete-pdf" style="display: flex; gap: 16px; align-items: flex-start;">
    ${logoSVG}
    <div style="flex: 1;">
      <h2>Corrigés — Automatismes ${profil}</h2>
      <div class="sous">Fiche du ${dateFr} &nbsp;·&nbsp; Difficulté : ${etoiles}</div>
    </div>
  </div>`;
  exercices.forEach((ex, i) => {
    html += `<div class="corrige"><span class="num">${i+1}.</span> <span class="texte">${ex.corrige}</span></div>`;
  });
  html += `<div class="pied-pdf">LaboMath — Lycée de Baudre · Agen</div>`;
  return html;
}

// Capturer une zone HTML en image base64, en utilisant la zone PDF cachée
// Retourne aussi les positions verticales des "blocs cassables" (exercices/corrigés)
async function capturerHTMLversCanvas(html) {
  const zone = document.getElementById('zone-pdf');
  zone.innerHTML = html;
  // Faire rendre les formules par MathJax (en SVG)
  if (window.MathJax && window.MathJax.typesetPromise) {
    await window.MathJax.typesetPromise([zone]);
  }
  // Attendre que toutes les images (data-URL des graphiques) soient chargées
  const imgs = zone.querySelectorAll('img');
  await Promise.all([...imgs].map(img => {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    return new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
      setTimeout(resolve, 2000); // timeout de sécurité
    });
  }));
  // Petit délai supplémentaire pour s'assurer que le DOM est stabilisé
  await new Promise(r => setTimeout(r, 200));
  const apercu = document.getElementById('apercu-pdf');
  apercu.style.display = 'block';
  apercu.style.position = 'absolute';
  apercu.style.left = '-9999px';

  // AVANT la capture : repérer les bordures des blocs (exercices ou corrigés)
  const zoneTop = zone.getBoundingClientRect().top;
  const blocs = zone.querySelectorAll('.exercice, .corrige');
  const limites = [];
  for (const b of blocs) {
    const r = b.getBoundingClientRect();
    limites.push(r.bottom - zoneTop);
  }
  // Options d'impression : N&B et qualité supérieure
  const optionNB = document.getElementById('opt-nb')?.checked || false;
  const optionHD = document.getElementById('opt-hd')?.checked || false;
  const scale = optionHD ? 3 : 2;
  if (optionNB) zone.classList.add('mode-nb');
  const canvas = await html2canvas(zone, {
    scale: scale,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false
  });
  // Retirer la classe N&B après capture (pour ne pas affecter l'aperçu)
  if (optionNB) zone.classList.remove('mode-nb');
  apercu.style.display = 'none';
  const limitesCanvas = limites.map(l => l * scale);
  return { canvas, limitesCanvas };
}

// Ajouter un canvas au PDF en respectant les frontières entre exercices
// (jamais couper au milieu d'un exercice)
function ajouterCanvasAuPDF(pdf, capture, debut) {
  const pageW_mm = 210, pageH_mm = 297;
  const margeBas_mm = 10;   // marge basse de sécurité
  const margeHaut_mm = 18;  // marge haute pour les pages 2 et suivantes (pour éviter de tronquer les fractions)
  const canvas = capture.canvas;
  const limitesCanvas = capture.limitesCanvas || [];

  // Conversion : 1 mm de page = (canvas.width / pageW_mm) px de canvas
  const pxParMm = canvas.width / pageW_mm;
  const margeBas_px = margeBas_mm * pxParMm;

  if (!debut) pdf.addPage();

  let debutPagePx = 0; // position du haut de la page courante dans le canvas
  let estPremierePagePDF = true;
  while (debutPagePx < canvas.height) {
    // Hauteur utile disponible sur cette page (en pixels canvas)
    const margeHautPxThisPage = estPremierePagePDF ? 0 : (margeHaut_mm * pxParMm);
    const hauteurUtile_px = (pageH_mm * pxParMm) - margeHautPxThisPage - margeBas_px;

    // Position théorique de fin de page
    const finTheorique = debutPagePx + hauteurUtile_px;
    let finPage;

    if (finTheorique >= canvas.height) {
      // Dernière page : on prend tout le reste
      finPage = canvas.height;
    } else {
      // Chercher la dernière limite (fin d'exercice complet) qui se trouve
      // STRICTEMENT après debutPagePx (sinon page vide) et au plus à finTheorique
      let meilleureLimite = -1;
      for (const l of limitesCanvas) {
        if (l > debutPagePx && l <= finTheorique && l > meilleureLimite) {
          meilleureLimite = l;
        }
      }

      if (meilleureLimite < 0) {
        // Aucune fin d'exercice ne tient dans la page : c'est qu'un exercice est plus grand
        // qu'une page A4 (très rare). On coupe à la limite théorique (en dernier recours).
        finPage = finTheorique;
      } else {
        // On termine la page à la fin du dernier exercice complet
        finPage = meilleureLimite;
      }
    }

    // Créer un canvas temporaire avec la portion utile
    const canvasTemp = document.createElement('canvas');
    canvasTemp.width = canvas.width;
    canvasTemp.height = finPage - debutPagePx;
    const ctx = canvasTemp.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasTemp.width, canvasTemp.height);
    ctx.drawImage(canvas, 0, debutPagePx, canvas.width, finPage - debutPagePx,
                          0, 0, canvas.width, finPage - debutPagePx);

    // Calculer la hauteur correspondante en mm
    const hauteurPortion_mm = (finPage - debutPagePx) / pxParMm;
    const imgData = canvasTemp.toDataURL('image/png');
    // Position verticale : marge haute pour les pages 2+, 0 pour la première
    const yPos = estPremierePagePDF ? 0 : margeHaut_mm;
    pdf.addImage(imgData, 'PNG', 0, yPos, pageW_mm, hauteurPortion_mm);

    debutPagePx = finPage;
    estPremierePagePDF = false;
    if (debutPagePx < canvas.height) pdf.addPage();
  }
}

// ===== APERÇU AVANT GÉNÉRATION DU PDF =====
// Conserve l'état actuel de l'aperçu (exercices, difficulté, corrigés)
let etatApercu = null;

function ouvrirApercu() {
  const message = document.getElementById('message');
  message.style.display = 'none';
  sujetBacLabel = null;
  const blocs = collecterGenerateurs();
  if (blocs.length === 0) {
    message.textContent = "Sélectionne au moins un thème avec au moins une question.";
    message.className = 'message erreur'; message.style.display = 'block';
    return;
  }
  const difficulte = parseInt(document.querySelector('input[name="difficulte"]:checked').value);
  const avecCorriges = document.getElementById('corriges').checked;
  const exercices = genererListeExercices(blocs, difficulte);
  etatApercu = { exercices, difficulte, avecCorriges };
  rafraichirApercu();
  document.getElementById('modale-apercu').style.display = 'flex';
  // Forcer MathJax à rendre les formules dans la modale, si présent
  if (window.MathJax && window.MathJax.typesetPromise) {
    setTimeout(() => window.MathJax.typesetPromise([document.getElementById('apercu-liste-exos')]), 50);
  }
}

function fermerApercu() {
  document.getElementById('modale-apercu').style.display = 'none';
}

// Renvoie la liste des identifiants de générateurs (feuilles) du sous-thème "Annales",
// lue dynamiquement dans l'ARBRE. Récursive : prend en compte la structure imbriquée
// (catégories umbrella → sous-thèmes spécifiques).
function listerGenerateursAnnales() {
  const ids = [];
  function collecterFeuilles(noeud) {
    if (!noeud.enfants) {
      if (noeud.id && noeud.actif) ids.push(noeud.id);
      return;
    }
    for (const e of noeud.enfants) collecterFeuilles(e);
  }
  function chercher(noeud) {
    if (noeud.id === 'rev_annales' && noeud.enfants) {
      for (const e of noeud.enfants) collecterFeuilles(e);
      return true;
    }
    if (noeud.enfants) for (const e of noeud.enfants) if (chercher(e)) return true;
    return false;
  }
  for (const t of ARBRE) if (chercher(t)) break;
  return ids;
}

// Génère un "sujet type bac" : N questions annales réparties équitablement
// entre tous les types (round-robin), puis mélangées. Réutilise le pipeline
// d'aperçu existant (régénération unitaire, suppression, export PDF).
function genererSujetBac() {
  const message = document.getElementById('message');
  message.style.display = 'none';
  const types = listerGenerateursAnnales();
  if (types.length === 0) {
    message.textContent = "Aucune question d'annales disponible.";
    message.className = 'message erreur'; message.style.display = 'block';
    return;
  }
  let N = parseInt(document.getElementById('sujet-bac-nombre').value, 10);
  if (isNaN(N) || N < 1) N = types.length;
  if (N > 40) N = 40;
  const difficulte = parseInt(document.querySelector('input[name="difficulte"]:checked').value);
  const avecCorriges = document.getElementById('corriges').checked;

  // Répartition équilibrée : round-robin sur les types, en partant d'un type au hasard
  const ordre = types.slice();
  for (let i = ordre.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ordre[i], ordre[j]] = [ordre[j], ordre[i]]; }
  const tirages = [];
  for (let i = 0; i < N; i++) tirages.push(ordre[i % ordre.length]);

  const exercices = [];
  for (const id of tirages) {
    const g = generateurs[id];
    if (g) exercices.push({ ...g(difficulte), _generateurId: id });
  }
  // Mélange final pour ne pas enchaîner les types dans l'ordre
  for (let i = exercices.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [exercices[i], exercices[j]] = [exercices[j], exercices[i]]; }

  etatApercu = { exercices, difficulte, avecCorriges };
  sujetBacLabel = 'Sujet type bac';
  rafraichirApercu();
  document.getElementById('modale-apercu').style.display = 'flex';
  if (window.MathJax && window.MathJax.typesetPromise) {
    setTimeout(() => window.MathJax.typesetPromise([document.getElementById('apercu-liste-exos')]), 50);
  }
}

function rafraichirApercu() {
  if (!etatApercu) return;
  const conteneur = document.getElementById('apercu-liste-exos');
  const sousTitre = document.getElementById('apercu-sous-titre');
  const { exercices, difficulte } = etatApercu;
  const etoiles = '★'.repeat(difficulte);
  sousTitre.innerHTML = `${exercices.length} exercice${exercices.length > 1 ? 's' : ''} · niveau ${etoiles} · clique sur <strong>⟳</strong> pour régénérer un exercice qui ne te plaît pas.`;
  let html = composerMemoRappels(exercices);
  exercices.forEach((exo, idx) => {
    html += creerHTMLBlocExo(exo, idx);
  });
  // CORRECTIF accumulation MathJax : avant d'écraser le HTML, on demande
  // explicitement à MathJax de libérer ses références aux anciens nœuds.
  // Sans ça, certains rendus persistent visuellement entre deux ouvertures
  // de l'aperçu (anciens exos + nouveaux concaténés à l'écran).
  if (window.MathJax && window.MathJax.typesetClear) {
    try { window.MathJax.typesetClear([conteneur]); } catch (e) {}
  }
  conteneur.innerHTML = html;
  // Attacher les listeners de régénération et suppression
  conteneur.querySelectorAll('.apercu-exo').forEach(bloc => {
    const idx = parseInt(bloc.dataset.idx);
    attacherActionsBloc(bloc, idx);
  });
  // Demander à MathJax de retypeset après mise à jour du HTML
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([conteneur]).catch(() => {});
  }
}

// HTML d'UN bloc exo complet (le conteneur <div class="apercu-exo">)
function creerHTMLBlocExo(exo, idx) {
  const interieur = creerHTMLInterieurExo(exo, idx);
  return `
    <div class="apercu-exo" data-idx="${idx}" draggable="true">
      ${interieur}
    </div>
  `;
}

// HTML de l'intérieur d'un bloc exo (sans le wrapper) — utilisé pour la régénération unitaire
function creerHTMLInterieurExo(exo, idx) {
  const lib = libelleGenerateur(exo._generateurId);
  const titreCourt = lib.parent ? `${lib.parent} · ${lib.titre}` : lib.titre;
  const codeBloc = exo.code ? `<div class="apercu-exo-code">${exo.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>` : '';
  const svgBloc = exo.svg ? `<div class="apercu-exo-svg">${exo.svg}</div>` : '';
  const tableauBloc = exo.tableau ? `<div class="apercu-exo-tableau">${exo.tableau}</div>` : '';
  return `
    <div class="apercu-exo-poignee" title="Glisser pour déplacer">⋮⋮</div>
    <div class="apercu-exo-num">${idx + 1}.</div>
    <div class="apercu-exo-corps">
      <div class="apercu-exo-titre">${escapeHTML(titreCourt)}</div>
      <div class="apercu-exo-enonce">${exo.enonce}</div>
      ${tableauBloc}
      ${codeBloc}
    </div>
    ${svgBloc}
    <div class="apercu-exo-actions">
      <button class="bouton-regen" data-action="regen" data-idx="${idx}" title="Régénérer cet exercice">⟳</button>
      <button class="bouton-dupliq" data-action="dupliq" data-idx="${idx}" title="Dupliquer (nouvelle variante du même thème)">⊕</button>
      <button class="bouton-suppr" data-action="suppr" data-idx="${idx}" title="Supprimer cet exercice">✕</button>
    </div>
  `;
}

function escapeHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function regenererUnExo(idx) {
  if (!etatApercu) return;
  const exo = etatApercu.exercices[idx];
  if (!exo || !exo._generateurId) return;
  const g = generateurs[exo._generateurId];
  if (!g) return;
  // 1. Tirer une nouvelle variante (en évitant un énoncé identique si possible)
  let q = g(etatApercu.difficulte);
  let tries = 0;
  while (tries < 10 && q.enonce === exo.enonce && q.svg === exo.svg && q.code === exo.code) {
    q = g(etatApercu.difficulte);
    tries++;
  }
  const nouveauExo = { ...q, _generateurId: exo._generateurId };
  etatApercu.exercices[idx] = nouveauExo;
  // 2. Mettre à jour UNIQUEMENT le bloc concerné, sans toucher au reste de la page
  const conteneur = document.getElementById('apercu-liste-exos');
  const bloc = conteneur.querySelector(`.apercu-exo[data-idx="${idx}"]`);
  if (!bloc) { rafraichirApercu(); return; } // fallback
  // Mémoriser le scroll AVANT modification
  const scrollAvant = conteneur.scrollTop;
  // Remplacer l'intérieur du bloc (sans toucher au wrapper, donc pas de saut)
  bloc.innerHTML = creerHTMLInterieurExo(nouveauExo, idx);
  // Réattacher les listeners aux nouveaux boutons ⟳ et ✕
  attacherActionsBloc(bloc, idx);
  // Restaurer le scroll (au cas où le navigateur l'aurait modifié)
  conteneur.scrollTop = scrollAvant;
  // Petit feedback visuel : le bloc clignote brièvement en jaune pâle
  bloc.classList.add('juste-regenere');
  setTimeout(() => bloc.classList.remove('juste-regenere'), 400);
  // Refaire passer MathJax uniquement sur ce bloc
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([bloc]).catch(() => {});
  }
}

// Attache les listeners aux boutons d'action (⟳ ⊕ ✕) d'un bloc exo
function attacherActionsBloc(bloc, idx) {
  const btnRegen = bloc.querySelector('[data-action="regen"]');
  if (btnRegen) btnRegen.addEventListener('click', () => regenererUnExo(idx));
  const btnDupliq = bloc.querySelector('[data-action="dupliq"]');
  if (btnDupliq) btnDupliq.addEventListener('click', () => dupliquerUnExo(idx));
  const btnSuppr = bloc.querySelector('[data-action="suppr"]');
  if (btnSuppr) btnSuppr.addEventListener('click', () => supprimerUnExo(idx));
  // Drag & drop : on attache aux blocs eux-mêmes (le wrapper a draggable="true")
  attacherDragDrop(bloc);
}

function dupliquerUnExo(idx) {
  if (!etatApercu) return;
  const exo = etatApercu.exercices[idx];
  if (!exo || !exo._generateurId) return;
  const g = generateurs[exo._generateurId];
  if (!g) return;
  // Tirer une nouvelle variante du MÊME générateur
  const q = g(etatApercu.difficulte);
  const nouveauExo = { ...q, _generateurId: exo._generateurId };
  // L'insérer juste après l'exo source
  etatApercu.exercices.splice(idx + 1, 0, nouveauExo);
  // Reconstruction nécessaire (numérotation change pour les suivants)
  const conteneur = document.getElementById('apercu-liste-exos');
  const scrollAvant = conteneur.scrollTop;
  rafraichirApercu();
  conteneur.scrollTop = scrollAvant;
  // Faire défiler doucement vers le nouvel exo pour le rendre visible
  setTimeout(() => {
    const nouveauBloc = conteneur.querySelector(`.apercu-exo[data-idx="${idx + 1}"]`);
    if (nouveauBloc) {
      // Petit feedback visuel sur le nouvel exo
      nouveauBloc.classList.add('juste-regenere');
      setTimeout(() => nouveauBloc.classList.remove('juste-regenere'), 400);
      // Scroll dans la vue si pas visible
      const rectConteneur = conteneur.getBoundingClientRect();
      const rectBloc = nouveauBloc.getBoundingClientRect();
      if (rectBloc.bottom > rectConteneur.bottom) {
        nouveauBloc.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, 30);
}

// ===== GLISSER-DÉPOSER =====
// Variables d'état pour le drag (souris + tactile)
let dragSrcIdx = null;
let dragGhostElt = null;
let dragTouchStartY = 0;
let dragTouchCurrentBloc = null;
let dragAutoScrollInterval = null;

// Vitesse courante d'auto-scroll (en pixels par frame)
let dragAutoScrollVitesse = 0;

// Auto-scroll de la liste pendant le drag : si on approche du haut ou du bas
// de la zone visible, on fait défiler progressivement.
function gererAutoScrollDrag(clientY) {
  const conteneur = document.getElementById('apercu-liste-exos');
  if (!conteneur) return;
  const rect = conteneur.getBoundingClientRect();
  const zoneSeuil = 60; // pixels depuis le bord où on déclenche le scroll
  let vitesse = 0;
  if (clientY < rect.top + zoneSeuil) {
    const proximite = (rect.top + zoneSeuil - clientY) / zoneSeuil; // 0 → 1
    vitesse = -Math.min(18, Math.max(4, proximite * 18));
  } else if (clientY > rect.bottom - zoneSeuil) {
    const proximite = (clientY - (rect.bottom - zoneSeuil)) / zoneSeuil;
    vitesse = Math.min(18, Math.max(4, proximite * 18));
  }
  dragAutoScrollVitesse = vitesse;
  if (vitesse !== 0 && !dragAutoScrollInterval) {
    // Démarrer l'interval UNE SEULE FOIS quand on entre dans la zone
    dragAutoScrollInterval = setInterval(() => {
      if (dragAutoScrollVitesse !== 0) {
        conteneur.scrollTop += dragAutoScrollVitesse;
      }
    }, 16); // ~60 fps
  } else if (vitesse === 0) {
    arreterAutoScrollDrag();
  }
}

function arreterAutoScrollDrag() {
  if (dragAutoScrollInterval) {
    clearInterval(dragAutoScrollInterval);
    dragAutoScrollInterval = null;
  }
  dragAutoScrollVitesse = 0;
}

function attacherDragDrop(bloc) {
  // === Drag souris (HTML5) ===
  bloc.addEventListener('dragstart', (e) => {
    dragSrcIdx = parseInt(bloc.dataset.idx);
    bloc.classList.add('en-cours-drag');
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(dragSrcIdx)); // requis sur Firefox
    }
  });
  bloc.addEventListener('dragend', () => {
    bloc.classList.remove('en-cours-drag');
    document.querySelectorAll('.apercu-exo.zone-drop').forEach(el => el.classList.remove('zone-drop', 'zone-drop-avant', 'zone-drop-apres'));
    arreterAutoScrollDrag();
    dragSrcIdx = null;
  });
  bloc.addEventListener('dragover', (e) => {
    e.preventDefault(); // autorise le drop
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    if (dragSrcIdx === null) return;
    // Auto-scroll : si on approche des bords haut/bas de la liste, faire défiler
    gererAutoScrollDrag(e.clientY);
    const cibleIdx = parseInt(bloc.dataset.idx);
    if (cibleIdx === dragSrcIdx) return;
    // Determiner si on passe devant ou derrière (selon position du curseur dans le bloc)
    const rect = bloc.getBoundingClientRect();
    const milieu = rect.top + rect.height / 2;
    const avant = e.clientY < milieu;
    // Nettoyer les marqueurs précédents
    document.querySelectorAll('.apercu-exo.zone-drop').forEach(el => el.classList.remove('zone-drop', 'zone-drop-avant', 'zone-drop-apres'));
    bloc.classList.add('zone-drop');
    bloc.classList.add(avant ? 'zone-drop-avant' : 'zone-drop-apres');
  });
  bloc.addEventListener('dragleave', (e) => {
    // Ne nettoyer que si on quitte vraiment le bloc (pas un enfant)
    if (!bloc.contains(e.relatedTarget)) {
      bloc.classList.remove('zone-drop', 'zone-drop-avant', 'zone-drop-apres');
    }
  });
  bloc.addEventListener('drop', (e) => {
    e.preventDefault();
    arreterAutoScrollDrag();
    if (dragSrcIdx === null) return;
    const cibleIdx = parseInt(bloc.dataset.idx);
    if (cibleIdx === dragSrcIdx) return;
    const rect = bloc.getBoundingClientRect();
    const milieu = rect.top + rect.height / 2;
    const avant = e.clientY < milieu;
    deplacerExo(dragSrcIdx, cibleIdx, avant);
  });

  // === Drag tactile (mobile/tablette) — sur la poignée uniquement pour ne pas gêner le scroll ===
  const poignee = bloc.querySelector('.apercu-exo-poignee');
  if (poignee) {
    poignee.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      dragSrcIdx = parseInt(bloc.dataset.idx);
      dragTouchStartY = e.touches[0].clientY;
      bloc.classList.add('en-cours-drag');
      e.preventDefault(); // empêche le scroll quand on saisit la poignée
    }, { passive: false });

    poignee.addEventListener('touchmove', (e) => {
      if (dragSrcIdx === null || e.touches.length !== 1) return;
      e.preventDefault();
      const touch = e.touches[0];
      // Auto-scroll unifié (même logique que pour la souris)
      gererAutoScrollDrag(touch.clientY);
      // Trouver le bloc sous le doigt
      const elementSous = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!elementSous) return;
      const blocSous = elementSous.closest('.apercu-exo');
      if (!blocSous) return;
      const cibleIdx = parseInt(blocSous.dataset.idx);
      if (cibleIdx === dragSrcIdx) return;
      // Indicateur visuel
      const rect = blocSous.getBoundingClientRect();
      const milieu = rect.top + rect.height / 2;
      const avant = touch.clientY < milieu;
      document.querySelectorAll('.apercu-exo.zone-drop').forEach(el => el.classList.remove('zone-drop', 'zone-drop-avant', 'zone-drop-apres'));
      blocSous.classList.add('zone-drop');
      blocSous.classList.add(avant ? 'zone-drop-avant' : 'zone-drop-apres');
      dragTouchCurrentBloc = blocSous;
    }, { passive: false });

    poignee.addEventListener('touchend', (e) => {
      arreterAutoScrollDrag();
      if (dragSrcIdx === null) return;
      bloc.classList.remove('en-cours-drag');
      if (dragTouchCurrentBloc) {
        const cibleIdx = parseInt(dragTouchCurrentBloc.dataset.idx);
        const touch = e.changedTouches[0];
        const rect = dragTouchCurrentBloc.getBoundingClientRect();
        const milieu = rect.top + rect.height / 2;
        const avant = touch && touch.clientY < milieu;
        if (cibleIdx !== dragSrcIdx) {
          deplacerExo(dragSrcIdx, cibleIdx, avant);
        }
      }
      document.querySelectorAll('.apercu-exo.zone-drop').forEach(el => el.classList.remove('zone-drop', 'zone-drop-avant', 'zone-drop-apres'));
      dragSrcIdx = null;
      dragTouchCurrentBloc = null;
    });

    poignee.addEventListener('touchcancel', () => {
      arreterAutoScrollDrag();
      bloc.classList.remove('en-cours-drag');
      document.querySelectorAll('.apercu-exo.zone-drop').forEach(el => el.classList.remove('zone-drop', 'zone-drop-avant', 'zone-drop-apres'));
      dragSrcIdx = null;
      dragTouchCurrentBloc = null;
    });
  }
}

// Déplace l'exo à l'index `src` vers une position relative à `cible` (avant ou après)
function deplacerExo(src, cible, insererAvant) {
  if (!etatApercu) return;
  if (src === cible) return;
  const exo = etatApercu.exercices[src];
  if (!exo) return;
  // Retirer d'abord, puis recalculer la position d'insertion
  etatApercu.exercices.splice(src, 1);
  // Si on retirait avant la cible, l'index de cible a diminué de 1
  let nouvelIdx = cible;
  if (src < cible) nouvelIdx = cible - 1;
  if (!insererAvant) nouvelIdx += 1;
  // Borner
  nouvelIdx = Math.max(0, Math.min(etatApercu.exercices.length, nouvelIdx));
  etatApercu.exercices.splice(nouvelIdx, 0, exo);
  // Reconstruire l'affichage (les numéros et data-idx changent)
  const conteneur = document.getElementById('apercu-liste-exos');
  const scrollAvant = conteneur.scrollTop;
  rafraichirApercu();
  conteneur.scrollTop = scrollAvant;
  // Mettre en évidence l'exo déplacé
  setTimeout(() => {
    const blocDeplace = conteneur.querySelector(`.apercu-exo[data-idx="${nouvelIdx}"]`);
    if (blocDeplace) {
      blocDeplace.classList.add('juste-deplace');
      setTimeout(() => blocDeplace.classList.remove('juste-deplace'), 600);
    }
  }, 30);
}

function supprimerUnExo(idx) {
  if (!etatApercu) return;
  // Empêcher la suppression du dernier exo (sinon fiche vide)
  if (etatApercu.exercices.length <= 1) {
    // Petit feedback visuel sur le bouton
    const conteneur = document.getElementById('apercu-liste-exos');
    const bloc = conteneur.querySelector(`.apercu-exo[data-idx="${idx}"]`);
    if (bloc) {
      bloc.classList.add('suppr-bloquee');
      setTimeout(() => bloc.classList.remove('suppr-bloquee'), 600);
    }
    return;
  }
  // 1. Trouver le bloc DOM correspondant
  const conteneur = document.getElementById('apercu-liste-exos');
  const bloc = conteneur.querySelector(`.apercu-exo[data-idx="${idx}"]`);
  const scrollAvant = conteneur.scrollTop;
  // 2. Supprimer de l'état
  etatApercu.exercices.splice(idx, 1);
  // 3. Animer la disparition du bloc, puis renuméroter
  if (bloc) {
    bloc.classList.add('en-suppression');
    setTimeout(() => {
      // Reconstruction nécessaire pour renuméroter tout (les data-idx changent)
      rafraichirApercu();
      // Restaurer le scroll
      conteneur.scrollTop = scrollAvant;
    }, 220);
  } else {
    rafraichirApercu();
  }
}

function toutRegenerer() {
  if (!etatApercu) return;
  // On régénère tous les exos en conservant les mêmes ids de générateurs
  etatApercu.exercices = etatApercu.exercices.map(exo => {
    const g = generateurs[exo._generateurId];
    if (!g) return exo;
    const q = g(etatApercu.difficulte);
    return { ...q, _generateurId: exo._generateurId };
  });
  rafraichirApercu();
}

async function genererPDF() {
  if (!etatApercu) return;
  const bouton = document.getElementById('bouton-imprimer');
  const message = document.getElementById('message');
  const { exercices, difficulte, avecCorriges } = etatApercu;
  bouton.disabled = true; bouton.textContent = "Génération…";
  try {
    // Page 1 : énoncés
    const canvasEnonces = await capturerHTMLversCanvas(composerHTMLEnonces(exercices, difficulte));

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    ajouterCanvasAuPDF(pdf, canvasEnonces, true);

    // Page 2 : corrigés (sur nouvelle page)
    if (avecCorriges) {
      const canvasCorriges = await capturerHTMLversCanvas(composerHTMLCorriges(exercices, difficulte));
      ajouterCanvasAuPDF(pdf, canvasCorriges, false);
    }

    const dateIso = new Date().toISOString().slice(0, 10);
    pdf.save(`automatismes_labomath_${dateIso}.pdf`);
    fermerApercu();
    message.textContent = `PDF généré (${exercices.length} questions, difficulté ${'★'.repeat(difficulte)}).`;
    message.className = 'message succes'; message.style.display = 'block';
  } catch (err) {
    console.error(err);
    message.textContent = "Erreur : " + err.message;
    message.className = 'message erreur'; message.style.display = 'block';
  } finally {
    bouton.disabled = false; bouton.textContent = "📄 Générer le PDF";
  }
}

document.getElementById('btn-tout-deplier').addEventListener('click', () => {
  document.querySelectorAll('.enfants').forEach(e => e.style.display = 'block');
  document.querySelectorAll('.triangle:not(.vide)').forEach(t => t.classList.add('ouvert'));
});
document.getElementById('btn-tout-replier').addEventListener('click', () => {
  document.querySelectorAll('.enfants').forEach(e => e.style.display = 'none');
  document.querySelectorAll('.triangle:not(.vide)').forEach(t => t.classList.remove('ouvert'));
});
document.getElementById('btn-tout-decocher').addEventListener('click', () => {
  for (const k of Object.keys(etat)) etat[k] = 0;
  document.querySelectorAll('.case').forEach(c => c.checked = false);
  document.querySelectorAll('.valeur').forEach(v => { v.textContent = '0'; v.classList.add('zero'); });
  document.querySelectorAll('.noeud').forEach(n => {
    const id = n.dataset.id;
    const findN = (arbre) => { for (const x of arbre) { if (x.id === id) return x; if (x.enfants) { const r = findN(x.enfants); if (r) return r; } } return null; };
    const noeud = findN(ARBRE);
    if (!noeud) return;
    const c = n.querySelector(':scope > .ligne .case');
    if (c && aDesEnfantsActifs(noeud)) c.disabled = false;
    const lib = n.querySelector(':scope > .ligne .libelle');
    if (lib) lib.classList.remove('parent-coche');
  });
  majTotal();
});

document.querySelectorAll('input[name="difficulte"]').forEach(r => {
  r.addEventListener('change', () => {
    document.getElementById('etoiles-affichees').textContent = '★'.repeat(parseInt(r.value));
  });
});

// Le bouton principal ouvre désormais l'aperçu (au lieu de générer directement le PDF)
document.getElementById('bouton-generer').addEventListener('click', ouvrirApercu);
const btnSujetBac = document.getElementById('bouton-sujet-bac');
if (btnSujetBac) btnSujetBac.addEventListener('click', genererSujetBac);

// Bindings de la modale d'aperçu
document.getElementById('bouton-fermer-apercu').addEventListener('click', fermerApercu);
document.getElementById('bouton-tout-regen').addEventListener('click', toutRegenerer);
document.getElementById('bouton-imprimer').addEventListener('click', genererPDF);
// Fermer la modale en cliquant sur l'overlay (mais pas sur le contenu)
document.getElementById('modale-apercu').addEventListener('click', (e) => {
  if (e.target.id === 'modale-apercu') fermerApercu();
});
// Fermer avec la touche Échap
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.getElementById('modale-apercu').style.display === 'flex') {
    fermerApercu();
  }
});

// Pré-sélection du profil et du mode via paramètres d'URL.
//   ?profil=xxx  → seconde, premiere_stmg, premiere_sti2d, terminale_spe
//   ?palier=yyy  → premiere : cache Seconde et Terminale, l'élève choisit sa filière 1re
//   ?mode=zzz    → automatismes (défaut) ou annales (= entrainement bac)
// Effets :
//   • profil valide → coche le radio, cache le bloc « Profil de l'élève »,
//                     adapte le lien « Retour » vers la page hub.
//   • palier=premiere → restreint visuellement les profils aux 1res, ne coche rien.
//   • mode=annales → cache toutes les branches sauf RÉVISIONS, adapte le titre.
//   • mode=automatismes → cache la branche RÉVISIONS.
let modeActif = 'automatismes'; // valeur par défaut, lue par construireArbre()
(function appliquerParametresURL() {
  try {
    const params = new URLSearchParams(window.location.search);
    const demande = params.get('profil');
    const palier = params.get('palier');
    const mode = params.get('mode');

    // 1) Mode (avant tout, pour que construireArbre puisse l'utiliser)
    if (mode === 'annales') {
      modeActif = 'annales';
      const h1 = document.querySelector('.container h1');
      if (h1) h1.textContent = "Entrainement de type bac";
      const intro = document.querySelector('.container p.intro');
      if (intro) intro.textContent =
        "Composez une fiche d'entrainement à partir des annales et questions type bac. " +
        "Chaque thème tire une question rapide inspirée des sujets officiels.";
    }

    // 2) Palier (filtrage visuel des profils sans en sélectionner un)
    const profilsParPalier = {
      seconde:   ['seconde'],
      premiere:  ['premiere_ss', 'premiere_spe', 'premiere_stmg', 'premiere_sti2d'],
      terminale: ['terminale_spe'],
    };
    if (palier && profilsParPalier[palier]) {
      const profilsAGarder = new Set(profilsParPalier[palier]);
      document.querySelectorAll('input[name="profil"]').forEach(radio => {
        if (!profilsAGarder.has(radio.value)) {
          const label = radio.closest('label');
          if (label) label.style.display = 'none';
          radio.checked = false; // au cas où le défaut (seconde) serait masqué
        }
      });
      // S'il ne reste qu'un profil actif visible, le cocher
      const visibles = [...document.querySelectorAll('input[name="profil"]')]
        .filter(r => r.closest('label').style.display !== 'none' && !r.disabled);
      if (visibles.length === 1) {
        visibles[0].checked = true;
      } else if (visibles.length > 1 && !document.querySelector('input[name="profil"]:checked')) {
        // Sinon, cocher le premier actif visible pour avoir un arbre cohérent
        visibles[0].checked = true;
      }
    }

    // 3) Profil (priorité sur palier si les deux sont passés)
    if (!demande) return;
    const radio = document.querySelector(`input[name="profil"][value="${demande}"]`);
    if (!radio || radio.disabled) return;
    radio.checked = true;
    // Cacher le bloc parent « Profil de l'élève »
    const bloc = radio.closest('.bloc');
    if (bloc) bloc.style.display = 'none';
    // Adapter le lien « Retour » vers le hub du niveau
    const libelles = {
      seconde:        { nom: 'Seconde',         hub: '../seconde/' },
      premiere_stmg:  { nom: 'Première STMG',   hub: '../premiere/' },
      premiere_sti2d: { nom: 'Première STI2D',  hub: '../premiere/' },
      terminale_spe:  { nom: 'Terminale',       hub: '../terminale/' },
    };
    const meta = libelles[demande];
    const lienRetour = document.querySelector('nav.nav-top a');
    if (meta && lienRetour) {
      lienRetour.textContent = `← Retour à ${meta.nom}`;
      lienRetour.setAttribute('href', meta.hub);
    }
  } catch (e) { /* silencieux : on garde le comportement par défaut */ }
})();

construireArbre();
majTotal();
// Listener : quand on change de profil, on reconstruit l'arbre
document.querySelectorAll('input[name="profil"]').forEach(radio => {
  radio.addEventListener('change', onChangementProfil);
});

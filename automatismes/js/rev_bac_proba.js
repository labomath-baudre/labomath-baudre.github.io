/* LaboMath — Générateurs annales bac (rev_bac_proba_*)
   Lot 4 : Probabilités — 7 générateurs, 3 niveaux chacun, variantes paramétrées.
   Calibrés sur les sujets bac Tle spé récents (APMEP).
   Compatible avec window.LM_GEN, helpers : pick, rand, randNonZero, signe, dec.

   Couverture :
   - Arbre pondéré + probas totales + conditionnelle inverse  → rev_bac_proba_arbre_total
   - Loi binomiale en contexte (étude complète)               → rev_bac_proba_binom_etude
   - Seuil binomial : trouver n minimum                        → rev_bac_proba_binom_seuil
   - VA de gain dans un jeu (loi, espérance, équitabilité)    → rev_bac_proba_va_jeu
   - Succession d'épreuves indépendantes (Bernoulli)          → rev_bac_proba_succession
   - Bienaymé-Tchebychev appliqué à un modèle                  → rev_bac_proba_concentration_appli
   - Tester l'indépendance de deux événements                  → rev_bac_proba_independance
*/

// Helpers locaux
const _pr_fact = (n) => n <= 1 ? 1 : n * _pr_fact(n - 1);
const _pr_comb = (n, k) => _pr_fact(n) / (_pr_fact(k) * _pr_fact(n - k));
// P(X = k) avec X ~ B(n, p)
const _pr_binomP = (n, p, k) => _pr_comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
// Arrondi à 4 décimales (typique au bac)
const _pr_arr4 = (x) => Math.round(x * 10000) / 10000;
// Notation décimale française pour LaTeX : 0.7 → "0{,}7"
const _pr_dec = (n) => {
  if (typeof n !== 'number') return String(n);
  if (Number.isInteger(n)) return String(n);
  return String(n).replace('.', '{,}');
};

Object.assign(window.LM_GEN ??= {}, {

  // ============================================================
  // 1. rev_bac_proba_arbre_total
  // Arbre pondéré complet : probabilités totales + conditionnelle inverse
  // nv1 : compléter l'arbre + calcul direct P(A ∩ B)
  // nv2 : formule des probabilités totales pour P(B)
  // nv3 : conditionnelle inverse P(A | B)
  // ============================================================
  rev_bac_proba_arbre_total: (d) => {
    if (d === 1) {
      // Contexte test médical simple : P(M) = 0,02 ; P(T|M) = 0,95 ; P(T|non M) = 0,05
      // Calcul direct P(M ∩ T) = 0,02 × 0,95 = 0,019
      const variantes = [
        () => {
          // Test médical
          const pM = 0.02; // prévalence
          const pT_M = 0.95; // sensibilité
          const pTbar_Mbar = 0.95; // spécificité (donc P(T|non M) = 0,05)
          const inter = pM * pT_M; // P(M ∩ T)
          return {
            enonce: `Dans une population, $2\\,\\%$ des personnes sont atteintes d'une maladie. ` +
              `On administre un test : il est positif avec une probabilité de $0{,}95$ chez une personne malade, ` +
              `et négatif avec une probabilité de $0{,}95$ chez une personne saine.<br>` +
              `On note $M$ : « la personne est malade » et $T$ : « le test est positif ».<br>` +
              `Calculer $P(M \\cap T)$. Interpréter.`,
            corrige: `D'après l'énoncé : $P(M) = 0{,}02$ et $P_M(T) = 0{,}95$.<br>` +
              `Par la formule des probabilités composées : $P(M \\cap T) = P(M) \\times P_M(T) = 0{,}02 \\times 0{,}95 = ${_pr_dec(inter)}$.<br>` +
              `Interprétation : la probabilité qu'une personne soit à la fois malade ET testée positive est $${_pr_dec(inter)}$, soit ${_pr_dec(inter * 100)}\\,\\%$.`
          };
        },
        () => {
          // Contrôle qualité
          // Usine produit pièces sur 2 machines : A produit 60%, B produit 40%
          // A : 3% défectueuses, B : 5% défectueuses
          // P(A ∩ D) = 0,6 × 0,03 = 0,018
          const inter = 0.6 * 0.03;
          return {
            enonce: `Une usine produit des pièces sur deux machines $A$ et $B$. La machine $A$ produit $60\\,\\%$ des pièces, ` +
              `et la machine $B$ en produit $40\\,\\%$. Parmi les pièces de $A$, $3\\,\\%$ sont défectueuses ; ` +
              `parmi celles de $B$, $5\\,\\%$ sont défectueuses.<br>` +
              `On choisit une pièce au hasard. On note $A$ : « la pièce vient de la machine $A$ » et $D$ : « la pièce est défectueuse ».<br>` +
              `Calculer $P(A \\cap D)$.`,
            corrige: `D'après l'énoncé : $P(A) = 0{,}6$ et $P_A(D) = 0{,}03$.<br>` +
              `$P(A \\cap D) = P(A) \\times P_A(D) = 0{,}6 \\times 0{,}03 = ${_pr_dec(inter)}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Probabilités composées.</strong> $P(A \\cap B) = P(A) \\times P_A(B)$. Sur un arbre pondéré, $P(A \\cap B)$ se lit comme le <em>produit des probabilités le long du chemin</em> menant à $A$ puis à $B$.`
      };
    }

    if (d === 2) {
      // Formule des probabilités totales
      const variantes = [
        () => {
          // Test médical étendu
          const pM = 0.02;
          const pT_M = 0.95;
          const pT_Mbar = 0.05;
          // P(T) = P(M) P(T|M) + P(non M) P(T|non M) = 0,02·0,95 + 0,98·0,05
          const pT = pM * pT_M + (1 - pM) * pT_Mbar;
          return {
            enonce: `Dans une population, $2\\,\\%$ des personnes sont atteintes d'une maladie. ` +
              `Un test médical est utilisé : il est positif avec une probabilité de $0{,}95$ chez les malades, ` +
              `et négatif avec une probabilité de $0{,}95$ chez les non-malades.<br>` +
              `On note $M$ : « la personne est malade » et $T$ : « le test est positif ».<br>` +
              `1. Représenter la situation par un arbre pondéré.<br>` +
              `2. Démontrer que la probabilité que le test soit positif est $P(T) = ${_pr_dec(_pr_arr4(pT))}$.`,
            corrige: `<strong>1.</strong> L'arbre se compose de deux branches : $M$ (proba $0{,}02$) et $\\overline{M}$ (proba $0{,}98$). ` +
              `Depuis $M$ : $T$ (proba $0{,}95$) et $\\overline{T}$ (proba $0{,}05$). Depuis $\\overline{M}$ : $T$ (proba $0{,}05$) et $\\overline{T}$ (proba $0{,}95$).<br>` +
              `<strong>2.</strong> Les événements $M$ et $\\overline{M}$ forment une partition de l'univers. D'après la formule des probabilités totales :<br>` +
              `$P(T) = P(M \\cap T) + P(\\overline{M} \\cap T) = P(M) \\times P_M(T) + P(\\overline{M}) \\times P_{\\overline{M}}(T)$<br>` +
              `$= 0{,}02 \\times 0{,}95 + 0{,}98 \\times 0{,}05 = 0{,}019 + 0{,}049 = ${_pr_dec(_pr_arr4(pT))}$.`
          };
        },
        () => {
          // Sondage à deux niveaux
          // Élèves d'un lycée : 55% filles, 45% garçons
          // Parmi les filles : 30% pratiquent un sport ; parmi les garçons : 50%
          // P(S) = 0,55·0,3 + 0,45·0,5 = 0,165 + 0,225 = 0,39
          const pS = 0.55 * 0.3 + 0.45 * 0.5;
          return {
            enonce: `Dans un lycée, $55\\,\\%$ des élèves sont des filles et $45\\,\\%$ sont des garçons. ` +
              `Parmi les filles, $30\\,\\%$ pratiquent un sport en club. Parmi les garçons, $50\\,\\%$ pratiquent un sport en club.<br>` +
              `On choisit un élève au hasard. On note $F$ : « l'élève est une fille » et $S$ : « l'élève pratique un sport en club ».<br>` +
              `Démontrer que la probabilité qu'un élève pratique un sport en club est $P(S) = ${_pr_dec(_pr_arr4(pS))}$.`,
            corrige: `Les événements $F$ et $\\overline{F}$ forment une partition de l'univers. D'après la formule des probabilités totales :<br>` +
              `$P(S) = P(F) \\times P_F(S) + P(\\overline{F}) \\times P_{\\overline{F}}(S) = 0{,}55 \\times 0{,}3 + 0{,}45 \\times 0{,}5$<br>` +
              `$= 0{,}165 + 0{,}225 = ${_pr_dec(_pr_arr4(pS))}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Formule des probabilités totales.</strong> Si $A_1, A_2, \\ldots, A_n$ forment une <em>partition</em> de l'univers, alors pour tout événement $B$ : $P(B) = \\displaystyle\\sum_{i=1}^{n} P(A_i) \\times P_{A_i}(B)$. En pratique, on lit cette formule sur l'arbre en sommant les chemins menant à $B$.`
      };
    }

    // d === 3 : conditionnelle inverse (type Bayes), 2 variantes
    const variantes = [
      () => ({
        enonce: `Dans une population, $2\\,\\%$ des personnes sont atteintes d'une maladie. ` +
          `Un test médical est utilisé : il est positif chez les malades avec une probabilité de $0{,}95$, ` +
          `et négatif chez les non-malades avec une probabilité de $0{,}95$.<br>` +
          `On note $M$ : « la personne est malade » et $T$ : « le test est positif ».<br>` +
          `On admet que $P(T) = 0{,}068$.<br>` +
          `1. Une personne a un test positif. Quelle est la probabilité qu'elle soit malade ? Donner la valeur arrondie au millième.<br>` +
          `2. Commenter ce résultat.`,
        corrige: `<strong>1.</strong> On cherche $P_T(M) = \\dfrac{P(M \\cap T)}{P(T)} = \\dfrac{0{,}02 \\times 0{,}95}{0{,}068} = \\dfrac{0{,}019}{0{,}068} \\approx 0{,}279$.<br>` +
          `<strong>2.</strong> Bien que le test soit fiable à $95\\,\\%$ dans les deux sens, une personne testée positive n'a que $27{,}9\\,\\%$ de chance d'être réellement malade. ` +
          `Ce résultat surprenant s'explique par la rareté de la maladie ($2\\,\\%$) : il y a beaucoup plus de « faux positifs » que de vrais malades dans la population.`
      }),
      () => ({
        // Contrôle qualité : pièces produites par 2 machines, défectueuses
        // A produit 60%, B produit 40%. A : 3% défectueuses, B : 5% défectueuses
        // P(D) = 0,6·0,03 + 0,4·0,05 = 0,018 + 0,02 = 0,038
        // P_D(A) = P(A∩D)/P(D) = 0,018/0,038 ≈ 0,474
        enonce: `Une usine produit des pièces sur deux machines $A$ et $B$. La machine $A$ produit $60\\,\\%$ des pièces, ` +
          `et la machine $B$ en produit $40\\,\\%$. Parmi les pièces de $A$, $3\\,\\%$ sont défectueuses ; parmi celles de $B$, $5\\,\\%$ sont défectueuses.<br>` +
          `On note $A$ : « la pièce vient de la machine $A$ » et $D$ : « la pièce est défectueuse ».<br>` +
          `On admet que $P(D) = 0{,}038$.<br>` +
          `1. Une pièce prélevée au hasard est défectueuse. Quelle est la probabilité qu'elle provienne de la machine $A$ ? Arrondir au millième.<br>` +
          `2. Commenter ce résultat.`,
        corrige: `<strong>1.</strong> $P_D(A) = \\dfrac{P(A \\cap D)}{P(D)} = \\dfrac{P(A) \\times P_A(D)}{P(D)} = \\dfrac{0{,}6 \\times 0{,}03}{0{,}038} = \\dfrac{0{,}018}{0{,}038} \\approx 0{,}474$.<br>` +
          `<strong>2.</strong> Alors que $60\\,\\%$ des pièces sortent de la machine $A$, seulement $47{,}4\\,\\%$ des pièces défectueuses en proviennent. La machine $B$, bien que minoritaire, produit davantage de défauts proportionnellement.`
      })
    ];
    const v = pick(variantes)();
    return {
      enonce: v.enonce,
      corrige: v.corrige,
      rappel: `<strong>Probabilité conditionnelle inverse.</strong> $P_B(A) = \\dfrac{P(A \\cap B)}{P(B)} = \\dfrac{P(A) \\times P_A(B)}{P(B)}$. Cette formule (cas particulier de la formule de Bayes) permet de « renverser » le conditionnement.`
    };
  },

  // ============================================================
  // 2. rev_bac_proba_binom_etude
  // Étude d'une loi binomiale en contexte
  // nv1 : identifier B(n,p) + P(X=k) à la calculatrice
  // nv2 : + espérance et variance, interprétation
  // nv3 : événements composés P(X ≥ k), avec calculs
  // ============================================================
  rev_bac_proba_binom_etude: (d) => {
    if (d === 1) {
      // n = 10, p = 0,3, calculer P(X = 3)
      const variantes = [
        () => {
          // Tir au but
          const n = 10;
          const p = 0.3;
          const k = 3;
          const px = _pr_arr4(_pr_binomP(n, p, k));
          return {
            enonce: `Un footballeur a une probabilité $p = 0{,}3$ de réussir un tir au but. Il effectue $${n}$ tirs indépendants. ` +
              `On note $X$ le nombre de tirs réussis.<br>` +
              `1. Justifier que $X$ suit une loi binomiale dont on précisera les paramètres.<br>` +
              `2. Calculer $P(X = ${k})$. Donner la valeur arrondie à $10^{-4}$.`,
            corrige: `<strong>1.</strong> $X$ compte le nombre de succès dans une succession de $${n}$ épreuves de Bernoulli indépendantes (chaque tir = épreuve), ` +
              `de même paramètre $p = 0{,}3$ (probabilité de succès). Donc $X \\sim \\mathcal{B}(${n}\\,;\\,0{,}3)$.<br>` +
              `<strong>2.</strong> $P(X = ${k}) = \\dbinom{${n}}{${k}} \\times 0{,}3^{${k}} \\times 0{,}7^{${n - k}} = ${_pr_comb(n, k)} \\times 0{,}3^{${k}} \\times 0{,}7^{${n - k}} \\approx ${_pr_dec(px)}$.`
          };
        },
        () => {
          // QCM aléatoire : 20 questions, 4 réponses au hasard → p = 0,25
          const n = 20;
          const p = 0.25;
          const k = 5;
          const px = _pr_arr4(_pr_binomP(n, p, k));
          return {
            enonce: `Un élève passe un QCM de $${n}$ questions, avec $4$ réponses par question dont une seule est correcte. Il répond au hasard. ` +
              `On note $X$ le nombre de bonnes réponses.<br>` +
              `1. Justifier que $X$ suit une loi binomiale dont on précisera les paramètres.<br>` +
              `2. Calculer $P(X = ${k})$. Arrondir à $10^{-4}$.`,
            corrige: `<strong>1.</strong> Chaque question est une épreuve de Bernoulli (succès = bonne réponse, probabilité $\\dfrac{1}{4} = 0{,}25$). ` +
              `Les $${n}$ questions sont indépendantes. $X$ compte les succès : $X \\sim \\mathcal{B}(${n}\\,;\\,0{,}25)$.<br>` +
              `<strong>2.</strong> $P(X = ${k}) = \\dbinom{${n}}{${k}} \\times 0{,}25^{${k}} \\times 0{,}75^{${n - k}} \\approx ${_pr_dec(px)}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Loi binomiale.</strong> $X \\sim \\mathcal{B}(n\\,;\\,p)$ : on répète $n$ épreuves de Bernoulli indépendantes de paramètre $p$, et $X$ compte le nombre de succès. ` +
          `$P(X = k) = \\dbinom{n}{k} p^{k}(1-p)^{n-k}$ pour $k \\in \\{0, 1, \\ldots, n\\}$.`
      };
    }

    if (d === 2) {
      // n = 50, p = 0,2 → E(X) = 10, V(X) = 50 × 0,2 × 0,8 = 8, σ ≈ 2,83
      const variantes = [
        () => {
          const n = 50;
          const p = 0.2;
          const k = 12;
          const ex = n * p;
          const vx = n * p * (1 - p);
          const px = _pr_arr4(_pr_binomP(n, p, k));
          return {
            enonce: `Une entreprise produit des composants électroniques. La probabilité qu'un composant soit défectueux est $p = 0{,}2$. ` +
              `On prélève $n = ${n}$ composants au hasard (les prélèvements sont supposés indépendants). On note $X$ le nombre de composants défectueux.<br>` +
              `1. Justifier que $X$ suit une loi binomiale dont on précisera les paramètres.<br>` +
              `2. Calculer l'espérance $E(X)$ et la variance $V(X)$. Interpréter $E(X)$.<br>` +
              `3. Calculer $P(X = ${k})$, arrondi à $10^{-4}$.`,
            corrige: `<strong>1.</strong> $X \\sim \\mathcal{B}(${n}\\,;\\,0{,}2)$ (succession d'épreuves de Bernoulli indépendantes, $X$ compte les succès).<br>` +
              `<strong>2.</strong> $E(X) = np = ${n} \\times 0{,}2 = ${ex}$ et $V(X) = np(1 - p) = ${n} \\times 0{,}2 \\times 0{,}8 = ${vx}$.<br>` +
              `Interprétation : sur un grand nombre de prélèvements de $${n}$ composants, on s'attend à obtenir en moyenne $${ex}$ composants défectueux.<br>` +
              `<strong>3.</strong> $P(X = ${k}) = \\dbinom{${n}}{${k}} \\times 0{,}2^{${k}} \\times 0{,}8^{${n - k}} \\approx ${_pr_dec(px)}$.`
          };
        },
        () => {
          // n = 30, p = 0,4 → E(X) = 12, V(X) = 30·0,4·0,6 = 7,2
          const n = 30;
          const p = 0.4;
          const k = 10;
          const ex = n * p;
          const vx = n * p * (1 - p);
          const px = _pr_arr4(_pr_binomP(n, p, k));
          return {
            enonce: `Une enquête montre que $40\\,\\%$ des consommateurs préfèrent une certaine marque. ` +
              `On interroge $n = ${n}$ consommateurs au hasard (de manière indépendante). On note $X$ le nombre de personnes interrogées préférant cette marque.<br>` +
              `1. Justifier que $X$ suit une loi binomiale dont on précisera les paramètres.<br>` +
              `2. Calculer $E(X)$ et $V(X)$. Interpréter $E(X)$.<br>` +
              `3. Calculer $P(X = ${k})$, arrondi à $10^{-4}$.`,
            corrige: `<strong>1.</strong> $X \\sim \\mathcal{B}(${n}\\,;\\,0{,}4)$.<br>` +
              `<strong>2.</strong> $E(X) = ${n} \\times 0{,}4 = ${ex}$ et $V(X) = ${n} \\times 0{,}4 \\times 0{,}6 = ${_pr_dec(vx)}$.<br>` +
              `Interprétation : sur un grand nombre de sondages de $${n}$ personnes, on s'attend à $${ex}$ personnes préférant la marque en moyenne.<br>` +
              `<strong>3.</strong> $P(X = ${k}) = \\dbinom{${n}}{${k}} \\times 0{,}4^{${k}} \\times 0{,}6^{${n - k}} \\approx ${_pr_dec(px)}$.`
          };
        },
        () => {
          // n = 40, p = 0,15 → E(X) = 6, V(X) = 40·0,15·0,85 = 5,1
          const n = 40;
          const p = 0.15;
          const k = 5;
          const ex = n * p;
          const vx = n * p * (1 - p);
          const px = _pr_arr4(_pr_binomP(n, p, k));
          return {
            enonce: `Un site de vente en ligne constate que $15\\,\\%$ des visiteurs effectuent un achat. ` +
              `Sur une journée, $${n}$ visiteurs indépendants consultent le site. On note $X$ le nombre d'acheteurs.<br>` +
              `1. Justifier que $X$ suit une loi binomiale dont on précisera les paramètres.<br>` +
              `2. Calculer $E(X)$ et $V(X)$.<br>` +
              `3. Calculer $P(X = ${k})$, arrondi à $10^{-4}$.`,
            corrige: `<strong>1.</strong> $X \\sim \\mathcal{B}(${n}\\,;\\,0{,}15)$.<br>` +
              `<strong>2.</strong> $E(X) = ${n} \\times 0{,}15 = ${ex}$ et $V(X) = ${n} \\times 0{,}15 \\times 0{,}85 = ${_pr_dec(vx)}$.<br>` +
              `<strong>3.</strong> $P(X = ${k}) = \\dbinom{${n}}{${k}} \\times 0{,}15^{${k}} \\times 0{,}85^{${n - k}} \\approx ${_pr_dec(px)}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Espérance et variance d'une loi binomiale.</strong> Si $X \\sim \\mathcal{B}(n\\,;\\,p)$ : $E(X) = np$ et $V(X) = np(1-p)$. L'espérance représente le nombre moyen de succès sur un grand nombre de répétitions.`
      };
    }

    // d === 3 : événement composé P(X ≥ k), 2 variantes
    const variantes3 = [
      () => {
        const n = 100;
        const p = 0.6;
        const seuil = 65;
        const pXgeqSeuil = _pr_arr4(1 - Array.from({ length: seuil }, (_, k) => _pr_binomP(n, p, k))
          .reduce((a, b) => a + b, 0));
        const ex = n * p;
        const vx = n * p * (1 - p);
        return {
          enonce: `Une étude statistique montre que $60\\,\\%$ des clients d'un site web reviennent dans les 30 jours. ` +
            `On choisit $n = ${n}$ clients indépendamment et on note $X$ le nombre d'entre eux qui reviennent dans les 30 jours.<br>` +
            `1. Donner la loi de $X$ et préciser $E(X)$ et $V(X)$.<br>` +
            `2. Calculer $P(X \\geqslant ${seuil})$ à l'aide de la calculatrice, arrondi à $10^{-4}$.<br>` +
            `3. Interpréter ce résultat.`,
          corrige: `<strong>1.</strong> $X \\sim \\mathcal{B}(${n}\\,;\\,0{,}6)$. $E(X) = ${ex}$ et $V(X) = ${vx}$.<br>` +
            `<strong>2.</strong> $P(X \\geqslant ${seuil}) = 1 - P(X \\leqslant ${seuil - 1})$. À la calculatrice : $P(X \\leqslant ${seuil - 1}) \\approx ${_pr_dec(_pr_arr4(1 - pXgeqSeuil))}$, donc $P(X \\geqslant ${seuil}) \\approx ${_pr_dec(pXgeqSeuil)}$.<br>` +
            `<strong>3.</strong> Il y a environ $${_pr_dec(_pr_arr4(pXgeqSeuil * 100))}\\,\\%$ de chances d'avoir au moins $${seuil}$ clients qui reviennent.`
        };
      },
      () => {
        // n=80, p=0,5, seuil=45 → P(X >= 45) à calculer
        const n = 80;
        const p = 0.5;
        const seuil = 45;
        const pXgeqSeuil = _pr_arr4(1 - Array.from({ length: seuil }, (_, k) => _pr_binomP(n, p, k))
          .reduce((a, b) => a + b, 0));
        const ex = n * p;
        const vx = n * p * (1 - p);
        return {
          enonce: `Lors d'un référendum, $50\\,\\%$ des électeurs prévoient de voter "oui". ` +
            `Un institut interroge $n = ${n}$ électeurs au hasard et de manière indépendante. On note $X$ le nombre d'électeurs déclarant voter "oui".<br>` +
            `1. Donner la loi de $X$ et préciser $E(X)$ et $V(X)$.<br>` +
            `2. Calculer $P(X \\geqslant ${seuil})$, arrondi à $10^{-4}$.<br>` +
            `3. Interpréter ce résultat.`,
          corrige: `<strong>1.</strong> $X \\sim \\mathcal{B}(${n}\\,;\\,0{,}5)$. $E(X) = ${ex}$ et $V(X) = ${vx}$.<br>` +
            `<strong>2.</strong> $P(X \\geqslant ${seuil}) = 1 - P(X \\leqslant ${seuil - 1}) \\approx ${_pr_dec(pXgeqSeuil)}$.<br>` +
            `<strong>3.</strong> Avec une espérance de $${ex}$, observer au moins $${seuil}$ "oui" est un événement de probabilité $${_pr_dec(_pr_arr4(pXgeqSeuil * 100))}\\,\\%$.`
        };
      }
    ];
    const v3 = pick(variantes3)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Calcul de $P(X \\geqslant k)$ à la calculatrice.</strong> Utiliser <em>BinomFRép</em> (TI) ou <em>binomFRep</em> (Casio) qui donne $P(X \\leqslant k)$, puis : $P(X \\geqslant k) = 1 - P(X \\leqslant k - 1)$. Attention au $-1$ : c'est l'erreur classique au bac.`
    };
  },

  // ============================================================
  // 3. rev_bac_proba_binom_seuil
  // Trouver n minimum tel que P(X >= 1) >= alpha
  // nv1 : exercice direct avec inéquation
  // nv2 : avec ln, n minimum exact
  // nv3 : double seuil ou avec interprétation
  // ============================================================
  rev_bac_proba_binom_seuil: (d) => {
    if (d === 1) {
      // p = 0,1 (probabilité succès par essai), cherche n tel que P(X >= 1) >= 0,9
      // 1 - (1-p)^n >= 0,9 ↔ (0,9)^n <= 0,1 ↔ n ln(0,9) <= ln(0,1) ↔ n >= ln(0,1)/ln(0,9) ≈ 21,85
      // Donc n >= 22
      const variantes = [
        () => {
          const p = 0.1;
          const seuil = 0.9;
          // n_min = ceil(ln(1-seuil) / ln(1-p))
          const nMin = Math.ceil(Math.log(1 - seuil) / Math.log(1 - p));
          return {
            enonce: `Lors d'une tombola, chaque ticket a une probabilité $p = 0{,}1$ d'être gagnant. ` +
              `Un joueur achète $n$ tickets indépendamment. On note $X$ le nombre de tickets gagnants.<br>` +
              `1. Donner la loi de $X$ et exprimer $P(X = 0)$ en fonction de $n$.<br>` +
              `2. Déterminer le plus petit entier $n$ tel que $P(X \\geqslant 1) \\geqslant 0{,}9$.`,
            corrige: `<strong>1.</strong> $X \\sim \\mathcal{B}(n\\,;\\,0{,}1)$. $P(X = 0) = \\dbinom{n}{0}\\,0{,}1^{0}\\,0{,}9^{n} = 0{,}9^{n}$.<br>` +
              `<strong>2.</strong> $P(X \\geqslant 1) = 1 - P(X = 0) = 1 - 0{,}9^{n}$. On résout $1 - 0{,}9^{n} \\geqslant 0{,}9$, soit $0{,}9^{n} \\leqslant 0{,}1$.<br>` +
              `En passant au logarithme (ln strictement croissante) : $n \\ln(0{,}9) \\leqslant \\ln(0{,}1)$. Comme $\\ln(0{,}9) < 0$, on inverse l'inégalité en divisant :<br>` +
              `$n \\geqslant \\dfrac{\\ln(0{,}1)}{\\ln(0{,}9)} \\approx ${_pr_dec(_pr_arr4(Math.log(0.1) / Math.log(0.9)))}$.<br>` +
              `Le plus petit entier vérifiant cette condition est $n = ${nMin}$. Il faut acheter au moins $${nMin}$ tickets pour avoir au moins $90\\,\\%$ de chance d'en avoir un gagnant.`
          };
        },
        () => {
          // Variante : tirage avec remise. p = 0,2, seuil = 0,95
          // 1 - 0,8^n >= 0,95 ↔ 0,8^n <= 0,05 ↔ n >= ln(0,05)/ln(0,8) ≈ 13,4 → n = 14
          const p = 0.2;
          const seuil = 0.95;
          const nMin = Math.ceil(Math.log(1 - seuil) / Math.log(1 - p));
          return {
            enonce: `Dans une boîte, $20\\,\\%$ des objets sont défectueux. On effectue $n$ tirages avec remise et on note $X$ le nombre d'objets défectueux tirés.<br>` +
              `1. Donner la loi de $X$ et exprimer $P(X = 0)$ en fonction de $n$.<br>` +
              `2. Déterminer le plus petit entier $n$ tel que $P(X \\geqslant 1) \\geqslant 0{,}95$.`,
            corrige: `<strong>1.</strong> $X \\sim \\mathcal{B}(n\\,;\\,0{,}2)$. $P(X = 0) = 0{,}8^{n}$.<br>` +
              `<strong>2.</strong> $P(X \\geqslant 1) = 1 - 0{,}8^{n} \\geqslant 0{,}95 \\Leftrightarrow 0{,}8^{n} \\leqslant 0{,}05$. En passant au $\\ln$ : $n \\ln(0{,}8) \\leqslant \\ln(0{,}05)$. Comme $\\ln(0{,}8) < 0$, on inverse : $n \\geqslant \\dfrac{\\ln(0{,}05)}{\\ln(0{,}8)} \\approx ${_pr_dec(_pr_arr4(Math.log(0.05) / Math.log(0.8)))}$.<br>` +
              `Le plus petit entier convenant est $n = ${nMin}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Seuil binomial classique.</strong> Pour $X \\sim \\mathcal{B}(n\\,;\\,p)$ : $P(X \\geqslant 1) = 1 - (1-p)^{n}$. Pour résoudre $1 - (1-p)^{n} \\geqslant \\alpha$, on passe par le logarithme : $n \\geqslant \\dfrac{\\ln(1 - \\alpha)}{\\ln(1 - p)}$ (attention à diviser par un nombre négatif inverse le sens).`
      };
    }

    if (d === 2) {
      const variantes = [
        () => {
          // p = 0,02, seuil = 0,5, n_min = 35
          const p = 0.02;
          const seuil = 0.5;
          const nMin = Math.ceil(Math.log(1 - seuil) / Math.log(1 - p));
          return {
            enonce: `Une maladie touche $2\\,\\%$ d'une population. On prélève $n$ personnes au hasard de façon indépendante. ` +
              `On note $X$ le nombre de personnes malades dans l'échantillon.<br>` +
              `1. Donner la loi de $X$.<br>` +
              `2. Déterminer le nombre minimal de personnes à prélever pour que la probabilité de trouver au moins un malade soit supérieure ou égale à $0{,}5$.`,
            corrige: `<strong>1.</strong> $X \\sim \\mathcal{B}(n\\,;\\,0{,}02)$.<br>` +
              `<strong>2.</strong> $P(X \\geqslant 1) = 1 - 0{,}98^{n} \\geqslant 0{,}5 \\Leftrightarrow 0{,}98^{n} \\leqslant 0{,}5$. ` +
              `$n \\geqslant \\dfrac{\\ln(0{,}5)}{\\ln(0{,}98)} \\approx ${_pr_dec(_pr_arr4(Math.log(0.5) / Math.log(0.98)))}$. Donc $n = ${nMin}$.`
          };
        },
        () => {
          // Tirage avec remise, p = 0,15, seuil = 0,9
          const p = 0.15;
          const seuil = 0.9;
          const nMin = Math.ceil(Math.log(1 - seuil) / Math.log(1 - p));
          return {
            enonce: `Sur une plateforme, $15\\,\\%$ des utilisateurs cliquent sur une publicité. On présente la publicité à $n$ utilisateurs indépendants. ` +
              `On note $X$ le nombre d'utilisateurs cliquant sur la publicité.<br>` +
              `1. Donner la loi de $X$.<br>` +
              `2. Déterminer le nombre minimal $n$ pour que la probabilité d'obtenir au moins un clic soit supérieure ou égale à $0{,}9$.`,
            corrige: `<strong>1.</strong> $X \\sim \\mathcal{B}(n\\,;\\,0{,}15)$.<br>` +
              `<strong>2.</strong> $P(X \\geqslant 1) = 1 - 0{,}85^{n} \\geqslant 0{,}9 \\Leftrightarrow 0{,}85^{n} \\leqslant 0{,}1$. ` +
              `$n \\geqslant \\dfrac{\\ln(0{,}1)}{\\ln(0{,}85)} \\approx ${_pr_dec(_pr_arr4(Math.log(0.1) / Math.log(0.85)))}$. Donc $n = ${nMin}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Logarithme et inégalité.</strong> Quand $0 < q < 1$, $\\ln(q) < 0$. Diviser par $\\ln(q)$ <em>inverse</em> le sens de l'inégalité. C'est l'erreur la plus fréquente sur les seuils binomiaux.`
      };
    }

    // d === 3 : double seuil ou comparaison, 2 variantes
    const variantes3 = [
      () => {
        const p = 0.05;
        const seuil1 = 0.5;
        const seuil2 = 0.9;
        const n1 = Math.ceil(Math.log(1 - seuil1) / Math.log(1 - p));
        const n2 = Math.ceil(Math.log(1 - seuil2) / Math.log(1 - p));
        return {
          enonce: `Lors d'une étude clinique, $5\\,\\%$ des patients présentent un effet indésirable rare. On suit $n$ patients de manière indépendante. ` +
            `On note $X$ le nombre de patients ayant cet effet.<br>` +
            `1. Donner la loi de $X$.<br>` +
            `2. Déterminer $n_1$ pour $P(X \\geqslant 1) \\geqslant 0{,}5$.<br>` +
            `3. Déterminer $n_2$ pour $P(X \\geqslant 1) \\geqslant 0{,}9$.<br>` +
            `4. Comparer $n_1$ et $n_2$.`,
          corrige: `<strong>1.</strong> $X \\sim \\mathcal{B}(n\\,;\\,0{,}05)$.<br>` +
            `<strong>2.</strong> $n \\geqslant \\dfrac{\\ln(0{,}5)}{\\ln(0{,}95)} \\approx ${_pr_dec(_pr_arr4(Math.log(0.5) / Math.log(0.95)))}$, donc $n_1 = ${n1}$.<br>` +
            `<strong>3.</strong> $n \\geqslant \\dfrac{\\ln(0{,}1)}{\\ln(0{,}95)} \\approx ${_pr_dec(_pr_arr4(Math.log(0.1) / Math.log(0.95)))}$, donc $n_2 = ${n2}$.<br>` +
            `<strong>4.</strong> Passer de $50\\,\\%$ à $90\\,\\%$ de détection demande de passer de $${n1}$ à $${n2}$ patients : presque ${Math.round(n2 / n1)} fois plus.`
        };
      },
      () => {
        // p = 0,03, seuils 0,6 et 0,95
        const p = 0.03;
        const seuil1 = 0.6;
        const seuil2 = 0.95;
        const n1 = Math.ceil(Math.log(1 - seuil1) / Math.log(1 - p));
        const n2 = Math.ceil(Math.log(1 - seuil2) / Math.log(1 - p));
        return {
          enonce: `Dans une production industrielle, $3\\,\\%$ des pièces sont défectueuses. On inspecte $n$ pièces indépendamment. On note $X$ le nombre de pièces défectueuses détectées.<br>` +
            `1. Donner la loi de $X$.<br>` +
            `2. Déterminer $n_1$ pour $P(X \\geqslant 1) \\geqslant 0{,}6$.<br>` +
            `3. Déterminer $n_2$ pour $P(X \\geqslant 1) \\geqslant 0{,}95$.<br>` +
            `4. Comparer.`,
          corrige: `<strong>1.</strong> $X \\sim \\mathcal{B}(n\\,;\\,0{,}03)$.<br>` +
            `<strong>2.</strong> $n \\geqslant \\dfrac{\\ln(0{,}4)}{\\ln(0{,}97)} \\approx ${_pr_dec(_pr_arr4(Math.log(0.4) / Math.log(0.97)))}$, donc $n_1 = ${n1}$.<br>` +
            `<strong>3.</strong> $n \\geqslant \\dfrac{\\ln(0{,}05)}{\\ln(0{,}97)} \\approx ${_pr_dec(_pr_arr4(Math.log(0.05) / Math.log(0.97)))}$, donc $n_2 = ${n2}$.<br>` +
            `<strong>4.</strong> Passer de $60\\,\\%$ à $95\\,\\%$ demande de $${n1}$ à $${n2}$ pièces.`
        };
      }
    ];
    const v3 = pick(variantes3)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Coût de la fiabilité.</strong> Pour les seuils binomiaux, $n_{\\min}$ croît à un rythme « logarithmique inverse » par rapport à la probabilité de manquer l'événement.`
    };
  },

  // ============================================================
  // 4. rev_bac_proba_va_jeu
  // Variable aléatoire de gain dans un jeu : loi, espérance, équitabilité
  // nv1 : déterminer la loi (tableau)
  // nv2 : + espérance, jeu équitable
  // nv3 : optimiser la mise / interpréter
  // ============================================================
  rev_bac_proba_va_jeu: (d) => {
    if (d === 1) {
      const variantes = [
        () => ({
          enonce: `À la roulette, on mise $1$ € sur un numéro entre $1$ et $36$. Si la bille s'arrête sur ce numéro, on gagne $35$ € (en plus de la mise rendue, gain net $35$ €). Sinon, on perd sa mise.<br>` +
            `Soit $X$ la variable aléatoire égale au gain net du joueur.<br>` +
            `Donner la loi de probabilité de $X$ sous forme de tableau.`,
          corrige: `$X$ prend les valeurs $35$ ou $-1$.<br>` +
            `$P(X = 35) = \\dfrac{1}{36}$ et $P(X = -1) = \\dfrac{35}{36}$.<br>` +
            `<table style="border-collapse:collapse; margin-top:8px;"><tr><th style="border:1px solid #888; padding:4px 10px;">$x_i$</th><td style="border:1px solid #888; padding:4px 10px;">$-1$</td><td style="border:1px solid #888; padding:4px 10px;">$35$</td></tr>` +
            `<tr><th style="border:1px solid #888; padding:4px 10px;">$P(X = x_i)$</th><td style="border:1px solid #888; padding:4px 10px;">$\\dfrac{35}{36}$</td><td style="border:1px solid #888; padding:4px 10px;">$\\dfrac{1}{36}$</td></tr></table>` +
            `<br>Vérification : $\\dfrac{35}{36} + \\dfrac{1}{36} = 1$. ✓`
        }),
        () => ({
          // Tirage d'une urne : 10 boules, 3 rouges (gain 5€), 7 blanches (perte 2€)
          enonce: `Une urne contient $10$ boules : $3$ rouges et $7$ blanches. On tire une boule au hasard. ` +
            `Si elle est rouge, on gagne $5$ € ; si elle est blanche, on perd $2$ €.<br>` +
            `Soit $X$ le gain net du joueur. Donner la loi de probabilité de $X$.`,
          corrige: `$X$ prend les valeurs $5$ ou $-2$.<br>` +
            `$P(X = 5) = \\dfrac{3}{10}$ et $P(X = -2) = \\dfrac{7}{10}$.<br>` +
            `<table style="border-collapse:collapse; margin-top:8px;"><tr><th style="border:1px solid #888; padding:4px 10px;">$x_i$</th><td style="border:1px solid #888; padding:4px 10px;">$-2$</td><td style="border:1px solid #888; padding:4px 10px;">$5$</td></tr>` +
            `<tr><th style="border:1px solid #888; padding:4px 10px;">$P(X = x_i)$</th><td style="border:1px solid #888; padding:4px 10px;">$\\dfrac{7}{10}$</td><td style="border:1px solid #888; padding:4px 10px;">$\\dfrac{3}{10}$</td></tr></table>` +
            `<br>Vérification : $\\dfrac{7}{10} + \\dfrac{3}{10} = 1$. ✓`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Loi de probabilité d'une VA.</strong> On présente sous forme de tableau les valeurs $x_i$ prises par $X$ avec leurs probabilités $P(X = x_i)$. La somme de toutes ces probabilités doit faire $1$.`
      };
    }

    if (d === 2) {
      const variantes = [
        () => ({
          enonce: `Un joueur lance un dé équilibré à six faces. Les gains (algébriques) sont :<br>` +
            `- si le dé indique $6$ : il gagne $5$ €<br>` +
            `- si le dé indique $1$ ou $2$ : il perd $2$ €<br>` +
            `- sinon : il ne gagne et ne perd rien.<br>` +
            `On note $X$ le gain net.<br>` +
            `1. Donner la loi de probabilité de $X$.<br>` +
            `2. Calculer $E(X)$.<br>` +
            `3. Le jeu est-il favorable au joueur ?`,
          corrige: `<strong>1.</strong> $X$ prend les valeurs $5$, $-2$, $0$.<br>` +
            `$P(X = 5) = \\dfrac{1}{6}$ ; $P(X = -2) = \\dfrac{2}{6} = \\dfrac{1}{3}$ ; $P(X = 0) = \\dfrac{3}{6} = \\dfrac{1}{2}$.<br>` +
            `Vérif : $\\dfrac{1}{6} + \\dfrac{1}{3} + \\dfrac{1}{2} = 1$. ✓<br>` +
            `<strong>2.</strong> $E(X) = 5 \\times \\dfrac{1}{6} + (-2) \\times \\dfrac{1}{3} + 0 \\times \\dfrac{1}{2} = \\dfrac{5}{6} - \\dfrac{4}{6} = \\dfrac{1}{6} \\approx 0{,}17$ €.<br>` +
            `<strong>3.</strong> $E(X) > 0$ : le jeu est <em>favorable</em> au joueur.`
        }),
        () => ({
          // Tirage de 2 boules dans une urne, gain selon couleurs
          // Urne : 4 rouges (R), 6 blanches (B). On tire 2 boules SIMULTANÉMENT (sans remise).
          // 2R : gain 5€. P(2R) = C(4,2)/C(10,2) = 6/45 = 2/15
          // 2B : perte 1€. P(2B) = C(6,2)/C(10,2) = 15/45 = 1/3
          // 1R+1B : gain 1€. P = 4·6/C(10,2) = 24/45 = 8/15
          // Vérif somme : 2/15 + 8/15 + 5/15 = 15/15 = 1 ✓ (5/15 = 1/3)
          // E(X) = 5·(2/15) + 1·(8/15) + (-1)·(5/15) = 10/15 + 8/15 - 5/15 = 13/15 ≈ 0,87
          enonce: `Une urne contient $4$ boules rouges et $6$ boules blanches. On tire simultanément $2$ boules au hasard. ` +
            `Les gains sont :<br>` +
            `- $2$ rouges : gain de $5$ €<br>` +
            `- $1$ rouge et $1$ blanche : gain de $1$ €<br>` +
            `- $2$ blanches : perte de $1$ €.<br>` +
            `On note $X$ le gain net.<br>` +
            `1. Donner la loi de probabilité de $X$.<br>` +
            `2. Calculer $E(X)$.<br>` +
            `3. Le jeu est-il favorable au joueur ?`,
          corrige: `<strong>1.</strong> Nombre de tirages possibles : $\\dbinom{10}{2} = 45$.<br>` +
            `$P(X = 5) = \\dfrac{\\binom{4}{2}}{45} = \\dfrac{6}{45} = \\dfrac{2}{15}$ ; ` +
            `$P(X = 1) = \\dfrac{4 \\times 6}{45} = \\dfrac{24}{45} = \\dfrac{8}{15}$ ; ` +
            `$P(X = -1) = \\dfrac{\\binom{6}{2}}{45} = \\dfrac{15}{45} = \\dfrac{1}{3}$.<br>` +
            `<strong>2.</strong> $E(X) = 5 \\times \\dfrac{2}{15} + 1 \\times \\dfrac{8}{15} + (-1) \\times \\dfrac{5}{15} = \\dfrac{10 + 8 - 5}{15} = \\dfrac{13}{15} \\approx 0{,}87$ €.<br>` +
            `<strong>3.</strong> $E(X) > 0$ : le jeu est <em>favorable</em> au joueur.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Espérance et équitabilité.</strong> $E(X) = \\sum x_i\\,P(X = x_i)$. Jeu <em>équitable</em> si $E(X) = 0$, <em>favorable</em> au joueur si $E(X) > 0$, <em>défavorable</em> si $E(X) < 0$.`
      };
    }

    // d === 3 : optimiser la mise / interpréter, 2 variantes
    const variantes = [
      () => ({
        enonce: `Une loterie propose le jeu suivant : pour une mise de $m$ euros, on tire un ticket parmi $1000$. ` +
          `Un ticket donne un gros lot de $500$ €, $10$ tickets donnent un lot de $50$ €, $50$ tickets donnent un lot de $5$ €, ` +
          `les autres ($939$ tickets) ne rapportent rien. Soit $X$ le gain net (lot $-$ mise).<br>` +
          `1. Exprimer la loi de $X$ en fonction de $m$.<br>` +
          `2. Calculer $E(X)$ en fonction de $m$.<br>` +
          `3. Pour quelle valeur de $m$ le jeu est-il équitable ?`,
        corrige: `<strong>1.</strong> $X$ prend les valeurs $500 - m$, $50 - m$, $5 - m$, $-m$ avec respectivement $\\dfrac{1}{1000}$, $\\dfrac{10}{1000}$, $\\dfrac{50}{1000}$, $\\dfrac{939}{1000}$.<br>` +
          `<strong>2.</strong> $E(X) = \\dfrac{500 + 500 + 250}{1000} - m = 1{,}25 - m$.<br>` +
          `<strong>3.</strong> $E(X) = 0 \\Leftrightarrow m = 1{,}25$ €.`
      }),
      () => ({
        // Tombola : 200 tickets. 1 gros lot 100€, 5 lots 20€, 194 sans rien. Mise m
        // E(gain brut) = 100·(1/200) + 20·(5/200) + 0·(194/200) = 0,5 + 0,5 = 1
        // E(X) = 1 - m. Équitable si m = 1
        enonce: `Une tombola propose $200$ tickets : $1$ ticket donne un lot de $100$ €, $5$ tickets donnent un lot de $20$ € chacun, ` +
          `les $194$ autres ne rapportent rien. Chaque ticket coûte $m$ euros. Soit $X$ le gain net d'un joueur.<br>` +
          `1. Exprimer la loi de $X$ en fonction de $m$.<br>` +
          `2. Calculer $E(X)$ en fonction de $m$.<br>` +
          `3. Pour quelle valeur de $m$ le jeu est-il équitable ?`,
        corrige: `<strong>1.</strong> $X$ prend les valeurs $100 - m$, $20 - m$, $-m$ avec respectivement $\\dfrac{1}{200}$, $\\dfrac{5}{200}$, $\\dfrac{194}{200}$.<br>` +
          `<strong>2.</strong> $E(X) = \\dfrac{100 + 100}{200} - m = 1 - m$.<br>` +
          `<strong>3.</strong> $E(X) = 0 \\Leftrightarrow m = 1$ €.`
      })
    ];
    const v3 = pick(variantes)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Mise équitable.</strong> Dans un jeu à mise $m$, le gain net est $\\text{lot} - m$. L'espérance s'écrit $E(X) = E(\\text{lot}) - m$. Le jeu est équitable quand $m = E(\\text{lot})$.`
    };
  },

  // ============================================================
  // 5. rev_bac_proba_succession
  // Succession d'épreuves de Bernoulli indépendantes (modélisation + P(au moins 1))
  // nv1 : modéliser, calculer P(X = 0) et P(X >= 1)
  // nv2 : calcul P(X >= k) avec calculatrice
  // nv3 : succession avec seuil
  // ============================================================
  rev_bac_proba_succession: (d) => {
    if (d === 1) {
      // 5 tirages avec remise, p = 0,2, P(X = 0) et P(X >= 1)
      const variantes = [
        () => {
          const n = 5;
          const p = 0.2;
          const pX0 = _pr_arr4(Math.pow(1 - p, n));
          const pXgeq1 = _pr_arr4(1 - pX0);
          return {
            enonce: `On répète $${n}$ fois, de façon indépendante, une expérience aléatoire dont la probabilité de succès est $p = 0{,}2$. ` +
              `On note $X$ le nombre de succès.<br>` +
              `1. Quelle est la loi de $X$ ?<br>` +
              `2. Calculer $P(X = 0)$, puis $P(X \\geqslant 1)$.`,
            corrige: `<strong>1.</strong> $X$ est le nombre de succès dans une succession de $${n}$ épreuves de Bernoulli indépendantes de paramètre $0{,}2$. ` +
              `Donc $X \\sim \\mathcal{B}(${n}\\,;\\,0{,}2)$.<br>` +
              `<strong>2.</strong> $P(X = 0) = \\dbinom{${n}}{0} \\times 0{,}2^{0} \\times 0{,}8^{${n}} = 0{,}8^{${n}} \\approx ${_pr_dec(pX0)}$.<br>` +
              `$P(X \\geqslant 1) = 1 - P(X = 0) \\approx ${_pr_dec(pXgeq1)}$.`
          };
        },
        () => {
          // Composants électroniques : 4 tests indépendants, p = 0,1 d'être défectueux
          const n = 4;
          const p = 0.1;
          const pX0 = _pr_arr4(Math.pow(1 - p, n));
          const pXgeq1 = _pr_arr4(1 - pX0);
          return {
            enonce: `Une usine fabrique des composants. La probabilité qu'un composant soit défectueux est $0{,}1$. ` +
              `On choisit $${n}$ composants au hasard et de façon indépendante. On note $X$ le nombre de composants défectueux.<br>` +
              `1. Justifier que $X \\sim \\mathcal{B}(${n}\\,;\\,0{,}1)$.<br>` +
              `2. Calculer la probabilité qu'aucun composant ne soit défectueux.<br>` +
              `3. En déduire la probabilité qu'au moins un composant soit défectueux.`,
            corrige: `<strong>1.</strong> Chaque composant constitue une épreuve de Bernoulli (succès = défectueux, $p = 0{,}1$). ` +
              `Les $${n}$ tests sont indépendants, $X$ compte les succès, donc $X \\sim \\mathcal{B}(${n}\\,;\\,0{,}1)$.<br>` +
              `<strong>2.</strong> $P(X = 0) = 0{,}9^{${n}} \\approx ${_pr_dec(pX0)}$.<br>` +
              `<strong>3.</strong> $P(X \\geqslant 1) = 1 - P(X = 0) \\approx ${_pr_dec(pXgeq1)}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>« Au moins un » : utiliser l'événement contraire.</strong> $P(X \\geqslant 1) = 1 - P(X = 0)$. Cette astuce évite le calcul de $P(X = 1) + P(X = 2) + \\ldots$ Souvent au bac, l'énoncé suggère implicitement cette technique.`
      };
    }

    if (d === 2) {
      const variantes = [
        () => {
          const n = 8;
          const p = 0.3;
          const pXleq2 = Array.from({ length: 3 }, (_, k) => _pr_binomP(n, p, k)).reduce((a, b) => a + b, 0);
          const pXgeq3 = _pr_arr4(1 - pXleq2);
          return {
            enonce: `Une équipe a une probabilité de gagner un match de $0{,}3$, indépendamment du précédent. ` +
              `Elle joue $${n}$ matchs. On note $X$ le nombre de matchs gagnés.<br>` +
              `1. Justifier que $X \\sim \\mathcal{B}(${n}\\,;\\,0{,}3)$ et donner $E(X)$.<br>` +
              `2. Calculer $P(X \\geqslant 3)$, arrondi à $10^{-4}$.<br>` +
              `3. Interpréter.`,
            corrige: `<strong>1.</strong> Chaque match : épreuve de Bernoulli indépendante, $p = 0{,}3$. Donc $X \\sim \\mathcal{B}(${n}\\,;\\,0{,}3)$ et $E(X) = ${_pr_dec(n * p)}$.<br>` +
              `<strong>2.</strong> $P(X \\geqslant 3) = 1 - P(X \\leqslant 2) \\approx ${_pr_dec(pXgeq3)}$.<br>` +
              `<strong>3.</strong> Environ $${_pr_dec(_pr_arr4(pXgeq3 * 100))}\\,\\%$ de chances de gagner au moins $3$ matchs sur $${n}$.`
          };
        },
        () => {
          // n = 15, p = 0,4, P(X >= 7)
          const n = 15;
          const p = 0.4;
          const k0 = 7;
          const pXleq = Array.from({ length: k0 }, (_, k) => _pr_binomP(n, p, k)).reduce((a, b) => a + b, 0);
          const pXgeq = _pr_arr4(1 - pXleq);
          return {
            enonce: `Un commercial parvient à conclure une vente avec une probabilité $0{,}4$ à chaque appel, indépendamment des autres. ` +
              `Il effectue $${n}$ appels dans la journée. On note $X$ le nombre de ventes conclues.<br>` +
              `1. Justifier la loi de $X$ et calculer $E(X)$.<br>` +
              `2. Calculer $P(X \\geqslant ${k0})$, arrondi à $10^{-4}$.<br>` +
              `3. Interpréter.`,
            corrige: `<strong>1.</strong> $X \\sim \\mathcal{B}(${n}\\,;\\,0{,}4)$ et $E(X) = ${n * p}$.<br>` +
              `<strong>2.</strong> $P(X \\geqslant ${k0}) = 1 - P(X \\leqslant ${k0 - 1}) \\approx ${_pr_dec(pXgeq)}$.<br>` +
              `<strong>3.</strong> Probabilité de $${_pr_dec(_pr_arr4(pXgeq * 100))}\\,\\%$ de conclure au moins $${k0}$ ventes.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>$P(X \\geqslant k) = 1 - P(X \\leqslant k - 1)$.</strong> Toujours convertir « au moins $k$ » en utilisant la probabilité cumulée disponible à la calculatrice (BinomFRép).`
      };
    }

    // d === 3 : succession avec seuil, 2 variantes
    const variantes = [
      () => ({
        enonce: `Lors d'un concours de tir, la probabilité qu'un archer atteigne la cible est $p = 0{,}4$ à chaque tir, indépendamment des autres. ` +
          `Il effectue $n$ tirs.<br>` +
          `1. Quelle est la loi du nombre $X$ de tirs réussis ?<br>` +
          `2. Exprimer $P(X = 0)$ en fonction de $n$.<br>` +
          `3. Combien de tirs faut-il pour que la probabilité d'atteindre la cible au moins une fois soit supérieure à $0{,}99$ ?`,
        corrige: `<strong>1.</strong> $X \\sim \\mathcal{B}(n\\,;\\,0{,}4)$.<br>` +
          `<strong>2.</strong> $P(X = 0) = 0{,}6^{n}$.<br>` +
          `<strong>3.</strong> $1 - 0{,}6^{n} \\geqslant 0{,}99 \\Leftrightarrow 0{,}6^{n} \\leqslant 0{,}01 \\Leftrightarrow n \\geqslant \\dfrac{\\ln(0{,}01)}{\\ln(0{,}6)} \\approx ${_pr_dec(_pr_arr4(Math.log(0.01) / Math.log(0.6)))}$. ` +
          `Donc $n = ${Math.ceil(Math.log(0.01) / Math.log(0.6))}$.`
      }),
      () => ({
        // p = 0,25 (1 chance sur 4), seuil 0,9
        // 1 - 0,75^n >= 0,9 ↔ 0,75^n <= 0,1 ↔ n >= ln(0,1)/ln(0,75) ≈ 8,0 → n = 9
        enonce: `Lors d'un jeu vidéo, un joueur a une probabilité de $\\dfrac{1}{4}$ de réussir un niveau, indépendamment des essais précédents. ` +
          `Il joue $n$ parties.<br>` +
          `1. Quelle est la loi de $X$, nombre de niveaux réussis ?<br>` +
          `2. Exprimer $P(X = 0)$ en fonction de $n$.<br>` +
          `3. Combien de parties faut-il pour que la probabilité de réussir au moins une fois soit supérieure à $0{,}9$ ?`,
        corrige: `<strong>1.</strong> $X \\sim \\mathcal{B}(n\\,;\\,0{,}25)$.<br>` +
          `<strong>2.</strong> $P(X = 0) = 0{,}75^{n}$.<br>` +
          `<strong>3.</strong> $1 - 0{,}75^{n} \\geqslant 0{,}9 \\Leftrightarrow 0{,}75^{n} \\leqslant 0{,}1 \\Leftrightarrow n \\geqslant \\dfrac{\\ln(0{,}1)}{\\ln(0{,}75)} \\approx ${_pr_dec(_pr_arr4(Math.log(0.1) / Math.log(0.75)))}$. ` +
          `Donc $n = ${Math.ceil(Math.log(0.1) / Math.log(0.75))}$.`
      })
    ];
    const v3 = pick(variantes)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Combiner Bernoulli et seuil.</strong> Méthode standard : (1) modéliser par $\\mathcal{B}(n\\,;\\,p)$, (2) écrire $P(X \\geqslant 1) = 1 - (1-p)^{n}$, (3) résoudre par passage au logarithme.`
    };
  },

  // ============================================================
  // 6. rev_bac_proba_concentration_appli
  // Application de Bienaymé-Tchebychev
  // nv1 : appliquer la formule directement
  // nv2 : appliquer à Mn (moyenne d'échantillon)
  // nv3 : trouver n minimum pour une garantie
  // ============================================================
  rev_bac_proba_concentration_appli: (d) => {
    if (d === 1) {
      // X telle que E(X) = 5, V(X) = 4, majorer P(|X - 5| >= 6) par 4/36 = 1/9
      const variantes = [
        () => {
          // E(X) = 10, V(X) = 9, majorer P(|X - 10| >= 5)
          const mu = 10;
          const v = 9;
          const eps = 5;
          const majorant = v / (eps * eps);
          return {
            enonce: `Soit $X$ une variable aléatoire d'espérance $E(X) = ${mu}$ et de variance $V(X) = ${v}$. ` +
              `À l'aide de l'inégalité de Bienaymé-Tchebychev, majorer $P(|X - ${mu}| \\geqslant ${eps})$.`,
            corrige: `L'inégalité de Bienaymé-Tchebychev appliquée à $X$ s'écrit :<br>` +
              `$P(|X - E(X)| \\geqslant \\varepsilon) \\leqslant \\dfrac{V(X)}{\\varepsilon^{2}}$, pour tout $\\varepsilon > 0$.<br>` +
              `Ici, $E(X) = ${mu}$, $V(X) = ${v}$ et $\\varepsilon = ${eps}$. Donc :<br>` +
              `$P(|X - ${mu}| \\geqslant ${eps}) \\leqslant \\dfrac{${v}}{${eps}^{2}} = \\dfrac{${v}}{${eps * eps}} = ${_pr_dec(_pr_arr4(majorant))}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Inégalité de Bienaymé-Tchebychev.</strong> Pour toute variable $X$ d'espérance $E(X)$ et de variance $V(X)$ finie : $P(|X - E(X)| \\geqslant \\varepsilon) \\leqslant \\dfrac{V(X)}{\\varepsilon^{2}}$ pour tout $\\varepsilon > 0$. C'est un majorant <em>universel</em>, généralement très lâche, mais valable sans hypothèse de loi.`
      };
    }

    if (d === 2) {
      const variantes = [
        () => {
          // p=0,5, n=100, eps=0,1. Majorant = 0,25/(100·0,01) = 0,25
          const p = 0.5;
          const n = 100;
          const eps = 0.1;
          const majorant = p * (1 - p) / (n * eps * eps);
          return {
            enonce: `Pour estimer la proportion $p$ d'individus possédant un trait dans une population, on prélève $n = ${n}$ individus indépendamment ` +
              `et on note $M_n$ la proportion observée dans l'échantillon.<br>` +
              `On admet que $E(M_n) = p$ et $V(M_n) = \\dfrac{p(1-p)}{n}$.<br>` +
              `Dans cet exercice, on suppose $p = ${_pr_dec(p)}$.<br>` +
              `1. Calculer $E(M_n)$ et $V(M_n)$.<br>` +
              `2. À l'aide de l'inégalité de Bienaymé-Tchebychev, majorer $P(|M_n - p| \\geqslant ${_pr_dec(eps)})$.`,
            corrige: `<strong>1.</strong> $E(M_n) = ${_pr_dec(p)}$ et $V(M_n) = \\dfrac{${_pr_dec(p)} \\times ${_pr_dec(1 - p)}}{${n}} = ${_pr_dec(_pr_arr4(p * (1 - p) / n))}$.<br>` +
              `<strong>2.</strong> $P(|M_n - p| \\geqslant ${_pr_dec(eps)}) \\leqslant \\dfrac{V(M_n)}{${_pr_dec(eps)}^{2}} = \\dfrac{${_pr_dec(_pr_arr4(p * (1 - p) / n))}}{${_pr_dec(eps * eps)}} = ${_pr_dec(_pr_arr4(majorant))}$.`
          };
        },
        () => {
          // p=0,3, n=200, eps=0,05. V(Mn) = 0,21/200 = 0,00105
          // Majorant = 0,00105 / 0,0025 = 0,42
          const p = 0.3;
          const n = 200;
          const eps = 0.05;
          const majorant = p * (1 - p) / (n * eps * eps);
          return {
            enonce: `Pour estimer la proportion $p$ de clients satisfaits dans une enseigne, on interroge $n = ${n}$ clients indépendamment ` +
              `et on note $M_n$ la proportion observée.<br>` +
              `On admet $E(M_n) = p$ et $V(M_n) = \\dfrac{p(1-p)}{n}$. On suppose $p = ${_pr_dec(p)}$.<br>` +
              `1. Calculer $E(M_n)$ et $V(M_n)$.<br>` +
              `2. À l'aide de l'inégalité de Bienaymé-Tchebychev, majorer $P(|M_n - p| \\geqslant ${_pr_dec(eps)})$.`,
            corrige: `<strong>1.</strong> $E(M_n) = ${_pr_dec(p)}$ et $V(M_n) = \\dfrac{${_pr_dec(p)} \\times ${_pr_dec(1 - p)}}{${n}} = \\dfrac{${_pr_dec(p * (1 - p))}}{${n}} = ${_pr_dec(_pr_arr4(p * (1 - p) / n))}$.<br>` +
              `<strong>2.</strong> $P(|M_n - p| \\geqslant ${_pr_dec(eps)}) \\leqslant \\dfrac{${_pr_dec(_pr_arr4(p * (1 - p) / n))}}{${_pr_dec(eps * eps)}} = ${_pr_dec(_pr_arr4(majorant))}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Concentration sur $M_n$.</strong> Pour une moyenne empirique $M_n = \\dfrac{X_1 + \\ldots + X_n}{n}$ : $E(M_n) = \\mu$ et $V(M_n) = \\dfrac{\\sigma^2}{n}$. La variance diminue en $\\dfrac{1}{n}$ : c'est le fondement de la <em>loi des grands nombres</em>.`
      };
    }

    // d === 3 : trouver n minimum, 2 variantes
    const variantes = [
      () => ({
        enonce: `On souhaite estimer la proportion $p$ d'électeurs favorables à un candidat. On suppose $p$ inconnue, mais $p(1-p) \\leqslant \\dfrac{1}{4}$. ` +
          `On note $M_n$ la fréquence observée dans un échantillon de taille $n$.<br>` +
          `On veut garantir $P(|M_n - p| \\geqslant 0{,}05) \\leqslant 0{,}05$.<br>` +
          `Quelle taille minimale $n$ d'échantillon faut-il prendre ?`,
        corrige: `D'après l'inégalité : $P(|M_n - p| \\geqslant \\varepsilon) \\leqslant \\dfrac{p(1-p)}{n \\varepsilon^{2}} \\leqslant \\dfrac{1}{4 n \\varepsilon^{2}}$.<br>` +
          `Avec $\\varepsilon = 0{,}05$, on veut $\\dfrac{1}{4n \\times 0{,}0025} \\leqslant 0{,}05$, soit $n \\geqslant \\dfrac{1}{4 \\times 0{,}05 \\times 0{,}0025} = 2000$.<br>` +
          `Il faut un échantillon d'au moins $2000$ personnes.`
      }),
      () => ({
        // ε = 0,02, α = 0,1. n >= 1/(4 · 0,1 · 0,0004) = 1/0,00016 = 6250
        enonce: `On souhaite estimer une proportion $p$ inconnue dans une population, avec $p(1-p) \\leqslant \\dfrac{1}{4}$. ` +
          `On note $M_n$ la fréquence observée dans un échantillon de taille $n$.<br>` +
          `On veut garantir $P(|M_n - p| \\geqslant 0{,}02) \\leqslant 0{,}1$.<br>` +
          `Quelle taille minimale $n$ d'échantillon faut-il prendre ?`,
        corrige: `Avec $\\varepsilon = 0{,}02$, on veut $\\dfrac{1}{4n \\times 0{,}0004} \\leqslant 0{,}1$, soit $n \\geqslant \\dfrac{1}{4 \\times 0{,}1 \\times 0{,}0004} = \\dfrac{1}{0{,}00016} = 6250$.<br>` +
          `Il faut un échantillon d'au moins $6250$ personnes.`
      })
    ];
    const v3 = pick(variantes)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Taille d'échantillon par Tchebychev.</strong> En utilisant $p(1-p) \\leqslant \\dfrac{1}{4}$ : la taille $n$ minimale pour garantir $P(|M_n - p| \\geqslant \\varepsilon) \\leqslant \\alpha$ est $n \\geqslant \\dfrac{1}{4 \\alpha \\varepsilon^{2}}$.`
    };
  },

  // ============================================================
  // 7. rev_bac_proba_independance
  // Tester l'indépendance de deux événements
  // nv1 : test direct P(A ∩ B) = P(A) P(B)
  // nv2 : à partir d'un tableau ou d'un arbre
  // nv3 : équivalence et contre-exemple
  // ============================================================
  rev_bac_proba_independance: (d) => {
    if (d === 1) {
      // P(A) = 0,4, P(B) = 0,5, P(A ∩ B) = 0,2 → indépendants
      // OU P(A) = 0,4, P(B) = 0,5, P(A ∩ B) = 0,3 → pas indépendants
      const variantes = [
        () => {
          // Cas indépendants
          const pA = 0.4;
          const pB = 0.5;
          const pAB = pA * pB; // 0,2 → indépendants
          return {
            enonce: `Soient $A$ et $B$ deux événements tels que $P(A) = ${_pr_dec(pA)}$, $P(B) = ${_pr_dec(pB)}$ et $P(A \\cap B) = ${_pr_dec(pAB)}$.<br>` +
              `Les événements $A$ et $B$ sont-ils indépendants ? Justifier.`,
            corrige: `On compare $P(A \\cap B)$ et $P(A) \\times P(B)$ :<br>` +
              `$P(A) \\times P(B) = ${_pr_dec(pA)} \\times ${_pr_dec(pB)} = ${_pr_dec(pA * pB)}$.<br>` +
              `$P(A \\cap B) = ${_pr_dec(pAB)}$.<br>` +
              `Comme $P(A \\cap B) = P(A) \\times P(B)$, les événements $A$ et $B$ sont <strong>indépendants</strong>.`
          };
        },
        () => {
          // Cas non indépendants
          const pA = 0.6;
          const pB = 0.4;
          const pAB = 0.3; // ≠ 0,24
          return {
            enonce: `Soient $A$ et $B$ deux événements tels que $P(A) = ${_pr_dec(pA)}$, $P(B) = ${_pr_dec(pB)}$ et $P(A \\cap B) = ${_pr_dec(pAB)}$.<br>` +
              `Les événements $A$ et $B$ sont-ils indépendants ? Justifier.`,
            corrige: `On compare $P(A \\cap B)$ et $P(A) \\times P(B)$ :<br>` +
              `$P(A) \\times P(B) = ${_pr_dec(pA)} \\times ${_pr_dec(pB)} = ${_pr_dec(pA * pB)}$.<br>` +
              `$P(A \\cap B) = ${_pr_dec(pAB)}$.<br>` +
              `Comme $P(A \\cap B) \\neq P(A) \\times P(B)$ ($${_pr_dec(pAB)} \\neq ${_pr_dec(pA * pB)}$), les événements $A$ et $B$ ne sont <strong>pas indépendants</strong>.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Indépendance de deux événements.</strong> Deux événements $A$ et $B$ sont <em>indépendants</em> si et seulement si $P(A \\cap B) = P(A) \\times P(B)$. ` +
          `<em>Attention :</em> indépendance $\\neq$ incompatibilité ($A$ et $B$ incompatibles signifie $A \\cap B = \\emptyset$, soit $P(A \\cap B) = 0$).`
      };
    }

    if (d === 2) {
      const variantes = [
        () => ({
          // Tableau Garçons/Filles, Sport/Pas sport, indépendants
          enonce: `Le tableau ci-dessous donne la répartition des élèves d'un lycée selon le sexe et la pratique d'un sport en club :<br>` +
            `<table style="border-collapse:collapse; margin-top:8px;"><tr><th style="border:1px solid #888; padding:4px 10px;"></th><th style="border:1px solid #888; padding:4px 10px;">Sport</th><th style="border:1px solid #888; padding:4px 10px;">Pas de sport</th><th style="border:1px solid #888; padding:4px 10px;">Total</th></tr>` +
            `<tr><th style="border:1px solid #888; padding:4px 10px;">Garçons</th><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$60$</td><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$90$</td><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$150$</td></tr>` +
            `<tr><th style="border:1px solid #888; padding:4px 10px;">Filles</th><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$40$</td><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$60$</td><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$100$</td></tr>` +
            `<tr><th style="border:1px solid #888; padding:4px 10px;">Total</th><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$100$</td><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$150$</td><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$250$</td></tr></table>` +
            `<br>On choisit un élève au hasard. On note $G$ : « l'élève est un garçon » et $S$ : « pratique un sport ».<br>` +
            `Les événements $G$ et $S$ sont-ils indépendants ? Justifier.`,
          corrige: `$P(G) = \\dfrac{150}{250} = 0{,}6$ ; $P(S) = \\dfrac{100}{250} = 0{,}4$ ; $P(G \\cap S) = \\dfrac{60}{250} = 0{,}24$.<br>` +
            `$P(G) \\times P(S) = 0{,}6 \\times 0{,}4 = 0{,}24 = P(G \\cap S)$. Donc $G$ et $S$ sont <strong>indépendants</strong>.`
        }),
        () => ({
          // Tableau Fumeur/Non Fumeur, Malade/Pas Malade, non indépendants
          // F : 80 total, M : 30 fumeurs malades, 50 fumeurs sains
          // NF : 320 total, M : 40 malades, 280 sains
          // Total 400. Total M = 70, NM = 330.
          // P(F) = 80/400 = 0,2. P(M) = 70/400 = 0,175. P(F∩M) = 30/400 = 0,075
          // P(F)·P(M) = 0,2·0,175 = 0,035 ≠ 0,075 → non indépendants
          enonce: `Le tableau ci-dessous donne la répartition d'un groupe selon le statut de fumeur et la présence d'une affection respiratoire :<br>` +
            `<table style="border-collapse:collapse; margin-top:8px;"><tr><th style="border:1px solid #888; padding:4px 10px;"></th><th style="border:1px solid #888; padding:4px 10px;">Malade</th><th style="border:1px solid #888; padding:4px 10px;">Sain</th><th style="border:1px solid #888; padding:4px 10px;">Total</th></tr>` +
            `<tr><th style="border:1px solid #888; padding:4px 10px;">Fumeurs</th><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$30$</td><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$50$</td><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$80$</td></tr>` +
            `<tr><th style="border:1px solid #888; padding:4px 10px;">Non-fumeurs</th><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$40$</td><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$280$</td><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$320$</td></tr>` +
            `<tr><th style="border:1px solid #888; padding:4px 10px;">Total</th><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$70$</td><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$330$</td><td style="border:1px solid #888; padding:4px 10px; text-align:center;">$400$</td></tr></table>` +
            `<br>On choisit une personne au hasard. On note $F$ : « la personne fume » et $M$ : « la personne est malade ».<br>` +
            `Les événements $F$ et $M$ sont-ils indépendants ? Interpréter.`,
          corrige: `$P(F) = \\dfrac{80}{400} = 0{,}2$ ; $P(M) = \\dfrac{70}{400} = 0{,}175$ ; $P(F \\cap M) = \\dfrac{30}{400} = 0{,}075$.<br>` +
            `$P(F) \\times P(M) = 0{,}2 \\times 0{,}175 = 0{,}035$.<br>` +
            `$P(F \\cap M) = 0{,}075 \\neq 0{,}035$, donc $F$ et $M$ ne sont <strong>pas indépendants</strong>. ` +
            `Interprétation : le fait d'être fumeur est lié à la maladie (proportion de malades plus élevée chez les fumeurs : $\\dfrac{30}{80} = 0{,}375$, contre $\\dfrac{40}{320} = 0{,}125$ chez les non-fumeurs).`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Tester l'indépendance avec un tableau.</strong> Calculer $P(A)$, $P(B)$ et $P(A \\cap B)$ à partir des effectifs (probabilité = effectif / total), puis comparer $P(A \\cap B)$ et $P(A) \\times P(B)$.`
      };
    }

    // d === 3 : équivalence et caractérisation, 2 variantes
    const variantes = [
      () => ({
        enonce: `Soient $A$ et $B$ deux événements de probabilités strictement positives.<br>` +
          `1. Démontrer que $A$ et $B$ sont indépendants si et seulement si $P_A(B) = P(B)$.<br>` +
          `2. Application : on lance deux dés équilibrés. Soit $A$ : « le premier dé donne un nombre pair » et $B$ : « la somme des deux dés est paire ». ` +
          `Les événements $A$ et $B$ sont-ils indépendants ?`,
        corrige: `<strong>1.</strong> Par définition : $P_A(B) = \\dfrac{P(A \\cap B)}{P(A)}$.<br>` +
          `$A$ et $B$ indépendants $\\iff P(A \\cap B) = P(A) \\times P(B) \\iff \\dfrac{P(A \\cap B)}{P(A)} = P(B) \\iff P_A(B) = P(B)$. CQFD.<br>` +
          `<strong>2.</strong> $P(A) = \\dfrac{1}{2}$. La somme est paire ssi les deux dés ont la même parité, donc $P(B) = \\dfrac{18}{36} = \\dfrac{1}{2}$. ` +
          `Pour $A \\cap B$ : premier dé pair ET somme paire ⟹ second dé pair aussi, donc $P(A \\cap B) = \\dfrac{9}{36} = \\dfrac{1}{4}$.<br>` +
          `$P(A) \\times P(B) = \\dfrac{1}{4} = P(A \\cap B)$, donc $A$ et $B$ sont <strong>indépendants</strong>.`
      }),
      () => ({
        // Tirage carte dans jeu 32 cartes
        // A : "carte rouge" (16/32 = 1/2). B : "as" (4/32 = 1/8). A ∩ B : as rouge (2/32 = 1/16)
        // P(A)·P(B) = 1/2 · 1/8 = 1/16 = P(A∩B) → indépendants
        enonce: `Soient $A$ et $B$ deux événements de probabilités strictement positives.<br>` +
          `1. Démontrer que $A$ et $B$ sont indépendants si et seulement si $P_A(B) = P(B)$.<br>` +
          `2. Application : on tire une carte au hasard dans un jeu de $32$ cartes. Soit $A$ : « la carte est rouge » et $B$ : « la carte est un as ». ` +
          `Les événements $A$ et $B$ sont-ils indépendants ?`,
        corrige: `<strong>1.</strong> $P_A(B) = \\dfrac{P(A \\cap B)}{P(A)}$. Indépendance $\\iff P(A \\cap B) = P(A) P(B) \\iff P_A(B) = P(B)$.<br>` +
          `<strong>2.</strong> $P(A) = \\dfrac{16}{32} = \\dfrac{1}{2}$ ; $P(B) = \\dfrac{4}{32} = \\dfrac{1}{8}$ ; $P(A \\cap B) = \\dfrac{2}{32} = \\dfrac{1}{16}$ (deux as rouges).<br>` +
          `$P(A) \\times P(B) = \\dfrac{1}{2} \\times \\dfrac{1}{8} = \\dfrac{1}{16} = P(A \\cap B)$, donc $A$ et $B$ sont <strong>indépendants</strong>.`
      })
    ];
    const v3 = pick(variantes)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Caractérisations équivalentes de l'indépendance.</strong> Pour $P(A), P(B) > 0$ : $A, B$ indépendants $\\iff P(A \\cap B) = P(A)\\,P(B) \\iff P_A(B) = P(B) \\iff P_B(A) = P(A)$.`
    };
  }

});

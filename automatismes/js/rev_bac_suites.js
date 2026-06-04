/* LaboMath — Générateurs annales bac (rev_bac_suites_*)
   Lot 3 : Suites numériques — 7 générateurs, 3 niveaux chacun, variantes paramétrées.
   Calibrés sur les sujets bac Tle spé récents (APMEP).
   Compatible avec window.LM_GEN, helpers : pick, rand, randNonZero, signe, dec.

   Couverture :
   - Récurrence : démonstration P(n) ⇒ P(n+1)         → rev_bac_suites_recurrence_simple
   - Récurrence + étude combinée (monotonie, bornes)  → rev_bac_suites_recurrence_etude
   - Suite auxiliaire géométrique (v_n = u_n − L)     → rev_bac_suites_arith_geom_aux
   - Limite d'une suite contenant q^n                 → rev_bac_suites_limite_qn
   - Somme géométrique / arith-géom                   → rev_bac_suites_somme
   - Algorithme de seuil (Python)                     → rev_bac_suites_seuil_python
   - Suite récurrente u_{n+1} = f(u_n)                → rev_bac_suites_recurrente_f
*/

// Helper local : signe d'un coefficient
// _su_signe(3) → "+ 3" ; _su_signe(-1) → "- 1" ; _su_signe(0) → ""
const _su_signe = (n) => {
  if (n === 0) return '';
  return n > 0 ? `+ ${n}` : `- ${-n}`;
};

// Helper local : fraction en LaTeX, "1/2" → "\dfrac{1}{2}", entier → "n"
const _su_frac = (num, den) => {
  if (den === 1) return String(num);
  if (num < 0) return `-\\dfrac{${-num}}{${den}}`;
  return `\\dfrac{${num}}{${den}}`;
};

// Helper local : afficher u_{n+1} = (a) u_n + b avec a fraction (num/den)
// _su_eqRecur(1, 2, 3) → "u_{n+1} = \\dfrac{1}{2}\\,u_n + 3"
// _su_eqRecur(-1, 3, 0) → "u_{n+1} = -\\dfrac{1}{3}\\,u_n"
const _su_eqRecur = (aNum, aDen, b) => {
  let coef;
  if (aDen === 1) {
    // a entier
    if (aNum === 1) coef = 'u_n';
    else if (aNum === -1) coef = '-u_n';
    else coef = `${aNum}\\,u_n`;
  } else {
    coef = `${_su_frac(aNum, aDen)}\\,u_n`;
  }
  if (b === 0) return `u_{n+1} = ${coef}`;
  return `u_{n+1} = ${coef} ${_su_signe(b)}`;
};

Object.assign(window.LM_GEN ??= {}, {

  // ============================================================
  // 1. rev_bac_suites_recurrence_simple
  // Démonstration par récurrence d'une propriété simple.
  // nv1 : u_n >= u_0 (suite croissante évidente)
  // nv2 : u_n <= M (suite majorée)
  // nv3 : u_n = formule explicite
  // ============================================================
  rev_bac_suites_recurrence_simple: (d) => {
    if (d === 1) {
      // u_0 = 2, u_{n+1} = u_n + 3, démontrer u_n >= 2
      // (suite arithmétique de raison 3 partant de 2, croissante donc u_n >= 2)
      const variantes = [
        () => {
          const u0 = rand(2, 4);
          const r = rand(2, 4);
          return {
            enonce: `Soit $(u_n)$ la suite définie par $u_0 = ${u0}$ et $u_{n+1} = u_n + ${r}$ pour tout $n \\in \\mathbb{N}$.<br>` +
              `Démontrer par récurrence que pour tout $n \\in \\mathbb{N}$, $u_n \\geqslant ${u0}$.`,
            corrige: `Posons $P(n) : \\,u_n \\geqslant ${u0}$.<br>` +
              `<strong>Initialisation</strong> ($n = 0$) : $u_0 = ${u0} \\geqslant ${u0}$. Donc $P(0)$ est vraie.<br>` +
              `<strong>Hérédité</strong> : supposons $P(n)$ vraie pour un certain $n \\in \\mathbb{N}$, c'est-à-dire $u_n \\geqslant ${u0}$. ` +
              `Alors $u_{n+1} = u_n + ${r} \\geqslant ${u0} + ${r} \\geqslant ${u0}$ (car $${r} > 0$).<br>` +
              `Donc $P(n+1)$ est vraie.<br>` +
              `<strong>Conclusion</strong> : par récurrence, $u_n \\geqslant ${u0}$ pour tout $n \\in \\mathbb{N}$.`
          };
        },
        () => {
          // u_0 = 0, u_{n+1} = u_n + 2n + 1, démontrer u_n >= 0
          return {
            enonce: `Soit $(u_n)$ la suite définie par $u_0 = 0$ et $u_{n+1} = u_n + 2n + 1$ pour tout $n \\in \\mathbb{N}$.<br>` +
              `Démontrer par récurrence que pour tout $n \\in \\mathbb{N}$, $u_n \\geqslant 0$.`,
            corrige: `Posons $P(n) : \\,u_n \\geqslant 0$.<br>` +
              `<strong>Initialisation</strong> : $u_0 = 0 \\geqslant 0$. Donc $P(0)$ est vraie.<br>` +
              `<strong>Hérédité</strong> : supposons $u_n \\geqslant 0$. Alors $u_{n+1} = u_n + 2n + 1 \\geqslant 0 + 0 + 1 \\geqslant 0$ (car $n \\geqslant 0$).<br>` +
              `Donc $P(n+1)$ est vraie.<br>` +
              `<strong>Conclusion</strong> : $u_n \\geqslant 0$ pour tout $n \\in \\mathbb{N}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Démonstration par récurrence.</strong> Pour démontrer qu'une propriété $P(n)$ est vraie pour tout $n \\in \\mathbb{N}$ : (1) <em>Initialisation</em> : vérifier $P(0)$ (ou $P(n_0)$) ; (2) <em>Hérédité</em> : supposer $P(n)$ vraie pour un certain $n$ et démontrer $P(n+1)$ ; (3) <em>Conclusion</em>.`
      };
    }

    if (d === 2) {
      // u_0 = 0, u_{n+1} = (1/2) u_n + M/2, démontrer u_n <= M
      // Choisir u_0 = 0, u_{n+1} = (1/2) u_n + 3, démontrer u_n <= 6
      // Vérif : si u_n <= 6, alors u_{n+1} = (1/2) u_n + 3 <= 3 + 3 = 6 ✓
      const variantes = [
        () => {
          // u_0 = 0, u_{n+1} = (u_n + 6)/2 = (1/2) u_n + 3
          return {
            enonce: `Soit $(u_n)$ la suite définie par $u_0 = 0$ et $u_{n+1} = \\dfrac{1}{2}u_n + 3$ pour tout $n \\in \\mathbb{N}$.<br>` +
              `Démontrer par récurrence que pour tout $n \\in \\mathbb{N}$, $u_n \\leqslant 6$.`,
            corrige: `Posons $P(n) : \\,u_n \\leqslant 6$.<br>` +
              `<strong>Initialisation</strong> : $u_0 = 0 \\leqslant 6$. Donc $P(0)$ est vraie.<br>` +
              `<strong>Hérédité</strong> : supposons $u_n \\leqslant 6$. Alors $\\dfrac{1}{2}u_n \\leqslant 3$ (en multipliant par $\\dfrac{1}{2} > 0$), ` +
              `puis $u_{n+1} = \\dfrac{1}{2}u_n + 3 \\leqslant 3 + 3 = 6$.<br>` +
              `Donc $P(n+1)$ est vraie.<br>` +
              `<strong>Conclusion</strong> : $u_n \\leqslant 6$ pour tout $n \\in \\mathbb{N}$.`
          };
        },
        () => {
          // u_0 = 1, u_{n+1} = (1/3) u_n + 4, démontrer u_n <= 6
          // si u_n <= 6, alors u_{n+1} = u_n/3 + 4 <= 2 + 4 = 6 ✓
          return {
            enonce: `Soit $(u_n)$ la suite définie par $u_0 = 1$ et $u_{n+1} = \\dfrac{1}{3}u_n + 4$ pour tout $n \\in \\mathbb{N}$.<br>` +
              `Démontrer par récurrence que pour tout $n \\in \\mathbb{N}$, $u_n \\leqslant 6$.`,
            corrige: `Posons $P(n) : \\,u_n \\leqslant 6$.<br>` +
              `<strong>Initialisation</strong> : $u_0 = 1 \\leqslant 6$. Donc $P(0)$ est vraie.<br>` +
              `<strong>Hérédité</strong> : supposons $u_n \\leqslant 6$. Alors $\\dfrac{1}{3}u_n \\leqslant 2$, ` +
              `et $u_{n+1} = \\dfrac{1}{3}u_n + 4 \\leqslant 2 + 4 = 6$.<br>` +
              `Donc $P(n+1)$ est vraie.<br>` +
              `<strong>Conclusion</strong> : $u_n \\leqslant 6$ pour tout $n \\in \\mathbb{N}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Récurrence sur une borne.</strong> Pour montrer $u_n \\leqslant M$ (ou $u_n \\geqslant m$) avec une suite définie par $u_{n+1} = f(u_n)$, on utilise l'hypothèse de récurrence et la monotonie de $f$ pour propager l'inégalité de $n$ à $n+1$.`
      };
    }

    // d === 3 : démontrer une formule explicite par récurrence
    const variantes = [
      () => {
        // u_0 = 1, u_{n+1} = 2 u_n + 1, démontrer u_n = 2^(n+1) - 1
        // u_1 = 3 = 2² - 1, u_2 = 7 = 2³ - 1, u_3 = 15 = 2⁴ - 1 ✓
        return {
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 1$ et $u_{n+1} = 2u_n + 1$ pour tout $n \\in \\mathbb{N}$.<br>` +
            `Démontrer par récurrence que pour tout $n \\in \\mathbb{N}$, $u_n = 2^{n+1} - 1$.`,
          corrige: `Posons $P(n) : \\,u_n = 2^{n+1} - 1$.<br>` +
            `<strong>Initialisation</strong> : $u_0 = 1$ et $2^{0+1} - 1 = 2 - 1 = 1$. Donc $P(0)$ est vraie.<br>` +
            `<strong>Hérédité</strong> : supposons $u_n = 2^{n+1} - 1$. Alors :<br>` +
            `$u_{n+1} = 2u_n + 1 = 2\\left(2^{n+1} - 1\\right) + 1 = 2^{n+2} - 2 + 1 = 2^{n+2} - 1 = 2^{(n+1)+1} - 1$.<br>` +
            `Donc $P(n+1)$ est vraie.<br>` +
            `<strong>Conclusion</strong> : $u_n = 2^{n+1} - 1$ pour tout $n \\in \\mathbb{N}$.`
        };
      },
      () => {
        // u_0 = 2, u_{n+1} = 3 u_n - 2, démontrer u_n = 3^n + 1
        // u_1 = 4 = 3 + 1, u_2 = 10 = 9 + 1, u_3 = 28 = 27 + 1 ✓
        return {
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 2$ et $u_{n+1} = 3u_n - 2$ pour tout $n \\in \\mathbb{N}$.<br>` +
            `Démontrer par récurrence que pour tout $n \\in \\mathbb{N}$, $u_n = 3^{n} + 1$.`,
          corrige: `Posons $P(n) : \\,u_n = 3^{n} + 1$.<br>` +
            `<strong>Initialisation</strong> : $u_0 = 2$ et $3^{0} + 1 = 1 + 1 = 2$. Donc $P(0)$ est vraie.<br>` +
            `<strong>Hérédité</strong> : supposons $u_n = 3^{n} + 1$. Alors :<br>` +
            `$u_{n+1} = 3u_n - 2 = 3\\left(3^{n} + 1\\right) - 2 = 3^{n+1} + 3 - 2 = 3^{n+1} + 1$.<br>` +
            `Donc $P(n+1)$ est vraie.<br>` +
            `<strong>Conclusion</strong> : $u_n = 3^{n} + 1$ pour tout $n \\in \\mathbb{N}$.`
        };
      }
    ];
    const v = pick(variantes)();
    return {
      enonce: v.enonce,
      corrige: v.corrige,
      rappel: `<strong>Récurrence sur une formule explicite.</strong> Pour démontrer $u_n = $ formule, on substitue la formule dans la relation de récurrence, on développe, et on simplifie pour retrouver la formule au rang $n+1$. Souvent les puissances $2^n$, $3^n$ ou $q^n$ apparaissent.`
    };
  },

  // ============================================================
  // 2. rev_bac_suites_recurrence_etude
  // Récurrence COMBINÉE : démontrer plusieurs propriétés en chaîne (encadrement + monotonie)
  // nv1 : encadrement m ≤ u_n ≤ M
  // nv2 : monotonie + borne ⇒ convergence
  // nv3 : étude complète (initialisation, hérédité, conclusion, convergence)
  // ============================================================
  rev_bac_suites_recurrence_etude: (d) => {
    if (d === 1) {
      const variantes = [
        () => ({
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 0$ et $u_{n+1} = \\sqrt{u_n + 2}$ pour tout $n \\in \\mathbb{N}$.<br>` +
            `Démontrer par récurrence que pour tout $n \\in \\mathbb{N}$, $0 \\leqslant u_n \\leqslant 2$.`,
          corrige: `Posons $P(n) : \\,0 \\leqslant u_n \\leqslant 2$.<br>` +
            `<strong>Init.</strong> : $u_0 = 0$, donc $0 \\leqslant u_0 \\leqslant 2$. ✓<br>` +
            `<strong>Héréd.</strong> : si $0 \\leqslant u_n \\leqslant 2$, alors $2 \\leqslant u_n + 2 \\leqslant 4$, donc $\\sqrt{2} \\leqslant u_{n+1} \\leqslant 2$. ` +
            `Comme $\\sqrt{2} > 0$, $0 \\leqslant u_{n+1} \\leqslant 2$. ✓<br>` +
            `<strong>Conclusion</strong> : $0 \\leqslant u_n \\leqslant 2$ pour tout $n$.`
        }),
        () => ({
          // u_0 = 1, u_{n+1} = √(2u_n + 3). Démontrer 1 ≤ u_n ≤ 3.
          // Si 1 ≤ u_n ≤ 3, alors 5 ≤ 2u_n+3 ≤ 9, donc √5 ≤ u_{n+1} ≤ 3. Comme √5 ≈ 2,24 ≥ 1 ✓
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 1$ et $u_{n+1} = \\sqrt{2u_n + 3}$ pour tout $n \\in \\mathbb{N}$.<br>` +
            `Démontrer par récurrence que pour tout $n \\in \\mathbb{N}$, $1 \\leqslant u_n \\leqslant 3$.`,
          corrige: `Posons $P(n) : \\,1 \\leqslant u_n \\leqslant 3$.<br>` +
            `<strong>Init.</strong> : $u_0 = 1$, donc $1 \\leqslant u_0 \\leqslant 3$. ✓<br>` +
            `<strong>Héréd.</strong> : si $1 \\leqslant u_n \\leqslant 3$, alors $5 \\leqslant 2u_n + 3 \\leqslant 9$, donc $\\sqrt{5} \\leqslant u_{n+1} \\leqslant 3$. ` +
            `Comme $\\sqrt{5} \\approx 2{,}24 \\geqslant 1$, $1 \\leqslant u_{n+1} \\leqslant 3$. ✓<br>` +
            `<strong>Conclusion</strong> : $1 \\leqslant u_n \\leqslant 3$ pour tout $n$.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Encadrement par récurrence.</strong> Pour démontrer $m \\leqslant u_n \\leqslant M$ avec $u_{n+1} = f(u_n)$ et $f$ croissante : on applique $f$ à l'encadrement supposé pour obtenir un encadrement sur $u_{n+1}$.`
      };
    }

    if (d === 2) {
      const variantes = [
        () => ({
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 1$ et $u_{n+1} = \\dfrac{u_n + 6}{2}$ pour tout $n \\in \\mathbb{N}$.<br>` +
            `1. Démontrer que pour tout $n$, $u_n \\leqslant 6$.<br>` +
            `2. Démontrer que $(u_n)$ est croissante.<br>` +
            `3. Que peut-on en déduire ?`,
          corrige: `<strong>1.</strong> Init. : $u_0 = 1 \\leqslant 6$. Héréd. : si $u_n \\leqslant 6$, alors $u_{n+1} = \\dfrac{u_n + 6}{2} \\leqslant 6$.<br>` +
            `<strong>2.</strong> $u_{n+1} - u_n = \\dfrac{6 - u_n}{2} \\geqslant 0$ (car $u_n \\leqslant 6$). Croissante.<br>` +
            `<strong>3.</strong> Croissante et majorée par $6$, donc convergente.`
        }),
        () => ({
          // u_0 = 0, u_{n+1} = (u_n + 8)/3. Démontrer u_n ≤ 4.
          // Si u_n ≤ 4, alors u_{n+1} = (u_n+8)/3 ≤ 12/3 = 4 ✓
          // u_{n+1} - u_n = (u_n + 8)/3 - u_n = (8 - 2u_n)/3 = 2(4 - u_n)/3 ≥ 0 ssi u_n ≤ 4 ✓
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 0$ et $u_{n+1} = \\dfrac{u_n + 8}{3}$ pour tout $n \\in \\mathbb{N}$.<br>` +
            `1. Démontrer que pour tout $n$, $u_n \\leqslant 4$.<br>` +
            `2. Démontrer que $(u_n)$ est croissante.<br>` +
            `3. Que peut-on en déduire ?`,
          corrige: `<strong>1.</strong> Init. : $u_0 = 0 \\leqslant 4$. Héréd. : si $u_n \\leqslant 4$, alors $u_{n+1} = \\dfrac{u_n + 8}{3} \\leqslant \\dfrac{12}{3} = 4$.<br>` +
            `<strong>2.</strong> $u_{n+1} - u_n = \\dfrac{u_n + 8 - 3u_n}{3} = \\dfrac{8 - 2u_n}{3} = \\dfrac{2(4 - u_n)}{3} \\geqslant 0$ (car $u_n \\leqslant 4$). Croissante.<br>` +
            `<strong>3.</strong> Croissante et majorée par $4$, donc convergente.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Théorème : toute suite croissante majorée converge.</strong> Argument classique au bac pour démontrer la convergence d'une suite récurrente sans calculer la limite.`
      };
    }

    // d === 3 : étude complète, 2 variantes
    const variantes3 = [
      () => ({
        enonce: `Soit $(u_n)$ la suite définie par $u_0 = 4$ et $u_{n+1} = \\sqrt{2u_n + 3}$ pour tout $n \\in \\mathbb{N}$.<br>` +
          `1. Démontrer que pour tout $n$, $3 \\leqslant u_n \\leqslant 4$.<br>` +
          `2. Démontrer que $(u_n)$ est décroissante. (Indication : étudier $u_{n+1}^{2} - u_n^{2}$.)<br>` +
          `3. En déduire que $(u_n)$ converge. Déterminer sa limite $\\ell$.`,
        corrige: `<strong>1.</strong> $P(n) : 3 \\leqslant u_n \\leqslant 4$. Init. : $u_0 = 4$. Héréd. : si $3 \\leqslant u_n \\leqslant 4$, alors $9 \\leqslant 2u_n + 3 \\leqslant 11$, donc $3 \\leqslant u_{n+1} \\leqslant \\sqrt{11} < 4$.<br>` +
          `<strong>2.</strong> $u_{n+1}^{2} - u_n^{2} = -u_n^{2} + 2u_n + 3 = -(u_n - 3)(u_n + 1) \\leqslant 0$ (car $u_n \\geqslant 3$). Donc $u_{n+1} \\leqslant u_n$ : décroissante.<br>` +
          `<strong>3.</strong> Décroissante et minorée par $3$, donc convergente vers $\\ell$. Équation $\\ell = \\sqrt{2\\ell + 3} \\Leftrightarrow \\ell^{2} - 2\\ell - 3 = 0 \\Leftrightarrow (\\ell-3)(\\ell+1) = 0$. Comme $\\ell \\geqslant 3$ : $\\ell = 3$.`
      }),
      () => ({
        // u_0 = 6, u_{n+1} = (u_n + 12)/3. 4 ≤ u_n ≤ 6.
        // Si 4 ≤ u_n ≤ 6, alors (u_n+12)/3 entre 16/3 ≈ 5,3 et 6 ✓
        // u_{n+1} - u_n = (12 - 2u_n)/3. Si u_n ≥ 6, ≤ 0. Si u_n = 6, =0. Au début u_0 = 6 → u_1 = 6 → constante !
        // Mauvais exemple. Recommençons.
        // u_0 = 10, u_{n+1} = (u_n + 12)/3. Vérif : u_1 = 22/3 ≈ 7,3. u_2 = (22/3+12)/3 = 58/9 ≈ 6,4. u_3 = (58/9+12)/3 ≈ 5,8
        // Vers 6 (point fixe : x = (x+12)/3 → 2x = 12 → x = 6)
        // P(n) : 6 ≤ u_n ≤ 10
        // Init : u_0 = 10 ✓
        // Héréd : si 6 ≤ u_n ≤ 10, alors u_n+12 entre 18 et 22, donc u_{n+1} entre 6 et 22/3 ≈ 7,3. Mais 22/3 < 10 ✓
        // Donc 6 ≤ u_{n+1} ≤ 22/3 < 10. ✓ (l'encadrement reste correct)
        // u_{n+1} - u_n = (u_n + 12 - 3u_n)/3 = (12 - 2u_n)/3. Si u_n ≥ 6, ≤ 0 ✓ (décroissante)
        // Limite : ℓ = (ℓ+12)/3 → 2ℓ = 12 → ℓ = 6
        enonce: `Soit $(u_n)$ la suite définie par $u_0 = 10$ et $u_{n+1} = \\dfrac{u_n + 12}{3}$ pour tout $n \\in \\mathbb{N}$.<br>` +
          `1. Démontrer que pour tout $n$, $6 \\leqslant u_n \\leqslant 10$.<br>` +
          `2. Démontrer que $(u_n)$ est décroissante.<br>` +
          `3. En déduire que $(u_n)$ converge. Déterminer sa limite $\\ell$.`,
        corrige: `<strong>1.</strong> Init. : $u_0 = 10$, donc $6 \\leqslant u_0 \\leqslant 10$. Héréd. : si $6 \\leqslant u_n \\leqslant 10$, alors $18 \\leqslant u_n + 12 \\leqslant 22$, donc $6 \\leqslant u_{n+1} \\leqslant \\dfrac{22}{3} \\leqslant 10$.<br>` +
          `<strong>2.</strong> $u_{n+1} - u_n = \\dfrac{u_n + 12 - 3u_n}{3} = \\dfrac{12 - 2u_n}{3} = \\dfrac{2(6 - u_n)}{3} \\leqslant 0$ (car $u_n \\geqslant 6$). Décroissante.<br>` +
          `<strong>3.</strong> Décroissante et minorée par $6$, donc convergente vers $\\ell$. Équation $\\ell = \\dfrac{\\ell + 12}{3} \\Leftrightarrow 3\\ell = \\ell + 12 \\Leftrightarrow \\ell = 6$.`
      })
    ];
    const v3 = pick(variantes3)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Limite d'une suite récurrente.</strong> Si $(u_n)$ converge vers $\\ell$ et si $u_{n+1} = f(u_n)$ avec $f$ continue, alors $\\ell = f(\\ell)$. On résout cette équation.`
    };
  },

  // ============================================================
  // 3. rev_bac_suites_arith_geom_aux
  // Suite auxiliaire v_n = u_n − L où L est le point fixe.
  // nv1 : montrer que (v_n) est géométrique, donner v_n
  // nv2 : + en déduire u_n et sa limite
  // nv3 : en contexte (population, capital)
  // ============================================================
  rev_bac_suites_arith_geom_aux: (d) => {
    if (d === 1) {
      const variantes = [
        () => ({
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 2$ et $u_{n+1} = \\dfrac{1}{2}u_n + 3$ pour tout $n \\in \\mathbb{N}$. On pose $v_n = u_n - 6$.<br>` +
            `1. Démontrer que $(v_n)$ est géométrique. Préciser sa raison et son premier terme.<br>` +
            `2. En déduire l'expression de $v_n$.`,
          corrige: `<strong>1.</strong> $v_{n+1} = u_{n+1} - 6 = \\dfrac{1}{2}u_n + 3 - 6 = \\dfrac{1}{2}(u_n - 6) = \\dfrac{1}{2}v_n$. Géométrique de raison $\\dfrac{1}{2}$, $v_0 = -4$.<br>` +
            `<strong>2.</strong> $v_n = -4 \\times \\left(\\dfrac{1}{2}\\right)^{n}$.`
        }),
        () => ({
          // u_0 = 8, u_{n+1} = (1/2)u_n + 1, point fixe 2, v_n = u_n - 2, v_0 = 6
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 8$ et $u_{n+1} = \\dfrac{1}{2}u_n + 1$ pour tout $n \\in \\mathbb{N}$. On pose $v_n = u_n - 2$.<br>` +
            `1. Démontrer que $(v_n)$ est géométrique. Préciser sa raison et son premier terme.<br>` +
            `2. En déduire l'expression de $v_n$.`,
          corrige: `<strong>1.</strong> $v_{n+1} = u_{n+1} - 2 = \\dfrac{1}{2}u_n + 1 - 2 = \\dfrac{1}{2}u_n - 1 = \\dfrac{1}{2}(u_n - 2) = \\dfrac{1}{2}v_n$. Géométrique de raison $\\dfrac{1}{2}$, $v_0 = 6$.<br>` +
            `<strong>2.</strong> $v_n = 6 \\times \\left(\\dfrac{1}{2}\\right)^{n}$.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Suite arithmético-géométrique.</strong> Si $u_{n+1} = a\\,u_n + b$ avec $a \\neq 1$, le <em>point fixe</em> est $L = \\dfrac{b}{1-a}$. Alors $(v_n)$ définie par $v_n = u_n - L$ est géométrique de raison $a$.`
      };
    }

    if (d === 2) {
      const variantes = [
        () => ({
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 5$ et $u_{n+1} = \\dfrac{1}{3}u_n + 2$ pour tout $n \\in \\mathbb{N}$. On pose $v_n = u_n - 3$.<br>` +
            `1. Démontrer que $(v_n)$ est géométrique.<br>` +
            `2. En déduire $u_n$ en fonction de $n$.<br>` +
            `3. Déterminer la limite de $(u_n)$.`,
          corrige: `<strong>1.</strong> $v_{n+1} = u_{n+1} - 3 = \\dfrac{1}{3}u_n + 2 - 3 = \\dfrac{1}{3}(u_n - 3) = \\dfrac{1}{3}v_n$. Géométrique, raison $\\dfrac{1}{3}$, $v_0 = 2$.<br>` +
            `<strong>2.</strong> $v_n = 2 \\times \\left(\\dfrac{1}{3}\\right)^{n}$, donc $u_n = 3 + 2\\left(\\dfrac{1}{3}\\right)^{n}$.<br>` +
            `<strong>3.</strong> $\\lim\\limits_{n \\to +\\infty} \\left(\\dfrac{1}{3}\\right)^{n} = 0$, donc $\\lim\\limits_{n \\to +\\infty} u_n = 3$.`
        }),
        () => ({
          // u_0 = 7, u_{n+1} = (1/4)u_n + 3, point fixe 4, v_n = u_n - 4, v_0 = 3
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 7$ et $u_{n+1} = \\dfrac{1}{4}u_n + 3$ pour tout $n \\in \\mathbb{N}$. On pose $v_n = u_n - 4$.<br>` +
            `1. Démontrer que $(v_n)$ est géométrique.<br>` +
            `2. En déduire $u_n$.<br>` +
            `3. Déterminer la limite de $(u_n)$.`,
          corrige: `<strong>1.</strong> $v_{n+1} = u_{n+1} - 4 = \\dfrac{1}{4}u_n + 3 - 4 = \\dfrac{1}{4}(u_n - 4) = \\dfrac{1}{4}v_n$. Géométrique, raison $\\dfrac{1}{4}$, $v_0 = 3$.<br>` +
            `<strong>2.</strong> $v_n = 3 \\times \\left(\\dfrac{1}{4}\\right)^{n}$, donc $u_n = 4 + 3\\left(\\dfrac{1}{4}\\right)^{n}$.<br>` +
            `<strong>3.</strong> $\\lim\\limits_{n \\to +\\infty} \\left(\\dfrac{1}{4}\\right)^{n} = 0$, donc $\\lim\\limits_{n \\to +\\infty} u_n = 4$.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Limite de $q^n$.</strong> Si $-1 < q < 1$, $\\lim\\limits_{n \\to +\\infty} q^{n} = 0$. La suite $(u_n)$ converge alors vers son point fixe $L$.`
      };
    }

    // d === 3 : en contexte (concentration / population)
    const variantes = [
      () => {
        // Population : u_0 = 12000, u_{n+1} = 0,9 u_n + 1000 (départs + arrivées constantes)
        // Point fixe : L = 1000 / 0,1 = 10000
        // v_n = u_n - 10000, v_0 = 2000, v_n = 2000 * 0,9^n
        // u_n = 10000 + 2000 * 0,9^n
        // Limite : u_n → 10000
        return {
          enonce: `Une ville compte $12\\,000$ habitants en 2024. Chaque année, $10\\,\\%$ des habitants quittent la ville et $1\\,000$ nouveaux habitants s'y installent.<br>` +
            `On note $u_n$ la population $n$ années après 2024, donc $u_0 = 12\\,000$ et $u_{n+1} = 0{,}9\\,u_n + 1000$ pour tout $n \\in \\mathbb{N}$. On pose $v_n = u_n - 10\\,000$.<br>` +
            `1. Démontrer que $(v_n)$ est géométrique de raison $0{,}9$.<br>` +
            `2. En déduire $u_n$ en fonction de $n$.<br>` +
            `3. À long terme, vers quelle valeur la population va-t-elle tendre ?`,
          corrige: `<strong>1.</strong> $v_{n+1} = u_{n+1} - 10\\,000 = 0{,}9\\,u_n + 1000 - 10\\,000 = 0{,}9\\,u_n - 9000 = 0{,}9(u_n - 10\\,000) = 0{,}9\\,v_n$.<br>` +
            `Donc $(v_n)$ est géométrique de raison $0{,}9$, avec $v_0 = 12\\,000 - 10\\,000 = 2000$.<br>` +
            `<strong>2.</strong> $v_n = 2000 \\times 0{,}9^{n}$, donc $u_n = 10\\,000 + 2000 \\times 0{,}9^{n}$.<br>` +
            `<strong>3.</strong> Comme $-1 < 0{,}9 < 1$, $\\lim\\limits_{n \\to +\\infty} 0{,}9^{n} = 0$, donc $\\lim\\limits_{n \\to +\\infty} u_n = 10\\,000$. À long terme, la population se stabilisera autour de $10\\,000$ habitants.`
        };
      },
      () => {
        // Médicament : u_0 = 0, u_{n+1} = 0,75 u_n + 5 (dose quotidienne + élimination)
        // Point fixe : L = 5 / 0,25 = 20
        // v_n = u_n - 20, v_0 = -20, v_n = -20 * 0,75^n
        // u_n = 20 - 20 * 0,75^n = 20(1 - 0,75^n)
        // Limite : 20
        return {
          enonce: `Un patient prend chaque jour une dose de $5$ mg d'un médicament. Entre deux prises, son organisme élimine $25\\,\\%$ du médicament présent dans le sang. ` +
            `On note $u_n$ la quantité (en mg) de médicament dans le sang juste après la $n$-ième prise. On a $u_0 = 5$ et $u_{n+1} = 0{,}75\\,u_n + 5$ pour tout $n \\geqslant 0$.<br>` +
            `On pose $v_n = u_n - 20$.<br>` +
            `1. Démontrer que $(v_n)$ est géométrique. Donner sa raison et $v_0$.<br>` +
            `2. En déduire $u_n$ en fonction de $n$.<br>` +
            `3. Déterminer la limite de $(u_n)$. Interpréter dans le contexte.`,
          corrige: `<strong>1.</strong> $v_{n+1} = u_{n+1} - 20 = 0{,}75\\,u_n + 5 - 20 = 0{,}75\\,u_n - 15 = 0{,}75(u_n - 20) = 0{,}75\\,v_n$.<br>` +
            `Donc $(v_n)$ est géométrique de raison $0{,}75$, avec $v_0 = 5 - 20 = -15$.<br>` +
            `<strong>2.</strong> $v_n = -15 \\times 0{,}75^{n}$, donc $u_n = 20 - 15 \\times 0{,}75^{n}$.<br>` +
            `<strong>3.</strong> $\\lim\\limits_{n \\to +\\infty} 0{,}75^{n} = 0$, donc $\\lim\\limits_{n \\to +\\infty} u_n = 20$. La quantité de médicament dans le sang se stabilise autour de $20$ mg à long terme.`
        };
      }
    ];
    const v = pick(variantes)();
    return {
      enonce: v.enonce,
      corrige: v.corrige,
      rappel: `<strong>Modèle arithmético-géométrique en contexte.</strong> Très fréquent au bac : démographie, finance, pharmacocinétique. La suite auxiliaire $v_n = u_n - L$ (avec $L$ point fixe) ramène l'étude à une suite géométrique classique.`
    };
  },

  // ============================================================
  // 4. rev_bac_suites_limite_qn
  // Limite d'une suite contenant q^n
  // nv1 : u_n = C * q^n + D (cas standard)
  // nv2 : limite + interprétation
  // nv3 : justifier par théorème de comparaison ou des gendarmes
  // ============================================================
  rev_bac_suites_limite_qn: (d) => {
    if (d === 1) {
      // u_n = A + B * q^n avec |q| < 1
      const variantes = [
        () => {
          // u_n = 3 + 5 * (1/4)^n
          return {
            enonce: `Soit $(u_n)$ la suite définie pour tout $n \\in \\mathbb{N}$ par $u_n = 3 + 5\\left(\\dfrac{1}{4}\\right)^{n}$.<br>` +
              `Déterminer $\\lim\\limits_{n \\to +\\infty} u_n$. Justifier.`,
            corrige: `Comme $-1 < \\dfrac{1}{4} < 1$, on a $\\lim\\limits_{n \\to +\\infty} \\left(\\dfrac{1}{4}\\right)^{n} = 0$.<br>` +
              `Donc par somme et produit, $\\lim\\limits_{n \\to +\\infty} 5\\left(\\dfrac{1}{4}\\right)^{n} = 0$, puis $\\lim\\limits_{n \\to +\\infty} u_n = 3 + 0 = 3$.`
          };
        },
        () => {
          // u_n = 7 - 2 * (2/3)^n
          return {
            enonce: `Soit $(u_n)$ la suite définie pour tout $n \\in \\mathbb{N}$ par $u_n = 7 - 2\\left(\\dfrac{2}{3}\\right)^{n}$.<br>` +
              `Déterminer $\\lim\\limits_{n \\to +\\infty} u_n$. Justifier.`,
            corrige: `Comme $-1 < \\dfrac{2}{3} < 1$, on a $\\lim\\limits_{n \\to +\\infty} \\left(\\dfrac{2}{3}\\right)^{n} = 0$.<br>` +
              `Donc $\\lim\\limits_{n \\to +\\infty} \\left[-2\\left(\\dfrac{2}{3}\\right)^{n}\\right] = 0$, puis $\\lim\\limits_{n \\to +\\infty} u_n = 7 - 0 = 7$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Limite de $q^n$.</strong> Si $-1 < q < 1$, $\\lim\\limits_{n \\to +\\infty} q^{n} = 0$. Si $q > 1$, $\\lim\\limits_{n \\to +\\infty} q^{n} = +\\infty$. Si $q \\leqslant -1$, la suite $(q^n)$ n'a pas de limite.`
      };
    }

    if (d === 2) {
      // Limite avec puissance et interprétation
      const variantes = [
        () => {
          // u_n = 1000 - 800 * 0,8^n (population, capital). Limite = 1000
          return {
            enonce: `Pour modéliser la population d'une espèce sur une île, on utilise la suite $(u_n)$ définie pour tout $n \\geqslant 0$ par $u_n = 1000 - 800 \\times 0{,}8^{n}$, où $u_n$ est le nombre d'individus au bout de $n$ années.<br>` +
              `1. Déterminer $\\lim\\limits_{n \\to +\\infty} u_n$.<br>` +
              `2. Que peut-on dire de la population à long terme ?`,
            corrige: `<strong>1.</strong> Comme $-1 < 0{,}8 < 1$, $\\lim\\limits_{n \\to +\\infty} 0{,}8^{n} = 0$. Donc $\\lim\\limits_{n \\to +\\infty} u_n = 1000 - 0 = 1000$.<br>` +
              `<strong>2.</strong> À long terme, la population se stabilisera autour de $1000$ individus (valeur asymptotique du modèle).`
          };
        },
        () => {
          // u_n = 50 + 100 * (3/2)^n - DIVERGE vers +∞
          return {
            enonce: `Soit $(u_n)$ la suite définie pour tout $n \\in \\mathbb{N}$ par $u_n = 50 + 100\\left(\\dfrac{3}{2}\\right)^{n}$. ` +
              `Cette suite modélise la valeur d'un placement après $n$ années (en milliers d'euros).<br>` +
              `1. Déterminer $\\lim\\limits_{n \\to +\\infty} u_n$.<br>` +
              `2. Interpréter dans le contexte.`,
            corrige: `<strong>1.</strong> Comme $\\dfrac{3}{2} > 1$, $\\lim\\limits_{n \\to +\\infty} \\left(\\dfrac{3}{2}\\right)^{n} = +\\infty$. Donc $\\lim\\limits_{n \\to +\\infty} u_n = +\\infty$.<br>` +
              `<strong>2.</strong> Le placement croît sans limite : sa valeur tend vers l'infini à long terme (croissance exponentielle).`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Cas de divergence.</strong> Si $q > 1$, la suite $C\\,q^{n} + D$ (avec $C > 0$) tend vers $+\\infty$ : croissance exponentielle non bornée. Toujours interpréter physiquement (un modèle ne reste réaliste que sur un intervalle de temps borné).`
      };
    }

    // d === 3 : justification par comparaison, 2 variantes
    const variantes = [
      () => ({
        enonce: `Soit $(u_n)$ la suite définie pour tout $n \\in \\mathbb{N}^{*}$ par $u_n = \\dfrac{(-1)^{n}}{n}$.<br>` +
          `1. Démontrer que pour tout $n \\geqslant 1$, $-\\dfrac{1}{n} \\leqslant u_n \\leqslant \\dfrac{1}{n}$.<br>` +
          `2. En déduire $\\lim\\limits_{n \\to +\\infty} u_n$.`,
        corrige: `<strong>1.</strong> $-1 \\leqslant (-1)^{n} \\leqslant 1$. En divisant par $n > 0$ : $-\\dfrac{1}{n} \\leqslant u_n \\leqslant \\dfrac{1}{n}$.<br>` +
          `<strong>2.</strong> $\\lim -\\dfrac{1}{n} = 0$ et $\\lim \\dfrac{1}{n} = 0$. Par le <strong>théorème des gendarmes</strong>, $\\lim u_n = 0$.`
      }),
      () => ({
        // u_n = sin(n)/n. -1 ≤ sin(n) ≤ 1, donc -1/n ≤ u_n ≤ 1/n, limite 0
        enonce: `Soit $(u_n)$ la suite définie pour tout $n \\in \\mathbb{N}^{*}$ par $u_n = \\dfrac{\\sin(n)}{n}$.<br>` +
          `1. Démontrer que pour tout $n \\geqslant 1$, $-\\dfrac{1}{n} \\leqslant u_n \\leqslant \\dfrac{1}{n}$.<br>` +
          `2. En déduire $\\lim\\limits_{n \\to +\\infty} u_n$.`,
        corrige: `<strong>1.</strong> Pour tout $x \\in \\mathbb{R}$, $-1 \\leqslant \\sin(x) \\leqslant 1$. En divisant par $n > 0$ : $-\\dfrac{1}{n} \\leqslant \\dfrac{\\sin(n)}{n} \\leqslant \\dfrac{1}{n}$.<br>` +
          `<strong>2.</strong> $\\lim -\\dfrac{1}{n} = 0$ et $\\lim \\dfrac{1}{n} = 0$. Par le <strong>théorème des gendarmes</strong>, $\\lim u_n = 0$.`
      })
    ];
    const v3 = pick(variantes)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Théorème des gendarmes (ou d'encadrement).</strong> Si $a_n \\leqslant u_n \\leqslant b_n$ et $\\lim a_n = \\lim b_n = \\ell$, alors $\\lim u_n = \\ell$. Indispensable quand la suite oscille.`
    };
  },

  // ============================================================
  // 5. rev_bac_suites_somme
  // Somme des n premiers termes d'une suite (géométrique ou arith-géom)
  // nv1 : somme géométrique finie (formule 1 + q + ... + q^n)
  // nv2 : somme d'une suite arith-géom
  // nv3 : limite de la somme partielle (somme infinie)
  // ============================================================
  rev_bac_suites_somme: (d) => {
    if (d === 1) {
      const variantes = [
        () => ({
          enonce: `On considère la suite géométrique $(u_n)$ de premier terme $u_0 = 1$ et de raison $q = \\dfrac{1}{2}$. ` +
            `On note $S_n = u_0 + u_1 + \\ldots + u_n$.<br>` +
            `1. Donner $u_n$ en fonction de $n$.<br>` +
            `2. Exprimer $S_n$ en fonction de $n$.`,
          corrige: `<strong>1.</strong> $u_n = \\left(\\dfrac{1}{2}\\right)^{n}$.<br>` +
            `<strong>2.</strong> $S_n = \\dfrac{1 - (1/2)^{n+1}}{1 - 1/2} = 2\\left[1 - \\left(\\dfrac{1}{2}\\right)^{n+1}\\right]$.`
        }),
        () => ({
          // u_0 = 2, q = 1/3. u_n = 2·(1/3)^n. S_n = 2·(1-(1/3)^(n+1))/(2/3) = 3·(1-(1/3)^(n+1))
          enonce: `On considère la suite géométrique $(u_n)$ de premier terme $u_0 = 2$ et de raison $q = \\dfrac{1}{3}$. ` +
            `On note $S_n = u_0 + u_1 + \\ldots + u_n$.<br>` +
            `1. Donner $u_n$ en fonction de $n$.<br>` +
            `2. Exprimer $S_n$ en fonction de $n$.`,
          corrige: `<strong>1.</strong> $u_n = 2 \\times \\left(\\dfrac{1}{3}\\right)^{n}$.<br>` +
            `<strong>2.</strong> $S_n = 2 \\times \\dfrac{1 - (1/3)^{n+1}}{1 - 1/3} = 3\\left[1 - \\left(\\dfrac{1}{3}\\right)^{n+1}\\right]$.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Somme géométrique.</strong> Si $q \\neq 1$ : $\\displaystyle\\sum_{k=0}^{n} q^{k} = \\dfrac{1 - q^{n+1}}{1 - q}$. Plus généralement, $\\sum_{k=0}^{n} a\\,q^{k} = a\\,\\dfrac{1 - q^{n+1}}{1 - q}$.`
      };
    }

    if (d === 2) {
      const variantes = [
        () => ({
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 2$ et $u_{n+1} = \\dfrac{1}{2}u_n + 3$. On admet $u_n = 6 - 4\\left(\\dfrac{1}{2}\\right)^{n}$.<br>` +
            `On pose $S_n = u_0 + u_1 + \\ldots + u_n$.<br>` +
            `1. Exprimer $S_n$ en fonction de $n$.<br>` +
            `2. Déterminer $\\lim\\limits_{n \\to +\\infty} \\dfrac{S_n}{n}$.`,
          corrige: `<strong>1.</strong> $S_n = 6(n+1) - 4\\displaystyle\\sum_{k=0}^{n}\\left(\\dfrac{1}{2}\\right)^{k} = 6(n+1) - 8\\left[1 - \\left(\\dfrac{1}{2}\\right)^{n+1}\\right] = 6n - 2 + 8\\left(\\dfrac{1}{2}\\right)^{n+1}$.<br>` +
            `<strong>2.</strong> $\\dfrac{S_n}{n} = 6 - \\dfrac{2}{n} + \\dfrac{8}{n}\\left(\\dfrac{1}{2}\\right)^{n+1} \\to 6$.`
        }),
        () => ({
          // u_n = 3 + 2(1/3)^n. S_n = 3(n+1) + 2·∑(1/3)^k = 3(n+1) + 3(1-(1/3)^(n+1))
          //     = 3n + 3 + 3 - 3(1/3)^(n+1) = 3n + 6 - 3·(1/3)^(n+1)
          // S_n/n = 3 + 6/n - 3/n · (1/3)^(n+1) → 3
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 5$ et $u_{n+1} = \\dfrac{1}{3}u_n + 2$. On admet $u_n = 3 + 2\\left(\\dfrac{1}{3}\\right)^{n}$.<br>` +
            `On pose $S_n = u_0 + u_1 + \\ldots + u_n$.<br>` +
            `1. Exprimer $S_n$ en fonction de $n$.<br>` +
            `2. Déterminer $\\lim\\limits_{n \\to +\\infty} \\dfrac{S_n}{n}$.`,
          corrige: `<strong>1.</strong> $S_n = 3(n+1) + 2\\displaystyle\\sum_{k=0}^{n}\\left(\\dfrac{1}{3}\\right)^{k} = 3(n+1) + 3\\left[1 - \\left(\\dfrac{1}{3}\\right)^{n+1}\\right] = 3n + 6 - 3\\left(\\dfrac{1}{3}\\right)^{n+1}$.<br>` +
            `<strong>2.</strong> $\\dfrac{S_n}{n} \\to 3$.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Somme d'une suite arith-géom.</strong> On décompose $u_n$ en partie constante + partie géométrique, puis on somme chaque terme séparément par linéarité.`
      };
    }

    // d === 3 : série géométrique convergente, 2 variantes
    const variantes = [
      () => ({
        enonce: `Une balle est lâchée d'une hauteur $h_0 = 2$ mètres. À chaque rebond, elle remonte à $\\dfrac{3}{4}$ de sa hauteur précédente. On note $h_n$ la hauteur (en m) après le $n$-ième rebond.<br>` +
          `1. Exprimer $h_n$ en fonction de $n$.<br>` +
          `2. Calculer la distance totale $D_n$ parcourue entre le 1er et le $n$-ième rebond (descente + remontée).<br>` +
          `3. Déterminer $\\lim\\limits_{n \\to +\\infty} D_n$.`,
        corrige: `<strong>1.</strong> $h_n = 2 \\times \\left(\\dfrac{3}{4}\\right)^{n}$.<br>` +
          `<strong>2.</strong> $D_n = h_0 + 2(h_1 + \\ldots + h_n) = 2 + 12\\left[1 - \\left(\\dfrac{3}{4}\\right)^{n}\\right] = 14 - 12\\left(\\dfrac{3}{4}\\right)^{n}$.<br>` +
          `<strong>3.</strong> $\\lim D_n = 14$ m.`
      }),
      () => ({
        // Pendule perdant 1/3 énergie. A_0=3 m, A_n = 3 (2/3)^n. D_n = A_0 + 2(A_1+...+A_n) = 3 + 2·3·(2/3)·(1-(2/3)^n)/(1/3) = 3 + 12(1-(2/3)^n)
        // lim = 15
        enonce: `Un pendule oscille en perdant à chaque oscillation $\\dfrac{1}{3}$ de son amplitude. Au départ, l'amplitude est $A_0 = 3$ m. ` +
          `On note $A_n$ l'amplitude après la $n$-ième oscillation.<br>` +
          `1. Exprimer $A_n$ en fonction de $n$.<br>` +
          `2. Calculer la distance totale $D_n$ parcourue entre le 1er et le $n$-ième passage à l'équilibre (somme des aller-retour).<br>` +
          `3. Déterminer $\\lim\\limits_{n \\to +\\infty} D_n$.`,
        corrige: `<strong>1.</strong> $A_n = 3 \\times \\left(\\dfrac{2}{3}\\right)^{n}$.<br>` +
          `<strong>2.</strong> $D_n = A_0 + 2(A_1 + \\ldots + A_n) = 3 + 2 \\times 3 \\times \\dfrac{2}{3} \\times \\dfrac{1 - (2/3)^{n}}{1/3} = 3 + 12\\left[1 - \\left(\\dfrac{2}{3}\\right)^{n}\\right]$.<br>` +
          `<strong>3.</strong> $\\lim D_n = 15$ m.`
      })
    ];
    const v3 = pick(variantes)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Série géométrique convergente.</strong> Si $-1 < q < 1$ : $\\displaystyle\\sum_{k=0}^{+\\infty} q^{k} = \\dfrac{1}{1 - q}$. C'est la limite de la somme partielle quand $n \\to +\\infty$.`
    };
  },

  // ============================================================
  // 6. rev_bac_suites_seuil_python
  // Algorithme de seuil : compléter / interpréter un script Python
  // nv1 : compléter un script (à trous)
  // nv2 : interpréter un script donné
  // nv3 : analyser un script et expliquer la sortie
  // ============================================================
  rev_bac_suites_seuil_python: (d) => {
    if (d === 1) {
      const variantes = [
        () => ({
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 100$ et $u_{n+1} = 0{,}9\\,u_n$. ` +
            `On souhaite déterminer le plus petit entier $n$ tel que $u_n < 50$. Compléter le script :<br>` +
            `<pre>def seuil():
    n = 0
    u = 100
    while u .... 50:
        u = ....
        n = ....
    return ....</pre>`,
          corrige: `<pre>def seuil():
    n = 0
    u = 100
    while u >= 50:
        u = 0.9 * u
        n = n + 1
    return n</pre>` +
            `Tant que $u \\geqslant 50$, on met à jour $u$ et on incrémente $n$. À la sortie, $u_n < 50$.`
        }),
        () => ({
          // u_0 = 200, q = 0,8, seuil < 30
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 200$ et $u_{n+1} = 0{,}8\\,u_n$. ` +
            `On cherche le plus petit entier $n$ tel que $u_n < 30$. Compléter :<br>` +
            `<pre>def seuil():
    n = 0
    u = 200
    while u .... 30:
        u = ....
        n = ....
    return ....</pre>`,
          corrige: `<pre>def seuil():
    n = 0
    u = 200
    while u >= 30:
        u = 0.8 * u
        n = n + 1
    return n</pre>` +
            `Boucle tant que $u \\geqslant 30$ ; à la sortie, $n$ est le plus petit rang tel que $u_n < 30$.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Algorithme de seuil.</strong> Pour trouver le plus petit $n$ tel que $u_n < S$, on utilise une boucle <code>while</code> avec la condition <em>opposée</em>. À l'intérieur, on met à jour $u$ et on incrémente le compteur.`
      };
    }

    if (d === 2) {
      const variantes = [
        () => ({
          enonce: `On considère le script Python :<br>` +
            `<pre>def f():
    n = 0
    u = 5
    while u < 1000:
        u = 1.2 * u + 10
        n = n + 1
    return n</pre>` +
            `Une suite $(u_n)$ est définie par $u_0 = 5$ et $u_{n+1} = 1{,}2\\,u_n + 10$.<br>` +
            `1. Que représente la valeur renvoyée ?<br>` +
            `2. La suite est-elle croissante ou décroissante ? Justifier.`,
          corrige: `<strong>1.</strong> Le plus petit entier $n$ tel que $u_n \\geqslant 1000$.<br>` +
            `<strong>2.</strong> $u_{n+1} - u_n = 0{,}2\\,u_n + 10 > 0$ (car $u_n > 0$). La suite est croissante.`
        }),
        () => ({
          // u_0 = 2, u_{n+1} = 1,5 u_n + 5, seuil 500
          enonce: `On considère le script Python :<br>` +
            `<pre>def g():
    n = 0
    u = 2
    while u < 500:
        u = 1.5 * u + 5
        n = n + 1
    return n</pre>` +
            `Une suite $(u_n)$ est définie par $u_0 = 2$ et $u_{n+1} = 1{,}5\\,u_n + 5$.<br>` +
            `1. Que représente la valeur renvoyée par $g()$ ?<br>` +
            `2. La suite est-elle croissante ou décroissante ?`,
          corrige: `<strong>1.</strong> Le plus petit entier $n$ tel que $u_n \\geqslant 500$.<br>` +
            `<strong>2.</strong> $u_{n+1} - u_n = 0{,}5\\,u_n + 5 > 0$ (car $u_n > 0$). Croissante.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Lire un algorithme de seuil.</strong> Repérer : valeur initiale, condition de boucle, mise à jour de $u$, valeur retournée (souvent le compteur $n$).`
      };
    }

    // d === 3 : script plus complexe, 2 variantes
    const variantes = [
      () => ({
        enonce: `Soit $(u_n)$ définie par $u_0 = 1000$ et $u_{n+1} = 0{,}8\\,u_n + 100$. La suite est décroissante et converge vers $500$.<br>` +
          `<pre>def mystere(p):
    n = 0
    u = 1000
    while u - 500 > p:
        u = 0.8 * u + 100
        n = n + 1
    return n</pre>` +
          `1. Que renvoie <code>mystere(0.1)</code> ? Décrire le rôle de la fonction.<br>` +
          `2. Pourquoi la boucle s'arrête-t-elle pour tout $p > 0$ ?`,
        corrige: `<strong>1.</strong> Le plus petit entier $n$ tel que $u_n - 500 \\leqslant p$. Elle calcule le rang à partir duquel $(u_n)$ est dans $[500\\,;\\,500 + p]$.<br>` +
          `<strong>2.</strong> $(u_n)$ converge vers $500$, donc $u_n - 500 \\to 0^{+}$ : à partir d'un certain rang, $u_n - 500 \\leqslant p$.`
      }),
      () => ({
        // u_0=0, u_{n+1}=0,5 u_n + 4, croissante vers 8
        enonce: `Soit $(u_n)$ définie par $u_0 = 0$ et $u_{n+1} = 0{,}5\\,u_n + 4$. La suite est croissante et converge vers $8$.<br>` +
          `<pre>def mystere(p):
    n = 0
    u = 0
    while 8 - u > p:
        u = 0.5 * u + 4
        n = n + 1
    return n</pre>` +
          `1. Que renvoie <code>mystere(0.01)</code> ? Décrire le rôle de la fonction.<br>` +
          `2. Pourquoi la boucle s'arrête-t-elle pour tout $p > 0$ ?`,
        corrige: `<strong>1.</strong> Le plus petit entier $n$ tel que $8 - u_n \\leqslant p$. La fonction trouve le rang à partir duquel $u_n \\in [8 - p\\,;\\,8]$.<br>` +
          `<strong>2.</strong> $(u_n)$ croît vers $8$, donc $8 - u_n \\to 0^{+}$ : à partir d'un certain rang, $8 - u_n \\leqslant p$.`
      })
    ];
    const v3 = pick(variantes)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Arrêt d'un algorithme de seuil.</strong> Avec une suite convergente, on utilise que l'écart à la limite tend vers $0$ : la condition finit par devenir fausse.`
    };
  },

  // ============================================================
  // 7. rev_bac_suites_recurrente_f
  // Suite récurrente u_{n+1} = f(u_n) : calcul + conjecture + démonstration
  // nv1 : calculer les premiers termes, conjecturer la monotonie
  // nv2 : conjecturer + amorcer la démonstration
  // nv3 : démonstration complète (récurrence + convergence)
  // ============================================================
  rev_bac_suites_recurrente_f: (d) => {
    if (d === 1) {
      const variantes = [
        () => ({
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 3$ et $u_{n+1} = \\dfrac{u_n + 4}{2}$ pour tout $n \\in \\mathbb{N}$.<br>` +
            `1. Calculer $u_1$, $u_2$, $u_3$ (valeurs exactes).<br>` +
            `2. Conjecturer le sens de variation et la limite.`,
          corrige: `<strong>1.</strong> $u_1 = \\dfrac{7}{2}$ ; $u_2 = \\dfrac{15}{4}$ ; $u_3 = \\dfrac{31}{8}$.<br>` +
            `<strong>2.</strong> Suite <em>croissante</em>, semble converger vers $4$.`
        }),
        () => ({
          // u_0 = 0, u_{n+1} = (u_n + 3)/2. u_1 = 3/2, u_2 = 9/4, u_3 = 21/8. Tend vers 3.
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 0$ et $u_{n+1} = \\dfrac{u_n + 3}{2}$ pour tout $n \\in \\mathbb{N}$.<br>` +
            `1. Calculer $u_1$, $u_2$, $u_3$ (valeurs exactes).<br>` +
            `2. Conjecturer le sens de variation et la limite.`,
          corrige: `<strong>1.</strong> $u_1 = \\dfrac{3}{2}$ ; $u_2 = \\dfrac{9}{4}$ ; $u_3 = \\dfrac{21}{8}$.<br>` +
            `<strong>2.</strong> Suite <em>croissante</em>, semble converger vers $3$.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Conjecturer une monotonie.</strong> Calculer plusieurs premiers termes permet de conjecturer le sens de variation et la limite. La conjecture doit ensuite être démontrée.`
      };
    }

    if (d === 2) {
      const variantes = [
        () => ({
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 0$ et $u_{n+1} = \\dfrac{u_n + 2}{3}$ pour tout $n \\in \\mathbb{N}$.<br>` +
            `1. Calculer $u_1$, $u_2$, $u_3$.<br>` +
            `2. Conjecturer la limite $\\ell$ et déterminer $\\ell$ via l'équation $\\ell = \\dfrac{\\ell + 2}{3}$.<br>` +
            `3. Démontrer par récurrence que $u_n \\leqslant 1$ pour tout $n$.`,
          corrige: `<strong>1.</strong> $u_1 = \\dfrac{2}{3}$ ; $u_2 = \\dfrac{8}{9}$ ; $u_3 = \\dfrac{26}{27}$.<br>` +
            `<strong>2.</strong> Conjecture $\\ell = 1$. Équation $3\\ell = \\ell + 2 \\Rightarrow \\ell = 1$.<br>` +
            `<strong>3.</strong> Init. : $u_0 = 0 \\leqslant 1$. Héréd. : si $u_n \\leqslant 1$, alors $u_n + 2 \\leqslant 3$, donc $u_{n+1} \\leqslant 1$.`
        }),
        () => ({
          // u_0 = 0, u_{n+1} = (u_n + 5)/4. Point fixe : x = (x+5)/4 → 4x = x+5 → x = 5/3
          // Mauvais (fraction). Essayons : u_0 = 5, u_{n+1} = (u_n + 6)/4. Point fixe : 4x = x+6 → x = 2
          // u_1 = 11/4 = 2.75, u_2 = (11/4+6)/4 = 35/16 ≈ 2.19, u_3 = (35/16+6)/4 = 131/64 ≈ 2.05
          // Décroissante vers 2. P(n) : u_n ≥ 2.
          enonce: `Soit $(u_n)$ la suite définie par $u_0 = 5$ et $u_{n+1} = \\dfrac{u_n + 6}{4}$ pour tout $n \\in \\mathbb{N}$.<br>` +
            `1. Calculer $u_1$, $u_2$, $u_3$.<br>` +
            `2. Conjecturer la limite $\\ell$ et déterminer $\\ell$ via l'équation $\\ell = \\dfrac{\\ell + 6}{4}$.<br>` +
            `3. Démontrer par récurrence que $u_n \\geqslant 2$ pour tout $n$.`,
          corrige: `<strong>1.</strong> $u_1 = \\dfrac{11}{4}$ ; $u_2 = \\dfrac{35}{16}$ ; $u_3 = \\dfrac{131}{64}$.<br>` +
            `<strong>2.</strong> Conjecture $\\ell = 2$. Équation $4\\ell = \\ell + 6 \\Rightarrow \\ell = 2$.<br>` +
            `<strong>3.</strong> Init. : $u_0 = 5 \\geqslant 2$. Héréd. : si $u_n \\geqslant 2$, alors $u_n + 6 \\geqslant 8$, donc $u_{n+1} \\geqslant 2$.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Point fixe.</strong> Si $u_{n+1} = f(u_n)$ converge vers $\\ell$ et $f$ continue, alors $\\ell = f(\\ell)$.`
      };
    }

    // d === 3 : étude complète, 2 variantes
    const variantes = [
      () => ({
        enonce: `Soit $(u_n)$ la suite définie par $u_0 = 0$ et $u_{n+1} = \\dfrac{1}{2}\\,u_n + 2$ pour tout $n \\in \\mathbb{N}$.<br>` +
          `1. Calculer $u_1$, $u_2$. Conjecturer la limite.<br>` +
          `2. Démontrer que $0 \\leqslant u_n \\leqslant 4$ pour tout $n$.<br>` +
          `3. Démontrer que $(u_n)$ est croissante.<br>` +
          `4. En déduire que $(u_n)$ converge. Déterminer sa limite.`,
        corrige: `<strong>1.</strong> $u_1 = 2$ ; $u_2 = 3$. Conjecture $\\ell = 4$.<br>` +
          `<strong>2.</strong> Init. : $u_0 = 0$. Héréd. : si $0 \\leqslant u_n \\leqslant 4$, alors $2 \\leqslant u_{n+1} \\leqslant 4$.<br>` +
          `<strong>3.</strong> $u_{n+1} - u_n = \\dfrac{4 - u_n}{2} \\geqslant 0$. Croissante.<br>` +
          `<strong>4.</strong> Croissante et majorée par $4$, convergente. Équation $\\ell = \\dfrac{\\ell}{2} + 2 \\Rightarrow \\ell = 4$.`
      }),
      () => ({
        // u_0 = 6, u_{n+1} = (1/3) u_n + 2. Point fixe : x = x/3 + 2 → 2x/3 = 2 → x = 3
        // u_1 = 2 + 2 = 4, u_2 = 4/3 + 2 = 10/3, u_3 = 10/9 + 2 = 28/9
        // Décroissante. 3 ≤ u_n ≤ 6.
        // P : 3 ≤ u_n ≤ 6. Init : u_0 = 6 ✓. Héréd : si 3 ≤ u_n ≤ 6, alors 1 ≤ u_n/3 ≤ 2, donc 3 ≤ u_{n+1} ≤ 4 ⊂ [3,6] ✓
        // u_{n+1} - u_n = u_n/3 + 2 - u_n = 2 - 2u_n/3 = (6 - 2u_n)/3 ≤ 0 ssi u_n ≥ 3 ✓ → décroissante
        // Limite ℓ = 3
        enonce: `Soit $(u_n)$ la suite définie par $u_0 = 6$ et $u_{n+1} = \\dfrac{1}{3}\\,u_n + 2$ pour tout $n \\in \\mathbb{N}$.<br>` +
          `1. Calculer $u_1$, $u_2$. Conjecturer la limite.<br>` +
          `2. Démontrer que $3 \\leqslant u_n \\leqslant 6$ pour tout $n$.<br>` +
          `3. Démontrer que $(u_n)$ est décroissante.<br>` +
          `4. En déduire que $(u_n)$ converge. Déterminer sa limite.`,
        corrige: `<strong>1.</strong> $u_1 = 4$ ; $u_2 = \\dfrac{10}{3}$. Conjecture $\\ell = 3$.<br>` +
          `<strong>2.</strong> Init. : $u_0 = 6$. Héréd. : si $3 \\leqslant u_n \\leqslant 6$, alors $1 \\leqslant \\dfrac{u_n}{3} \\leqslant 2$, donc $3 \\leqslant u_{n+1} \\leqslant 4 \\leqslant 6$.<br>` +
          `<strong>3.</strong> $u_{n+1} - u_n = 2 - \\dfrac{2u_n}{3} = \\dfrac{2(3 - u_n)}{3} \\leqslant 0$ (car $u_n \\geqslant 3$). Décroissante.<br>` +
          `<strong>4.</strong> Décroissante et minorée par $3$, convergente. Équation $\\ell = \\dfrac{\\ell}{3} + 2 \\Rightarrow \\ell = 3$.`
      })
    ];
    const v3 = pick(variantes)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Étude complète d'une suite récurrente.</strong> (1) Premiers termes pour conjecturer ; (2) Encadrement par récurrence ; (3) Monotonie par signe de $u_{n+1} - u_n$ ; (4) Convergence (théorème des suites monotones bornées) ; (5) Limite par passage à la limite.`
    };
  }

});

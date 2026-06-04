/* LaboMath — Générateurs annales bac (rev_bac_ed_*)
   Lot 2 : Équations différentielles — 7 générateurs, 3 niveaux chacun, variantes paramétrées.
   Calibrés sur les sujets bac récents (APMEP).
   Compatible avec window.LM_GEN, helpers : pick, rand, randNonZero, signe, dec.

   Couverture :
   - y' = ay (homogène)              → rev_bac_ed_homogene
   - y' = ay + b (constante)         → rev_bac_ed_complete_const, rev_bac_ed_part_constante
   - y' = ay + f(x) (second membre variable) → rev_bac_ed_part_donnee
   - Vérification / contexte / asymptote → rev_bac_ed_verifier, rev_bac_ed_contexte, rev_bac_ed_asymptote
*/

// Helper local : signe d'un coefficient avec variable optionnelle
// _signeCoefVar(3, "x") → "+ 3x" ; _signeCoefVar(-1, "x") → "- x"
const _ed_signeCoef = (n, varStr = '') => {
  if (n === 0) return '';
  if (n === 1) return varStr ? `+ ${varStr}` : '+ 1';
  if (n === -1) return varStr ? `- ${varStr}` : '- 1';
  return n > 0 ? `+ ${n}${varStr}` : `- ${-n}${varStr}`;
};

// Helper local : présentation d'un coefficient a dans "ay" : "2y", "-y", "y", "-3y"
// (pas de "+ " devant car c'est le premier terme)
const _ed_coefVar = (n, varStr = 'y') => {
  if (n === 0) return '0';
  if (n === 1) return varStr;
  if (n === -1) return `-${varStr}`;
  return `${n}${varStr}`;
};

// Helper local : format "y' = ay" ou "y' = ay + b" propre
// _ed_eqLatex(2, 0) → "y' = 2y"
// _ed_eqLatex(2, -3) → "y' = 2y - 3"
// _ed_eqLatex(-3, 5) → "y' = -3y + 5"
const _ed_eqLatex = (a, b) => {
  const partA = _ed_coefVar(a, 'y');
  if (b === 0) return `y' = ${partA}`;
  return `y' = ${partA} ${_ed_signeCoef(b)}`;
};

// Helper local : notation décimale française pour LaTeX
// _ed_dec(0.5) → "0{,}5" (au lieu de "0.5") ; _ed_dec(3) → "3"
const _ed_dec = (n) => {
  if (typeof n !== 'number') return String(n);
  if (Number.isInteger(n)) return String(n);
  return String(n).replace('.', '{,}');
};

Object.assign(window.LM_GEN ??= {}, {

  // ============================================================
  // 1. rev_bac_ed_homogene : Résoudre y' = ay
  // nv1 : forme générale uniquement, a entier simple
  // nv2 : avec condition initiale y(0) = y_0
  // nv3 : condition initiale en t_0 ≠ 0, ou exploitation contextuelle
  // ============================================================
  rev_bac_ed_homogene: (d) => {
    if (d === 1) {
      const variantes = [
        () => {
          // y' = ay avec a entier non nul, ni 1 ni -1 (cosmétique)
          const a = pick([2, 3, -2, -3]);
          return {
            enonce: `Résoudre sur $\\mathbb{R}$ l'équation différentielle $(E) : ${_ed_eqLatex(a, 0)}$.`,
            corrige: `L'équation $(E)$ est de la forme $y' = a\\,y$ avec $a = ${a}$.<br>` +
              `D'après le cours, les solutions sur $\\mathbb{R}$ sont les fonctions $f$ définies par $f(x) = C\\,e^{${a}x}$, où $C \\in \\mathbb{R}$.`
          };
        },
        () => {
          // Variation : y' + ay = 0 (forme à transformer)
          const a = pick([2, 3, 5]);
          return {
            enonce: `Résoudre sur $\\mathbb{R}$ l'équation différentielle $(E) : y' + ${a}\\,y = 0$.`,
            corrige: `On écrit $(E)$ sous la forme $y' = -${a}\\,y$.<br>` +
              `C'est une équation différentielle homogène. Ses solutions sur $\\mathbb{R}$ sont les fonctions $f$ définies par $f(x) = C\\,e^{-${a}x}$, où $C \\in \\mathbb{R}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Équation différentielle homogène.</strong> Les solutions sur $\\mathbb{R}$ de $y' = a\\,y$ (où $a$ est un réel) sont les fonctions $f$ définies par $f(x) = C\\,e^{ax}$, où $C \\in \\mathbb{R}$.`
      };
    }

    if (d === 2) {
      const variantes = [
        () => {
          // y' = ay, y(0) = y_0
          const a = pick([2, 3, -2, -3, -4]);
          const y0 = randNonZero(-5, 5);
          return {
            enonce: `On considère l'équation différentielle $(E) : ${_ed_eqLatex(a, 0)}$. ` +
              `Déterminer l'unique solution $f$ de $(E)$ sur $\\mathbb{R}$ vérifiant $f(0) = ${y0}$.`,
            corrige: `Les solutions de $(E)$ sont les fonctions $f(x) = C\\,e^{${a}x}$, $C \\in \\mathbb{R}$.<br>` +
              `La condition $f(0) = ${y0}$ donne $C\\,e^{0} = ${y0}$, donc $C = ${y0}$.<br>` +
              `L'unique solution est $f(x) = ${y0}\\,e^{${a}x}$.`
          };
        },
        () => {
          // y' + ay = 0, y(0) = y_0
          const a = pick([2, 3, 4]);
          const y0 = rand(1, 6);
          return {
            enonce: `Résoudre le problème de Cauchy : $\\begin{cases} y' + ${a}\\,y = 0 \\\\ y(0) = ${y0} \\end{cases}$`,
            corrige: `L'équation s'écrit $y' = -${a}\\,y$. Les solutions sont $f(x) = C\\,e^{-${a}x}$, $C \\in \\mathbb{R}$.<br>` +
              `La condition $f(0) = ${y0}$ donne $C = ${y0}$.<br>` +
              `L'unique solution est $f(x) = ${y0}\\,e^{-${a}x}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Problème de Cauchy.</strong> Une équation $y' = a\\,y$ avec une condition initiale $y(x_0) = y_0$ admet une <em>unique</em> solution. On détermine $C$ en injectant la condition dans la forme générale $f(x) = C\\,e^{ax}$.`
      };
    }

    // d === 3 : condition initiale en t_0 ≠ 0, ou exploitation
    const variantes = [
      () => {
        // y' = ay, y(t_0) = y_0 avec t_0 != 0
        const a = pick([-2, -3, 2, 3]);
        const t0 = rand(1, 2);
        const y0 = rand(2, 5);
        // f(x) = C e^(ax), f(t_0) = y_0 → C = y_0 e^(-a t_0)
        // donc f(x) = y_0 e^(a(x - t_0))
        return {
          enonce: `Déterminer l'unique solution $f$ sur $\\mathbb{R}$ de l'équation différentielle $${_ed_eqLatex(a, 0)}$ vérifiant $f(${t0}) = ${y0}$.`,
          corrige: `Les solutions de l'équation sont $f(x) = C\\,e^{${a}x}$ avec $C \\in \\mathbb{R}$.<br>` +
            `La condition $f(${t0}) = ${y0}$ donne $C\\,e^{${a * t0}} = ${y0}$, donc $C = ${y0}\\,e^{${-a * t0}}$.<br>` +
            `Donc $f(x) = ${y0}\\,e^{${-a * t0}} \\cdot e^{${a}x} = ${y0}\\,e^{${a}(x ${_ed_signeCoef(-t0)})}$, soit $f(x) = ${y0}\\,e^{${a}x ${_ed_signeCoef(-a * t0)}}$.`
        };
      },
      () => {
        // Démonstration : si f vérifie y' = ay, alors f(x) = f(0) e^(ax)
        const a = pick([-2, 3, -3]);
        const y0 = rand(2, 5);
        return {
          enonce: `Soit $f$ une fonction dérivable sur $\\mathbb{R}$ vérifiant $${_ed_eqLatex(a, 0)}$ et $f(0) = ${y0}$.<br>` +
            `1. Donner l'expression explicite de $f(x)$.<br>` +
            `2. Calculer $f(1)$, en donner la valeur arrondie au millième.`,
          corrige: `<strong>1.</strong> $f$ est solution de $y' = ${a}\\,y$, donc de la forme $f(x) = C\\,e^{${a}x}$.<br>` +
            `Avec $f(0) = ${y0}$ : $C = ${y0}$. Donc $f(x) = ${y0}\\,e^{${a}x}$.<br>` +
            `<strong>2.</strong> $f(1) = ${y0}\\,e^{${a}} \\approx ${dec(Math.round(y0 * Math.exp(a) * 1000) / 1000)}$.`
        };
      }
    ];
    const v = pick(variantes)();
    return {
      enonce: v.enonce,
      corrige: v.corrige,
      rappel: `<strong>Condition initiale en $t_0 \\neq 0$.</strong> Pour $y(t_0) = y_0$, on injecte directement dans $f(x) = C\\,e^{ax}$ : $C\\,e^{a t_0} = y_0$, d'où $C = y_0\\,e^{-a t_0}$. On peut alors écrire $f(x) = y_0\\,e^{a(x - t_0)}$.`
    };
  },

  // ============================================================
  // 2. rev_bac_ed_complete_const : Résoudre y' = ay + b
  // nv1 : forme générale, b/a "joli"
  // nv2 : avec condition initiale y(0) = y_0
  // nv3 : avec CI plus complexe
  // ============================================================
  rev_bac_ed_complete_const: (d) => {
    // Génère a et b tels que -b/a soit entier "joli" (entre -5 et 5, non nul)
    // a doit être non nul, on choisit |a| dans {2, 3} ; -b/a entier non nul
    const tirerAB = () => {
      const a = pick([2, 3, -2, -3]);
      const yp = randNonZero(-4, 4); // y_p = -b/a, donc b = -a * y_p
      const b = -a * yp;
      return { a, b, yp };
    };

    if (d === 1) {
      const { a, b, yp } = tirerAB();
      return {
        enonce: `Résoudre sur $\\mathbb{R}$ l'équation différentielle $(E) : ${_ed_eqLatex(a, b)}$.`,
        corrige: `<strong>Solution particulière :</strong> on cherche une constante $y_p$ telle que $0 = ${a}\\,y_p ${_ed_signeCoef(b)}$.<br>` +
          `On obtient $y_p = ${yp}$.<br>` +
          `<strong>Équation homogène associée :</strong> $y' = ${_ed_coefVar(a, 'y')}$, dont les solutions sont $g(x) = C\\,e^{${a}x}$, $C \\in \\mathbb{R}$.<br>` +
          `<strong>Solutions de $(E)$ :</strong> $f(x) = C\\,e^{${a}x} ${_ed_signeCoef(yp)}$, où $C \\in \\mathbb{R}$.`,
        rappel: `<strong>Équation $y' = a\\,y + b$ ($a \\neq 0$).</strong> Les solutions sur $\\mathbb{R}$ sont $f(x) = C\\,e^{ax} - \\dfrac{b}{a}$, où $C \\in \\mathbb{R}$. La constante $-\\dfrac{b}{a}$ est l'unique solution particulière constante.`
      };
    }

    if (d === 2) {
      const variantes = [
        () => {
          const { a, b, yp } = tirerAB();
          const y0 = randNonZero(-5, 5);
          // f(x) = C e^(ax) + yp, f(0) = C + yp = y0 → C = y0 - yp
          const C = y0 - yp;
          return {
            enonce: `Déterminer l'unique solution sur $\\mathbb{R}$ du problème de Cauchy : $\\begin{cases} ${_ed_eqLatex(a, b)} \\\\ y(0) = ${y0} \\end{cases}$`,
            corrige: `Les solutions de l'équation différentielle sont de la forme $f(x) = C\\,e^{${a}x} ${_ed_signeCoef(yp)}$, $C \\in \\mathbb{R}$ (solution particulière constante $y_p = ${yp}$).<br>` +
              `La condition $f(0) = ${y0}$ donne $C ${_ed_signeCoef(yp)} = ${y0}$, soit $C = ${C}$.<br>` +
              `L'unique solution est $f(x) = ${_ed_coefVar(C, `e^{${a}x}`)} ${_ed_signeCoef(yp)}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Problème de Cauchy avec $y' = a\\,y + b$.</strong> Les solutions sont $f(x) = C\\,e^{ax} - \\dfrac{b}{a}$. La condition initiale $f(x_0) = y_0$ détermine $C$ de manière unique.`
      };
    }

    // d === 3 : énoncé en deux temps : résoudre l'homogène puis l'équation complète, avec CI
    const { a, b, yp } = tirerAB();
    const y0 = randNonZero(-5, 5);
    const C = y0 - yp;
    return {
      enonce: `On considère l'équation différentielle $(E) : ${_ed_eqLatex(a, b)}$ et l'équation homogène associée $(H) : ${_ed_eqLatex(a, 0)}$.<br>` +
        `1. Résoudre $(H)$ sur $\\mathbb{R}$.<br>` +
        `2. Déterminer une solution constante de $(E)$.<br>` +
        `3. En déduire l'ensemble des solutions de $(E)$, puis l'unique solution $f$ vérifiant $f(0) = ${y0}$.`,
      corrige: `<strong>1.</strong> $(H)$ : $y' = ${_ed_coefVar(a, 'y')}$. Les solutions sont $g(x) = C\\,e^{${a}x}$, $C \\in \\mathbb{R}$.<br>` +
        `<strong>2.</strong> On cherche $y_p$ constante telle que $0 = ${a}\\,y_p ${_ed_signeCoef(b)}$, soit $y_p = ${yp}$.<br>` +
        `<strong>3.</strong> Les solutions de $(E)$ sont $f(x) = C\\,e^{${a}x} ${_ed_signeCoef(yp)}$.<br>` +
        `La condition $f(0) = ${y0}$ donne $C ${_ed_signeCoef(yp)} = ${y0}$, donc $C = ${C}$.<br>` +
        `L'unique solution est $f(x) = ${_ed_coefVar(C, `e^{${a}x}`)} ${_ed_signeCoef(yp)}$.`,
      rappel: `<strong>Méthode standard.</strong> Pour résoudre $y' = a\\,y + b$ : (1) résoudre l'homogène $y' = a\\,y$ ; (2) chercher une solution particulière constante $y_p$ ; (3) sommer : solution générale = solution particulière + solution générale de l'homogène ; (4) utiliser la CI pour fixer la constante.`
    };
  },

  // ============================================================
  // 3. rev_bac_ed_verifier : Vérifier qu'une fonction est solution
  // nv1 : f(x) = C e^(ax), vérifier que c'est solution de y' = ay
  // nv2 : f(x) = C e^(ax) + α, vérifier que c'est solution de y' = ay + b
  // nv3 : f(x) avec polynôme, vérifier solution de y' = ay + g(x)
  // ============================================================
  rev_bac_ed_verifier: (d) => {
    if (d === 1) {
      const a = pick([2, 3, -2, -3]);
      const C = randNonZero(-4, 4);
      return {
        enonce: `Soit $f$ définie sur $\\mathbb{R}$ par $f(x) = ${_ed_coefVar(C, `e^{${a}x}`)}$. ` +
          `Vérifier que $f$ est solution de l'équation différentielle $(E) : ${_ed_eqLatex(a, 0)}$.`,
        corrige: `$f$ est dérivable sur $\\mathbb{R}$ et $f'(x) = ${_ed_coefVar(a * C, `e^{${a}x}`)}$.<br>` +
          `D'autre part, $${a}\\,f(x) = ${_ed_coefVar(a * C, `e^{${a}x}`)}$ (par calcul direct).<br>` +
          `Donc $f'(x) = ${a}\\,f(x)$ pour tout $x \\in \\mathbb{R}$ : $f$ est bien solution de $(E)$.`,
        rappel: `<strong>Vérifier qu'une fonction est solution d'une ED.</strong> Calculer $f'(x)$, puis vérifier que la relation $f'(x) = a\\,f(x) + b$ (ou $f'(x) = a\\,f(x) + g(x)$) est satisfaite pour tout $x$ de l'intervalle.`
      };
    }

    if (d === 2) {
      // f(x) = C e^(ax) - b/a, vérifier solution de y' = ay + b
      const a = pick([2, -2, 3, -3]);
      const yp = randNonZero(-4, 4);
      const b = -a * yp;
      const C = randNonZero(-4, 4);
      return {
        enonce: `Soit $f$ définie sur $\\mathbb{R}$ par $f(x) = ${_ed_coefVar(C, `e^{${a}x}`)} ${_ed_signeCoef(yp)}$. ` +
          `Vérifier que $f$ est solution de l'équation différentielle $(E) : ${_ed_eqLatex(a, b)}$.`,
        corrige: `$f$ est dérivable sur $\\mathbb{R}$ et $f'(x) = ${_ed_coefVar(a * C, `e^{${a}x}`)}$ (la constante $${yp}$ a une dérivée nulle).<br>` +
          `Calculons $${a}\\,f(x) ${_ed_signeCoef(b)} = ${a}\\left(${_ed_coefVar(C, `e^{${a}x}`)} ${_ed_signeCoef(yp)}\\right) ${_ed_signeCoef(b)}$<br>` +
          `$= ${_ed_coefVar(a * C, `e^{${a}x}`)} ${_ed_signeCoef(a * yp)} ${_ed_signeCoef(b)} = ${_ed_coefVar(a * C, `e^{${a}x}`)}$ (car $${a * yp} ${_ed_signeCoef(b)} = 0$).<br>` +
          `Donc $f'(x) = ${a}\\,f(x) ${_ed_signeCoef(b)}$ : $f$ est solution de $(E)$.`,
        rappel: `<strong>Vérification avec second membre constant.</strong> On dérive $f$, puis on calcule $a\\,f(x) + b$ et on vérifie l'égalité avec $f'(x)$. Le terme constant $-\\dfrac{b}{a}$ joue le rôle de solution particulière.`
      };
    }

    // d === 3 : f(x) avec polynôme, second membre polynomial
    // Exemple : f(x) = (alpha x + beta) e^(ax) + gamma x + delta, vérifier solution de y' = ay + (poly)
    // Plus simple : f(x) = (alpha x + beta) + C e^(ax) avec un second membre lié
    // Encore plus simple : f(x) = C e^(ax) + alpha x + beta, vérifier y' - ay = alpha - a(alpha x + beta) = -a alpha x + (alpha - a beta)
    // On choisit f, on calcule g(x) = f'(x) - a f(x), et on demande de vérifier
    const variantes = [
      () => {
        // f(x) = e^(2x) - x - 1/2, vérifier f' = 2f + 2x
        // f'(x) = 2 e^(2x) - 1
        // 2f(x) + 2x = 2 e^(2x) - 2x - 1 + 2x = 2 e^(2x) - 1 = f'(x) ✓
        return {
          enonce: `Soit $f$ définie sur $\\mathbb{R}$ par $f(x) = e^{2x} - x - \\dfrac{1}{2}$. ` +
            `Vérifier que $f$ est solution de l'équation différentielle $(E) : y' = 2\\,y + 2x$.`,
          corrige: `$f$ est dérivable sur $\\mathbb{R}$ et $f'(x) = 2\\,e^{2x} - 1$.<br>` +
            `Calculons $2\\,f(x) + 2x = 2\\left(e^{2x} - x - \\dfrac{1}{2}\\right) + 2x = 2\\,e^{2x} - 2x - 1 + 2x = 2\\,e^{2x} - 1$.<br>` +
            `On a donc $f'(x) = 2\\,f(x) + 2x$ pour tout $x \\in \\mathbb{R}$ : $f$ est bien solution de $(E)$.`
        };
      },
      () => {
        // f(x) = (x + 1) e^(-x) - 1, vérifier f' = -f - x e^(-x) - 1
        // f'(x) = e^(-x) - (x+1) e^(-x) = (1 - x - 1) e^(-x) = -x e^(-x)
        // -f(x) - x e^(-x) - 1 = -(x+1) e^(-x) + 1 - x e^(-x) - 1 = -(x+1) e^(-x) - x e^(-x) = -(2x+1) e^(-x)
        // Pas égal. Choisissons un autre exemple plus simple.
        // f(x) = x e^(-x), vérifier f' = -f + e^(-x)
        // f'(x) = e^(-x) - x e^(-x) = (1-x) e^(-x)
        // -f(x) + e^(-x) = -x e^(-x) + e^(-x) = (1-x) e^(-x) ✓
        return {
          enonce: `Soit $f$ définie sur $\\mathbb{R}$ par $f(x) = x\\,e^{-x}$. ` +
            `Vérifier que $f$ est solution de l'équation différentielle $(E) : y' + y = e^{-x}$.`,
          corrige: `$f$ est dérivable sur $\\mathbb{R}$. Par dérivation d'un produit ($u(x) = x$, $v(x) = e^{-x}$) :<br>` +
            `$f'(x) = e^{-x} + x \\times (-e^{-x}) = (1 - x)\\,e^{-x}$.<br>` +
            `Calculons $f'(x) + f(x) = (1 - x)\\,e^{-x} + x\\,e^{-x} = (1 - x + x)\\,e^{-x} = e^{-x}$.<br>` +
            `Donc $f'(x) + f(x) = e^{-x}$ : $f$ est bien solution de $(E)$.`
        };
      }
    ];
    const v = pick(variantes)();
    return {
      enonce: v.enonce,
      corrige: v.corrige,
      rappel: `<strong>Vérification avec second membre variable.</strong> Pour vérifier que $f$ est solution de $y' = a\\,y + g(x)$, on calcule $f'(x)$ et on vérifie que $f'(x) - a\\,f(x) = g(x)$ pour tout $x$. Les calculs algébriques doivent aboutir au second membre exact.`
    };
  },

  // ============================================================
  // 4. rev_bac_ed_part_constante : Trouver la solution particulière constante de y' = ay + b
  // nv1 : trouver alpha tel que f(x) = alpha est solution
  // nv2 : trouver alpha + résoudre l'ED complète
  // nv3 : contexte modèle (équilibre)
  // ============================================================
  rev_bac_ed_part_constante: (d) => {
    // a et b tels que -b/a entier
    const tirerAB = () => {
      const a = pick([2, 3, -2, -3]);
      const yp = randNonZero(-4, 4);
      const b = -a * yp;
      return { a, b, yp };
    };

    if (d === 1) {
      const { a, b, yp } = tirerAB();
      return {
        enonce: `On considère l'équation différentielle $(E) : ${_ed_eqLatex(a, b)}$. ` +
          `Déterminer le réel $\\alpha$ tel que la fonction constante $g(x) = \\alpha$ soit solution de $(E)$.`,
        corrige: `Si $g(x) = \\alpha$ pour tout $x$, alors $g'(x) = 0$. ` +
          `L'équation $(E)$ donne : $0 = ${a}\\,\\alpha ${_ed_signeCoef(b)}$.<br>` +
          `On résout : $${a}\\,\\alpha = ${-b}$, donc $\\alpha = ${yp}$.<br>` +
          `La fonction constante $g(x) = ${yp}$ est solution de $(E)$.`,
        rappel: `<strong>Solution particulière constante.</strong> Une fonction constante $g(x) = \\alpha$ a une dérivée nulle. Pour qu'elle soit solution de $y' = a\\,y + b$, il faut $0 = a\\,\\alpha + b$, donc $\\alpha = -\\dfrac{b}{a}$.`
      };
    }

    if (d === 2) {
      const { a, b, yp } = tirerAB();
      return {
        enonce: `Soit l'équation différentielle $(E) : ${_ed_eqLatex(a, b)}$.<br>` +
          `1. Déterminer la solution constante $g$ de $(E)$.<br>` +
          `2. Démontrer que $f$ est solution de $(E)$ si, et seulement si, $f - g$ est solution de l'équation homogène $(H) : ${_ed_eqLatex(a, 0)}$.<br>` +
          `3. En déduire l'ensemble des solutions de $(E)$.`,
        corrige: `<strong>1.</strong> Si $g(x) = \\alpha$, l'équation $(E)$ donne $0 = ${a}\\,\\alpha ${_ed_signeCoef(b)}$, donc $\\alpha = ${yp}$. La solution constante est $g(x) = ${yp}$.<br>` +
          `<strong>2.</strong> Posons $h = f - g$. Alors $h' = f' - g' = f'$ (car $g' = 0$).<br>` +
          `$f$ solution de $(E)$ $\\iff$ $f' = ${a}\\,f ${_ed_signeCoef(b)}$ $\\iff$ $h' = ${a}(h + g) ${_ed_signeCoef(b)} = ${a}\\,h + (${a}g ${_ed_signeCoef(b)}) = ${a}\\,h$ (car $g$ est solution).<br>` +
          `Donc $f$ solution de $(E)$ $\\iff$ $h = f - g$ solution de $(H)$.<br>` +
          `<strong>3.</strong> Les solutions de $(H)$ sont $h(x) = C\\,e^{${a}x}$, $C \\in \\mathbb{R}$.<br>` +
          `Donc les solutions de $(E)$ sont $f(x) = h(x) + g(x) = C\\,e^{${a}x} ${_ed_signeCoef(yp)}$, $C \\in \\mathbb{R}$.`,
        rappel: `<strong>Méthode du changement de fonction (cas constant).</strong> Si $g$ est solution particulière de $(E) : y' = a\\,y + b$, alors $f$ est solution de $(E)$ $\\iff$ $f - g$ est solution de l'équation homogène $(H) : y' = a\\,y$. C'est la structure générale des EDL.`
      };
    }

    // d === 3 : contexte modèle (équilibre d'un système)
    const variantes = [
      () => {
        // Refroidissement : T'(t) = -k(T - T_ext), équilibre T = T_ext
        // T'(t) = -k T(t) + k T_ext, donc a = -k, b = k T_ext, -b/a = T_ext
        const k = pick([0.1, 0.2, 0.5]);
        const Text = rand(15, 25);
        return {
          enonce: `Un café à température $T(t)$ (en °C) à l'instant $t$ (en minutes) est laissé dans une pièce de température constante ${Text}°C. ` +
            `Sa température suit l'équation différentielle $(E) : T'(t) = -${k}\\,(T(t) - ${Text})$.<br>` +
            `1. Réécrire $(E)$ sous la forme $T'(t) = a\\,T(t) + b$.<br>` +
            `2. Déterminer la solution constante $T_{\\text{eq}}$ de $(E)$. Interpréter physiquement.`,
          corrige: `<strong>1.</strong> En développant : $T'(t) = -${k}\\,T(t) + ${k * Text}$. Donc $a = -${k}$ et $b = ${k * Text}$.<br>` +
            `<strong>2.</strong> Une solution constante $T_{\\text{eq}}$ vérifie $0 = -${k}\\,T_{\\text{eq}} + ${k * Text}$, donc $T_{\\text{eq}} = ${Text}$°C.<br>` +
            `Interprétation : la température d'équilibre est celle de la pièce. Le café tend asymptotiquement vers cette température (refroidissement).`
        };
      },
      () => {
        // Médicament : c'(t) = -k c(t) + D (apport constant)
        // équilibre : c = D/k
        const k = pick([0.1, 0.2, 0.4]);
        const D = pick([2, 4, 6, 8]);
        const ceq = D / k;
        return {
          enonce: `Un patient reçoit un médicament par perfusion à débit constant. La concentration $c(t)$ (en mg/L) du médicament dans le sang à l'instant $t$ (en h) vérifie : ` +
            `$(E) : c'(t) = -${k}\\,c(t) + ${D}$.<br>` +
            `1. Déterminer la solution constante $c_{\\text{eq}}$ de $(E)$.<br>` +
            `2. Interpréter cette valeur dans le contexte.`,
          corrige: `<strong>1.</strong> Une solution constante $c_{\\text{eq}}$ vérifie $0 = -${k}\\,c_{\\text{eq}} + ${D}$, donc $c_{\\text{eq}} = \\dfrac{${D}}{${k}} = ${dec(ceq)}$ mg/L.<br>` +
            `<strong>2.</strong> $c_{\\text{eq}}$ est la concentration d'équilibre du médicament : la quantité reçue par perfusion compense exactement celle éliminée par l'organisme. La concentration tend vers cette valeur sur le long terme.`
        };
      }
    ];
    const v = pick(variantes)();
    return {
      enonce: v.enonce,
      corrige: v.corrige,
      rappel: `<strong>Équilibre d'un modèle.</strong> Dans un modèle de la forme $y' = a\\,y + b$, la solution constante $y_{\\text{eq}} = -\\dfrac{b}{a}$ représente l'état d'équilibre du système. Quand $a < 0$, toute solution converge vers $y_{\\text{eq}}$ en $+\\infty$.`
    };
  },

  // ============================================================
  // 5. rev_bac_ed_part_donnee : y' = ay + f(x) avec solution particulière donnée
  // nv1 : vérifier que g est solution particulière
  // nv2 : déduire les solutions de l'ED complète
  // nv3 : avec CI complète
  // ============================================================
  rev_bac_ed_part_donnee: (d) => {
    if (d === 1) {
      // g(x) = x + 1, vérifier solution de y' = -y + x + 2
      // g'(x) = 1, -g(x) + x + 2 = -x - 1 + x + 2 = 1 ✓
      const variantes = [
        () => {
          return {
            enonce: `On considère l'équation différentielle $(E) : y' = -y + x + 2$ et la fonction $g$ définie sur $\\mathbb{R}$ par $g(x) = x + 1$. ` +
              `Vérifier que $g$ est une solution particulière de $(E)$.`,
            corrige: `$g$ est dérivable sur $\\mathbb{R}$ et $g'(x) = 1$.<br>` +
              `Calculons $-g(x) + x + 2 = -(x + 1) + x + 2 = -x - 1 + x + 2 = 1$.<br>` +
              `Donc $g'(x) = -g(x) + x + 2$ : $g$ est bien une solution particulière de $(E)$.`
          };
        },
        () => {
          // g(x) = 2x - 3, vérifier solution de y' = y - 2x + 5
          // g'(x) = 2, g(x) - 2x + 5 = 2x - 3 - 2x + 5 = 2 ✓
          return {
            enonce: `On considère l'équation différentielle $(E) : y' = y - 2x + 5$ et la fonction $g$ définie sur $\\mathbb{R}$ par $g(x) = 2x - 3$. ` +
              `Vérifier que $g$ est une solution particulière de $(E)$.`,
            corrige: `$g$ est dérivable sur $\\mathbb{R}$ et $g'(x) = 2$.<br>` +
              `Calculons $g(x) - 2x + 5 = (2x - 3) - 2x + 5 = 2$.<br>` +
              `Donc $g'(x) = g(x) - 2x + 5$ : $g$ est bien une solution particulière de $(E)$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Solution particulière donnée.</strong> Pour vérifier qu'une fonction $g$ est solution particulière de $y' = a\\,y + h(x)$, on calcule $g'(x)$ et $a\\,g(x) + h(x)$, puis on vérifie l'égalité. C'est un calcul mécanique mais central pour la résolution.`
      };
    }

    if (d === 2) {
      const variantes = [
        () => ({
          enonce: `On considère l'équation différentielle $(E) : y' = 2\\,y - 4x + 3$ et la fonction $g$ définie sur $\\mathbb{R}$ par $g(x) = 2x - \\dfrac{1}{2}$.<br>` +
            `1. Vérifier que $g$ est solution de $(E)$.<br>` +
            `2. Démontrer que $f$ est solution de $(E)$ ssi $h = f - g$ est solution de $(H) : y' = 2y$.<br>` +
            `3. En déduire l'ensemble des solutions de $(E)$.`,
          corrige: `<strong>1.</strong> $g'(x) = 2$ et $2g(x) - 4x + 3 = 4x - 1 - 4x + 3 = 2$. ✓<br>` +
            `<strong>2.</strong> $h = f - g$, $h' = f' - g' = (2f - 4x + 3) - (2g - 4x + 3) = 2h$.<br>` +
            `<strong>3.</strong> Solutions de $(H)$ : $h(x) = C\\,e^{2x}$. Solutions de $(E)$ : $f(x) = C\\,e^{2x} + 2x - \\dfrac{1}{2}$, $C \\in \\mathbb{R}$.`
        }),
        () => ({
          // (E) : y' = 3y - 6x - 1, g(x) = 2x + 1
          enonce: `On considère l'équation différentielle $(E) : y' = 3y - 6x - 1$ et la fonction $g$ définie sur $\\mathbb{R}$ par $g(x) = 2x + 1$.<br>` +
            `1. Vérifier que $g$ est solution de $(E)$.<br>` +
            `2. Démontrer que $f$ est solution de $(E)$ ssi $h = f - g$ est solution de $(H) : y' = 3y$.<br>` +
            `3. En déduire l'ensemble des solutions de $(E)$.`,
          corrige: `<strong>1.</strong> $g'(x) = 2$ et $3g(x) - 6x - 1 = 6x + 3 - 6x - 1 = 2$. ✓<br>` +
            `<strong>2.</strong> $h = f - g$, $h' = f' - g' = 3(f - g) = 3h$.<br>` +
            `<strong>3.</strong> Solutions de $(H)$ : $h(x) = C\\,e^{3x}$. Solutions de $(E)$ : $f(x) = C\\,e^{3x} + 2x + 1$, $C \\in \\mathbb{R}$.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Structure des solutions d'une EDL.</strong> Solution générale = solution particulière + solution générale de l'équation homogène.`
      };
    }

    // d === 3 : avec CI, 2 variantes
    const variantes = [
      () => ({
        enonce: `On considère $(E) : y' + y = x\\,e^{-x}$ et $g(x) = \\dfrac{x^{2}}{2}\\,e^{-x}$.<br>` +
          `1. Vérifier que $g$ est solution de $(E)$.<br>` +
          `2. Démontrer que $f$ solution de $(E)$ ssi $f - g$ solution de $(H) : y' + y = 0$.<br>` +
          `3. Résoudre $(E)$ et déterminer l'unique solution $f$ avec $f(0) = 1$.`,
        corrige: `<strong>1.</strong> $g'(x) = x\\,e^{-x} - \\dfrac{x^{2}}{2}\\,e^{-x}$. $g' + g = x\\,e^{-x}$. ✓<br>` +
          `<strong>2.</strong> $h = f - g$ : $h' + h = 0$.<br>` +
          `<strong>3.</strong> $(H)$ : $h(x) = C\\,e^{-x}$. $f(x) = \\left(C + \\dfrac{x^{2}}{2}\\right)e^{-x}$. $f(0) = 1 \\Rightarrow C = 1$. ` +
          `Solution : $f(x) = \\left(1 + \\dfrac{x^{2}}{2}\\right)e^{-x}$.`
      }),
      () => ({
        // (E) : y' - 2y = e^(2x), g(x) = x·e^(2x), CI f(0) = 2
        enonce: `On considère $(E) : y' - 2y = e^{2x}$ et $g(x) = x\\,e^{2x}$.<br>` +
          `1. Vérifier que $g$ est solution de $(E)$.<br>` +
          `2. Démontrer que $f$ solution de $(E)$ ssi $f - g$ solution de $(H) : y' - 2y = 0$.<br>` +
          `3. Résoudre $(E)$ et déterminer l'unique solution $f$ avec $f(0) = 2$.`,
        corrige: `<strong>1.</strong> $g'(x) = e^{2x} + 2x\\,e^{2x}$. $g' - 2g = e^{2x}$. ✓<br>` +
          `<strong>2.</strong> $h = f - g$ : $h' - 2h = 0$.<br>` +
          `<strong>3.</strong> $(H)$ : $h(x) = C\\,e^{2x}$. $f(x) = (C + x)\\,e^{2x}$. $f(0) = 2 \\Rightarrow C = 2$. ` +
          `Solution : $f(x) = (2 + x)\\,e^{2x}$.`
      })
    ];
    const v3 = pick(variantes)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>EDL avec second membre variable.</strong> Méthode : (1) vérifier $g$ solution particulière ; (2) montrer $f \\in \\mathcal{S}_{(E)} \\iff f - g \\in \\mathcal{S}_{(H)}$ ; (3) résoudre $(H)$ et déduire $(E)$.`
    };
  },

  // ============================================================
  // 6. rev_bac_ed_contexte : Modélisation
  // nv1 : refroidissement / loi de Newton
  // nv2 : médicament avec apport constant
  // nv3 : modèle d'évolution avec étude
  // ============================================================
  rev_bac_ed_contexte: (d) => {
    if (d === 1) {
      // Refroidissement
      const k = pick([0.05, 0.1, 0.2]);
      const Text = rand(15, 22);
      const T0 = rand(70, 90);
      // T(t) = (T0 - Text) e^(-kt) + Text
      return {
        enonce: `Un objet chauffé à $${T0}$ °C est placé dans une pièce de température constante $${Text}$ °C. ` +
          `Sa température $T(t)$ à l'instant $t$ (en min) vérifie l'équation différentielle $(E) : T'(t) = -${k}\\,(T(t) - ${Text})$, avec $T(0) = ${T0}$.<br>` +
          `1. Justifier que $T_{\\text{eq}}(t) = ${Text}$ est solution particulière constante de $(E)$.<br>` +
          `2. Résoudre $(E)$ avec la condition initiale donnée.`,
        corrige: `<strong>1.</strong> Si $T(t) = ${Text}$ pour tout $t$, alors $T'(t) = 0$ et $-${k}(${Text} - ${Text}) = 0$. Égalité vérifiée : $T_{\\text{eq}}$ est solution constante.<br>` +
          `<strong>2.</strong> $(E)$ s'écrit $T'(t) = -${k}\\,T(t) + ${k * Text}$. Les solutions sont $T(t) = C\\,e^{-${k}t} + ${Text}$, $C \\in \\mathbb{R}$.<br>` +
          `Condition $T(0) = ${T0}$ : $C + ${Text} = ${T0}$, donc $C = ${T0 - Text}$.<br>` +
          `D'où $T(t) = ${T0 - Text}\\,e^{-${k}t} + ${Text}$.`,
        rappel: `<strong>Loi de refroidissement de Newton.</strong> $T'(t) = -k\\,(T - T_{\\text{ext}})$ se réécrit $T'(t) = -k\\,T + k\\,T_{\\text{ext}}$. La solution est $T(t) = (T_0 - T_{\\text{ext}})\\,e^{-kt} + T_{\\text{ext}}$ : la température tend exponentiellement vers $T_{\\text{ext}}$.`
      };
    }

    if (d === 2) {
      // Médicament avec apport constant
      const k = pick([0.1, 0.2, 0.25]);
      const D = pick([4, 6, 8]);
      const c0 = 0;
      const ceq = D / k;
      // c(t) = (c0 - ceq) e^(-kt) + ceq = -ceq e^(-kt) + ceq = ceq (1 - e^(-kt))
      return {
        enonce: `Un patient reçoit un médicament par perfusion continue. La concentration $c(t)$ (en mg/L) à l'instant $t$ (en heures) vérifie : ` +
          `$(E) : c'(t) = -${k}\\,c(t) + ${D}$, avec $c(0) = 0$.<br>` +
          `1. Déterminer la solution constante $c_{\\text{eq}}$ de $(E)$.<br>` +
          `2. Résoudre le problème de Cauchy.<br>` +
          `3. Quelle est la concentration au bout d'une longue durée ?`,
        corrige: `<strong>1.</strong> Si $c$ est constante, $c'(t) = 0$ et $-${k}\\,c_{\\text{eq}} + ${D} = 0$, donc $c_{\\text{eq}} = \\dfrac{${D}}{${k}} = ${dec(ceq)}$ mg/L.<br>` +
          `<strong>2.</strong> Les solutions de $(E)$ sont $c(t) = C\\,e^{-${k}t} + ${dec(ceq)}$, $C \\in \\mathbb{R}$.<br>` +
          `Condition $c(0) = 0$ : $C + ${dec(ceq)} = 0$, donc $C = ${dec(-ceq)}$.<br>` +
          `D'où $c(t) = ${dec(-ceq)}\\,e^{-${k}t} + ${dec(ceq)} = ${dec(ceq)}\\,(1 - e^{-${k}t})$.<br>` +
          `<strong>3.</strong> $\\lim\\limits_{t \\to +\\infty} e^{-${k}t} = 0$, donc $\\lim\\limits_{t \\to +\\infty} c(t) = ${dec(ceq)}$ mg/L. La concentration tend vers $c_{\\text{eq}}$.`,
        rappel: `<strong>Modèle perfusion / réservoir.</strong> Apport constant $D$ et élimination proportionnelle $-k\\,c$. La concentration converge vers $\\dfrac{D}{k}$ (équilibre entre apport et élimination).`
      };
    }

    // d === 3 : modèle d'évolution complet avec étude
    const variantes = [
      () => {
        // Décharge condensateur : u'(t) = -u(t)/(RC), u(0) = U0
        const RC = pick([2, 4, 5]);
        const U0 = pick([6, 9, 12]);
        return {
          enonce: `Lors de la décharge d'un condensateur dans une résistance, la tension $u(t)$ (en volts) à ses bornes à l'instant $t$ (en s) vérifie : ` +
            `$(E) : u'(t) = -\\dfrac{1}{${RC}}\\,u(t)$, avec $u(0) = ${U0}$.<br>` +
            `1. Résoudre $(E)$ avec cette condition initiale.<br>` +
            `2. Au bout de combien de temps la tension atteint-elle la moitié de sa valeur initiale ? Donner la valeur exacte puis arrondir au dixième.`,
          corrige: `<strong>1.</strong> $(E)$ est de la forme $y' = a\\,y$ avec $a = -\\dfrac{1}{${RC}}$. Les solutions sont $u(t) = C\\,e^{-t/${RC}}$, $C \\in \\mathbb{R}$.<br>` +
            `Condition $u(0) = ${U0}$ : $C = ${U0}$. Donc $u(t) = ${U0}\\,e^{-t/${RC}}$.<br>` +
            `<strong>2.</strong> On cherche $t$ tel que $u(t) = \\dfrac{${U0}}{2}$, soit $${U0}\\,e^{-t/${RC}} = \\dfrac{${U0}}{2}$, donc $e^{-t/${RC}} = \\dfrac{1}{2}$.<br>` +
            `Par composition avec $\\ln$ : $-\\dfrac{t}{${RC}} = \\ln\\!\\left(\\dfrac{1}{2}\\right) = -\\ln(2)$, donc $t = ${RC}\\,\\ln(2) \\approx ${dec(Math.round(RC * Math.log(2) * 10) / 10)}$ s.`
        };
      },
      () => {
        // Évolution population de bactéries : N'(t) = a N(t) (croissance simple)
        const a = pick([0.2, 0.3, 0.4]);
        const N0 = pick([100, 500, 1000]);
        // Temps de doublement : T2 = ln(2)/a
        const T2 = Math.log(2) / a;
        return {
          enonce: `Une population de bactéries croît selon le modèle $(E) : N'(t) = ${a}\\,N(t)$, où $N(t)$ est la population à l'instant $t$ (en h). À $t = 0$, on dénombre $${N0}$ bactéries.<br>` +
            `1. Donner l'expression de $N(t)$.<br>` +
            `2. Calculer le temps de doublement $T_{2}$ de la population.`,
          corrige: `<strong>1.</strong> Les solutions sont $N(t) = C\\,e^{${a}t}$. Avec $N(0) = ${N0}$ : $C = ${N0}$. Donc $N(t) = ${N0}\\,e^{${a}t}$.<br>` +
            `<strong>2.</strong> $T_{2}$ vérifie $N(T_{2}) = 2\\,N_{0}$, soit $e^{${a}T_{2}} = 2$, donc $T_{2} = \\dfrac{\\ln(2)}{${a}} \\approx ${dec(Math.round(T2 * 100) / 100)}$ h.`
        };
      }
    ];
    const v = pick(variantes)();
    return {
      enonce: v.enonce,
      corrige: v.corrige,
      rappel: `<strong>Modélisation par ED.</strong> Les modèles classiques au bac : refroidissement (loi de Newton), décharge $RC$ (électricité), croissance/décroissance exponentielle (biologie). On identifie $a$ et $b$ dans $y' = a\\,y + b$, puis on résout.`
    };
  },

  // ============================================================
  // 7. rev_bac_ed_asymptote : Comportement asymptotique d'une solution
  // nv1 : limite simple d'une solution de y' = ay (a < 0)
  // nv2 : limite d'une solution de y' = ay + b (a < 0)
  // nv3 : interprétation asymptotique contextuelle
  // ============================================================
  rev_bac_ed_asymptote: (d) => {
    if (d === 1) {
      // f(x) = C e^(ax), avec a < 0
      const a = pick([-2, -3]);
      const C = randNonZero(2, 6);
      return {
        enonce: `Soit $f$ définie sur $\\mathbb{R}$ par $f(x) = ${C}\\,e^{${a}x}$. ` +
          `$f$ est solution de l'équation différentielle $y' = ${a}\\,y$.<br>` +
          `Déterminer la limite de $f$ en $+\\infty$. Interpréter graphiquement.`,
        corrige: `Comme $${a} < 0$, on a $\\lim\\limits_{x \\to +\\infty} e^{${a}x} = 0$.<br>` +
          `Par produit : $\\lim\\limits_{x \\to +\\infty} f(x) = 0$.<br>` +
          `Interprétation : la droite d'équation $y = 0$ (l'axe des abscisses) est asymptote horizontale à la courbe $\\mathcal{C}_{f}$ en $+\\infty$.`,
        rappel: `<strong>Limite de $e^{ax}$ en $+\\infty$.</strong> Si $a < 0$, $\\lim\\limits_{x \\to +\\infty} e^{ax} = 0$. Si $a > 0$, $\\lim\\limits_{x \\to +\\infty} e^{ax} = +\\infty$. Conséquence : les solutions de $y' = a\\,y$ avec $a < 0$ tendent vers $0$ en $+\\infty$.`
      };
    }

    if (d === 2) {
      // f(x) = C e^(ax) + alpha avec a < 0
      // limite en +∞ : alpha
      const a = pick([-2, -3]);
      const yp = rand(2, 6);
      const b = -a * yp;
      const C = randNonZero(-4, 4);
      return {
        enonce: `Soit $f$ définie sur $\\mathbb{R}$ par $f(x) = ${_ed_coefVar(C, `e^{${a}x}`)} ${_ed_signeCoef(yp)}$. ` +
          `$f$ est solution de l'équation différentielle $${_ed_eqLatex(a, b)}$.<br>` +
          `Déterminer la limite de $f$ en $+\\infty$. Interpréter graphiquement.`,
        corrige: `Comme $${a} < 0$, $\\lim\\limits_{x \\to +\\infty} e^{${a}x} = 0$, donc $\\lim\\limits_{x \\to +\\infty} ${_ed_coefVar(C, `e^{${a}x}`)} = 0$.<br>` +
          `Par somme : $\\lim\\limits_{x \\to +\\infty} f(x) = ${yp}$.<br>` +
          `Interprétation : la droite d'équation $y = ${yp}$ est asymptote horizontale à la courbe $\\mathcal{C}_{f}$ en $+\\infty$. Cette valeur correspond à la solution constante (équilibre) de l'équation.`,
        rappel: `<strong>Asymptote horizontale et solution d'équilibre.</strong> Pour $y' = a\\,y + b$ avec $a < 0$, toute solution converge vers $-\\dfrac{b}{a}$ (la solution constante) en $+\\infty$. C'est la valeur d'équilibre du système.`
      };
    }

    // d === 3 : interprétation contextuelle
    const variantes = [
      () => {
        // Refroidissement : T(t) = (T0 - Text) e^(-kt) + Text
        const k = pick([0.1, 0.2]);
        const Text = rand(18, 22);
        const T0 = rand(70, 90);
        return {
          enonce: `Une tasse de café initialement à $${T0}$°C refroidit dans une pièce à $${Text}$°C. Sa température (en °C) est donnée par $T(t) = ${T0 - Text}\\,e^{-${k}t} + ${Text}$ où $t$ est en minutes.<br>` +
            `1. Calculer $\\lim\\limits_{t \\to +\\infty} T(t)$.<br>` +
            `2. Interpréter ce résultat dans le contexte. Le résultat est-il cohérent ?`,
          corrige: `<strong>1.</strong> $\\lim\\limits_{t \\to +\\infty} e^{-${k}t} = 0$ (car $-${k} < 0$), donc $\\lim\\limits_{t \\to +\\infty} T(t) = 0 + ${Text} = ${Text}$°C.<br>` +
            `<strong>2.</strong> Au bout d'une longue durée, la température du café se stabilise autour de $${Text}$°C, soit la température de la pièce. Cohérent : un objet finit toujours par atteindre la température ambiante de son milieu (loi de refroidissement de Newton).`
        };
      },
      () => {
        // Médicament : c(t) = ceq (1 - e^(-kt))
        const ceq = pick([20, 30, 40]);
        const k = pick([0.1, 0.2]);
        return {
          enonce: `La concentration d'un médicament dans le sang d'un patient (en mg/L) à l'instant $t$ (en h) est donnée par $c(t) = ${ceq}\\,(1 - e^{-${k}t})$.<br>` +
            `1. Déterminer $\\lim\\limits_{t \\to +\\infty} c(t)$.<br>` +
            `2. Si la concentration thérapeutique optimale est de $${ceq - 5}$ mg/L et la concentration toxique de $${ceq + 5}$ mg/L, le traitement est-il sûr ?`,
          corrige: `<strong>1.</strong> $\\lim\\limits_{t \\to +\\infty} e^{-${k}t} = 0$, donc $\\lim\\limits_{t \\to +\\infty} c(t) = ${ceq}\\,(1 - 0) = ${ceq}$ mg/L.<br>` +
            `<strong>2.</strong> La concentration tend vers $${ceq}$ mg/L, valeur comprise entre $${ceq - 5}$ mg/L (thérapeutique) et $${ceq + 5}$ mg/L (toxique). Le traitement est donc sûr : la concentration n'atteint pas le seuil toxique.`
        };
      }
    ];
    const v = pick(variantes)();
    return {
      enonce: v.enonce,
      corrige: v.corrige,
      rappel: `<strong>Interprétation asymptotique en contexte.</strong> Pour une grandeur modélisée par une ED, la limite en $+\\infty$ donne la valeur à long terme du système (équilibre). Il faut toujours interpréter ce résultat dans les termes du problème (température, concentration, population...).`
    };
  }

});

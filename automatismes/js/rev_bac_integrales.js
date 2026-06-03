/* LaboMath — Générateurs annales bac (rev_bac_int_*)
   Lot 1 : Intégrales — 8 générateurs, 3 niveaux chacun, variantes paramétrées
   Calibrés sur les sujets bac 2025 (APMEP).
   Compatible avec window.LM_GEN, helpers : pick, rand, randNonZero, reformule, signe, par, dec. */

// Helpers locaux pour ce fichier (évitent les "+ 1x", "+ 0x", "+ -" dans les polynômes)
// signeCoefVar(n, "x") : affiche "+ x", "- x", "+ 2x", "- 3x" selon n (rien si n=0)
// signeCoefVar(n) : version sans variable, équivaut à signe(n)
const _signeCoefVar = (n, varStr = '') => {
  if (n === 0) return '';
  if (n === 1) return varStr ? `+ ${varStr}` : '+ 1';
  if (n === -1) return varStr ? `- ${varStr}` : '- 1';
  return n > 0 ? `+ ${n}${varStr}` : `- ${-n}${varStr}`;
};
// coefVar(n, "x") : affiche "x", "-x", "2x", "-3x" selon n (rien si n=0) — pour début d'expression
const _coefVar = (n, varStr = '') => {
  if (n === 0) return '';
  if (n === 1) return varStr || '1';
  if (n === -1) return varStr ? `-${varStr}` : '-1';
  return `${n}${varStr}`;
};

Object.assign(window.LM_GEN ??= {}, {

  // ============================================================
  // 1. rev_bac_int_polynome
  // nv1 : degré 2 bornes 0/B simples
  // nv2 : degré 2 ou 3, bornes paramétriques
  // nv3 : degré 3 avec facteur, calcul fin
  // ============================================================
  rev_bac_int_polynome: (d) => {
    if (d === 1) {
      const variantes = [
        () => {
          // ∫_0^B (a x^2 + b) dx = a B^3/3 + b B
          const a = rand(2, 3);  // évite a=1 cosmétique
          const b = randNonZero(-3, 3);
          const B = rand(2, 3);
          const val = `\\dfrac{${a}\\times ${B}^3}{3} ${_signeCoefVar(b * B)}`;
          const num = a * B * B * B + 3 * b * B;
          return {
            enonce: `Calculer l'intégrale $I = \\displaystyle\\int_{0}^{${B}} \\left(${a}x^2 ${_signeCoefVar(b)}\\right) dx$.`,
            corrige: `Une primitive de $${a}x^2 ${_signeCoefVar(b)}$ est $F(x) = \\dfrac{${a}}{3}x^3 ${_signeCoefVar(b, 'x')}$.<br>` +
              `$I = \\left[\\dfrac{${a}}{3}x^3 ${_signeCoefVar(b, 'x')}\\right]_{0}^{${B}} = ${val} = \\dfrac{${num}}{3}$.`
          };
        },
        () => {
          // ∫_0^B (a x + b) dx avec énoncé plus court
          const a = rand(2, 4);
          const b = randNonZero(-4, 4);
          const B = rand(2, 4);
          const val = a * B * B / 2 + b * B;
          return {
            enonce: `Calculer $\\displaystyle\\int_{0}^{${B}} (${a}x ${_signeCoefVar(b)})\\,dx$.`,
            corrige: `Une primitive de $${a}x ${_signeCoefVar(b)}$ est $\\dfrac{${a}}{2}x^2 ${_signeCoefVar(b, 'x')}$.<br>` +
              `L'intégrale vaut $\\left[\\dfrac{${a}}{2}x^2 ${_signeCoefVar(b, 'x')}\\right]_{0}^{${B}} = \\dfrac{${a}\\times ${B}^2}{2} ${_signeCoefVar(b * B)} = ${dec(val)}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Primitive d'un polynôme.</strong> Une primitive de $x^n$ est $\\dfrac{x^{n+1}}{n+1}$ (pour $n \\neq -1$). Par linéarité : $\\displaystyle\\int_a^b f = F(b) - F(a)$ où $F$ est une primitive de $f$.`
      };
    }

    if (d === 2) {
      const variantes = [
        () => {
          // ∫_a^b (alpha x^2 + beta x + gamma) dx
          const alpha = rand(2, 3);  // évite alpha=1 cosmétique
          const beta = randNonZero(-3, 3);
          const gamma = randNonZero(-4, 4);
          const a = rand(0, 1);
          const b = rand(2, 3);
          // F(x) = alpha x^3/3 + beta x^2/2 + gamma x
          const Fa = alpha * a * a * a / 3 + beta * a * a / 2 + gamma * a;
          const Fb = alpha * b * b * b / 3 + beta * b * b / 2 + gamma * b;
          const I = Fb - Fa;
          return {
            enonce: `Calculer $\\displaystyle\\int_{${a}}^{${b}} \\left(${alpha}x^2 ${_signeCoefVar(beta, 'x')} ${_signeCoefVar(gamma)}\\right) dx$.`,
            corrige: `Une primitive est $F(x) = \\dfrac{${alpha}}{3}x^3 ${_signeCoefVar(beta, '\\dfrac{x^2}{2}')} ${_signeCoefVar(gamma, 'x')}$.<br>` +
              `$F(${b}) = \\dfrac{${alpha}\\times ${b}^3}{3} ${_signeCoefVar(beta, '\\dfrac{' + b + '^2}{2}')} ${_signeCoefVar(gamma * b)} = ${dec(Math.round(Fb * 1000) / 1000)}$ et $F(${a}) = ${dec(Math.round(Fa * 1000) / 1000)}$.<br>` +
              `Donc l'intégrale vaut $${dec(Math.round(I * 1000) / 1000)}$.`
          };
        },
        () => {
          // ∫_1^B (3x^2 + 2x - 1) dx style (calibré sur Métropole)
          const c1 = rand(2, 4); // coef de x^2
          const c2 = randNonZero(-3, 3);
          const c3 = randNonZero(-3, 3);
          const B = rand(2, 3);
          // primitive : (c1/3)x^3 + (c2/2)x^2 + c3 x, évaluée en 1 et B
          const F1 = c1 / 3 + c2 / 2 + c3;
          const FB = c1 * B * B * B / 3 + c2 * B * B / 2 + c3 * B;
          const I = FB - F1;
          return {
            enonce: `On considère la fonction $f$ définie sur $\\mathbb{R}$ par $f(x) = ${c1}x^2 ${_signeCoefVar(c2, 'x')} ${_signeCoefVar(c3)}$.<br>` +
              `Calculer $\\displaystyle\\int_{1}^{${B}} f(x)\\,dx$.`,
            corrige: `Une primitive de $f$ est $F(x) = \\dfrac{${c1}}{3}x^3 ${_signeCoefVar(c2, '\\dfrac{x^2}{2}')} ${_signeCoefVar(c3, 'x')}$.<br>` +
              `$\\displaystyle\\int_{1}^{${B}} f(x)\\,dx = F(${B}) - F(1) = ${dec(Math.round(I * 1000) / 1000)}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Intégrale d'un polynôme.</strong> Linéarité de l'intégrale : $\\int (f+g) = \\int f + \\int g$ et $\\int (k\\,f) = k\\int f$. On calcule chaque terme avec une primitive de $x^n$.`
      };
    }

    // d === 3 : polynôme degré 3 avec sortie sous forme fractionnaire
    const variantes = [
      () => {
        // ∫_0^1 (4x^3 - 3x^2 + 2x - 1) dx = 1 - 1 + 1 - 1 = 0 type
        const c3 = rand(2, 5);
        const c2 = randNonZero(-4, 4);
        const c1 = randNonZero(-4, 4);
        const c0 = randNonZero(-3, 3);
        const B = rand(1, 2);
        // F(x) = (c3/4)x^4 + (c2/3)x^3 + (c1/2)x^2 + c0 x
        const FB = c3 * Math.pow(B, 4) / 4 + c2 * Math.pow(B, 3) / 3 + c1 * B * B / 2 + c0 * B;
        return {
          enonce: `Calculer $\\displaystyle\\int_{0}^{${B}} \\left(${c3}x^3 ${_signeCoefVar(c2, 'x^2')} ${_signeCoefVar(c1, 'x')} ${_signeCoefVar(c0)}\\right) dx$. Donner la valeur exacte.`,
          corrige: `Une primitive est $F(x) = \\dfrac{${c3}}{4}x^4 ${_signeCoefVar(c2, '\\dfrac{x^3}{3}')} ${_signeCoefVar(c1, '\\dfrac{x^2}{2}')} ${_signeCoefVar(c0, 'x')}$.<br>` +
            `$F(${B}) = \\dfrac{${c3}\\times ${B}^4}{4} ${_signeCoefVar(c2, '\\dfrac{' + B + '^3}{3}')} ${_signeCoefVar(c1, '\\dfrac{' + B + '^2}{2}')} ${_signeCoefVar(c0 * B)} = ${dec(Math.round(FB * 1000) / 1000)}$ et $F(0) = 0$.<br>` +
            `L'intégrale vaut donc $${dec(Math.round(FB * 1000) / 1000)}$ (valeur approchée).`
        };
      },
      () => {
        // ∫_a^b polynôme degré 3 type "calcul d'aire entre deux courbes"
        const k = rand(2, 4); // coef principal
        const B = rand(2, 3);
        // ∫_0^B (-k x^3 + 3k x^2) dx = -k B^4/4 + k B^3 = k B^3 (1 - B/4)
        const val = -k * Math.pow(B, 4) / 4 + k * Math.pow(B, 3);
        return {
          enonce: `Calculer $\\displaystyle\\int_{0}^{${B}} \\left(-${k}x^3 + ${3 * k}x^2\\right) dx$.`,
          corrige: `Une primitive est $F(x) = -\\dfrac{${k}}{4}x^4 + ${k}x^3$.<br>` +
            `$F(${B}) = -\\dfrac{${k}\\times ${B}^4}{4} + ${k}\\times ${B}^3 = ${dec(val)}$ et $F(0) = 0$.<br>` +
            `Donc $\\displaystyle\\int_{0}^{${B}} \\left(-${k}x^3 + ${3 * k}x^2\\right) dx = ${dec(val)}$.`
        };
      }
    ];
    const v = pick(variantes)();
    return {
      enonce: v.enonce,
      corrige: v.corrige,
      rappel: `<strong>Polynôme de degré 3.</strong> $\\displaystyle\\int x^3\\,dx = \\dfrac{x^4}{4} + C$. Pour un calcul propre, on factorise les puissances de la borne avant d'évaluer numériquement.`
    };
  },

  // ============================================================
  // 2. rev_bac_int_exp_simple
  // nv1 : ∫ e^(ax+b) (primitive immédiate)
  // nv2 : ∫_0^B (alpha x + beta) e^(kx) avec primitive admise
  // nv3 : vérifier qu'une primitive donnée est correcte, calcul d'aire
  // ============================================================
  rev_bac_int_exp_simple: (d) => {
    if (d === 1) {
      const variantes = [
        () => {
          // ∫_0^1 e^(-2x) dx = -1/2 (e^(-2) - 1) = (1 - e^(-2))/2
          const k = pick([2, 3]);
          return {
            enonce: `Calculer $\\displaystyle\\int_{0}^{1} e^{-${k}x}\\,dx$. Donner la valeur exacte.`,
            corrige: `Une primitive de $e^{-${k}x}$ est $-\\dfrac{1}{${k}}e^{-${k}x}$.<br>` +
              `$\\displaystyle\\int_{0}^{1} e^{-${k}x}\\,dx = \\left[-\\dfrac{1}{${k}}e^{-${k}x}\\right]_{0}^{1} = -\\dfrac{1}{${k}}e^{-${k}} + \\dfrac{1}{${k}} = \\dfrac{1 - e^{-${k}}}{${k}}$.`
          };
        },
        () => {
          // ∫_0^B e^(kx) dx = (e^(kB) - 1)/k
          const k = pick([2, 3]);
          const B = rand(1, 2);
          return {
            enonce: `Calculer $\\displaystyle\\int_{0}^{${B}} e^{${k}x}\\,dx$. Donner la valeur exacte.`,
            corrige: `Une primitive de $e^{${k}x}$ est $\\dfrac{1}{${k}}e^{${k}x}$.<br>` +
              `$\\displaystyle\\int_{0}^{${B}} e^{${k}x}\\,dx = \\left[\\dfrac{1}{${k}}e^{${k}x}\\right]_{0}^{${B}} = \\dfrac{e^{${k * B}} - 1}{${k}}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Primitive de $e^{ax+b}$.</strong> $\\displaystyle\\int e^{ax+b}\\,dx = \\dfrac{1}{a}e^{ax+b} + C$. Attention au facteur $\\dfrac{1}{a}$ devant.`
      };
    }

    if (d === 2) {
      // F admise comme primitive, on l'utilise pour calculer ∫_0^B f
      // Type Amérique du Nord J1 : f(x) = (x^2+3x+2)e^(-x), F(x) = (-x^2-5x-7)e^(-x)
      const variantes = [
        () => {
          // f(x) = (x+1) e^x, F(x) = x e^x (à vérifier puis utiliser)
          const B = rand(1, 2);
          // F(B) = B e^B, F(0) = 0
          return {
            enonce: `On admet que $F(x) = x\\,e^{x}$ est une primitive de $f(x) = (x+1)\\,e^{x}$ sur $\\mathbb{R}$.<br>` +
              `Calculer $\\displaystyle\\int_{0}^{${B}} (x+1)\\,e^{x}\\,dx$.`,
            corrige: `D'après la définition de $F$ : $\\displaystyle\\int_{0}^{${B}} (x+1)\\,e^{x}\\,dx = F(${B}) - F(0) = ${B}\\,e^{${B}} - 0 = ${B}\\,e^{${B}}$.`
          };
        },
        () => {
          // f(x) = (1-x) e^(-x), F(x) = x e^(-x)
          const B = rand(1, 2);
          return {
            enonce: `On admet que $F(x) = x\\,e^{-x}$ est une primitive de $f(x) = (1 - x)\\,e^{-x}$ sur $\\mathbb{R}$.<br>` +
              `Calculer $\\displaystyle\\int_{0}^{${B}} (1 - x)\\,e^{-x}\\,dx$. Donner la valeur exacte.`,
            corrige: `$\\displaystyle\\int_{0}^{${B}} (1 - x)\\,e^{-x}\\,dx = F(${B}) - F(0) = ${B}\\,e^{-${B}} - 0 = ${B}\\,e^{-${B}} = \\dfrac{${B}}{e^{${B}}}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Primitive admise.</strong> Quand l'énoncé donne une primitive $F$ de $f$, le calcul est immédiat : $\\displaystyle\\int_a^b f(x)\\,dx = F(b) - F(a)$. On peut vérifier que $F'(x) = f(x)$ en dérivant.`
      };
    }

    // d === 3 : F(x) = (αx²+βx+γ) e^(kx) primitive donnée, calcul d'aire ou intégrale, puis interprétation
    const variantes = [
      () => {
        // Calibré exactement sur Amérique du Nord J1 2025 ex.4 partie C :
        // f(x) = (x² + 3x + 2) e^(-x), F(x) = (-x² - 5x - 7) e^(-x)
        // f est positive sur [0; +∞[, aire(α) = ∫_0^α f
        // F(α) - F(0) = (-α² - 5α - 7) e^(-α) - (-7) = 7 - (α² + 5α + 7) e^(-α)
        const A = rand(1, 3);
        // calcul numérique pour le corrigé
        const FA = (-A * A - 5 * A - 7) * Math.exp(-A);
        const F0 = -7;
        const val = FA - F0;
        return {
          enonce: `On considère $f$ définie sur $\\mathbb{R}$ par $f(x) = \\left(x^2 + 3x + 2\\right)e^{-x}$. ` +
            `On admet que $F(x) = \\left(-x^2 - 5x - 7\\right)e^{-x}$ est une primitive de $f$ sur $\\mathbb{R}$, ` +
            `et que $f$ est positive sur $[0\\,;\\,+\\infty[$.<br>` +
            `Soit $\\alpha = ${A}$. Déterminer la valeur exacte de l'aire $\\mathcal{A}(\\alpha)$, en unité d'aire, ` +
            `du domaine délimité par l'axe des abscisses, la courbe $\\mathcal{C}_f$ et les droites d'équation $x = 0$ et $x = ${A}$.`,
          corrige: `Comme $f \\geqslant 0$ sur $[0\\,;\\,${A}]$ :<br>` +
            `$\\mathcal{A}(\\alpha) = \\displaystyle\\int_{0}^{${A}} f(x)\\,dx = F(${A}) - F(0)$.<br>` +
            `$F(${A}) = (-${A}^2 - ${5 * A} - 7)\\,e^{-${A}} = ${-A * A - 5 * A - 7}\\,e^{-${A}}$.<br>` +
            `$F(0) = -7$.<br>` +
            `Donc $\\mathcal{A}(\\alpha) = ${-A * A - 5 * A - 7}\\,e^{-${A}} + 7 = 7 - ${A * A + 5 * A + 7}\\,e^{-${A}}$ u.a. $\\approx ${dec(Math.round(val * 1000) / 1000)}$ u.a.`
        };
      },
      () => {
        // Inspiré Asie J2 : f(t) = (60t+40) e^(-0.5t), valeur connue ∫_0^4 f = 320 - 800/e^2
        // Simplifié : f(t) = (at + b) e^(-0,5t), F(t) = (-2at - 2b - 4a) e^(-0,5t)
        // Vérif : F'(t) = -2a e^(-0,5t) + (-2at - 2b - 4a)(-0,5) e^(-0,5t)
        //        = e^(-0,5t) [ -2a + (at + b + 2a) ] = e^(-0,5t) [ at + b ] ✓
        // ∫_0^T (at + b) e^(-0,5t) dt = F(T) - F(0) = (-2aT - 2b - 4a) e^(-0,5T) - (-2b - 4a)
        //                              = (-2aT - 2b - 4a) e^(-0,5T) + 2b + 4a
        const a = pick([2, 4, 6]);
        const b = pick([2, 4]);
        const T = rand(2, 4);
        const FT = (-2 * a * T - 2 * b - 4 * a) * Math.exp(-0.5 * T);
        const F0 = -2 * b - 4 * a;
        const I = FT - F0;
        return {
          enonce: `Soit $f$ définie sur $[0\\,;\\,+\\infty[$ par $f(t) = (${a}t + ${b})\\,e^{-0{,}5\\,t}$.<br>` +
            `On admet que $F(t) = (-${2 * a}\\,t - ${2 * b + 4 * a})\\,e^{-0{,}5\\,t}$ est une primitive de $f$ sur $[0\\,;\\,+\\infty[$.<br>` +
            `Calculer la valeur exacte de $\\displaystyle\\int_{0}^{${T}} f(t)\\,dt$.`,
          corrige: `$\\displaystyle\\int_{0}^{${T}} f(t)\\,dt = F(${T}) - F(0)$.<br>` +
            `$F(${T}) = -${2 * a * T + 2 * b + 4 * a}\\,e^{-${0.5 * T}}$ et $F(0) = -${2 * b + 4 * a}$.<br>` +
            `Donc l'intégrale vaut $-${2 * a * T + 2 * b + 4 * a}\\,e^{-${0.5 * T}} + ${2 * b + 4 * a} = ${2 * b + 4 * a} - ${2 * a * T + 2 * b + 4 * a}\\,e^{-${0.5 * T}} \\approx ${dec(Math.round(I * 100) / 100)}$.`
        };
      }
    ];
    const v = pick(variantes)();
    return {
      enonce: v.enonce,
      corrige: v.corrige,
      rappel: `<strong>Primitive donnée par l'énoncé.</strong> Quand $F$ est admise comme primitive, on l'utilise directement : $\\int_a^b f = F(b) - F(a)$. On peut (et il est instructif de) vérifier que $F'(x) = f(x)$ en dérivant le produit $(\\alpha x^2 + \\beta x + \\gamma)\\,e^{kx}$.`
    };
  },

  // ============================================================
  // 3. rev_bac_int_ipp_polyexp
  // nv1 : ∫_0^B x e^(ax) (1 IPP simple)
  // nv2 : ∫_a^b (αx+β) e^(kx)
  // nv3 : ∫_0^B (αx²+βx) e^(kx) (2 IPP)
  // ============================================================
  rev_bac_int_ipp_polyexp: (d) => {
    if (d === 1) {
      const variantes = [
        () => {
          // ∫_0^1 x e^x dx = 1 (calibré sur Métropole)
          return {
            enonce: `À l'aide d'une intégration par parties, calculer $\\displaystyle\\int_{0}^{1} x\\,e^{x}\\,dx$. Donner la valeur exacte.`,
            corrige: `On pose $u(x) = x$ et $v'(x) = e^{x}$, d'où $u'(x) = 1$ et $v(x) = e^{x}$.<br>` +
              `$u$ et $v$ sont dérivables, de dérivées continues sur $[0\\,;\\,1]$. La formule d'IPP donne :<br>` +
              `$\\displaystyle\\int_{0}^{1} x\\,e^{x}\\,dx = \\big[x\\,e^{x}\\big]_{0}^{1} - \\int_{0}^{1} e^{x}\\,dx = e - \\big[e^{x}\\big]_{0}^{1} = e - (e - 1) = 1$.`
          };
        },
        () => {
          // ∫_0^B x e^(-x) dx (type Amérique du Nord J2 secours)
          const B = rand(1, 2);
          // F(x) = -x e^(-x) - e^(-x), val = F(B) - F(0) = -(B+1)e^(-B) + 1
          return {
            enonce: `À l'aide d'une intégration par parties, calculer $I = \\displaystyle\\int_{0}^{${B}} x\\,e^{-x}\\,dx$.`,
            corrige: `On pose $u(x) = x$ et $v'(x) = e^{-x}$, donc $u'(x) = 1$ et $v(x) = -e^{-x}$.<br>` +
              `Par IPP : $I = \\big[-x\\,e^{-x}\\big]_{0}^{${B}} - \\displaystyle\\int_{0}^{${B}} (-e^{-x})\\,dx = -${B}\\,e^{-${B}} + \\big[-e^{-x}\\big]_{0}^{${B}}$<br>` +
              `$= -${B}\\,e^{-${B}} - e^{-${B}} + 1 = 1 - ${B + 1}\\,e^{-${B}}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Intégration par parties.</strong> $\\displaystyle\\int_{a}^{b} u(x)\\,v'(x)\\,dx = \\big[u(x)\\,v(x)\\big]_{a}^{b} - \\int_{a}^{b} u'(x)\\,v(x)\\,dx$. Stratégie : choisir $u$ tel que $u'$ se simplifie (un polynôme à dériver) et $v'$ se primitive facilement (exponentielle).`
      };
    }

    if (d === 2) {
      const variantes = [
        () => {
          // ∫_0^1 (alpha x + beta) e^x dx
          // u = alpha x + beta, u' = alpha
          // v' = e^x, v = e^x
          // = [(alpha x + beta) e^x]_0^1 - alpha ∫_0^1 e^x dx
          // = (alpha + beta) e - beta - alpha (e - 1) = beta e - beta + alpha
          const alpha = rand(2, 3);  // 2 ou 3, évite "1x" cosmétique
          const beta = randNonZero(1, 3);
          return {
            enonce: `À l'aide d'une intégration par parties, calculer $\\displaystyle\\int_{0}^{1} (${alpha}x + ${beta})\\,e^{x}\\,dx$. Donner la valeur exacte.`,
            corrige: `On pose $u(x) = ${alpha}x + ${beta}$ et $v'(x) = e^{x}$, d'où $u'(x) = ${alpha}$ et $v(x) = e^{x}$.<br>` +
              `Par IPP : $\\displaystyle\\int_{0}^{1} (${alpha}x + ${beta})\\,e^{x}\\,dx = \\big[(${alpha}x + ${beta})\\,e^{x}\\big]_{0}^{1} - \\int_{0}^{1} ${alpha}\\,e^{x}\\,dx$<br>` +
              `$= ${alpha + beta}\\,e - ${beta} - ${alpha}\\big[e^{x}\\big]_{0}^{1} = ${alpha + beta}\\,e - ${beta} - ${alpha}(e - 1) = ${beta}\\,e ${_signeCoefVar(alpha - beta)}$.`
          };
        },
        () => {
          // ∫_0^B (alpha x + beta) e^(-x) dx
          // u = alpha x + beta, u' = alpha
          // v' = e^(-x), v = -e^(-x)
          // = [-(alpha x + beta) e^(-x)]_0^B + alpha ∫_0^B e^(-x) dx
          // = -(alpha B + beta) e^(-B) + beta + alpha [-e^(-x)]_0^B
          // = -(alpha B + beta) e^(-B) + beta - alpha e^(-B) + alpha
          // = -(alpha B + beta + alpha) e^(-B) + beta + alpha
          const alpha = rand(2, 3);
          const beta = randNonZero(1, 3);
          const B = rand(1, 2);
          return {
            enonce: `À l'aide d'une intégration par parties, calculer $\\displaystyle\\int_{0}^{${B}} (${alpha}x + ${beta})\\,e^{-x}\\,dx$.`,
            corrige: `On pose $u(x) = ${alpha}x + ${beta}$ et $v'(x) = e^{-x}$, donc $u'(x) = ${alpha}$ et $v(x) = -e^{-x}$.<br>` +
              `Par IPP : $\\displaystyle\\int_{0}^{${B}} (${alpha}x + ${beta})\\,e^{-x}\\,dx = \\big[-(${alpha}x + ${beta})\\,e^{-x}\\big]_{0}^{${B}} + \\int_{0}^{${B}} ${alpha}\\,e^{-x}\\,dx$<br>` +
              `$= -${alpha * B + beta}\\,e^{-${B}} + ${beta} + ${alpha}\\big[-e^{-x}\\big]_{0}^{${B}} = -${alpha * B + beta}\\,e^{-${B}} + ${beta} - ${alpha}\\,e^{-${B}} + ${alpha}$<br>` +
              `$= ${alpha + beta} - ${alpha * B + beta + alpha}\\,e^{-${B}}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>IPP avec $(ax+b)\\,e^{kx}$.</strong> On choisit toujours $u = ax+b$ (polynôme à dériver, sa dérivée se simplifie) et $v' = e^{kx}$ (s'intègre en $\\frac{1}{k}e^{kx}$). Bien gérer les signes pour $v' = e^{-x}$ donne $v = -e^{-x}$.`
      };
    }

    // d === 3 : double IPP avec polynôme degré 2
    const variantes = [
      () => {
        // ∫_0^1 x^2 e^(-x) dx - calibré sur sujets bac classiques
        // 1ère IPP : u = x², v' = e^(-x), u' = 2x, v = -e^(-x)
        // = [-x² e^(-x)]_0^1 + 2 ∫_0^1 x e^(-x) dx
        // ∫_0^1 x e^(-x) dx = 1 - 2/e (par IPP)
        // = -e^(-1) + 2(1 - 2/e) = -1/e + 2 - 4/e = 2 - 5/e
        return {
          enonce: `À l'aide de deux intégrations par parties successives, calculer $\\displaystyle\\int_{0}^{1} x^{2}\\,e^{-x}\\,dx$. Donner la valeur exacte.`,
          corrige: `<strong>Première IPP :</strong> on pose $u(x) = x^{2}$ et $v'(x) = e^{-x}$, donc $u'(x) = 2x$ et $v(x) = -e^{-x}$.<br>` +
            `$\\displaystyle\\int_{0}^{1} x^{2}\\,e^{-x}\\,dx = \\big[-x^{2}\\,e^{-x}\\big]_{0}^{1} + \\int_{0}^{1} 2x\\,e^{-x}\\,dx = -\\dfrac{1}{e} + 2\\int_{0}^{1} x\\,e^{-x}\\,dx$.<br>` +
            `<strong>Seconde IPP</strong> sur $\\int_{0}^{1} x\\,e^{-x}\\,dx$ : on pose $u(x) = x$ et $v'(x) = e^{-x}$, donc $u'(x) = 1$ et $v(x) = -e^{-x}$.<br>` +
            `$\\displaystyle\\int_{0}^{1} x\\,e^{-x}\\,dx = \\big[-x\\,e^{-x}\\big]_{0}^{1} + \\int_{0}^{1} e^{-x}\\,dx = -\\dfrac{1}{e} + \\big[-e^{-x}\\big]_{0}^{1} = -\\dfrac{1}{e} - \\dfrac{1}{e} + 1 = 1 - \\dfrac{2}{e}$.<br>` +
            `<strong>Conclusion :</strong> $\\displaystyle\\int_{0}^{1} x^{2}\\,e^{-x}\\,dx = -\\dfrac{1}{e} + 2\\left(1 - \\dfrac{2}{e}\\right) = 2 - \\dfrac{5}{e}$.`
        };
      },
      () => {
        // ∫_0^(π/2) e^x sin(x) dx (calibré sur Amérique du Nord J2 2025)
        // I = ∫ e^x sin(x), J = ∫ e^x cos(x)
        // IPP 1 sur I : u = sin(x), v' = e^x → I = [e^x sin(x)] - ∫ e^x cos(x) = e^(π/2) - J
        // IPP 2 sur I : u = e^x, v' = sin(x) → I = [-e^x cos(x)] + ∫ e^x cos(x) = 1 + J
        // Système : I = e^(π/2) - J et I = 1 + J → 2I = 1 + e^(π/2) → I = (1 + e^(π/2))/2
        return {
          enonce: `On pose $I = \\displaystyle\\int_{0}^{\\pi/2} e^{x}\\sin(x)\\,dx$ et $J = \\displaystyle\\int_{0}^{\\pi/2} e^{x}\\cos(x)\\,dx$.<br>` +
            `1. En intégrant par parties $I$ de deux manières différentes (d'abord avec $u = \\sin(x)$, puis avec $u = e^x$), établir que $I = e^{\\pi/2} - J$ et $I = 1 + J$.<br>` +
            `2. En déduire la valeur exacte de $I$.`,
          corrige: `<strong>Première IPP</strong> ($u = \\sin x$, $v' = e^{x}$, donc $u' = \\cos x$, $v = e^{x}$) :<br>` +
            `$I = \\big[e^{x}\\sin x\\big]_{0}^{\\pi/2} - \\displaystyle\\int_{0}^{\\pi/2} e^{x}\\cos x\\,dx = e^{\\pi/2} \\cdot 1 - 0 - J = e^{\\pi/2} - J$.<br>` +
            `<strong>Seconde IPP</strong> ($u = e^{x}$, $v' = \\sin x$, donc $u' = e^{x}$, $v = -\\cos x$) :<br>` +
            `$I = \\big[-e^{x}\\cos x\\big]_{0}^{\\pi/2} + \\displaystyle\\int_{0}^{\\pi/2} e^{x}\\cos x\\,dx = (0 - (-1)) + J = 1 + J$.<br>` +
            `<strong>Système :</strong> En additionnant les deux égalités, $2I = e^{\\pi/2} + 1$, donc $I = \\dfrac{1 + e^{\\pi/2}}{2}$.`
        };
      }
    ];
    const v = pick(variantes)();
    return {
      enonce: v.enonce,
      corrige: v.corrige,
      rappel: `<strong>Double IPP.</strong> Pour $\\int P(x)\\,e^{kx}\\,dx$ avec $P$ polynôme de degré 2, on applique l'IPP successivement (deux fois) en gardant $u$ = polynôme à chaque étape. Pour $\\int e^{x}\\sin(x)\\,dx$, deux IPP suivies d'une résolution de système donnent la valeur.`
    };
  },

  // ============================================================
  // 4. rev_bac_int_ipp_xln
  // nv1 : ∫_1^e ln(x) dx (= 1)
  // nv2 : ∫_1^e x ln(x) dx (= (e²+1)/4)
  // nv3 : ∫_1^e x² ln(x) dx ou ∫_1^e ln(x)/x² dx
  // ============================================================
  rev_bac_int_ipp_xln: (d) => {
    if (d === 1) {
      return {
        enonce: `À l'aide d'une intégration par parties, calculer $\\displaystyle\\int_{1}^{e} \\ln(x)\\,dx$. Donner la valeur exacte.`,
        corrige: `On pose $u(x) = \\ln(x)$ et $v'(x) = 1$, d'où $u'(x) = \\dfrac{1}{x}$ et $v(x) = x$.<br>` +
          `Par IPP : $\\displaystyle\\int_{1}^{e} \\ln(x)\\,dx = \\big[x\\,\\ln(x)\\big]_{1}^{e} - \\int_{1}^{e} x \\cdot \\dfrac{1}{x}\\,dx = (e \\cdot 1 - 0) - \\int_{1}^{e} 1\\,dx = e - (e - 1) = 1$.`,
        rappel: `<strong>Astuce IPP pour $\\ln$.</strong> Pour $\\int \\ln(x)\\,dx$ ou $\\int P(x)\\ln(x)\\,dx$, on pose toujours $u = \\ln(x)$ (qui se dérive en $\\frac{1}{x}$, simple) et $v' = $ le reste.`
      };
    }

    if (d === 2) {
      // ∫_1^e x ln(x) dx (calibré sur Métropole J1 2025 et Polynésie 2 sept.)
      return {
        enonce: `À l'aide d'une intégration par parties, montrer que $\\displaystyle\\int_{1}^{e} x\\,\\ln(x)\\,dx = \\dfrac{e^{2} + 1}{4}$.`,
        corrige: `On pose $u(x) = \\ln(x)$ et $v'(x) = x$, donc $u'(x) = \\dfrac{1}{x}$ et $v(x) = \\dfrac{x^{2}}{2}$.<br>` +
          `Par IPP : $\\displaystyle\\int_{1}^{e} x\\,\\ln(x)\\,dx = \\left[\\dfrac{x^{2}}{2}\\,\\ln(x)\\right]_{1}^{e} - \\int_{1}^{e} \\dfrac{x^{2}}{2} \\cdot \\dfrac{1}{x}\\,dx$<br>` +
          `$= \\dfrac{e^{2}}{2}\\ln(e) - \\dfrac{1}{2}\\ln(1) - \\dfrac{1}{2}\\int_{1}^{e} x\\,dx = \\dfrac{e^{2}}{2} - \\dfrac{1}{2}\\left[\\dfrac{x^{2}}{2}\\right]_{1}^{e}$<br>` +
          `$= \\dfrac{e^{2}}{2} - \\dfrac{1}{2}\\left(\\dfrac{e^{2}}{2} - \\dfrac{1}{2}\\right) = \\dfrac{e^{2}}{2} - \\dfrac{e^{2}}{4} + \\dfrac{1}{4} = \\dfrac{e^{2} + 1}{4}$.`,
        rappel: `<strong>IPP avec $x\\,\\ln(x)$.</strong> Choix obligé : $u = \\ln(x)$ et $v' = x$. La dérivée $u' = \\frac{1}{x}$ simplifie le $x$ qui apparaît dans $v = \\frac{x^2}{2}$, donnant une intégrale élémentaire.`
      };
    }

    // d === 3
    const variantes = [
      () => {
        // ∫_1^e x² ln(x) dx
        // u = ln(x), u' = 1/x ; v' = x², v = x³/3
        // = [x³/3 · ln(x)]_1^e - ∫_1^e x³/3 · 1/x dx
        // = e³/3 - 1/3 · ∫_1^e x² dx = e³/3 - 1/3 · [x³/3]_1^e = e³/3 - 1/3 · (e³ - 1)/3
        // = e³/3 - e³/9 + 1/9 = 3e³/9 - e³/9 + 1/9 = (2e³ + 1)/9
        return {
          enonce: `À l'aide d'une intégration par parties, montrer que $\\displaystyle\\int_{1}^{e} x^{2}\\,\\ln(x)\\,dx = \\dfrac{2\\,e^{3} + 1}{9}$.`,
          corrige: `On pose $u(x) = \\ln(x)$ et $v'(x) = x^{2}$, donc $u'(x) = \\dfrac{1}{x}$ et $v(x) = \\dfrac{x^{3}}{3}$.<br>` +
            `Par IPP : $\\displaystyle\\int_{1}^{e} x^{2}\\,\\ln(x)\\,dx = \\left[\\dfrac{x^{3}}{3}\\,\\ln(x)\\right]_{1}^{e} - \\int_{1}^{e} \\dfrac{x^{3}}{3} \\cdot \\dfrac{1}{x}\\,dx$<br>` +
            `$= \\dfrac{e^{3}}{3} - 0 - \\dfrac{1}{3}\\int_{1}^{e} x^{2}\\,dx = \\dfrac{e^{3}}{3} - \\dfrac{1}{3}\\left[\\dfrac{x^{3}}{3}\\right]_{1}^{e}$<br>` +
            `$= \\dfrac{e^{3}}{3} - \\dfrac{1}{3} \\cdot \\dfrac{e^{3} - 1}{3} = \\dfrac{3\\,e^{3} - (e^{3} - 1)}{9} = \\dfrac{2\\,e^{3} + 1}{9}$.`
        };
      },
      () => {
        // ∫_1^e x (ln x)² dx (calibré sur Métropole J1 2025)
        // Énoncé typique : on admet la valeur, on demande d'en déduire une aire
        // ∫_1^e x (ln x)² dx = (e² - 1)/4 (donné par le bac)
        return {
          enonce: `On admet que $\\displaystyle\\int_{1}^{e} x\\,(\\ln x)^{2}\\,dx = \\dfrac{e^{2} - 1}{4}$ et que $\\displaystyle\\int_{1}^{e} x\\,\\ln x\\,dx = \\dfrac{e^{2} + 1}{4}$.<br>` +
            `On considère $f(x) = x\\big[2(\\ln x)^{2} - 3\\ln x + 2\\big]$ pour $x > 0$, et la tangente $T_B$ à $\\mathcal{C}_f$ au point d'abscisse $e$, d'équation $y = 2x - e$.<br>` +
            `Calculer la valeur exacte de $\\mathcal{A} = \\displaystyle\\int_{1}^{e} \\big[f(x) - (2x - e)\\big]\\,dx$.`,
          corrige: `On développe : $f(x) - (2x - e) = 2x(\\ln x)^{2} - 3x\\ln x + 2x - 2x + e = 2x(\\ln x)^{2} - 3x\\ln x + e$.<br>` +
            `Par linéarité :<br>` +
            `$\\mathcal{A} = 2\\displaystyle\\int_{1}^{e} x(\\ln x)^{2}\\,dx - 3\\int_{1}^{e} x\\ln x\\,dx + e\\int_{1}^{e} 1\\,dx$<br>` +
            `$= 2 \\cdot \\dfrac{e^{2} - 1}{4} - 3 \\cdot \\dfrac{e^{2} + 1}{4} + e(e - 1) = \\dfrac{2e^{2} - 2 - 3e^{2} - 3}{4} + e^{2} - e$<br>` +
            `$= \\dfrac{-e^{2} - 5}{4} + e^{2} - e = \\dfrac{-e^{2} - 5 + 4e^{2} - 4e}{4} = \\dfrac{3e^{2} - 4e - 5}{4}$.`
        };
      }
    ];
    const v = pick(variantes)();
    return {
      enonce: v.enonce,
      corrige: v.corrige,
      rappel: `<strong>IPP avec $x^n\\,\\ln(x)$.</strong> On pose toujours $u = \\ln(x)$ et $v' = x^n$, ce qui donne $u' = \\frac{1}{x}$ et $v = \\frac{x^{n+1}}{n+1}$. Le facteur $\\frac{1}{x}$ se simplifie avec $x^{n+1}$ dans la seconde intégrale.`
    };
  },

  // ============================================================
  // 5. rev_bac_int_aire_courbes
  // nv1 : aire sous une courbe (f >= 0 donné)
  // nv2 : aire entre deux courbes polynomiales
  // nv3 : aire entre une courbe et sa tangente (cf Métropole J1 2025)
  // ============================================================
  rev_bac_int_aire_courbes: (d) => {
    if (d === 1) {
      const variantes = [
        () => {
          // f(x) = x² + a sur [0; B], avec a > 0 pour assurer f > 0
          // a >= 2 pour éviter "+ 1x" cosmétique dans le corrigé
          const a = rand(2, 4);
          const B = rand(2, 3);
          // aire = ∫_0^B (x² + a) dx = B³/3 + aB
          const aire = B * B * B / 3 + a * B;
          return {
            enonce: `Dans un repère orthonormé d'unité 1 cm, on considère la fonction $f$ définie sur $[0\\,;\\,${B}]$ par $f(x) = x^{2} + ${a}$. ` +
              `Calculer, en cm², l'aire $\\mathcal{A}$ du domaine délimité par la courbe $\\mathcal{C}_{f}$, l'axe des abscisses et les droites d'équations $x = 0$ et $x = ${B}$.`,
            corrige: `Pour tout $x \\in [0\\,;\\,${B}]$, $f(x) > 0$, donc l'aire vaut :<br>` +
              `$\\mathcal{A} = \\displaystyle\\int_{0}^{${B}} (x^{2} + ${a})\\,dx = \\left[\\dfrac{x^{3}}{3} + ${a}x\\right]_{0}^{${B}} = \\dfrac{${B}^{3}}{3} + ${a * B} = ${dec(Math.round(aire * 1000) / 1000)}$ cm².`
          };
        },
        () => {
          // f(x) = ln(x) sur [1; e] (aire = 1)
          return {
            enonce: `On considère la fonction $f(x) = \\ln(x)$ sur $[1\\,;\\,e]$. Calculer, en unité d'aire, l'aire du domaine délimité par $\\mathcal{C}_{f}$, l'axe des abscisses et la droite $x = e$.`,
            corrige: `Pour $x \\in [1\\,;\\,e]$, $\\ln(x) \\geqslant 0$. L'aire vaut $\\displaystyle\\int_{1}^{e} \\ln(x)\\,dx$.<br>` +
              `Par IPP avec $u(x) = \\ln(x)$ et $v'(x) = 1$ : $u'(x) = \\dfrac{1}{x}$, $v(x) = x$.<br>` +
              `$\\displaystyle\\int_{1}^{e} \\ln(x)\\,dx = \\big[x\\,\\ln(x)\\big]_{1}^{e} - \\int_{1}^{e} 1\\,dx = e - (e - 1) = 1$ u.a.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Aire sous une courbe.</strong> Si $f \\geqslant 0$ sur $[a\\,;\\,b]$, l'aire entre $\\mathcal{C}_f$ et l'axe des abscisses vaut $\\displaystyle\\int_a^b f(x)\\,dx$, en unité d'aire (u.a. = aire du rectangle unité défini par le repère).`
      };
    }

    if (d === 2) {
      // Aire entre deux courbes polynomiales
      const variantes = [
        () => {
          // f(x) = x + 2 et g(x) = x² sur [0; 2], f >= g sur [0; 2]
          // f - g = -x² + x + 2 = -(x-2)(x+1)
          // ∫_0^2 (-x² + x + 2) dx = -8/3 + 2 + 4 = 10/3
          return {
            enonce: `On considère deux fonctions $f$ et $g$ définies sur $[0\\,;\\,2]$ par $f(x) = x + 2$ et $g(x) = x^{2}$.<br>` +
              `Calculer l'aire, en unité d'aire, du domaine compris entre les courbes $\\mathcal{C}_{f}$ et $\\mathcal{C}_{g}$ sur $[0\\,;\\,2]$.`,
            corrige: `Sur $[0\\,;\\,2]$, $f(x) - g(x) = -x^{2} + x + 2 = -(x - 2)(x + 1)$. Comme $x - 2 \\leqslant 0$ et $x + 1 > 0$, on a $f(x) - g(x) \\geqslant 0$ : $\\mathcal{C}_{f}$ est au-dessus de $\\mathcal{C}_{g}$.<br>` +
              `Aire : $\\displaystyle\\int_{0}^{2} (f(x) - g(x))\\,dx = \\int_{0}^{2} (-x^{2} + x + 2)\\,dx = \\left[-\\dfrac{x^{3}}{3} + \\dfrac{x^{2}}{2} + 2x\\right]_{0}^{2}$<br>` +
              `$= -\\dfrac{8}{3} + 2 + 4 = \\dfrac{-8 + 18}{3} = \\dfrac{10}{3}$ u.a.`
          };
        },
        () => {
          // f(x) = 4 - x² et g(x) = x² sur [-? ;?], simplifier en [0; sqrt(2)]
          // Intersections : 4 - x² = x² <=> x² = 2 <=> x = ±√2
          // Sur [-√2, √2], f >= g, aire = ∫_(-√2)^(√2) (4 - 2x²) dx = 2 ∫_0^(√2) (4 - 2x²) dx
          // = 2 [4x - 2x³/3]_0^(√2) = 2 (4√2 - 2(2√2)/3) = 2(4√2 - 4√2/3) = 2 · 8√2/3 = 16√2/3
          return {
            enonce: `On considère les fonctions $f$ et $g$ définies sur $\\mathbb{R}$ par $f(x) = 4 - x^{2}$ et $g(x) = x^{2}$. ` +
              `Leurs courbes représentatives se coupent en deux points d'abscisses $-\\sqrt{2}$ et $\\sqrt{2}$. Calculer la valeur exacte de l'aire du domaine compris entre les deux courbes.`,
            corrige: `Sur $[-\\sqrt{2}\\,;\\,\\sqrt{2}]$, $f(x) - g(x) = 4 - 2x^{2} = -2(x^{2} - 2) \\geqslant 0$ : $\\mathcal{C}_{f}$ est au-dessus de $\\mathcal{C}_{g}$.<br>` +
              `Aire $= \\displaystyle\\int_{-\\sqrt{2}}^{\\sqrt{2}} (4 - 2x^{2})\\,dx$. La fonction étant paire, on calcule $2\\int_{0}^{\\sqrt{2}} (4 - 2x^{2})\\,dx$.<br>` +
              `$= 2\\left[4x - \\dfrac{2x^{3}}{3}\\right]_{0}^{\\sqrt{2}} = 2\\left(4\\sqrt{2} - \\dfrac{2 \\cdot 2\\sqrt{2}}{3}\\right) = 2\\left(4\\sqrt{2} - \\dfrac{4\\sqrt{2}}{3}\\right) = 2 \\cdot \\dfrac{8\\sqrt{2}}{3} = \\dfrac{16\\sqrt{2}}{3}$ u.a.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Aire entre deux courbes.</strong> Si $f \\geqslant g$ sur $[a\\,;\\,b]$, l'aire entre $\\mathcal{C}_f$ et $\\mathcal{C}_g$ vaut $\\displaystyle\\int_a^b (f - g)(x)\\,dx$. <strong>Étapes :</strong> (1) trouver les abscisses d'intersection, (2) étudier le signe de $f - g$, (3) intégrer.`
      };
    }

    // d === 3 : aire entre une courbe et sa tangente, calibré sur Amérique du Nord J2 ex.4 partie B
    return {
      enonce: `Soit $f(x) = e^{x}\\sin(x)$ sur $[0\\,;\\,\\pi]$ et $g(x) = x$ sur $\\mathbb{R}$. ` +
        `On admet que $\\displaystyle\\int_{0}^{\\pi/2} e^{x}\\sin(x)\\,dx = \\dfrac{1 + e^{\\pi/2}}{2}$ et que $f(x) \\geqslant g(x)$ sur $[0\\,;\\,\\pi/2]$.<br>` +
        `Calculer la valeur exacte de l'aire du domaine situé entre les courbes $\\mathcal{C}_{f}$ et $\\mathcal{C}_{g}$ et les droites d'équations $x = 0$ et $x = \\dfrac{\\pi}{2}$.`,
      corrige: `Comme $f \\geqslant g$ sur $[0\\,;\\,\\pi/2]$, l'aire vaut :<br>` +
        `$\\mathcal{A} = \\displaystyle\\int_{0}^{\\pi/2} \\big(f(x) - g(x)\\big)\\,dx = \\int_{0}^{\\pi/2} e^{x}\\sin(x)\\,dx - \\int_{0}^{\\pi/2} x\\,dx$.<br>` +
        `On calcule $\\displaystyle\\int_{0}^{\\pi/2} x\\,dx = \\left[\\dfrac{x^{2}}{2}\\right]_{0}^{\\pi/2} = \\dfrac{\\pi^{2}}{8}$.<br>` +
        `Donc $\\mathcal{A} = \\dfrac{1 + e^{\\pi/2}}{2} - \\dfrac{\\pi^{2}}{8}$ u.a.`,
      rappel: `<strong>Aire entre deux courbes (exo bac).</strong> Toujours : (1) justifier la position relative ($f \\geqslant g$ ou $f \\leqslant g$), (2) écrire l'aire comme $\\int (f - g)$, (3) utiliser la linéarité pour séparer en intégrales connues. Les résultats lourds (IPP, intégrales transcendantes) sont en général admis par l'énoncé.`
    };
  },

  // ============================================================
  // 6. rev_bac_int_moyenne_bac
  // nv1 : valeur moyenne d'exponentielle
  // nv2 : valeur moyenne d'une fonction rationnelle ou avec ln
  // nv3 : valeur moyenne nécessitant une IPP (cf Asie J2 2025)
  // ============================================================
  rev_bac_int_moyenne_bac: (d) => {
    if (d === 1) {
      const variantes = [
        () => {
          // f(t) = e^(-kt) sur [0, T], moyenne = (1 - e^(-kT))/(kT)
          const k = pick([2, 3, 4]);
          const T = rand(2, 4);
          return {
            enonce: `Soit $f$ définie sur $[0\\,;\\,${T}]$ par $f(t) = e^{-${k}\\,t}$. Calculer la valeur moyenne $\\mu$ de $f$ sur $[0\\,;\\,${T}]$. Donner la valeur exacte.`,
            corrige: `$\\mu = \\dfrac{1}{${T} - 0}\\displaystyle\\int_{0}^{${T}} e^{-${k}\\,t}\\,dt = \\dfrac{1}{${T}}\\left[-\\dfrac{1}{${k}}e^{-${k}\\,t}\\right]_{0}^{${T}} = \\dfrac{1}{${T}} \\times \\dfrac{1 - e^{-${k * T}}}{${k}} = \\dfrac{1 - e^{-${k * T}}}{${k * T}}$.`
          };
        },
        () => {
          // f(t) = a e^(-kt) + b sur [0, T] avec b > 0
          const a = pick([2, 3, 5]);
          const k = pick([2, 3]);
          const b = rand(1, 3);
          const T = rand(2, 3);
          // moyenne = (1/T) [a · (1 - e^(-kT))/k + bT]
          return {
            enonce: `Soit $f$ définie sur $[0\\,;\\,${T}]$ par $f(t) = ${a}\\,e^{-${k}\\,t} + ${b}$. Calculer la valeur moyenne de $f$ sur $[0\\,;\\,${T}]$. Donner la valeur exacte.`,
            corrige: `$\\mu = \\dfrac{1}{${T}}\\displaystyle\\int_{0}^{${T}} \\left(${a}\\,e^{-${k}\\,t} + ${b}\\right) dt = \\dfrac{1}{${T}}\\left[-\\dfrac{${a}}{${k}}e^{-${k}\\,t} + ${b}\\,t\\right]_{0}^{${T}}$<br>` +
              `$= \\dfrac{1}{${T}}\\left(-\\dfrac{${a}}{${k}}e^{-${k * T}} + ${b * T} + \\dfrac{${a}}{${k}}\\right) = \\dfrac{${a}(1 - e^{-${k * T}})}{${k * T}} + ${b}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Valeur moyenne.</strong> Sur $[a\\,;\\,b]$ avec $a \\neq b$ : $\\mu = \\dfrac{1}{b - a}\\displaystyle\\int_a^b f(t)\\,dt$. Géométriquement : hauteur du rectangle de base $[a\\,;\\,b]$ ayant la même aire que sous $\\mathcal{C}_f$.`
      };
    }

    if (d === 2) {
      const variantes = [
        () => {
          // f(t) = 1/(1 + t) sur [0, B] - moyenne = ln(1+B)/B
          const B = pick([2, 3, 4]);
          return {
            enonce: `Soit $f$ définie sur $[0\\,;\\,${B}]$ par $f(t) = \\dfrac{1}{1 + t}$. Calculer la valeur moyenne de $f$ sur cet intervalle. Donner la valeur exacte.`,
            corrige: `Une primitive de $\\dfrac{1}{1+t}$ est $\\ln(1 + t)$.<br>` +
              `$\\mu = \\dfrac{1}{${B}}\\displaystyle\\int_{0}^{${B}} \\dfrac{1}{1 + t}\\,dt = \\dfrac{1}{${B}}\\big[\\ln(1 + t)\\big]_{0}^{${B}} = \\dfrac{\\ln(${B + 1})}{${B}}$.`
          };
        },
        () => {
          // f(t) = e^(0,2t)/(1 + e^(0,2t)) sur [0; 40] - calibré sur Centres étrangers J2 2025
          // primitive : 5 ln(1 + e^(0,2t))
          // valeur moyenne sur [0; 40] : (1/40) · 5 · [ln(1+e^8) - ln(2)] = (1/8) · ln((1+e^8)/2)
          return {
            enonce: `Soit $f$ définie sur $[0\\,;\\,+\\infty[$ par $f(x) = \\dfrac{e^{0{,}2x}}{1 + e^{0{,}2x}}$. ` +
              `Calculer la valeur moyenne de $f$ sur $[0\\,;\\,40]$. Donner la valeur exacte.`,
            corrige: `On reconnaît la forme $\\dfrac{u'}{u}$ avec $u(x) = 1 + e^{0{,}2x}$ et $u'(x) = 0{,}2\\,e^{0{,}2x}$, donc $f(x) = \\dfrac{1}{0{,}2} \\cdot \\dfrac{u'(x)}{u(x)} = 5 \\cdot \\dfrac{u'(x)}{u(x)}$.<br>` +
              `Une primitive de $f$ est $F(x) = 5\\ln(1 + e^{0{,}2x})$.<br>` +
              `$\\mu = \\dfrac{1}{40}\\displaystyle\\int_{0}^{40} f(x)\\,dx = \\dfrac{1}{40}\\big[5\\ln(1 + e^{0{,}2x})\\big]_{0}^{40} = \\dfrac{1}{8}\\left[\\ln(1 + e^{8}) - \\ln(2)\\right] = \\dfrac{1}{8}\\ln\\!\\left(\\dfrac{1 + e^{8}}{2}\\right)$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Primitive de $\\dfrac{u'}{u}$.</strong> Si $u > 0$ : $\\displaystyle\\int \\dfrac{u'(x)}{u(x)}\\,dx = \\ln(u(x)) + C$. C'est très fréquent dans les sujets bac (modèle logistique notamment).`
      };
    }

    // d === 3 : valeur moyenne nécessitant une IPP, calibré sur Asie J2 2025
    return {
      enonce: `On considère la fonction $f$ définie sur $[0\\,;\\,10]$ par $f(t) = (60\\,t + 40)\\,e^{-0{,}5\\,t}$, modélisant la température (en °C) d'une réaction chimique en fonction du temps $t$ (en min).<br>` +
        `1. À l'aide d'une intégration par parties, montrer que $\\displaystyle\\int_{0}^{4} f(t)\\,dt = 320 - \\dfrac{800}{e^{2}}$.<br>` +
        `2. En déduire une valeur approchée, au degré Celsius près, de la température moyenne au cours des 4 premières minutes.`,
      corrige: `<strong>1.</strong> On pose $u(t) = 60t + 40$ et $v'(t) = e^{-0{,}5\\,t}$, d'où $u'(t) = 60$ et $v(t) = -2\\,e^{-0{,}5\\,t}$.<br>` +
        `Par IPP : $\\displaystyle\\int_{0}^{4} (60t + 40)\\,e^{-0{,}5\\,t}\\,dt = \\big[-2(60t + 40)\\,e^{-0{,}5\\,t}\\big]_{0}^{4} + \\int_{0}^{4} 120\\,e^{-0{,}5\\,t}\\,dt$.<br>` +
        `Pour le crochet : $-2(240 + 40)e^{-2} - (-2 \\cdot 40) = -560\\,e^{-2} + 80$.<br>` +
        `Pour l'intégrale restante : $\\displaystyle\\int_{0}^{4} 120\\,e^{-0{,}5\\,t}\\,dt = 120\\big[-2\\,e^{-0{,}5\\,t}\\big]_{0}^{4} = 120(-2\\,e^{-2} + 2) = -240\\,e^{-2} + 240$.<br>` +
        `Total : $80 - 560\\,e^{-2} + 240 - 240\\,e^{-2} = 320 - 800\\,e^{-2} = 320 - \\dfrac{800}{e^{2}}$. <br>` +
        `<strong>2.</strong> Température moyenne $= \\dfrac{1}{4}\\left(320 - \\dfrac{800}{e^{2}}\\right) = 80 - \\dfrac{200}{e^{2}} \\approx 80 - 27{,}07 \\approx 53$ °C.`,
      rappel: `<strong>Valeur moyenne + IPP.</strong> Quand l'intégrale nécessite une IPP (typique : $\\int (\\alpha t + \\beta)\\,e^{kt}\\,dt$), on la calcule séparément avant de diviser par $b - a$. Toujours bien noter $u, u', v, v'$ et appliquer la formule.`
    };
  },

  // ============================================================
  // 7. rev_bac_int_primitive_verif
  // Vérifier qu'une fonction donnée F est primitive de f (en dérivant F)
  // nv1 : F polynôme
  // nv2 : F = (alpha x + beta) e^(kx)
  // nv3 : F = (alpha x² + beta x + gamma) e^(kx)
  // ============================================================
  rev_bac_int_primitive_verif: (d) => {
    if (d === 1) {
      // F(x) = a x^3 + b x^2 + c x → F'(x) = 3a x^2 + 2b x + c
      const a = rand(2, 3);  // évite a=1 cosmétique sur ${a}x^3
      const b = randNonZero(-3, 3);
      const c = randNonZero(-4, 4);
      return {
        enonce: `On considère la fonction $F$ définie sur $\\mathbb{R}$ par $F(x) = ${a}x^{3} ${_signeCoefVar(b, 'x^{2}')} ${_signeCoefVar(c, 'x')}$. ` +
          `Vérifier que $F$ est une primitive sur $\\mathbb{R}$ de la fonction $f(x) = ${3 * a}x^{2} ${_signeCoefVar(2 * b, 'x')} ${_signeCoefVar(c)}$.`,
        corrige: `La fonction $F$ est dérivable sur $\\mathbb{R}$ comme polynôme. On calcule :<br>` +
          `$F'(x) = ${3 * a}x^{2} ${_signeCoefVar(2 * b, 'x')} ${_signeCoefVar(c)} = f(x)$.<br>` +
          `Donc $F$ est bien une primitive de $f$ sur $\\mathbb{R}$.`,
        rappel: `<strong>Vérification d'une primitive.</strong> Pour vérifier que $F$ est primitive de $f$, il suffit de calculer $F'$ et de vérifier que $F'(x) = f(x)$ sur l'intervalle considéré.`
      };
    }

    if (d === 2) {
      // F(x) = (alpha x + beta) e^(kx)
      // F'(x) = alpha · e^(kx) + (alpha x + beta) · k · e^(kx) = e^(kx) [k alpha x + (alpha + k beta)]
      const variantes = [
        () => {
          // F(x) = x e^x, f(x) = (x+1) e^x
          return {
            enonce: `Vérifier que la fonction $F$ définie sur $\\mathbb{R}$ par $F(x) = x\\,e^{x}$ est une primitive de $f(x) = (x + 1)\\,e^{x}$ sur $\\mathbb{R}$.`,
            corrige: `$F$ est dérivable sur $\\mathbb{R}$ (produit de fonctions dérivables). Avec la formule du produit $(uv)' = u'v + uv'$ où $u(x) = x$ et $v(x) = e^{x}$ :<br>` +
              `$F'(x) = 1 \\cdot e^{x} + x \\cdot e^{x} = (x + 1)\\,e^{x} = f(x)$.<br>` +
              `Donc $F$ est bien une primitive de $f$ sur $\\mathbb{R}$.`
          };
        },
        () => {
          // F(x) = (a x + b) e^(-x) avec coefficients fixes
          // F'(x) = a e^(-x) - (ax + b) e^(-x) = e^(-x) (a - ax - b) = e^(-x) (-ax + a - b)
          const a = rand(2, 3);  // évite a=1 cosmétique
          const b = randNonZero(1, 3);
          // f(x) = (-a x + a - b) e^(-x)
          const c1 = -a; // coef de x
          const c0 = a - b; // constante
          return {
            enonce: `On considère $F$ définie sur $\\mathbb{R}$ par $F(x) = (${a}x ${signe(b)})\\,e^{-x}$. ` +
              `Vérifier que $F$ est une primitive sur $\\mathbb{R}$ de $f(x) = (${c1}x ${signe(c0)})\\,e^{-x}$.`,
            corrige: `$F$ est dérivable sur $\\mathbb{R}$. Posons $u(x) = ${a}x ${signe(b)}$ et $v(x) = e^{-x}$ ; alors $u'(x) = ${a}$ et $v'(x) = -e^{-x}$.<br>` +
              `$F'(x) = u'v + uv' = ${a}\\,e^{-x} - (${a}x ${signe(b)})\\,e^{-x} = e^{-x}\\left[${a} - ${a}x ${signe(-b)}\\right] = e^{-x}\\left[${-a}x ${signe(a - b)}\\right] = f(x)$.<br>` +
              `Donc $F$ est bien une primitive de $f$ sur $\\mathbb{R}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Dérivée d'un produit $u \\cdot e^{kx}$.</strong> $(u\\,e^{kx})' = u'\\,e^{kx} + k\\,u\\,e^{kx} = (u' + k\\,u)\\,e^{kx}$. On factorise toujours par $e^{kx}$ qui ne s'annule jamais.`
      };
    }

    // d === 3 : F(x) = (alpha x² + beta x + gamma) e^(kx), calibré sur Amérique du Nord J1 2025
    return {
      enonce: `On considère $f$ définie sur $\\mathbb{R}$ par $f(x) = (x^{2} + 3x + 2)\\,e^{-x}$. ` +
        `Vérifier que $F(x) = (-x^{2} - 5x - 7)\\,e^{-x}$ est une primitive de $f$ sur $\\mathbb{R}$.`,
      corrige: `$F$ est dérivable sur $\\mathbb{R}$. Posons $u(x) = -x^{2} - 5x - 7$ et $v(x) = e^{-x}$, donc $u'(x) = -2x - 5$ et $v'(x) = -e^{-x}$.<br>` +
        `$F'(x) = u'v + uv' = (-2x - 5)\\,e^{-x} + (-x^{2} - 5x - 7)(-e^{-x})$<br>` +
        `$= e^{-x}\\big[(-2x - 5) + (x^{2} + 5x + 7)\\big] = e^{-x}(x^{2} + 3x + 2) = f(x)$.<br>` +
        `Donc $F$ est bien une primitive de $f$ sur $\\mathbb{R}$.`,
      rappel: `<strong>Vérification de primitive avec polynôme · exp.</strong> Dériver $(P(x)\\,e^{kx})$ avec la formule du produit donne $(P'(x) + k\\,P(x))\\,e^{kx}$. On regroupe les puissances de $x$ dans le crochet pour comparer à $f$.`
    };
  },

  // ============================================================
  // 8. rev_bac_int_encadrement
  // Encadrement d'intégrales et suite (I_n)
  // nv1 : encadrement de ∫ x^n sur [0;1]
  // nv2 : suite I_n = ∫_0^1 x^n e^(-x), monotonie, relation de récurrence
  // nv3 : encadrement avec limite (suite I_n converge vers 0)
  // ============================================================
  rev_bac_int_encadrement: (d) => {
    if (d === 1) {
      return {
        enonce: `Soit $n$ un entier naturel non nul. On pose $J_{n} = \\displaystyle\\int_{0}^{1} x^{n}\\,dx$.<br>` +
          `1. Calculer $J_{n}$ en fonction de $n$.<br>` +
          `2. Démontrer que pour tout $x \\in [0\\,;\\,1]$, on a $0 \\leqslant x^{n+1} \\leqslant x^{n}$.<br>` +
          `3. En déduire que la suite $(J_{n})$ est décroissante, puis sa limite.`,
        corrige: `<strong>1.</strong> $J_{n} = \\displaystyle\\int_{0}^{1} x^{n}\\,dx = \\left[\\dfrac{x^{n+1}}{n+1}\\right]_{0}^{1} = \\dfrac{1}{n+1}$.<br>` +
          `<strong>2.</strong> Pour $x \\in [0\\,;\\,1]$ et $n \\geqslant 1$ : $x^{n} \\geqslant 0$ et $0 \\leqslant x \\leqslant 1$, donc $x \\cdot x^{n} \\leqslant 1 \\cdot x^{n}$, soit $0 \\leqslant x^{n+1} \\leqslant x^{n}$.<br>` +
          `<strong>3.</strong> Par croissance de l'intégrale sur $[0\\,;\\,1]$ : $0 \\leqslant J_{n+1} \\leqslant J_{n}$, donc $(J_{n})$ est décroissante et minorée par $0$. Comme $J_{n} = \\dfrac{1}{n+1}$, $\\lim\\limits_{n \\to +\\infty} J_{n} = 0$.`,
        rappel: `<strong>Croissance de l'intégrale.</strong> Si $f \\leqslant g$ sur $[a\\,;\\,b]$ avec $a \\leqslant b$, alors $\\int_a^b f \\leqslant \\int_a^b g$. On l'utilise pour démontrer la monotonie d'une suite d'intégrales.`
      };
    }

    if (d === 2) {
      // Suite I_n = ∫_0^1 x^n e^(-x) dx avec relation de récurrence I_{n+1} = (n+1) I_n - 1/e
      // Calibré sur Polynésie J1 2025 ex.3
      return {
        enonce: `Pour tout entier naturel $n$, on pose $I_{n} = \\displaystyle\\int_{0}^{1} x^{n}\\,e^{-x}\\,dx$.<br>` +
          `1. Démontrer que pour tout $n \\in \\mathbb{N}$, $0 \\leqslant I_{n+1} \\leqslant I_{n}$.<br>` +
          `2. En déduire que la suite $(I_{n})$ est convergente.<br>` +
          `3. À l'aide d'une intégration par parties, démontrer que pour tout entier naturel $n$ : $I_{n+1} = (n+1)\\,I_{n} - \\dfrac{1}{e}$. (Indication : poser $u(x) = x^{n+1}$.)`,
        corrige: `<strong>1.</strong> Pour $x \\in [0\\,;\\,1]$ : $0 \\leqslant x^{n+1} \\leqslant x^{n}$ et $e^{-x} > 0$, donc $0 \\leqslant x^{n+1}\\,e^{-x} \\leqslant x^{n}\\,e^{-x}$. Par croissance de l'intégrale : $0 \\leqslant I_{n+1} \\leqslant I_{n}$.<br>` +
          `<strong>2.</strong> $(I_{n})$ est décroissante (d'après 1) et minorée par $0$, donc convergente.<br>` +
          `<strong>3.</strong> On pose $u(x) = x^{n+1}$ et $v'(x) = e^{-x}$, donc $u'(x) = (n+1)x^{n}$ et $v(x) = -e^{-x}$.<br>` +
          `Par IPP : $I_{n+1} = \\big[-x^{n+1}\\,e^{-x}\\big]_{0}^{1} + (n+1)\\displaystyle\\int_{0}^{1} x^{n}\\,e^{-x}\\,dx = -\\dfrac{1}{e} + (n+1)\\,I_{n}$.`,
        rappel: `<strong>Relation de récurrence sur une suite d'intégrales.</strong> Le mécanisme est toujours le même : une IPP bien choisie fait apparaître $I_{n}$ dans le second membre. Il faut typiquement choisir $u$ contenant la puissance de $x$.`
      };
    }

    // d === 3 : encadrement + limite (Polynésie J1 2025 fin)
    return {
      enonce: `Pour tout entier naturel $n$, on pose $I_{n} = \\displaystyle\\int_{0}^{1} x^{n}\\,e^{-x}\\,dx$.<br>` +
        `On admet que la suite $(I_{n})$ est convergente, de limite $\\ell$, et qu'elle vérifie la relation : pour tout $n \\in \\mathbb{N}$, $I_{n+1} = (n+1)\\,I_{n} - \\dfrac{1}{e}$.<br>` +
        `1. Démontrer que si $\\ell > 0$, l'égalité ci-dessus conduit à une contradiction.<br>` +
        `2. En déduire que $\\ell = 0$.`,
      corrige: `<strong>1.</strong> Supposons $\\ell > 0$. On passe à la limite dans l'égalité $I_{n+1} = (n+1)\\,I_{n} - \\dfrac{1}{e}$.<br>` +
        `Comme $I_{n} \\to \\ell$, le terme $(n+1)\\,I_{n}$ tend vers $+\\infty$ (produit de $n+1 \\to +\\infty$ par $\\ell > 0$). Donc $I_{n+1} \\to +\\infty$.<br>` +
        `Or $I_{n+1} \\to \\ell$ (même suite indexée), ce qui contredit $\\ell$ fini.<br>` +
        `<strong>2.</strong> Comme la suite $(I_{n})$ est minorée par $0$ (intégrale d'une fonction positive), on a $\\ell \\geqslant 0$. La question 1 exclut $\\ell > 0$, donc $\\ell = 0$.`,
      rappel: `<strong>Raisonnement par l'absurde sur une limite.</strong> Quand une suite définie par récurrence converge vers $\\ell$, on passe à la limite dans la relation de récurrence pour obtenir une équation sur $\\ell$. Si l'équation est incompatible avec une certaine valeur, on l'élimine.`
    };
  }

});


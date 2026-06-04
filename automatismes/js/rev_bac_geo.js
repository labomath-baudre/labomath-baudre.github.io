/* LaboMath — Générateurs annales bac (rev_bac_geo_*)
   Lot 5 : Géométrie dans l'espace — 7 générateurs, 3 niveaux chacun, variantes paramétrées.
   Calibrés sur les sujets bac Tle spé récents (APMEP).
   Compatible avec window.LM_GEN, helpers : pick, rand, randNonZero, signe, dec.

   Couverture :
   - Étude complète d'un tétraèdre OABC                   → rev_bac_geo_etude_tetra
   - Équation cartésienne d'un plan par 3 points           → rev_bac_geo_plan_3pts
   - Intersection droite-plan (résolution système)         → rev_bac_geo_intersection_dp
   - Distance d'un point à un plan + projeté orthogonal    → rev_bac_geo_distance_projete
   - Sphère : équation, intersection avec droite/plan      → rev_bac_geo_sphere
   - Position relative de deux droites                     → rev_bac_geo_position_relative
   - Droite perpendiculaire à un plan, plans perpend.      → rev_bac_geo_perpendicularite
*/

// Helpers locaux
// _geo_vec(x, y, z) : afficher un vecteur en notation $(x\,;\,y\,;\,z)$
const _geo_vec = (x, y, z) => `${x}\\,;\\,${y}\\,;\\,${z}`;
// Coefficient avec variable pour les équations de plan : "+ 3x", "- y", "+ z"
// pour le PREMIER terme : pas de "+", juste valeur ou "-"
const _geo_coefDebut = (n, varStr) => {
  if (n === 0) return '';
  if (n === 1) return varStr;
  if (n === -1) return `-${varStr}`;
  return `${n}${varStr}`;
};
// Pour les termes SUIVANTS dans une somme : avec signe explicite "+ 3x" ou "- 2y"
const _geo_coefSuite = (n, varStr) => {
  if (n === 0) return '';
  if (n === 1) return `+ ${varStr}`;
  if (n === -1) return `- ${varStr}`;
  return n > 0 ? `+ ${n}${varStr}` : `- ${-n}${varStr}`;
};
// Pour la constante seule (sans variable) : "+ 5" ou "- 3" ou ""
const _geo_constSuite = (n) => {
  if (n === 0) return '';
  return n > 0 ? `+ ${n}` : `- ${-n}`;
};
// Écrit l'équation ax + by + cz + d = 0 proprement
const _geo_eqPlan = (a, b, c, d) => {
  let eq = '';
  // 1er terme
  if (a !== 0) {
    eq = _geo_coefDebut(a, 'x');
    if (b !== 0) eq += ' ' + _geo_coefSuite(b, 'y');
    if (c !== 0) eq += ' ' + _geo_coefSuite(c, 'z');
  } else if (b !== 0) {
    eq = _geo_coefDebut(b, 'y');
    if (c !== 0) eq += ' ' + _geo_coefSuite(c, 'z');
  } else if (c !== 0) {
    eq = _geo_coefDebut(c, 'z');
  }
  if (d !== 0) eq += ' ' + _geo_constSuite(d);
  return eq + ' = 0';
};
// Norme d'un vecteur : ‖u‖ = √(x²+y²+z²)
const _geo_norme = (x, y, z) => Math.sqrt(x * x + y * y + z * z);
// Format d'un radical : √(n²) = n, √(simplifié) ou √n selon
const _geo_radical = (n2) => {
  // Cherche si n2 = a² × b avec b sans carré simplifiable
  if (n2 < 0) return 'NaN';
  if (n2 === 0) return '0';
  const sqrt = Math.sqrt(n2);
  if (Number.isInteger(sqrt)) return String(sqrt);
  return `\\sqrt{${n2}}`;
};
// Produit scalaire : u · v
const _geo_pscal = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
// Vecteur AB = B - A
const _geo_vecAB = (A, B) => [B[0] - A[0], B[1] - A[1], B[2] - A[2]];

Object.assign(window.LM_GEN ??= {}, {

  // ============================================================
  // 1. rev_bac_geo_etude_tetra
  // Étude complète d'un tétraèdre OABC
  // nv1 : vecteurs AB, AC, calcul produit scalaire
  // nv2 : + plan (ABC) avec vecteur normal donné, équation
  // nv3 : + distance, hauteur, volume
  // ============================================================
  rev_bac_geo_etude_tetra: (d) => {
    if (d === 1) {
      // O(0,0,0), A(2,0,0), B(0,3,0), C(0,0,4)
      // AB = (-2, 3, 0), AC = (-2, 0, 4), AB · AC = 4 + 0 + 0 = 4
      const variantes = [
        () => {
          const A = [2, 0, 0], B = [0, 3, 0], C = [0, 0, 4];
          const AB = _geo_vecAB(A, B);
          const AC = _geo_vecAB(A, C);
          const ps = _geo_pscal(AB, AC);
          return {
            enonce: `Dans l'espace muni d'un repère orthonormé $(O\\,;\\,\\vec{i}\\,,\\,\\vec{j}\\,,\\,\\vec{k})$, on considère les points $A(${_geo_vec(...A)})$, $B(${_geo_vec(...B)})$ et $C(${_geo_vec(...C)})$.<br>` +
              `1. Donner les coordonnées des vecteurs $\\vec{AB}$ et $\\vec{AC}$.<br>` +
              `2. Calculer $\\vec{AB} \\cdot \\vec{AC}$.<br>` +
              `3. Le triangle $ABC$ est-il rectangle en $A$ ? Justifier.`,
            corrige: `<strong>1.</strong> $\\vec{AB} = B - A = (${_geo_vec(...AB)})$ et $\\vec{AC} = C - A = (${_geo_vec(...AC)})$.<br>` +
              `<strong>2.</strong> $\\vec{AB} \\cdot \\vec{AC} = ${AB[0]} \\times ${AC[0]} + ${AB[1]} \\times ${AC[1]} + ${AB[2]} \\times ${AC[2]} = ${ps}$.<br>` +
              `<strong>3.</strong> $\\vec{AB} \\cdot \\vec{AC} = ${ps} ${ps === 0 ? '= 0' : '\\neq 0'}$, donc le triangle $ABC$ ${ps === 0 ? 'est' : "n'est pas"} rectangle en $A$.`
          };
        },
        () => {
          // Variante avec coordonnées différentes (triangle rectangle en A)
          const A = [1, 1, 0], B = [3, 1, 0], C = [1, 1, 5];
          const AB = _geo_vecAB(A, B); // (2, 0, 0)
          const AC = _geo_vecAB(A, C); // (0, 0, 5)
          const ps = _geo_pscal(AB, AC); // 0 → rectangle en A
          return {
            enonce: `Dans l'espace muni d'un repère orthonormé $(O\\,;\\,\\vec{i}\\,,\\,\\vec{j}\\,,\\,\\vec{k})$, on considère les points $A(${_geo_vec(...A)})$, $B(${_geo_vec(...B)})$ et $C(${_geo_vec(...C)})$.<br>` +
              `1. Donner les coordonnées des vecteurs $\\vec{AB}$ et $\\vec{AC}$.<br>` +
              `2. Calculer $\\vec{AB} \\cdot \\vec{AC}$.<br>` +
              `3. Le triangle $ABC$ est-il rectangle en $A$ ?`,
            corrige: `<strong>1.</strong> $\\vec{AB} = (${_geo_vec(...AB)})$ et $\\vec{AC} = (${_geo_vec(...AC)})$.<br>` +
              `<strong>2.</strong> $\\vec{AB} \\cdot \\vec{AC} = ${AB[0]} \\times ${AC[0]} + ${AB[1]} \\times ${AC[1]} + ${AB[2]} \\times ${AC[2]} = ${ps}$.<br>` +
              `<strong>3.</strong> $\\vec{AB} \\cdot \\vec{AC} = ${ps} = 0$, donc $\\vec{AB} \\perp \\vec{AC}$ : le triangle $ABC$ est rectangle en $A$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Produit scalaire dans l'espace.</strong> Si $\\vec{u}(x\\,;\\,y\\,;\\,z)$ et $\\vec{v}(x'\\,;\\,y'\\,;\\,z')$, alors $\\vec{u} \\cdot \\vec{v} = xx' + yy' + zz'$. Deux vecteurs non nuls sont orthogonaux si et seulement si leur produit scalaire est nul.`
      };
    }

    if (d === 2) {
      const variantes = [
        () => {
          // OABC sur axes : A(2,0,0), B(0,3,0), C(0,0,4) → n=(6,4,3), équation 6x+4y+3z-12=0
          return {
            enonce: `Dans un repère orthonormé, on considère les points $A(2\\,;\\,0\\,;\\,0)$, $B(0\\,;\\,3\\,;\\,0)$ et $C(0\\,;\\,0\\,;\\,4)$. ` +
              `Soit $\\vec{n}(6\\,;\\,4\\,;\\,3)$.<br>` +
              `1. Démontrer que $\\vec{n}$ est un vecteur normal au plan $(ABC)$.<br>` +
              `2. En déduire une équation cartésienne du plan $(ABC)$.`,
            corrige: `<strong>1.</strong> $\\vec{AB} = (-2\\,;\\,3\\,;\\,0)$ et $\\vec{AC} = (-2\\,;\\,0\\,;\\,4)$.<br>` +
              `$\\vec{n} \\cdot \\vec{AB} = 6 \\times (-2) + 4 \\times 3 + 3 \\times 0 = -12 + 12 + 0 = 0$.<br>` +
              `$\\vec{n} \\cdot \\vec{AC} = 6 \\times (-2) + 4 \\times 0 + 3 \\times 4 = -12 + 0 + 12 = 0$.<br>` +
              `$\\vec{n}$ est orthogonal à deux vecteurs non colinéaires du plan $(ABC)$, donc $\\vec{n}$ est un vecteur normal à ce plan.<br>` +
              `<strong>2.</strong> Une équation cartésienne du plan est de la forme $6x + 4y + 3z + d = 0$. Comme $A(2\\,;\\,0\\,;\\,0)$ appartient au plan : $6 \\times 2 + 4 \\times 0 + 3 \\times 0 + d = 0$, donc $d = -12$.<br>` +
              `Équation cartésienne : $6x + 4y + 3z - 12 = 0$.`
          };
        },
        () => {
          // Tétraèdre dans un cube ABCDEFGH : repère (A;AB,AD,AE)
          // A(0,0,0), B(1,0,0), D(0,1,0), E(0,0,1), C(1,1,0), F(1,0,1), G(1,1,1), H(0,1,1)
          // Étude du tétraèdre ABDE : pas intéressant.
          // Plan (BDE) : B(1,0,0), D(0,1,0), E(0,0,1). DB=(1,-1,0), DE=(0,-1,1)
          // n=(1,1,1) candidat : n·DB = 1-1+0 = 0 ✓, n·DE = 0-1+1 = 0 ✓
          // Équation : x+y+z+d = 0. B(1,0,0) : 1+d=0 → d=-1
          // Équation : x+y+z-1 = 0
          return {
            enonce: `Dans un cube $ABCDEFGH$ d'arête $1$, on choisit le repère orthonormé $(A\\,;\\,\\vec{AB}, \\vec{AD}, \\vec{AE})$. ` +
              `Dans ce repère, les sommets ont pour coordonnées $A(0\\,;\\,0\\,;\\,0)$, $B(1\\,;\\,0\\,;\\,0)$, $D(0\\,;\\,1\\,;\\,0)$ et $E(0\\,;\\,0\\,;\\,1)$.<br>` +
              `Soit $\\vec{n}(1\\,;\\,1\\,;\\,1)$.<br>` +
              `1. Démontrer que $\\vec{n}$ est un vecteur normal au plan $(BDE)$.<br>` +
              `2. En déduire une équation cartésienne du plan $(BDE)$.`,
            corrige: `<strong>1.</strong> $\\vec{DB} = (1\\,;\\,-1\\,;\\,0)$ et $\\vec{DE} = (0\\,;\\,-1\\,;\\,1)$.<br>` +
              `$\\vec{n} \\cdot \\vec{DB} = 1 \\times 1 + 1 \\times (-1) + 1 \\times 0 = 0$.<br>` +
              `$\\vec{n} \\cdot \\vec{DE} = 1 \\times 0 + 1 \\times (-1) + 1 \\times 1 = 0$.<br>` +
              `$\\vec{n}$ est orthogonal à deux vecteurs non colinéaires du plan $(BDE)$, donc $\\vec{n}$ est normal à ce plan.<br>` +
              `<strong>2.</strong> Une équation du plan est $x + y + z + d = 0$. Comme $B(1\\,;\\,0\\,;\\,0) \\in (BDE)$ : $1 + 0 + 0 + d = 0$, donc $d = -1$.<br>` +
              `Équation cartésienne : $x + y + z - 1 = 0$.`
          };
        },
        () => {
          // OABC sur axes différents : A(3,0,0), B(0,2,0), C(0,0,4)
          // AB=(-3,2,0), AC=(-3,0,4), n=(8,12,6) ou simplifié (4,6,3)
          // Vérif : (4,6,3)·(-3,2,0) = -12+12+0 = 0 ✓, (4,6,3)·(-3,0,4) = -12+0+12 = 0 ✓
          // Équation : 4x+6y+3z+d=0, A(3,0,0) : 12+d=0 → d=-12
          return {
            enonce: `Dans un repère orthonormé, on considère les points $A(3\\,;\\,0\\,;\\,0)$, $B(0\\,;\\,2\\,;\\,0)$ et $C(0\\,;\\,0\\,;\\,4)$. ` +
              `Soit $\\vec{n}(4\\,;\\,6\\,;\\,3)$.<br>` +
              `1. Démontrer que $\\vec{n}$ est un vecteur normal au plan $(ABC)$.<br>` +
              `2. En déduire une équation cartésienne du plan $(ABC)$.`,
            corrige: `<strong>1.</strong> $\\vec{AB} = (-3\\,;\\,2\\,;\\,0)$ et $\\vec{AC} = (-3\\,;\\,0\\,;\\,4)$.<br>` +
              `$\\vec{n} \\cdot \\vec{AB} = 4 \\times (-3) + 6 \\times 2 + 3 \\times 0 = -12 + 12 + 0 = 0$.<br>` +
              `$\\vec{n} \\cdot \\vec{AC} = 4 \\times (-3) + 6 \\times 0 + 3 \\times 4 = -12 + 0 + 12 = 0$.<br>` +
              `$\\vec{n}$ est orthogonal à deux vecteurs non colinéaires du plan, donc $\\vec{n}$ est normal à $(ABC)$.<br>` +
              `<strong>2.</strong> Équation de la forme $4x + 6y + 3z + d = 0$. Avec $A(3\\,;\\,0\\,;\\,0)$ : $12 + d = 0$, donc $d = -12$.<br>` +
              `Équation cartésienne : $4x + 6y + 3z - 12 = 0$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Vecteur normal et équation cartésienne d'un plan.</strong> Si $\\vec{n}(a\\,;\\,b\\,;\\,c)$ est normal au plan $\\mathcal{P}$, alors $\\mathcal{P}$ a une équation cartésienne de la forme $ax + by + cz + d = 0$. La valeur de $d$ se calcule en injectant les coordonnées d'un point du plan.`
      };
    }

    // d === 3 : étude complète (volume) — 2 variantes
    const variantes3 = [
      () => {
        // OABC(2,3,4) : V=4, équation 6x+4y+3z-12=0, distance OH=12/√61, aire(ABC)=√61
        return {
          enonce: `Dans un repère orthonormé $(O\\,;\\,\\vec{i}\\,,\\,\\vec{j}\\,,\\,\\vec{k})$, on considère les points $A(2\\,;\\,0\\,;\\,0)$, $B(0\\,;\\,3\\,;\\,0)$, $C(0\\,;\\,0\\,;\\,4)$. ` +
            `On admet que le plan $(ABC)$ a pour équation cartésienne $6x + 4y + 3z - 12 = 0$.<br>` +
            `1. Calculer la distance $OH$ du point $O$ au plan $(ABC)$, où $H$ est le projeté orthogonal de $O$ sur $(ABC)$.<br>` +
            `2. Calculer le volume du tétraèdre $OABC$ en utilisant le triangle $OAB$ (rectangle en $O$) comme base.<br>` +
            `3. En déduire l'aire du triangle $ABC$.`,
          corrige: `<strong>1.</strong> $OH = \\dfrac{|6 \\times 0 + 4 \\times 0 + 3 \\times 0 - 12|}{\\sqrt{6^{2} + 4^{2} + 3^{2}}} = \\dfrac{12}{\\sqrt{61}}$.<br>` +
            `<strong>2.</strong> Le triangle $OAB$ est rectangle en $O$ (car $OA \\perp OB$ : ils sont sur les axes). ` +
            `Aire$(OAB) = \\dfrac{1}{2} \\times OA \\times OB = \\dfrac{1}{2} \\times 2 \\times 3 = 3$. ` +
            `La hauteur du tétraèdre depuis $C$ vers le plan $(OAB)$ est $OC = 4$. ` +
            `Donc $V_{OABC} = \\dfrac{1}{3} \\times 3 \\times 4 = 4$.<br>` +
            `<strong>3.</strong> Le même volume, avec la base $ABC$ et la hauteur $OH$ : $V = \\dfrac{1}{3} \\times \\text{aire}(ABC) \\times OH$. ` +
            `Donc $\\text{aire}(ABC) = \\dfrac{3V}{OH} = \\dfrac{3 \\times 4}{12/\\sqrt{61}} = \\dfrac{12 \\sqrt{61}}{12} = \\sqrt{61}$.`
        };
      },
      () => {
        // OABC(3,2,4) : V=4, équation 4x+6y+3z-12=0, distance OH=12/√61, aire(ABC)=√61
        // Wait, c'est la même formule de distance (juste permutation des axes). C'est moins intéressant.
        // Prenons OABC(2,2,3) : V=2, équation 6x+6y+4z-12=0 ou 3x+3y+2z-6=0
        // Distance OH = |0-6|/√(9+9+4) = 6/√22
        // Aire(ABC) = 3V/OH = 6/(6/√22) = √22
        // C'est plus intéressant comme variante.
        return {
          enonce: `Dans un repère orthonormé $(O\\,;\\,\\vec{i}\\,,\\,\\vec{j}\\,,\\,\\vec{k})$, on considère les points $A(2\\,;\\,0\\,;\\,0)$, $B(0\\,;\\,2\\,;\\,0)$, $C(0\\,;\\,0\\,;\\,3)$. ` +
            `On admet que le plan $(ABC)$ a pour équation cartésienne $3x + 3y + 2z - 6 = 0$.<br>` +
            `1. Calculer la distance $OH$ du point $O$ au plan $(ABC)$, où $H$ est le projeté orthogonal de $O$ sur $(ABC)$.<br>` +
            `2. Calculer le volume du tétraèdre $OABC$ en utilisant le triangle $OAB$ comme base.<br>` +
            `3. En déduire l'aire du triangle $ABC$.`,
          corrige: `<strong>1.</strong> $OH = \\dfrac{|3 \\times 0 + 3 \\times 0 + 2 \\times 0 - 6|}{\\sqrt{3^{2} + 3^{2} + 2^{2}}} = \\dfrac{6}{\\sqrt{22}}$.<br>` +
            `<strong>2.</strong> Aire$(OAB) = \\dfrac{1}{2} \\times 2 \\times 2 = 2$. Hauteur depuis $C$ = $OC = 3$. ` +
            `Donc $V_{OABC} = \\dfrac{1}{3} \\times 2 \\times 3 = 2$.<br>` +
            `<strong>3.</strong> $\\text{aire}(ABC) = \\dfrac{3V}{OH} = \\dfrac{3 \\times 2}{6/\\sqrt{22}} = \\dfrac{6\\sqrt{22}}{6} = \\sqrt{22}$.`
        };
      },
      () => {
        // Tétraèdre dans un cube ABCDEFGH d'arête 1
        // Repère (A; AB, AD, AE) → A(0,0,0), B(1,0,0), D(0,1,0), E(0,0,1), G(1,1,1)
        // Tétraèdre BDEG : très intéressant
        // Mais simplifions : tétraèdre ABDE (sommets adjacents à A)
        // A(0,0,0), B(1,0,0), D(0,1,0), E(0,0,1)
        // Plan (BDE) : x+y+z-1=0
        // Distance A à (BDE) : |0+0+0-1|/√3 = 1/√3
        // Volume tétraèdre ABDE = 1/6 |det(AB,AD,AE)| = 1/6 |1| = 1/6 (cas trivial)
        // Mieux : tétraèdre BCEG ou similaire ? Trop complexe.
        // Allons simple : tétraèdre ABDE, vérifier les volumes.
        return {
          enonce: `Dans un cube $ABCDEFGH$ d'arête $1$, on choisit le repère $(A\\,;\\,\\vec{AB}, \\vec{AD}, \\vec{AE})$. ` +
            `Dans ce repère, $A(0\\,;\\,0\\,;\\,0)$, $B(1\\,;\\,0\\,;\\,0)$, $D(0\\,;\\,1\\,;\\,0)$ et $E(0\\,;\\,0\\,;\\,1)$.<br>` +
            `On admet que le plan $(BDE)$ a pour équation $x + y + z - 1 = 0$.<br>` +
            `1. Calculer la distance $AH$ du point $A$ au plan $(BDE)$.<br>` +
            `2. Calculer le volume du tétraèdre $ABDE$ en utilisant le triangle $ABD$ comme base.<br>` +
            `3. En déduire l'aire du triangle $BDE$.`,
          corrige: `<strong>1.</strong> $AH = \\dfrac{|0 + 0 + 0 - 1|}{\\sqrt{1 + 1 + 1}} = \\dfrac{1}{\\sqrt{3}} = \\dfrac{\\sqrt{3}}{3}$.<br>` +
            `<strong>2.</strong> $ABD$ est rectangle en $A$, donc aire$(ABD) = \\dfrac{1}{2} \\times 1 \\times 1 = \\dfrac{1}{2}$. ` +
            `Hauteur depuis $E$ vers $(ABD)$ = $AE = 1$. ` +
            `Donc $V_{ABDE} = \\dfrac{1}{3} \\times \\dfrac{1}{2} \\times 1 = \\dfrac{1}{6}$.<br>` +
            `<strong>3.</strong> $\\text{aire}(BDE) = \\dfrac{3V}{AH} = \\dfrac{3 \\times \\dfrac{1}{6}}{\\dfrac{1}{\\sqrt{3}}} = \\dfrac{\\sqrt{3}}{2}$.<br>` +
            `(On reconnaît l'aire d'un triangle équilatéral de côté $\\sqrt{2}$ : $BDE$ est en effet équilatéral car $BD = DE = BE = \\sqrt{2}$.)`
        };
      }
    ];
    const v3 = pick(variantes3)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Volume d'un tétraèdre par deux méthodes.</strong> En calculant le volume de deux façons (avec deux bases différentes), on obtient une équation qui permet de trouver une aire ou une hauteur inconnue. Méthode classique au bac pour déterminer l'aire d'une face « oblique » d'un tétraèdre.`
    };
  },

  // ============================================================
  // 2. rev_bac_geo_plan_3pts
  // Équation cartésienne d'un plan par 3 points
  // nv1 : vérifier qu'un vecteur n donné est normal, en déduire l'équation
  // nv2 : déterminer un vecteur normal par système, puis l'équation
  // nv3 : combinaison + vérifier qu'un point appartient au plan
  // ============================================================
  rev_bac_geo_plan_3pts: (d) => {
    if (d === 1) {
      // Variantes : vérifier qu'un vecteur n donné est normal au plan (ABC)
      const variantes = [
        () => {
          // A(1,0,2), B(2,1,0), C(0,3,1), n=(5,3,4), d=-13
          const A = [1, 0, 2], B = [2, 1, 0], C = [0, 3, 1];
          const AB = _geo_vecAB(A, B);
          const AC = _geo_vecAB(A, C);
          const n = [5, 3, 4];
          const dPlan = -(n[0] * A[0] + n[1] * A[1] + n[2] * A[2]);
          return {
            enonce: `Dans l'espace muni d'un repère orthonormé, on considère $A(${_geo_vec(...A)})$, $B(${_geo_vec(...B)})$, $C(${_geo_vec(...C)})$.<br>` +
              `1. Montrer que le vecteur $\\vec{n}(${_geo_vec(...n)})$ est normal au plan $(ABC)$.<br>` +
              `2. En déduire une équation cartésienne du plan $(ABC)$.`,
            corrige: `<strong>1.</strong> $\\vec{AB} = (${_geo_vec(...AB)})$ et $\\vec{AC} = (${_geo_vec(...AC)})$.<br>` +
              `$\\vec{n} \\cdot \\vec{AB} = ${n[0]} \\times ${AB[0]} + ${n[1]} \\times ${AB[1]} + ${n[2]} \\times ${AB[2]} = ${n[0] * AB[0]} ${_geo_constSuite(n[1] * AB[1])} ${_geo_constSuite(n[2] * AB[2])} = 0$.<br>` +
              `$\\vec{n} \\cdot \\vec{AC} = ${n[0]} \\times ${AC[0]} + ${n[1]} \\times ${AC[1]} + ${n[2]} \\times ${AC[2]} = ${n[0] * AC[0]} ${_geo_constSuite(n[1] * AC[1])} ${_geo_constSuite(n[2] * AC[2])} = 0$.<br>` +
              `$\\vec{n}$ est orthogonal à deux vecteurs non colinéaires du plan $(ABC)$, donc $\\vec{n}$ est un vecteur normal à ce plan.<br>` +
              `<strong>2.</strong> Le plan a une équation de la forme $${_geo_eqPlan(n[0], n[1], n[2], 0).replace(' = 0', '')} + d = 0$. ` +
              `Comme $A(${_geo_vec(...A)})$ appartient au plan : $${n[0] * A[0] + n[1] * A[1] + n[2] * A[2]} + d = 0$, donc $d = ${dPlan}$.<br>` +
              `Équation cartésienne : $${_geo_eqPlan(n[0], n[1], n[2], dPlan)}$.`
          };
        },
        () => {
          // A(2,0,1), B(0,3,2), C(1,1,3), n=(5,3,1), d=-11
          // AB=(-2,3,1), AC=(-1,1,2). Vérif : (5,3,1)·(-2,3,1) = -10+9+1=0 ✓, (5,3,1)·(-1,1,2) = -5+3+2=0 ✓
          const A = [2, 0, 1], B = [0, 3, 2], C = [1, 1, 3];
          const AB = _geo_vecAB(A, B);
          const AC = _geo_vecAB(A, C);
          const n = [5, 3, 1];
          const dPlan = -(n[0] * A[0] + n[1] * A[1] + n[2] * A[2]);
          return {
            enonce: `Dans l'espace muni d'un repère orthonormé, on considère $A(${_geo_vec(...A)})$, $B(${_geo_vec(...B)})$, $C(${_geo_vec(...C)})$.<br>` +
              `1. Montrer que le vecteur $\\vec{n}(${_geo_vec(...n)})$ est normal au plan $(ABC)$.<br>` +
              `2. En déduire une équation cartésienne du plan $(ABC)$.`,
            corrige: `<strong>1.</strong> $\\vec{AB} = (${_geo_vec(...AB)})$ et $\\vec{AC} = (${_geo_vec(...AC)})$.<br>` +
              `$\\vec{n} \\cdot \\vec{AB} = ${n[0]} \\times (${AB[0]}) + ${n[1]} \\times ${AB[1]} + ${n[2]} \\times ${AB[2]} = ${n[0] * AB[0]} ${_geo_constSuite(n[1] * AB[1])} ${_geo_constSuite(n[2] * AB[2])} = 0$.<br>` +
              `$\\vec{n} \\cdot \\vec{AC} = ${n[0]} \\times (${AC[0]}) + ${n[1]} \\times ${AC[1]} + ${n[2]} \\times ${AC[2]} = ${n[0] * AC[0]} ${_geo_constSuite(n[1] * AC[1])} ${_geo_constSuite(n[2] * AC[2])} = 0$.<br>` +
              `$\\vec{n}$ est orthogonal à deux vecteurs non colinéaires du plan $(ABC)$, donc $\\vec{n}$ est un vecteur normal à ce plan.<br>` +
              `<strong>2.</strong> Équation de la forme $${_geo_eqPlan(n[0], n[1], n[2], 0).replace(' = 0', '')} + d = 0$. Avec $A(${_geo_vec(...A)})$ : $${n[0] * A[0] + n[1] * A[1] + n[2] * A[2]} + d = 0$, donc $d = ${dPlan}$.<br>` +
              `Équation cartésienne : $${_geo_eqPlan(n[0], n[1], n[2], dPlan)}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Méthode pour déterminer une équation de plan.</strong> (1) Trouver un vecteur normal $\\vec{n}(a\\,;\\,b\\,;\\,c)$ ; (2) écrire l'équation sous la forme $ax + by + cz + d = 0$ ; (3) calculer $d$ en injectant les coordonnées d'un point du plan.`
      };
    }

    if (d === 2) {
      // Variantes : déterminer un vecteur normal par système
      const variantes = [
        () => {
          // A(1,2,0), B(2,0,1), C(0,1,2) → n=(1,1,1), x+y+z-3=0
          return {
            enonce: `Dans l'espace muni d'un repère orthonormé, on considère les points $A(1\\,;\\,2\\,;\\,0)$, $B(2\\,;\\,0\\,;\\,1)$ et $C(0\\,;\\,1\\,;\\,2)$.<br>` +
              `1. Donner les coordonnées des vecteurs $\\vec{AB}$ et $\\vec{AC}$.<br>` +
              `2. Déterminer les coordonnées d'un vecteur $\\vec{n}$ normal au plan $(ABC)$. (Indication : résoudre le système $\\vec{n} \\cdot \\vec{AB} = 0$ et $\\vec{n} \\cdot \\vec{AC} = 0$.)<br>` +
              `3. En déduire une équation cartésienne du plan $(ABC)$.`,
            corrige: `<strong>1.</strong> $\\vec{AB} = (1\\,;\\,-2\\,;\\,1)$ et $\\vec{AC} = (-1\\,;\\,-1\\,;\\,2)$.<br>` +
              `<strong>2.</strong> Soit $\\vec{n}(a\\,;\\,b\\,;\\,c)$. Les conditions $\\vec{n} \\cdot \\vec{AB} = 0$ et $\\vec{n} \\cdot \\vec{AC} = 0$ donnent :<br>` +
              `$\\begin{cases} a - 2b + c = 0 \\\\ -a - b + 2c = 0 \\end{cases}$.<br>` +
              `En additionnant : $-3b + 3c = 0$, donc $b = c$.<br>` +
              `En reportant dans la première : $a - 2b + b = 0$, donc $a = b$.<br>` +
              `Donc $a = b = c$ : le vecteur $\\vec{n}(1\\,;\\,1\\,;\\,1)$ convient.<br>` +
              `<strong>3.</strong> Équation de la forme $x + y + z + d = 0$. $A(1\\,;\\,2\\,;\\,0)$ donne $1 + 2 + 0 + d = 0$, donc $d = -3$.<br>` +
              `Équation cartésienne : $x + y + z - 3 = 0$.`
          };
        },
        () => {
          // A(2,1,0), B(3,0,2), C(1,2,1)
          // AB=(1,-1,2), AC=(-1,1,1)
          // Système : a-b+2c=0, -a+b+c=0
          // Sum : 3c=0 → c=0, et a=b. Donc n=(1,1,0)
          // Équation : x+y+d=0, A(2,1,0) : 3+d=0 → d=-3
          return {
            enonce: `Dans l'espace muni d'un repère orthonormé, on considère les points $A(2\\,;\\,1\\,;\\,0)$, $B(3\\,;\\,0\\,;\\,2)$ et $C(1\\,;\\,2\\,;\\,1)$.<br>` +
              `1. Donner les coordonnées des vecteurs $\\vec{AB}$ et $\\vec{AC}$.<br>` +
              `2. Déterminer les coordonnées d'un vecteur $\\vec{n}$ normal au plan $(ABC)$.<br>` +
              `3. En déduire une équation cartésienne du plan $(ABC)$.`,
            corrige: `<strong>1.</strong> $\\vec{AB} = (1\\,;\\,-1\\,;\\,2)$ et $\\vec{AC} = (-1\\,;\\,1\\,;\\,1)$.<br>` +
              `<strong>2.</strong> Soit $\\vec{n}(a\\,;\\,b\\,;\\,c)$. Le système $\\vec{n} \\cdot \\vec{AB} = 0$ et $\\vec{n} \\cdot \\vec{AC} = 0$ donne :<br>` +
              `$\\begin{cases} a - b + 2c = 0 \\\\ -a + b + c = 0 \\end{cases}$.<br>` +
              `En additionnant : $3c = 0$, donc $c = 0$.<br>` +
              `En reportant : $a - b = 0$, donc $a = b$.<br>` +
              `Le vecteur $\\vec{n}(1\\,;\\,1\\,;\\,0)$ convient.<br>` +
              `<strong>3.</strong> Équation de la forme $x + y + d = 0$. $A(2\\,;\\,1\\,;\\,0)$ donne $2 + 1 + d = 0$, donc $d = -3$.<br>` +
              `Équation cartésienne : $x + y - 3 = 0$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Trouver un vecteur normal par système.</strong> Si $\\vec{u}$ et $\\vec{v}$ sont deux vecteurs non colinéaires du plan, alors $\\vec{n}$ est normal si et seulement si $\\vec{n} \\cdot \\vec{u} = 0$ et $\\vec{n} \\cdot \\vec{v} = 0$.`
      };
    }

    // d === 3 : équation + appartenance + distance, 2 variantes
    const variantes = [
      () => {
        return {
          enonce: `Dans un repère orthonormé, on considère les points $A(1\\,;\\,1\\,;\\,2)$, $B(3\\,;\\,2\\,;\\,1)$, $C(0\\,;\\,3\\,;\\,4)$ et $D(2\\,;\\,4\\,;\\,5)$.<br>` +
            `On admet que le vecteur $\\vec{n}(4\\,;\\,5\\,;\\,3)$ est normal au plan $(ABC)$.<br>` +
            `1. Déterminer une équation cartésienne du plan $(ABC)$.<br>` +
            `2. Le point $D$ appartient-il au plan $(ABC)$ ? Justifier.<br>` +
            `3. Si non, calculer la distance de $D$ au plan $(ABC)$.`,
          corrige: `<strong>1.</strong> Équation de la forme $4x + 5y + 3z + d = 0$. Avec $A(1\\,;\\,1\\,;\\,2)$ : $4 + 5 + 6 + d = 0$, donc $d = -15$.<br>` +
            `Équation cartésienne : $4x + 5y + 3z - 15 = 0$.<br>` +
            `<strong>2.</strong> Pour $D(2\\,;\\,4\\,;\\,5)$ : $4 \\times 2 + 5 \\times 4 + 3 \\times 5 - 15 = 8 + 20 + 15 - 15 = 28 \\neq 0$. Donc $D \\notin (ABC)$.<br>` +
            `<strong>3.</strong> $d(D, (ABC)) = \\dfrac{|28|}{\\sqrt{4^{2} + 5^{2} + 3^{2}}} = \\dfrac{28}{\\sqrt{50}} = \\dfrac{28}{5\\sqrt{2}} = \\dfrac{14\\sqrt{2}}{5}$.`
        };
      },
      () => {
        // A(2,0,1), B(1,2,0), C(3,1,2), D(1,2,3)
        // AB=(-1,2,-1), AC=(1,1,1)
        // n par système : -a+2b-c=0, a+b+c=0. Sum : 3b=0 → b=0, a=-c. Donc n=(1,0,-1)
        // d : 1·2 + 0·0 + (-1)·1 + d = 0 → d = -1
        // Équation : x - z - 1 = 0
        // D(1,2,3) : 1 - 3 - 1 = -3 ≠ 0, distance = 3/√2 = 3√2/2
        return {
          enonce: `Dans un repère orthonormé, on considère les points $A(2\\,;\\,0\\,;\\,1)$, $B(1\\,;\\,2\\,;\\,0)$, $C(3\\,;\\,1\\,;\\,2)$ et $D(1\\,;\\,2\\,;\\,3)$.<br>` +
            `On admet que le vecteur $\\vec{n}(1\\,;\\,0\\,;\\,-1)$ est normal au plan $(ABC)$.<br>` +
            `1. Déterminer une équation cartésienne du plan $(ABC)$.<br>` +
            `2. Le point $D$ appartient-il au plan $(ABC)$ ? Justifier.<br>` +
            `3. Si non, calculer la distance de $D$ au plan $(ABC)$.`,
          corrige: `<strong>1.</strong> Équation de la forme $x - z + d = 0$. Avec $A(2\\,;\\,0\\,;\\,1)$ : $2 - 1 + d = 0$, donc $d = -1$.<br>` +
            `Équation cartésienne : $x - z - 1 = 0$.<br>` +
            `<strong>2.</strong> Pour $D(1\\,;\\,2\\,;\\,3)$ : $1 - 3 - 1 = -3 \\neq 0$. Donc $D \\notin (ABC)$.<br>` +
            `<strong>3.</strong> $d(D, (ABC)) = \\dfrac{|-3|}{\\sqrt{1^{2} + 0^{2} + (-1)^{2}}} = \\dfrac{3}{\\sqrt{2}} = \\dfrac{3\\sqrt{2}}{2}$.`
        };
      }
    ];
    const v = pick(variantes)();
    return {
      enonce: v.enonce,
      corrige: v.corrige,
      rappel: `<strong>Distance d'un point à un plan.</strong> Si $\\mathcal{P} : ax + by + cz + d = 0$ et $M(x_0\\,;\\,y_0\\,;\\,z_0)$, alors $d(M, \\mathcal{P}) = \\dfrac{|ax_0 + by_0 + cz_0 + d|}{\\sqrt{a^{2} + b^{2} + c^{2}}}$.`
    };
  },

  // ============================================================
  // 3. rev_bac_geo_intersection_dp
  // Intersection droite-plan : résolution par substitution
  // nv1 : intersection simple, calcul direct
  // nv2 : avec étude de l'unicité de la solution
  // nv3 : cas où la droite est dans le plan ou parallèle
  // ============================================================
  rev_bac_geo_intersection_dp: (d) => {
    if (d === 1) {
      // Variantes intersection simple : substitution directe
      const variantes = [
        () => ({
          enonce: `Dans un repère orthonormé, on considère le plan $\\mathcal{P} : x + y + z - 3 = 0$ et la droite $\\mathcal{D}$ de représentation paramétrique :<br>` +
            `$\\begin{cases} x = 1 + t \\\\ y = 1 - t \\\\ z = t \\end{cases}$ avec $t \\in \\mathbb{R}$.<br>` +
            `Déterminer les coordonnées du point d'intersection de $\\mathcal{D}$ et $\\mathcal{P}$.`,
          corrige: `On substitue dans l'équation de $\\mathcal{P}$ :<br>` +
            `$(1 + t) + (1 - t) + t - 3 = 0$, soit $-1 + t = 0$, donc $t = 1$.<br>` +
            `Le point d'intersection a pour coordonnées $(2\\,;\\,0\\,;\\,1)$.`
        }),
        () => ({
          // x+y+z-5=0, droite (1+t, 2-t, t+1) → t=1, point (2,1,2)
          enonce: `Dans un repère orthonormé, on considère le plan $\\mathcal{P} : x + y + z - 5 = 0$ et la droite $\\mathcal{D}$ de représentation paramétrique :<br>` +
            `$\\begin{cases} x = 1 + t \\\\ y = 2 - t \\\\ z = 1 + t \\end{cases}$ avec $t \\in \\mathbb{R}$.<br>` +
            `Déterminer les coordonnées du point d'intersection de $\\mathcal{D}$ et $\\mathcal{P}$.`,
          corrige: `On substitue dans l'équation de $\\mathcal{P}$ :<br>` +
            `$(1 + t) + (2 - t) + (1 + t) - 5 = 0$, soit $t - 1 = 0$, donc $t = 1$.<br>` +
            `Le point d'intersection a pour coordonnées $(2\\,;\\,1\\,;\\,2)$.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Méthode d'intersection droite-plan.</strong> On substitue les expressions paramétriques de la droite ($x(t)$, $y(t)$, $z(t)$) dans l'équation cartésienne du plan, puis on résout pour $t$. La valeur trouvée donne le paramètre du point d'intersection.`
      };
    }

    if (d === 2) {
      // Variantes : tester sécance + intersection avec produit scalaire
      const variantes = [
        () => ({
          enonce: `Dans un repère orthonormé, on considère le plan $\\mathcal{P} : 3x - 2y + z - 6 = 0$ et la droite $\\mathcal{D}$ passant par $A(1\\,;\\,0\\,;\\,2)$ et de vecteur directeur $\\vec{u}(1\\,;\\,1\\,;\\,0)$.<br>` +
            `1. Donner une représentation paramétrique de $\\mathcal{D}$.<br>` +
            `2. Démontrer que $\\mathcal{D}$ et $\\mathcal{P}$ sont sécants. Déterminer les coordonnées de leur point d'intersection.`,
          corrige: `<strong>1.</strong> $\\mathcal{D} : \\begin{cases} x = 1 + t \\\\ y = t \\\\ z = 2 \\end{cases}$ avec $t \\in \\mathbb{R}$.<br>` +
            `<strong>2.</strong> Un vecteur normal au plan est $\\vec{n}(3\\,;\\,-2\\,;\\,1)$. $\\vec{n} \\cdot \\vec{u} = 3 - 2 + 0 = 1 \\neq 0$. ` +
            `Donc $\\mathcal{D}$ et $\\mathcal{P}$ sont sécants.<br>` +
            `Substitution : $3(1 + t) - 2t + 2 - 6 = 0$, soit $t - 1 = 0$, donc $t = 1$.<br>` +
            `Point d'intersection : $(2\\,;\\,1\\,;\\,2)$.`
        }),
        () => ({
          // Plan 2x-y+z-1=0, droite via A(0,1,2) et u(1,1,0). Param (t, 1+t, 2).
          // n·u = (2,-1,1)·(1,1,0) = 2-1+0=1 ≠ 0, sécants
          // Sub : 2t-(1+t)+2-1 = 2t-t-1+2-1 = t = 0 → t=0, point (0,1,2). C'est le point A déjà.
          // Mauvais. Essayons d'autre : A(0,1,2), u(1,2,1). Param (t, 1+2t, 2+t).
          // n·u = (2,-1,1)·(1,2,1) = 2-2+1 = 1 ≠ 0
          // Sub : 2t-(1+2t)+(2+t)-1 = 2t-2t+t-1+2-1 = t = 0 → t=0, point (0,1,2). Mauvais encore.
          // Changeons : Plan x+2y-z-3=0, A(1,1,1), u(1,1,2). Param (1+t, 1+t, 1+2t).
          // n·u = (1,2,-1)·(1,1,2) = 1+2-2=1 ≠ 0
          // Sub : (1+t)+2(1+t)-(1+2t)-3 = 1+t+2+2t-1-2t-3 = t-1 = 0 → t=1
          // Point (2, 2, 3). Vérif sub 2+4-3-3=0 ✓
          enonce: `Dans un repère orthonormé, on considère le plan $\\mathcal{P} : x + 2y - z - 3 = 0$ et la droite $\\mathcal{D}$ passant par $A(1\\,;\\,1\\,;\\,1)$ et de vecteur directeur $\\vec{u}(1\\,;\\,1\\,;\\,2)$.<br>` +
            `1. Donner une représentation paramétrique de $\\mathcal{D}$.<br>` +
            `2. Démontrer que $\\mathcal{D}$ et $\\mathcal{P}$ sont sécants. Déterminer les coordonnées de leur point d'intersection.`,
          corrige: `<strong>1.</strong> $\\mathcal{D} : \\begin{cases} x = 1 + t \\\\ y = 1 + t \\\\ z = 1 + 2t \\end{cases}$ avec $t \\in \\mathbb{R}$.<br>` +
            `<strong>2.</strong> Un vecteur normal au plan est $\\vec{n}(1\\,;\\,2\\,;\\,-1)$. $\\vec{n} \\cdot \\vec{u} = 1 + 2 - 2 = 1 \\neq 0$. Donc $\\mathcal{D}$ et $\\mathcal{P}$ sont sécants.<br>` +
            `Substitution : $(1 + t) + 2(1 + t) - (1 + 2t) - 3 = 1 + t + 2 + 2t - 1 - 2t - 3 = t - 1 = 0$, donc $t = 1$.<br>` +
            `Point d'intersection : $(2\\,;\\,2\\,;\\,3)$.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Position relative droite-plan.</strong> Soit $\\vec{u}$ un vecteur directeur de la droite et $\\vec{n}$ un vecteur normal au plan. Si $\\vec{u} \\cdot \\vec{n} = 0$, la droite est parallèle au plan (ou incluse) ; sinon, sécante en exactement un point.`
      };
    }

    // d === 3 : variantes (parallèle, sécant, inclus)
    const variantes = [
      () => ({
        // Cas inclus
        enonce: `Dans un repère orthonormé, on considère le plan $\\mathcal{P} : x + y + 2z - 4 = 0$ et la droite $\\mathcal{D}$ de représentation paramétrique :<br>` +
          `$\\begin{cases} x = 1 + 2t \\\\ y = 1 - 2t \\\\ z = 1 \\end{cases}$ avec $t \\in \\mathbb{R}$.<br>` +
          `1. Donner un vecteur directeur $\\vec{u}$ de $\\mathcal{D}$ et un vecteur normal $\\vec{n}$ de $\\mathcal{P}$.<br>` +
          `2. Calculer $\\vec{u} \\cdot \\vec{n}$. En déduire la position relative de $\\mathcal{D}$ et $\\mathcal{P}$.<br>` +
          `3. La droite $\\mathcal{D}$ est-elle incluse dans $\\mathcal{P}$ ? Justifier.`,
        corrige: `<strong>1.</strong> $\\vec{u}(2\\,;\\,-2\\,;\\,0)$ et $\\vec{n}(1\\,;\\,1\\,;\\,2)$.<br>` +
          `<strong>2.</strong> $\\vec{u} \\cdot \\vec{n} = 2 - 2 + 0 = 0$. Donc $\\mathcal{D}$ est parallèle à $\\mathcal{P}$ (ou incluse).<br>` +
          `<strong>3.</strong> Test d'un point : $A(1\\,;\\,1\\,;\\,1) \\in \\mathcal{D}$ pour $t = 0$. Vérif : $1 + 1 + 2 - 4 = 0$, donc $A \\in \\mathcal{P}$.<br>` +
          `Comme $\\mathcal{D}$ est parallèle à $\\mathcal{P}$ et a un point commun avec lui, $\\mathcal{D} \\subset \\mathcal{P}$ : la droite est <strong>incluse</strong>.`
      }),
      () => ({
        // Cas strictement parallèle
        // Plan 2x-y+z-3=0, droite A(1,0,2), u(1,2,0). Param (1+t, 2t, 2)
        // n·u = (2,-1,1)·(1,2,0) = 2-2+0 = 0 → parallèle ou inclus
        // A(1,0,2) : 2-0+2-3 = 1 ≠ 0 → A pas dans le plan → strictement parallèle
        enonce: `Dans un repère orthonormé, on considère le plan $\\mathcal{P} : 2x - y + z - 3 = 0$ et la droite $\\mathcal{D}$ de représentation paramétrique :<br>` +
          `$\\begin{cases} x = 1 + t \\\\ y = 2t \\\\ z = 2 \\end{cases}$ avec $t \\in \\mathbb{R}$.<br>` +
          `1. Donner un vecteur directeur $\\vec{u}$ de $\\mathcal{D}$ et un vecteur normal $\\vec{n}$ de $\\mathcal{P}$.<br>` +
          `2. Calculer $\\vec{u} \\cdot \\vec{n}$. En déduire la position relative.<br>` +
          `3. La droite est-elle incluse dans le plan ? Justifier.`,
        corrige: `<strong>1.</strong> $\\vec{u}(1\\,;\\,2\\,;\\,0)$ et $\\vec{n}(2\\,;\\,-1\\,;\\,1)$.<br>` +
          `<strong>2.</strong> $\\vec{u} \\cdot \\vec{n} = 2 - 2 + 0 = 0$. Donc $\\mathcal{D}$ est parallèle à $\\mathcal{P}$ (ou incluse).<br>` +
          `<strong>3.</strong> Test d'un point : $A(1\\,;\\,0\\,;\\,2) \\in \\mathcal{D}$ pour $t = 0$. Vérif : $2 \\times 1 - 0 + 2 - 3 = 1 \\neq 0$, donc $A \\notin \\mathcal{P}$.<br>` +
          `$\\mathcal{D}$ est parallèle à $\\mathcal{P}$ sans point commun, donc <strong>strictement parallèle</strong> au plan.`
      })
    ];
    const v3 = pick(variantes)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Trois cas de position relative.</strong> (1) $\\vec{u} \\cdot \\vec{n} \\neq 0$ : sécants en un point. (2) $\\vec{u} \\cdot \\vec{n} = 0$ et un point de $\\mathcal{D}$ n'est pas dans $\\mathcal{P}$ : strictement parallèles. (3) $\\vec{u} \\cdot \\vec{n} = 0$ et un point commun : $\\mathcal{D}$ incluse.`
    };
  },

  // ============================================================
  // 4. rev_bac_geo_distance_projete
  // Distance d'un point à un plan + projeté orthogonal
  // nv1 : distance par formule directe
  // nv2 : + déterminer le projeté orthogonal
  // nv3 : étude complète avec géométrie
  // ============================================================
  rev_bac_geo_distance_projete: (d) => {
    if (d === 1) {
      // Variantes : distance par formule directe
      const variantes = [
        () => {
          // 2x+y-2z-6=0, A(1,2,0). d = 2/3
          const a = 2, b = 1, c = -2, dPlan = -6;
          const A = [1, 2, 0];
          const num = Math.abs(a * A[0] + b * A[1] + c * A[2] + dPlan);
          const denomSquared = a * a + b * b + c * c;
          const denom = Math.sqrt(denomSquared);
          return {
            enonce: `Dans un repère orthonormé, on considère le plan $\\mathcal{P} : ${_geo_eqPlan(a, b, c, dPlan)}$ et le point $A(${_geo_vec(...A)})$.<br>` +
              `Calculer la distance de $A$ au plan $\\mathcal{P}$.`,
            corrige: `Formule : $d(A, \\mathcal{P}) = \\dfrac{|a x_A + b y_A + c z_A + d|}{\\sqrt{a^2 + b^2 + c^2}}$.<br>` +
              `Numérateur : $|${a} \\times ${A[0]} ${_geo_constSuite(b * A[1])} ${_geo_constSuite(c * A[2])} ${_geo_constSuite(dPlan)}| = ${num}$.<br>` +
              `Dénominateur : $\\sqrt{${a}^{2} + ${b}^{2} + (${c})^{2}} = \\sqrt{${denomSquared}} = ${denom}$.<br>` +
              `$d(A, \\mathcal{P}) = \\dfrac{${num}}{${denom}}$.`
          };
        },
        () => {
          // x-2y+2z+1=0, A(3,1,2). |3-2+4+1|/√(1+4+4) = 6/3 = 2
          const a = 1, b = -2, c = 2, dPlan = 1;
          const A = [3, 1, 2];
          const num = Math.abs(a * A[0] + b * A[1] + c * A[2] + dPlan);
          const denomSquared = a * a + b * b + c * c;
          const denom = Math.sqrt(denomSquared);
          return {
            enonce: `Dans un repère orthonormé, on considère le plan $\\mathcal{P} : ${_geo_eqPlan(a, b, c, dPlan)}$ et le point $A(${_geo_vec(...A)})$.<br>` +
              `Calculer la distance de $A$ au plan $\\mathcal{P}$.`,
            corrige: `Formule : $d(A, \\mathcal{P}) = \\dfrac{|a x_A + b y_A + c z_A + d|}{\\sqrt{a^2 + b^2 + c^2}}$.<br>` +
              `Numérateur : $|${a * A[0]} ${_geo_constSuite(b * A[1])} ${_geo_constSuite(c * A[2])} ${_geo_constSuite(dPlan)}| = ${num}$.<br>` +
              `Dénominateur : $\\sqrt{${a}^{2} + (${b})^{2} + ${c}^{2}} = \\sqrt{${denomSquared}} = ${denom}$.<br>` +
              `$d(A, \\mathcal{P}) = \\dfrac{${num}}{${denom}} = ${num / denom}$.`
          };
        }
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Formule de la distance point-plan.</strong> Si $\\mathcal{P} : ax + by + cz + d = 0$ et $M(x_0\\,;\\,y_0\\,;\\,z_0)$, alors $d(M, \\mathcal{P}) = \\dfrac{|a x_0 + b y_0 + c z_0 + d|}{\\sqrt{a^{2} + b^{2} + c^{2}}}$.`
      };
    }

    if (d === 2) {
      // Variantes : distance + projeté orthogonal
      const variantes = [
        () => ({
          // x+y+z-6=0, A(2,0,1). d=√3, H=(3,1,2), t=1
          enonce: `Dans un repère orthonormé, on considère le plan $\\mathcal{P} : x + y + z - 6 = 0$ et le point $A(2\\,;\\,0\\,;\\,1)$.<br>` +
            `1. Calculer la distance de $A$ au plan $\\mathcal{P}$.<br>` +
            `2. Déterminer les coordonnées du projeté orthogonal $H$ de $A$ sur $\\mathcal{P}$. (Indication : $H = A + t\\,\\vec{n}$ pour un certain $t \\in \\mathbb{R}$.)`,
          corrige: `<strong>1.</strong> $d(A, \\mathcal{P}) = \\dfrac{|2 + 0 + 1 - 6|}{\\sqrt{1 + 1 + 1}} = \\dfrac{3}{\\sqrt{3}} = \\sqrt{3}$.<br>` +
            `<strong>2.</strong> Vecteur normal $\\vec{n}(1\\,;\\,1\\,;\\,1)$. Posons $H = A + t\\,\\vec{n} = (2 + t\\,;\\,t\\,;\\,1 + t)$ avec $H \\in \\mathcal{P}$ :<br>` +
            `$(2 + t) + t + (1 + t) - 6 = 0$, soit $3t - 3 = 0$, donc $t = 1$.<br>` +
            `Le projeté est $H(3\\,;\\,1\\,;\\,2)$. Vérification : $AH = \\sqrt{1 + 1 + 1} = \\sqrt{3}$. ✓`
        }),
        () => ({
          // 2x-y+2z-3=0, A(1,2,0). d = |2-2+0-3|/√9 = 3/3 = 1
          // H = A + t·n = (1+2t, 2-t, 2t). 2(1+2t)-(2-t)+2(2t)-3 = 2+4t-2+t+4t-3 = 9t-3 = 0 → t=1/3
          // H = (1+2/3, 2-1/3, 2/3) = (5/3, 5/3, 2/3)
          enonce: `Dans un repère orthonormé, on considère le plan $\\mathcal{P} : 2x - y + 2z - 3 = 0$ et le point $A(1\\,;\\,2\\,;\\,0)$.<br>` +
            `1. Calculer la distance de $A$ au plan $\\mathcal{P}$.<br>` +
            `2. Déterminer les coordonnées du projeté orthogonal $H$ de $A$ sur $\\mathcal{P}$.`,
          corrige: `<strong>1.</strong> $d(A, \\mathcal{P}) = \\dfrac{|2 \\times 1 - 2 + 0 - 3|}{\\sqrt{4 + 1 + 4}} = \\dfrac{3}{3} = 1$.<br>` +
            `<strong>2.</strong> Vecteur normal $\\vec{n}(2\\,;\\,-1\\,;\\,2)$. Posons $H = A + t\\,\\vec{n} = (1 + 2t\\,;\\,2 - t\\,;\\,2t)$ avec $H \\in \\mathcal{P}$ :<br>` +
            `$2(1 + 2t) - (2 - t) + 2(2t) - 3 = 2 + 4t - 2 + t + 4t - 3 = 9t - 3 = 0$, donc $t = \\dfrac{1}{3}$.<br>` +
            `Le projeté est $H\\left(\\dfrac{5}{3}\\,;\\,\\dfrac{5}{3}\\,;\\,\\dfrac{2}{3}\\right)$.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Projeté orthogonal sur un plan.</strong> Le projeté $H$ de $A$ sur $\\mathcal{P}$ est l'intersection de $\\mathcal{P}$ avec la droite $(A, \\vec{n})$. Méthode : écrire $H = A + t\\,\\vec{n}$, puis injecter dans l'équation du plan pour déterminer $t$.`
      };
    }

    // d === 3 : étude complète, 2 variantes
    const variantes = [
      () => ({
        enonce: `Dans un repère orthonormé, on considère le plan $\\mathcal{P} : 2x - 2y + z - 3 = 0$, les points $A(3\\,;\\,1\\,;\\,2)$ et $B(1\\,;\\,3\\,;\\,4)$.<br>` +
          `1. Calculer la distance de $A$ au plan $\\mathcal{P}$.<br>` +
          `2. Déterminer les coordonnées du projeté orthogonal $H$ de $A$ sur $\\mathcal{P}$.<br>` +
          `3. Le point $B$ appartient-il au plan $\\mathcal{P}$ ?`,
        corrige: `<strong>1.</strong> $d(A, \\mathcal{P}) = \\dfrac{|6 - 2 + 2 - 3|}{\\sqrt{4 + 4 + 1}} = \\dfrac{3}{3} = 1$.<br>` +
          `<strong>2.</strong> $\\vec{n}(2\\,;\\,-2\\,;\\,1)$, $H = (3 + 2t\\,;\\,1 - 2t\\,;\\,2 + t)$ avec $2(3 + 2t) - 2(1 - 2t) + (2 + t) - 3 = 0$, soit $9t + 3 = 0$, donc $t = -\\dfrac{1}{3}$.<br>` +
          `$H = \\left(\\dfrac{7}{3}\\,;\\,\\dfrac{5}{3}\\,;\\,\\dfrac{5}{3}\\right)$.<br>` +
          `<strong>3.</strong> Pour $B$ : $2 - 6 + 4 - 3 = -3 \\neq 0$. Donc $B \\notin \\mathcal{P}$.`
      }),
      () => ({
        // x+2y-2z-3=0, A(2,1,0), B(0,1,1)
        // d(A,P) = |2+2-0-3|/√9 = 1/3
        // n = (1,2,-2). H = (2+t, 1+2t, -2t). (2+t)+2(1+2t)-2(-2t)-3 = 2+t+2+4t+4t-3 = 9t+1 = 0 → t=-1/9
        // H = (17/9, 7/9, 2/9)
        // B(0,1,1) : 0+2-2-3 = -3 ≠ 0
        enonce: `Dans un repère orthonormé, on considère le plan $\\mathcal{P} : x + 2y - 2z - 3 = 0$, les points $A(2\\,;\\,1\\,;\\,0)$ et $B(0\\,;\\,1\\,;\\,1)$.<br>` +
          `1. Calculer la distance de $A$ au plan $\\mathcal{P}$.<br>` +
          `2. Déterminer les coordonnées du projeté orthogonal $H$ de $A$ sur $\\mathcal{P}$.<br>` +
          `3. Le point $B$ appartient-il au plan $\\mathcal{P}$ ?`,
        corrige: `<strong>1.</strong> $d(A, \\mathcal{P}) = \\dfrac{|2 + 2 - 0 - 3|}{\\sqrt{1 + 4 + 4}} = \\dfrac{1}{3}$.<br>` +
          `<strong>2.</strong> $\\vec{n}(1\\,;\\,2\\,;\\,-2)$, $H = (2 + t\\,;\\,1 + 2t\\,;\\,-2t)$ avec $(2 + t) + 2(1 + 2t) - 2(-2t) - 3 = 2 + t + 2 + 4t + 4t - 3 = 9t + 1 = 0$, donc $t = -\\dfrac{1}{9}$.<br>` +
          `$H = \\left(\\dfrac{17}{9}\\,;\\,\\dfrac{7}{9}\\,;\\,\\dfrac{2}{9}\\right)$.<br>` +
          `<strong>3.</strong> Pour $B$ : $0 + 2 - 2 - 3 = -3 \\neq 0$. Donc $B \\notin \\mathcal{P}$.`
      })
    ];
    const v3 = pick(variantes)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Calcul du projeté en pratique.</strong> Substituer la paramétrisation $H = A + t\\,\\vec{n}$ dans l'équation cartésienne du plan donne une équation du 1er degré en $t$. La résolution donne le paramètre, et on reporte dans la paramétrisation pour obtenir les coordonnées de $H$.`
    };
  },

  // ============================================================
  // 5. rev_bac_geo_sphere
  // Sphère : équation, intersection avec une droite ou un plan
  // nv1 : appartenance d'un point à une sphère
  // nv2 : équation d'une sphère
  // nv3 : intersection avec une droite
  // ============================================================
  rev_bac_geo_sphere: (d) => {
    if (d === 1) {
      // Variantes : appartenance d'un point à une sphère
      const variantes = [
        () => ({
          // Ω(1,-2,3), r=5. A(4,0,6) : 9+4+9=22 ≠ 25. B(5,-2,6) : 16+0+9=25 ✓
          enonce: `Dans un repère orthonormé, on considère la sphère $\\mathcal{S}$ de centre $\\Omega(1\\,;\\,-2\\,;\\,3)$ et de rayon $5$, ` +
            `et les points $A(4\\,;\\,0\\,;\\,6)$ et $B(5\\,;\\,-2\\,;\\,6)$.<br>` +
            `1. Donner une équation de la sphère $\\mathcal{S}$.<br>` +
            `2. Le point $A$ appartient-il à $\\mathcal{S}$ ?<br>` +
            `3. Le point $B$ appartient-il à $\\mathcal{S}$ ?`,
          corrige: `<strong>1.</strong> $(x - 1)^{2} + (y + 2)^{2} + (z - 3)^{2} = 25$.<br>` +
            `<strong>2.</strong> $\\Omega A^{2} = 9 + 4 + 9 = 22 \\neq 25$, donc $A \\notin \\mathcal{S}$.<br>` +
            `<strong>3.</strong> $\\Omega B^{2} = 16 + 0 + 9 = 25$, donc $B \\in \\mathcal{S}$.`
        }),
        () => ({
          // Ω(2,1,-1), r=3. A(4,1,1) : 4+0+4=8 ≠ 9. B(3,3,-3) : 1+4+4=9 ✓
          enonce: `Dans un repère orthonormé, on considère la sphère $\\mathcal{S}$ de centre $\\Omega(2\\,;\\,1\\,;\\,-1)$ et de rayon $3$, ` +
            `et les points $A(4\\,;\\,1\\,;\\,1)$ et $B(3\\,;\\,3\\,;\\,-3)$.<br>` +
            `1. Donner une équation de la sphère $\\mathcal{S}$.<br>` +
            `2. Le point $A$ appartient-il à $\\mathcal{S}$ ?<br>` +
            `3. Le point $B$ appartient-il à $\\mathcal{S}$ ?`,
          corrige: `<strong>1.</strong> $(x - 2)^{2} + (y - 1)^{2} + (z + 1)^{2} = 9$.<br>` +
            `<strong>2.</strong> $\\Omega A^{2} = (4 - 2)^{2} + 0^{2} + 2^{2} = 4 + 0 + 4 = 8 \\neq 9$, donc $A \\notin \\mathcal{S}$.<br>` +
            `<strong>3.</strong> $\\Omega B^{2} = 1^{2} + 2^{2} + (-2)^{2} = 1 + 4 + 4 = 9$, donc $B \\in \\mathcal{S}$.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Équation cartésienne d'une sphère.</strong> La sphère de centre $\\Omega(a\\,;\\,b\\,;\\,c)$ et de rayon $r > 0$ a pour équation $(x - a)^{2} + (y - b)^{2} + (z - c)^{2} = r^{2}$. Un point $M$ appartient à la sphère si et seulement si $\\Omega M^{2} = r^{2}$.`
      };
    }

    if (d === 2) {
      // Variantes : sphère de diamètre [AB]
      const variantes = [
        () => ({
          // A(1,2,1), B(3,0,5). I=(2,1,3). AB=√24=2√6, rayon=√6
          enonce: `Dans un repère orthonormé, on considère les points $A(1\\,;\\,2\\,;\\,1)$ et $B(3\\,;\\,0\\,;\\,5)$.<br>` +
            `1. Déterminer les coordonnées du milieu $I$ du segment $[AB]$.<br>` +
            `2. Calculer la longueur $AB$.<br>` +
            `3. En déduire une équation de la sphère $\\mathcal{S}$ de diamètre $[AB]$.`,
          corrige: `<strong>1.</strong> $I = (2\\,;\\,1\\,;\\,3)$.<br>` +
            `<strong>2.</strong> $AB = \\sqrt{(3 - 1)^{2} + (0 - 2)^{2} + (5 - 1)^{2}} = \\sqrt{4 + 4 + 16} = \\sqrt{24} = 2\\sqrt{6}$.<br>` +
            `<strong>3.</strong> Centre $I(2\\,;\\,1\\,;\\,3)$, rayon $\\sqrt{6}$. Équation : $(x - 2)^{2} + (y - 1)^{2} + (z - 3)^{2} = 6$.`
        }),
        () => ({
          // A(2,0,1), B(0,4,3). I=(1,2,2). AB=√(4+16+4)=√24=2√6
          enonce: `Dans un repère orthonormé, on considère les points $A(2\\,;\\,0\\,;\\,1)$ et $B(0\\,;\\,4\\,;\\,3)$.<br>` +
            `1. Déterminer les coordonnées du milieu $I$ du segment $[AB]$.<br>` +
            `2. Calculer la longueur $AB$.<br>` +
            `3. En déduire une équation de la sphère $\\mathcal{S}$ de diamètre $[AB]$.`,
          corrige: `<strong>1.</strong> $I = (1\\,;\\,2\\,;\\,2)$.<br>` +
            `<strong>2.</strong> $AB = \\sqrt{(0 - 2)^{2} + (4 - 0)^{2} + (3 - 1)^{2}} = \\sqrt{4 + 16 + 4} = \\sqrt{24} = 2\\sqrt{6}$.<br>` +
            `<strong>3.</strong> Centre $I(1\\,;\\,2\\,;\\,2)$, rayon $\\sqrt{6}$. Équation : $(x - 1)^{2} + (y - 2)^{2} + (z - 2)^{2} = 6$.`
        }),
        () => ({
          // A(0,1,2), B(4,3,0). I=(2,2,1). AB=√(16+4+4)=√24=2√6
          enonce: `Dans un repère orthonormé, on considère les points $A(0\\,;\\,1\\,;\\,2)$ et $B(4\\,;\\,3\\,;\\,0)$.<br>` +
            `1. Déterminer les coordonnées du milieu $I$ du segment $[AB]$.<br>` +
            `2. Calculer la longueur $AB$.<br>` +
            `3. En déduire une équation de la sphère $\\mathcal{S}$ de diamètre $[AB]$.`,
          corrige: `<strong>1.</strong> $I = (2\\,;\\,2\\,;\\,1)$.<br>` +
            `<strong>2.</strong> $AB = \\sqrt{16 + 4 + 4} = \\sqrt{24} = 2\\sqrt{6}$.<br>` +
            `<strong>3.</strong> Centre $I(2\\,;\\,2\\,;\\,1)$, rayon $\\sqrt{6}$. Équation : $(x - 2)^{2} + (y - 2)^{2} + (z - 1)^{2} = 6$.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Sphère de diamètre $[AB]$.</strong> Le centre est le milieu de $[AB]$ et le rayon est $\\dfrac{AB}{2}$. Caractérisation équivalente : $M$ appartient à la sphère si et seulement si $\\vec{MA} \\cdot \\vec{MB} = 0$.`
      };
    }

    // d === 3 : intersection sphère-droite, 2 variantes
    const variantes = [
      () => ({
        enonce: `Dans un repère orthonormé, on considère la sphère $\\mathcal{S}$ d'équation $(x - 1)^{2} + (y - 2)^{2} + z^{2} = 9$ ` +
          `et la droite $\\mathcal{D}$ passant par $A(0\\,;\\,2\\,;\\,1)$ et de vecteur directeur $\\vec{u}(1\\,;\\,0\\,;\\,0)$.<br>` +
          `1. Donner une représentation paramétrique de $\\mathcal{D}$.<br>` +
          `2. Déterminer les coordonnées des éventuels points d'intersection de $\\mathcal{D}$ et $\\mathcal{S}$.`,
        corrige: `<strong>1.</strong> $\\mathcal{D} : \\begin{cases} x = t \\\\ y = 2 \\\\ z = 1 \\end{cases}$ avec $t \\in \\mathbb{R}$.<br>` +
          `<strong>2.</strong> Substitution : $(t - 1)^{2} + 0 + 1 = 9$, soit $(t - 1)^{2} = 8$, donc $t = 1 \\pm 2\\sqrt{2}$.<br>` +
          `Points d'intersection : $M_1(1 + 2\\sqrt{2}\\,;\\,2\\,;\\,1)$ et $M_2(1 - 2\\sqrt{2}\\,;\\,2\\,;\\,1)$.`
      }),
      () => ({
        // Sphère (x-2)²+(y-1)²+(z+1)² = 16. Droite : A(0,1,-1), u(1,0,0). Param (t, 1, -1)
        // Sub : (t-2)² + 0 + 0 = 16 → (t-2)² = 16 → t-2 = ±4 → t = 6 ou t = -2
        // Points : (6, 1, -1) et (-2, 1, -1)
        enonce: `Dans un repère orthonormé, on considère la sphère $\\mathcal{S}$ d'équation $(x - 2)^{2} + (y - 1)^{2} + (z + 1)^{2} = 16$ ` +
          `et la droite $\\mathcal{D}$ passant par $A(0\\,;\\,1\\,;\\,-1)$ et de vecteur directeur $\\vec{u}(1\\,;\\,0\\,;\\,0)$.<br>` +
          `1. Donner une représentation paramétrique de $\\mathcal{D}$.<br>` +
          `2. Déterminer les coordonnées des éventuels points d'intersection de $\\mathcal{D}$ et $\\mathcal{S}$.`,
        corrige: `<strong>1.</strong> $\\mathcal{D} : \\begin{cases} x = t \\\\ y = 1 \\\\ z = -1 \\end{cases}$ avec $t \\in \\mathbb{R}$.<br>` +
          `<strong>2.</strong> Substitution : $(t - 2)^{2} + 0 + 0 = 16$, soit $(t - 2)^{2} = 16$, donc $t = 6$ ou $t = -2$.<br>` +
          `Points d'intersection : $M_1(6\\,;\\,1\\,;\\,-1)$ et $M_2(-2\\,;\\,1\\,;\\,-1)$.`
      })
    ];
    const v3 = pick(variantes)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Intersection droite-sphère.</strong> On substitue la paramétrisation de la droite dans l'équation de la sphère : on obtient une équation du second degré en $t$. Le nombre de solutions ($0$, $1$ ou $2$) donne le nombre de points d'intersection (sécante, tangente, disjoints).`
    };
  },

  // ============================================================
  // 6. rev_bac_geo_position_relative
  // Position relative de deux droites : coplanaires sécantes, parallèles, non coplanaires
  // nv1 : tester la colinéarité des vecteurs directeurs
  // nv2 : étude complète sécantes / parallèles
  // nv3 : cas non coplanaires
  // ============================================================
  rev_bac_geo_position_relative: (d) => {
    if (d === 1) {
      const variantes = [
        () => ({
          enonce: `Dans un repère orthonormé, on considère les droites :<br>` +
            `$\\mathcal{D}_1 : \\begin{cases} x = 1 + t \\\\ y = 2 - t \\\\ z = t \\end{cases}$ et ` +
            `$\\mathcal{D}_2 : \\begin{cases} x = 4 + 2s \\\\ y = -1 - 2s \\\\ z = 1 + 2s \\end{cases}$ avec $t, s \\in \\mathbb{R}$.<br>` +
            `1. Donner un vecteur directeur de chaque droite. Conclure sur leur direction.<br>` +
            `2. Les droites sont-elles confondues ou strictement parallèles ?`,
          corrige: `<strong>1.</strong> $\\vec{u_1}(1\\,;\\,-1\\,;\\,1)$ et $\\vec{u_2}(2\\,;\\,-2\\,;\\,2) = 2\\,\\vec{u_1}$ : vecteurs colinéaires, mêmes directions.<br>` +
            `<strong>2.</strong> Test : $A(1\\,;\\,2\\,;\\,0) \\in \\mathcal{D}_1$ ($t = 0$). Dans $\\mathcal{D}_2$ ? $1 = 4 + 2s \\Rightarrow s = -\\dfrac{3}{2}$. ` +
            `Vérif $y$ : $-1 + 3 = 2$ ✓ ; vérif $z$ : $1 - 3 = -2 \\neq 0$ ✗.<br>` +
            `Les droites sont <strong>strictement parallèles</strong>.`
        }),
        () => ({
          enonce: `Dans un repère orthonormé, on considère les droites :<br>` +
            `$\\mathcal{D}_1 : \\begin{cases} x = 1 + 2t \\\\ y = t \\\\ z = 2 - t \\end{cases}$ et ` +
            `$\\mathcal{D}_2 : \\begin{cases} x = 3 + 4s \\\\ y = 1 + 2s \\\\ z = -2s \\end{cases}$ avec $t, s \\in \\mathbb{R}$.<br>` +
            `1. Donner un vecteur directeur de chaque droite. Conclure sur leur direction.<br>` +
            `2. Les droites sont-elles confondues ou strictement parallèles ?`,
          corrige: `<strong>1.</strong> $\\vec{u_1}(2\\,;\\,1\\,;\\,-1)$ et $\\vec{u_2}(4\\,;\\,2\\,;\\,-2) = 2\\,\\vec{u_1}$ : colinéaires.<br>` +
            `<strong>2.</strong> Test : $A(1\\,;\\,0\\,;\\,2) \\in \\mathcal{D}_1$. Dans $\\mathcal{D}_2$ ? $1 = 3 + 4s \\Rightarrow s = -\\dfrac{1}{2}$. ` +
            `Vérif $y$ : $1 - 1 = 0$ ✓ ; vérif $z$ : $1 \\neq 2$ ✗.<br>` +
            `Les droites sont <strong>strictement parallèles</strong>.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Direction de deux droites.</strong> Mêmes directions ssi vecteurs directeurs colinéaires. Pour distinguer confondues / parallèles strictes : tester si un point d'une appartient à l'autre.`
      };
    }

    if (d === 2) {
      const variantes = [
        () => ({
          enonce: `Dans un repère orthonormé, on considère les droites :<br>` +
            `$\\mathcal{D}_1 : \\begin{cases} x = 1 + t \\\\ y = t \\\\ z = 2 - t \\end{cases}$ et ` +
            `$\\mathcal{D}_2 : \\begin{cases} x = s \\\\ y = 1 + s \\\\ z = s \\end{cases}$.<br>` +
            `1. Démontrer que les droites n'ont pas la même direction.<br>` +
            `2. Les droites sont-elles sécantes ?`,
          corrige: `<strong>1.</strong> $\\vec{u_1}(1\\,;\\,1\\,;\\,-1)$ et $\\vec{u_2}(1\\,;\\,1\\,;\\,1)$ : non colinéaires.<br>` +
            `<strong>2.</strong> Système $\\begin{cases} 1+t=s \\\\ t=1+s \\\\ 2-t=s \\end{cases}$. De (1) : $s=1+t$. (2) : $t=1+(1+t)$, soit $0=2$ ✗.<br>` +
            `Pas de point commun et pas la même direction : les droites sont <strong>non coplanaires</strong>.`
        }),
        () => ({
          // D1 : (t, 1+t, 2t), u1=(1,1,2). D2 : (s, 3-s, 2s), u2=(1,-1,2)
          // Sécantes en (1, 2, 2)
          enonce: `Dans un repère orthonormé, on considère les droites :<br>` +
            `$\\mathcal{D}_1 : \\begin{cases} x = t \\\\ y = 1 + t \\\\ z = 2t \\end{cases}$ et ` +
            `$\\mathcal{D}_2 : \\begin{cases} x = s \\\\ y = 3 - s \\\\ z = 2s \\end{cases}$.<br>` +
            `1. Démontrer que les droites n'ont pas la même direction.<br>` +
            `2. Les droites sont-elles sécantes ?`,
          corrige: `<strong>1.</strong> $\\vec{u_1}(1\\,;\\,1\\,;\\,2)$ et $\\vec{u_2}(1\\,;\\,-1\\,;\\,2)$ : non colinéaires.<br>` +
            `<strong>2.</strong> Système $\\begin{cases} t=s \\\\ 1+t=3-s \\\\ 2t=2s \\end{cases}$. De (1) : $s=t$. (3) toujours vraie. (2) : $1+t=3-t \\Rightarrow t=1$, $s=1$.<br>` +
            `Point d'intersection : $(1\\,;\\,2\\,;\\,2)$. Les droites sont <strong>sécantes</strong>.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Position relative de deux droites.</strong> Quatre cas : confondues, parallèles strictes, sécantes, non coplanaires. Méthode : (a) tester la colinéarité ; (b) résoudre le système.`
      };
    }

    // d === 3
    const variantes = [
      () => ({
        enonce: `Dans un repère orthonormé, on considère les droites :<br>` +
          `$\\mathcal{D}_1 : \\begin{cases} x = 2 + t \\\\ y = 1 - t \\\\ z = -1 + 2t \\end{cases}$ et ` +
          `$\\mathcal{D}_2 : \\begin{cases} x = 4 - s \\\\ y = 2 + s \\\\ z = 1 - 2s \\end{cases}$ avec $t, s \\in \\mathbb{R}$.<br>` +
          `1. Préciser un vecteur directeur de chacune des deux droites.<br>` +
          `2. Étudier la position relative de $\\mathcal{D}_1$ et $\\mathcal{D}_2$.`,
        corrige: `<strong>1.</strong> $\\vec{u_1}(1\\,;\\,-1\\,;\\,2)$ et $\\vec{u_2}(-1\\,;\\,1\\,;\\,-2) = -\\vec{u_1}$ : colinéaires.<br>` +
          `<strong>2.</strong> Test : $A(2\\,;\\,1\\,;\\,-1) \\in \\mathcal{D}_1$. $2 = 4 - s \\Rightarrow s = 2$. Vérif $y$ : $2 + 2 = 4 \\neq 1$ ✗.<br>` +
          `Les droites sont <strong>strictement parallèles</strong>.`
      }),
      () => ({
        enonce: `Dans un repère orthonormé, on considère les droites :<br>` +
          `$\\mathcal{D}_1 : \\begin{cases} x = 1 + t \\\\ y = t \\\\ z = 0 \\end{cases}$ et ` +
          `$\\mathcal{D}_2 : \\begin{cases} x = s \\\\ y = 0 \\\\ z = 1 + s \\end{cases}$ avec $t, s \\in \\mathbb{R}$.<br>` +
          `1. Préciser un vecteur directeur de chacune des deux droites.<br>` +
          `2. Étudier la position relative de $\\mathcal{D}_1$ et $\\mathcal{D}_2$.`,
        corrige: `<strong>1.</strong> $\\vec{u_1}(1\\,;\\,1\\,;\\,0)$ et $\\vec{u_2}(1\\,;\\,0\\,;\\,1)$ : non colinéaires.<br>` +
          `<strong>2.</strong> Système $\\begin{cases} 1+t=s \\\\ t=0 \\\\ 0=1+s \\end{cases}$. (2) : $t=0$. (1) : $s=1$. (3) : $0 = 2$ ✗.<br>` +
          `Pas de point commun ni même direction : les droites sont <strong>non coplanaires</strong>.`
      })
    ];
    const v3 = pick(variantes)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Méthode systématique.</strong> (a) Colinéaires + point commun ⟹ confondues ; (b) Colinéaires + pas de point commun ⟹ parallèles strictes ; (c) Non colinéaires + système avec solution ⟹ sécantes ; (d) Non colinéaires + sans solution ⟹ non coplanaires.`
    };
  },

  // ============================================================
  // 7. rev_bac_geo_perpendicularite
  // Droite perpendiculaire à un plan, plans perpendiculaires
  // nv1 : tester si une droite est perpendiculaire à un plan
  // nv2 : déterminer une droite perpendiculaire à un plan passant par un point
  // nv3 : plans perpendiculaires
  // ============================================================
  rev_bac_geo_perpendicularite: (d) => {
    if (d === 1) {
      const variantes = [
        () => ({
          enonce: `Dans un repère orthonormé, on considère le plan $\\mathcal{P} : 2x - y + 3z - 5 = 0$ et les droites :<br>` +
            `$\\mathcal{D}_1$ de vecteur directeur $\\vec{u_1}(4\\,;\\,-2\\,;\\,6)$,<br>` +
            `$\\mathcal{D}_2$ de vecteur directeur $\\vec{u_2}(1\\,;\\,1\\,;\\,1)$.<br>` +
            `Pour chacune de ces droites, déterminer si elle est perpendiculaire au plan $\\mathcal{P}$. Justifier.`,
          corrige: `Un vecteur normal à $\\mathcal{P}$ est $\\vec{n}(2\\,;\\,-1\\,;\\,3)$.<br>` +
            `<strong>$\\mathcal{D}_1$ :</strong> $\\vec{u_1} = 2\\,\\vec{n}$ : colinéaires, donc $\\mathcal{D}_1$ est <strong>perpendiculaire</strong>.<br>` +
            `<strong>$\\mathcal{D}_2$ :</strong> $\\dfrac{1}{2} \\neq \\dfrac{1}{-1}$, non colinéaires : $\\mathcal{D}_2$ n'est <strong>pas perpendiculaire</strong>.`
        }),
        () => ({
          enonce: `Dans un repère orthonormé, on considère le plan $\\mathcal{P} : x + 2y - 2z + 1 = 0$ et les droites :<br>` +
            `$\\mathcal{D}_1$ de vecteur directeur $\\vec{u_1}(3\\,;\\,6\\,;\\,-6)$,<br>` +
            `$\\mathcal{D}_2$ de vecteur directeur $\\vec{u_2}(1\\,;\\,1\\,;\\,1)$.<br>` +
            `Pour chacune de ces droites, déterminer si elle est perpendiculaire au plan $\\mathcal{P}$. Justifier.`,
          corrige: `Un vecteur normal à $\\mathcal{P}$ est $\\vec{n}(1\\,;\\,2\\,;\\,-2)$.<br>` +
            `<strong>$\\mathcal{D}_1$ :</strong> $\\vec{u_1}(3\\,;\\,6\\,;\\,-6) = 3\\,\\vec{n}$ : colinéaires, $\\mathcal{D}_1$ est <strong>perpendiculaire</strong>.<br>` +
            `<strong>$\\mathcal{D}_2$ :</strong> $\\dfrac{1}{1} = 1$ mais $\\dfrac{1}{2} \\neq 1$ : non colinéaires, $\\mathcal{D}_2$ n'est <strong>pas perpendiculaire</strong>.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Droite perpendiculaire à un plan.</strong> $\\mathcal{D} \\perp \\mathcal{P} \\iff$ vecteur directeur de $\\mathcal{D}$ colinéaire à un vecteur normal de $\\mathcal{P}$.`
      };
    }

    if (d === 2) {
      const variantes = [
        () => ({
          enonce: `Dans un repère orthonormé, on considère le plan $\\mathcal{P} : x + 2y - z - 4 = 0$ et le point $A(3\\,;\\,1\\,;\\,0)$.<br>` +
            `1. Donner un vecteur normal $\\vec{n}$ à $\\mathcal{P}$.<br>` +
            `2. Donner une représentation paramétrique de la droite $\\mathcal{D}$ perpendiculaire à $\\mathcal{P}$ passant par $A$.<br>` +
            `3. Déterminer les coordonnées du projeté orthogonal $H$ de $A$ sur $\\mathcal{P}$.`,
          corrige: `<strong>1.</strong> $\\vec{n}(1\\,;\\,2\\,;\\,-1)$.<br>` +
            `<strong>2.</strong> $\\mathcal{D} : \\begin{cases} x = 3 + t \\\\ y = 1 + 2t \\\\ z = -t \\end{cases}$.<br>` +
            `<strong>3.</strong> $(3 + t) + 2(1 + 2t) - (-t) - 4 = 6t + 1 = 0 \\Rightarrow t = -\\dfrac{1}{6}$. ` +
            `$H = \\left(\\dfrac{17}{6}\\,;\\,\\dfrac{2}{3}\\,;\\,\\dfrac{1}{6}\\right)$.`
        }),
        () => ({
          enonce: `Dans un repère orthonormé, on considère le plan $\\mathcal{P} : 2x + y + 2z - 6 = 0$ et le point $A(1\\,;\\,0\\,;\\,1)$.<br>` +
            `1. Donner un vecteur normal $\\vec{n}$ à $\\mathcal{P}$.<br>` +
            `2. Donner une représentation paramétrique de la droite $\\mathcal{D}$ perpendiculaire à $\\mathcal{P}$ passant par $A$.<br>` +
            `3. Déterminer les coordonnées du projeté orthogonal $H$ de $A$ sur $\\mathcal{P}$.`,
          corrige: `<strong>1.</strong> $\\vec{n}(2\\,;\\,1\\,;\\,2)$.<br>` +
            `<strong>2.</strong> $\\mathcal{D} : \\begin{cases} x = 1 + 2t \\\\ y = t \\\\ z = 1 + 2t \\end{cases}$.<br>` +
            `<strong>3.</strong> $2(1 + 2t) + t + 2(1 + 2t) - 6 = 9t - 2 = 0 \\Rightarrow t = \\dfrac{2}{9}$. ` +
            `$H = \\left(\\dfrac{13}{9}\\,;\\,\\dfrac{2}{9}\\,;\\,\\dfrac{13}{9}\\right)$.`
        })
      ];
      const v = pick(variantes)();
      return {
        enonce: v.enonce,
        corrige: v.corrige,
        rappel: `<strong>Droite perpendiculaire à un plan passant par un point.</strong> La perpendiculaire à $\\mathcal{P} : ax + by + cz + d = 0$ passant par $A$ a pour vecteur directeur $\\vec{n}(a\\,;\\,b\\,;\\,c)$.`
      };
    }

    // d === 3 : plans perpendiculaires
    const variantes = [
      () => ({
        enonce: `Dans un repère orthonormé, on considère les plans :<br>` +
          `$\\mathcal{P}_1 : 2x + y - z - 3 = 0$ et $\\mathcal{P}_2 : x - 3y - z = 0$.<br>` +
          `1. Donner un vecteur normal à chaque plan.<br>` +
          `2. Démontrer que les plans $\\mathcal{P}_1$ et $\\mathcal{P}_2$ sont perpendiculaires.`,
        corrige: `<strong>1.</strong> $\\vec{n_1}(2\\,;\\,1\\,;\\,-1)$ ; $\\vec{n_2}(1\\,;\\,-3\\,;\\,-1)$.<br>` +
          `<strong>2.</strong> $\\vec{n_1} \\cdot \\vec{n_2} = 2 - 3 + 1 = 0$. Donc les plans sont <strong>perpendiculaires</strong>.`
      }),
      () => ({
        enonce: `Dans un repère orthonormé, on considère les plans :<br>` +
          `$\\mathcal{P}_1 : x + 2y + z - 4 = 0$ et $\\mathcal{P}_2 : 3x - y - z + 1 = 0$.<br>` +
          `1. Donner un vecteur normal à chaque plan.<br>` +
          `2. Démontrer que les plans $\\mathcal{P}_1$ et $\\mathcal{P}_2$ sont perpendiculaires.`,
        corrige: `<strong>1.</strong> $\\vec{n_1}(1\\,;\\,2\\,;\\,1)$ ; $\\vec{n_2}(3\\,;\\,-1\\,;\\,-1)$.<br>` +
          `<strong>2.</strong> $\\vec{n_1} \\cdot \\vec{n_2} = 3 - 2 - 1 = 0$. Donc les plans sont <strong>perpendiculaires</strong>.`
      })
    ];
    const v3 = pick(variantes)();
    return {
      enonce: v3.enonce,
      corrige: v3.corrige,
      rappel: `<strong>Plans perpendiculaires.</strong> $\\mathcal{P}_1 \\perp \\mathcal{P}_2 \\iff \\vec{n_1} \\cdot \\vec{n_2} = 0$. Ne pas confondre avec « parallèles » : $\\mathcal{P}_1 \\parallel \\mathcal{P}_2 \\iff \\vec{n_1}$ et $\\vec{n_2}$ colinéaires.`
    };
  }

});

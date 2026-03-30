// Vercel Serverless Function
// Função que esconde toda a propriedade intelectual matemática da calculadora

const NOZZLES = [
  { iso: "01", size: 0.1, color: "#F28C28" },
  { iso: "0134", size: 0.134, color: "#795548" },
  { iso: "015", size: 0.15, color: "#4CAF50" },
  { iso: "0175", size: 0.175, color: "#9E9E9E" },
  { iso: "02", size: 0.2, color: "#FFEB3B" },
  { iso: "025", size: 0.25, color: "#9C27B0" },
  { iso: "03", size: 0.3, color: "#2196F3" },
  { iso: "04", size: 0.4, color: "#F44336" },
  { iso: "05", size: 0.5, color: "#A1887F" },
  { iso: "06", size: 0.6, color: "#BDBDBD" },
  { iso: "08", size: 0.8, color: "#FFFFFF" }
].map(n => ({
  iso: n.iso,
  color: n.color,
  size: n.size,
  q3: n.size * 3.785 // L/min @ 3 bar
}));

const BAR_TO_PSI = 14.5038;
const P_REF_BAR = 3.0;

function qPorBico(rate, vel, spacM) {
  return (rate * vel * spacM) / 600.0;
}

function velPara(rate, spacM, q) {
  return (q * 600.0) / (rate * spacM);
}

function toBar(p, unit) {
  return unit === 'psi' ? p / BAR_TO_PSI : p;
}

function fromBar(p, unit) {
  return unit === 'psi' ? p * BAR_TO_PSI : p;
}

function pressaoNecBar(qMix, q3, dens) {
  const qWaterEq = qMix * Math.sqrt(dens);
  return P_REF_BAR * Math.pow(qWaterEq / q3, 2);
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const spacingM = parseFloat(body.spacingM);
    const rate = parseFloat(body.rate);
    const density = parseFloat(body.density) || 1.0;
    const vMin = parseFloat(body.vMin) || 0;
    const vAvg = parseFloat(body.vAvg) || 0;
    const vMax = parseFloat(body.vMax) || 0;
    const unit = body.unit || 'bar';

    const pMinInput = parseFloat(body.pMin) || 0.1;
    const pMaxInput = parseFloat(body.pMax) || 10.0;

    const pMinBar = toBar(pMinInput, unit);
    const pMaxBar = toBar(pMaxInput, unit);
    const pMidBar = (pMinBar + pMaxBar) / 2;

    const valid =
      pMaxBar > pMinBar &&
      rate > 0 &&
      spacingM > 0 &&
      vMin > 0 &&
      vAvg > 0 &&
      vMax > 0 &&
      vMin <= vAvg &&
      vAvg <= vMax;

    if (!valid) {
      return res.status(400).json({ error: 'Parâmetros inválidos.' });
    }

    const qVmin = qPorBico(rate, vMin, spacingM);
    const qVavg = qPorBico(rate, vAvg, spacingM);
    const qVmax = qPorBico(rate, vMax, spacingM);

    let rows = [];

    NOZZLES.forEach(nz => {
      const qAtPminWater = nz.q3 * Math.sqrt(pMinBar / P_REF_BAR);
      const qAtPmaxWater = nz.q3 * Math.sqrt(pMaxBar / P_REF_BAR);
      const qAtPminMix = qAtPminWater / Math.sqrt(density);
      const qAtPmaxMix = qAtPmaxWater / Math.sqrt(density);

      const vAtPmin = velPara(rate, spacingM, qAtPminMix);
      const vAtPmax = velPara(rate, spacingM, qAtPmaxMix);

      const qAt3BarMix = nz.q3 / Math.sqrt(density);
      const vAt3Bar = velPara(rate, spacingM, qAt3BarMix);

      const pVminBar = pressaoNecBar(qVmin, nz.q3, density);
      const pVavgBar = pressaoNecBar(qVavg, nz.q3, density);
      const pVmaxBar = pressaoNecBar(qVmax, nz.q3, density);

      const ok = (pVminBar >= pMinBar && pVmaxBar <= pMaxBar);

      const belowMin = Math.max(0, pMinBar - pVminBar);
      const aboveMax = Math.max(0, pVmaxBar - pMaxBar);
      const violation = belowMin + aboveMax;

      const centerDiff = Math.abs(pVavgBar - pMidBar);
      const pressureSpan = pVmaxBar - pVminBar;

      rows.push({
        nz,
        vAtPmin,
        vAtPmax,
        vAt3Bar,
        qRequired: {
          min: qVmin,
          avg: qVavg,
          max: qVmax
        },
        pressuresBar: {
          min: pVminBar,
          avg: pVavgBar,
          max: pVmaxBar
        },
        pressuresDisplay: {
          min: fromBar(pVminBar, unit),
          avg: fromBar(pVavgBar, unit),
          max: fromBar(pVmaxBar, unit)
        },
        ok,
        violation,
        centerDiff,
        pressureSpan,
        status: ok
          ? 'Atende à faixa'
          : 'Melhor aproximação'
      });
    });

    rows.sort((a, b) => {
      if (a.ok !== b.ok) return a.ok ? -1 : 1;

      if (a.ok && b.ok) {
        if (a.centerDiff !== b.centerDiff) return a.centerDiff - b.centerDiff;
        return b.pressureSpan - a.pressureSpan;
      }

      if (a.violation !== b.violation) return a.violation - b.violation;
      if (a.centerDiff !== b.centerDiff) return a.centerDiff - b.centerDiff;
      return b.pressureSpan - a.pressureSpan;
    });

    res.status(200).json({ rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
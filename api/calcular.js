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
].map(n => ({ iso: n.iso, color: n.color, q3: n.size * 3.785 }));

const BAR_TO_PSI = 14.5038;
const P_REF_BAR = 3.0;

function qPorBico(rate, vel, spacM) { return (rate * vel * spacM) / 600.0; }
function velPara(rate, spacM, q) { return (q * 600.0) / (rate * spacM); }

export default function handler(req, res) {
  // Configuração para permitir CORS durante testes locais (opcional, bom para desenvolvimento)
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    const spacingM = parseFloat(body.spacingM);
    const rate = parseFloat(body.rate);
    const pMin = parseFloat(body.pMin) || 0.1;
    const pMax = parseFloat(body.pMax) || 10.0;
    const density = parseFloat(body.density) || 1.0;
    const vMin = parseFloat(body.vMin) || 0;
    const vAvg = parseFloat(body.vAvg) || 0;
    const vMax = parseFloat(body.vMax) || 0;
    const unit = body.unit || 'bar';

    const pTarget = (pMin + pMax) / 2;
    const pRef = () => unit === 'bar' ? P_REF_BAR : (P_REF_BAR * BAR_TO_PSI);
    const pressaoNec = (qMix, q3, dens) => { 
      const qWaterEq = qMix * Math.sqrt(dens); 
      return pRef() * Math.pow(qWaterEq / q3, 2); 
    };

    const maxLimitsValid = pMax > pMin && rate > 0 && spacingM > 0;
    if (!maxLimitsValid) {
        return res.status(400).json({ error: 'Parâmetros inválidos.' });
    }

    let rows = [];

    NOZZLES.forEach(nz => {
      const qAtPmin_water = nz.q3 * Math.sqrt(pMin / pRef());
      const qAtPmax_water = nz.q3 * Math.sqrt(pMax / pRef());
      const qAtPmin_mix = qAtPmin_water / Math.sqrt(density);
      const qAtPmax_mix = qAtPmax_water / Math.sqrt(density);

      const vAtPmin = velPara(rate, spacingM, qAtPmin_mix);
      const vAtPmax = velPara(rate, spacingM, qAtPmax_mix);

      const qAt3Bar_mix = nz.q3 / Math.sqrt(density);
      const vAt3Bar = velPara(rate, spacingM, qAt3Bar_mix);

      const qVmin = qPorBico(rate, vMin, spacingM);
      const pVmin = pressaoNec(qVmin, nz.q3, density);
      const qVavg = qPorBico(rate, vAvg, spacingM);
      const pVavg = pressaoNec(qVavg, nz.q3, density);
      const qVmax = qPorBico(rate, vMax, spacingM);
      const pVmax = pressaoNec(qVmax, nz.q3, density);

      // Critérios de Validação Reais (User Driven)
      const fitsMin = pVmin >= pMin;
      const fitsMax = pVmax <= pMax;
      const ok = fitsMin && fitsMax;
      
      // Status text as requested
      let statusText = "Não recomendado";
      if (ok) statusText = "Atende";
      else if (fitsMin || fitsMax) statusText = "Parcial";

      // Violação: Quão longe está dos limites (para ordenar os "não recomendados" por proximidade)
      const violation = Math.max(0, pMin - pVmin) + Math.max(0, pVmax - pMax);
      
      // Desvio do Alvo: Quão próximo da média da faixa (pTarget) o bico trabalha na vAvg
      const deviation = Math.abs(pVavg - pTarget);

      rows.push({
        nz: nz,
        vAtPmin, vAtPmax, vAt3Bar,
        pVavg, 
        qVavg,
        ok, 
        statusText,
        violation,
        deviation,
        pressures: [pVmin, pVavg, pVmax]
      });
    });

    // Ordenação Inteligente
    rows.sort((a, b) => {
      // 1. Quem atende a faixa 100% sempre ganha (Prioridade Máxima)
      if (a.ok !== b.ok) return a.ok ? -1 : 1;
      
      if (a.ok) {
        // 2. Entre os que atendem, ganha quem trabalha mais próximo do centro da faixa na vAvg
        return a.deviation - b.deviation;
      } else {
        // 3. Entre os que não atendem, ganha o "menos ruim" (menor violação dos limites)
        return a.violation - b.violation;
      }
    });

    res.status(200).json({ rows });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

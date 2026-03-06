import { useState, useMemo, useCallback } from "react";
import { ROLES, ROLE_CATS, CARGA_SOCIAL_FACTOR } from "./data/roles.js";
import { INFRA, INFRA_CATS } from "./data/infra.js";
import { STACK, STACK_CATS } from "./data/stack.js";
import { AI_PROVIDERS, AI_CATS } from "./data/ai.js";
import { FISCAL_MX, REGIMENES, calcISRFisicaAnual } from "./data/fiscal.js";

const DEFAULT_FX = 17.2;

const fmtUSD = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "USD", minimumFractionDigits: (n||0) < 10 ? 2 : 0, maximumFractionDigits: (n||0) < 10 ? 3 : 0 }).format(n || 0);
const fmtMXN = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n || 0);
const pct = (v, t) => t > 0 ? Math.round((v / t) * 100) : 0;

function NumInput({ value, onChange, min = 0, max = 9999, step = 1, style = {} }) {
  return (
    <input type="number" value={value} min={min} max={max} step={step}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      style={{ background: "var(--bg)", border: "1px solid var(--border2)", color: "var(--green)", fontFamily: "var(--mono)", fontSize: 12, padding: "4px 8px", borderRadius: 4, outline: "none", width: 72, textAlign: "center", ...style }}
      onFocus={e => e.target.style.borderColor = "var(--green)"}
      onBlur={e => e.target.style.borderColor = "var(--border2)"} />
  );
}

function TextInput({ value, onChange, placeholder, style = {} }) {
  return (
    <input type="text" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
      style={{ background: "var(--bg)", border: "1px solid var(--border2)", color: "var(--text)", fontFamily: "var(--mono)", fontSize: 12, padding: "6px 10px", borderRadius: 5, outline: "none", ...style }}
      onFocus={e => e.target.style.borderColor = "var(--green)"}
      onBlur={e => e.target.style.borderColor = "var(--border2)"} />
  );
}

function SelectInput({ value, onChange, options, style = {} }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ background: "var(--bg)", border: "1px solid var(--border2)", color: "var(--text)", fontFamily: "var(--mono)", fontSize: 11, padding: "4px 8px", borderRadius: 4, outline: "none", cursor: "pointer", ...style }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function CatHeader({ label }) {
  return (
    <div style={{ padding: "7px 16px", background: "var(--bg3)", borderBottom: "1px solid var(--border)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text3)" }}>
      {label}
    </div>
  );
}

function SectionCard({ children, style = {} }) {
  return (
    <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 14, ...style }}>
      {children}
    </div>
  );
}

function Row({ checked, onToggle, label, sublabel, note, right, rightDim }) {
  return (
    <div onClick={onToggle}
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderBottom: "1px solid var(--border)", cursor: "pointer", background: checked ? "rgba(110,255,160,0.025)" : "transparent", transition: "background 0.1s" }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
      onMouseLeave={e => e.currentTarget.style.background = checked ? "rgba(110,255,160,0.025)" : "transparent"}>
      <div style={{ width: 16, height: 16, border: `1.5px solid ${checked ? "var(--green)" : "var(--border2)"}`, borderRadius: 3, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: checked ? "rgba(110,255,160,0.12)" : "transparent" }}>
        {checked && <span style={{ color: "var(--green)", fontSize: 10 }}>&#10003;</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: "var(--text)" }}>{label}</div>
        {sublabel && <div style={{ fontSize: 10, color: "var(--text3)" }}>{sublabel}</div>}
        {note && <div style={{ fontSize: 10, color: "var(--amber)" }}>{note}</div>}
      </div>
      <div style={{ textAlign: "right", flexShrink: 0, minWidth: 90 }}>
        <div style={{ fontSize: 12, color: checked ? "var(--green)" : "var(--text3)" }}>{right}</div>
        {rightDim && <div style={{ fontSize: 10, color: "var(--text3)" }}>{rightDim}</div>}
      </div>
    </div>
  );
}

function BarRow({ label, usd, total, color }) {
  const w = total > 0 ? Math.max(2, pct(usd, total)) : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11 }}>
        <span style={{ color: "var(--text2)" }}>{label}</span>
        <span style={{ color }}>{fmtUSD(usd)}/mes</span>
      </div>
      <div style={{ height: 5, background: "var(--bg3)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${w}%`, background: color, borderRadius: 3, transition: "width 0.5s" }} />
      </div>
      <div style={{ fontSize: 9, color: "var(--text3)", marginTop: 2 }}>{pct(usd, total)}% del costo mensual</div>
    </div>
  );
}

const TABS = [
  { id: "human",    icon: "👥", label: "Capital Humano" },
  { id: "infra",    icon: "🖥️", label: "Infraestructura" },
  { id: "stack",    icon: "🧰", label: "Stack & SaaS" },
  { id: "ai",       icon: "🤖", label: "IA & ML" },
  { id: "comision", icon: "🤝", label: "Comisiones" },
  { id: "fiscal",   icon: "🏛️", label: "Fiscal MX" },
  { id: "summary",  icon: "📊", label: "Resumen & Exportar" },
];

function exportTXT({ project, costs, fx, months, margin, contingency, team, teamSeniority, infraOn, infraQty, stackOn, stackQty, aiOn, aiTokensM, sellers, customHumans, customInfra, customStack, customAI, fiscalLabel }) {
  const sep = "=".repeat(60);
  const div = "-".repeat(60);
  const now = new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
  const pad = (s, n) => String(s).padEnd(n);
  const rpad = (s, n) => String(s).padStart(n);

  let txt = `${sep}\nCOSTCALC — ESTIMACION DE PROYECTO TECNOLOGICO\n${sep}\n\n`;
  txt += `  PROYECTO  : ${project.name || "(sin nombre)"}\n`;
  txt += `  CLIENTE   : ${project.client || "(sin especificar)"}\n`;
  txt += `  VERSION   : ${project.version || "1.0"}\n`;
  txt += `  FECHA     : ${now}\n`;
  if (project.description) txt += `\n  DESCRIPCION:\n  ${project.description}\n`;
  txt += `\n${div}\n  PARAMETROS\n${div}\n`;
  txt += `  Duracion        : ${months} meses\n`;
  txt += `  Tipo de cambio  : $${fx} MXN/USD\n`;
  txt += `  Contingencia    : ${contingency}%\n`;
  txt += `  Margen          : ${margin}%\n`;
  if (fiscalLabel) txt += `  Regimen fiscal  : ${fiscalLabel}\n`;

  const activeTeam = ROLES.filter(r => (team[r.id] || 0) > 0);
  if (activeTeam.length) {
    txt += `\n${div}\n  CAPITAL HUMANO\n${div}\n`;
    txt += `  ${pad("ROL",34)} ${pad("NIV",7)} ${pad("x",3)} ${rpad("MENSUAL MXN",14)}\n`;
    activeTeam.forEach(r => {
      const sen = teamSeniority[r.id] || "mid";
      const sl = sen==="min"?"Junior":sen==="max"?"Senior":"Mid";
      const sal = sen==="min"?r.minMXN:sen==="max"?r.maxMXN:Math.round((r.minMXN+r.maxMXN)/2);
      const cnt = team[r.id];
      txt += `  ${pad(r.label,34)} ${pad(sl,7)} ${pad(cnt,3)} ${rpad(fmtMXN(sal*cnt),14)}\n`;
    });
    txt += `  ${div}\n  ${pad("SUBTOTAL MENSUAL",50)} ${rpad(fmtMXN(costs.humanMXN),14)}\n`;
    txt += `  ${pad("(USD)",50)} ${rpad(fmtUSD(costs.humanUSD),14)}\n`;
    if (customHumans && customHumans.length) {
      const customHumanMXN = customHumans.reduce((sum, entry) => sum + entry.mxn, 0);
      const customHumanUSD = customHumans.reduce((sum, entry) => sum + entry.mxn / fx, 0);
      txt += `\n${div}\n  PERFILES PERSONALIZADOS\n${div}\n`;
      customHumans.forEach(entry => {
        txt += `  ${pad(entry.label,36)} ${rpad(fmtMXN(entry.mxn),14)} ${rpad(fmtUSD(entry.mxn / fx),14)}\n`;
      });
      txt += `  ${pad("SUBTOTAL PERSONALIZADO",54)} ${rpad(fmtMXN(customHumanMXN),14)} ${rpad(fmtUSD(customHumanUSD),14)}\n`;
    }
  }

  const activeInfra = INFRA.filter(i => infraOn[i.id]);
  if (activeInfra.length) {
    txt += `\n${div}\n  INFRAESTRUCTURA\n${div}\n`;
    activeInfra.forEach(i => {
      const q = infraQty[i.id]||1;
      txt += `  ${pad(i.label,36)} x${pad(q,3)} ${rpad(fmtUSD(i.usd*q),10)}  ${rpad(fmtMXN(i.usd*q*fx),14)}\n`;
    });
    txt += `  ${div}\n  ${pad("SUBTOTAL MENSUAL",42)} ${rpad(fmtUSD(costs.infraUSD),12)}  ${rpad(fmtMXN(costs.infraUSD*fx),14)}\n`;
  }
  if (customInfra && customInfra.length) {
    const customInfraUSD = customInfra.reduce((sum, entry) => sum + entry.usd, 0);
    txt += `\n${div}\n  INFRA PERSONALIZADA\n${div}\n`;
    customInfra.forEach(entry => {
      txt += `  ${pad(entry.label,36)} ${rpad(fmtUSD(entry.usd),10)}  ${rpad(fmtMXN(entry.usd * fx),14)}\n`;
    });
    txt += `  ${div}\n  ${pad("SUBTOTAL PERSONALIZADO",42)} ${rpad(fmtUSD(customInfraUSD),12)}  ${rpad(fmtMXN(customInfraUSD*fx),14)}\n`;
  }

  const activeStack = STACK.filter(s => stackOn[s.id]);
  if (activeStack.length) {
    txt += `\n${div}\n  STACK & SAAS\n${div}\n`;
    activeStack.forEach(s => {
      const q = stackQty[s.id]||1;
      const c = s.usd*q;
      txt += `  ${pad(s.label,36)} ${s.usd>0?`x${pad(q,3)} ${rpad(fmtUSD(c),10)}  ${rpad(fmtMXN(c*fx),14)}`:"variable"}\n`;
    });
    txt += `  ${div}\n  ${pad("SUBTOTAL MENSUAL",42)} ${rpad(fmtUSD(costs.stackUSD),12)}  ${rpad(fmtMXN(costs.stackUSD*fx),14)}\n`;
  }
  if (customStack && customStack.length) {
    const customStackUSD = customStack.reduce((sum, entry) => sum + entry.usd, 0);
    txt += `\n${div}\n  STACK PERSONALIZADO\n${div}\n`;
    customStack.forEach(entry => {
      txt += `  ${pad(entry.label,36)} ${rpad(fmtUSD(entry.usd),10)}  ${rpad(fmtMXN(entry.usd * fx),14)}\n`;
    });
    txt += `  ${div}\n  ${pad("SUBTOTAL PERSONALIZADO",42)} ${rpad(fmtUSD(customStackUSD),12)}  ${rpad(fmtMXN(customStackUSD*fx),14)}\n`;
  }

  const activeAI = AI_PROVIDERS.filter(a => aiOn[a.id]);
  if (activeAI.length) {
    txt += `\n${div}\n  INTELIGENCIA ARTIFICIAL\n${div}\n`;
    activeAI.forEach(a => {
      const isFlat = a.flatUSD!=null&&a.flatUSD>0;
      const tk = aiTokensM[a.id]||0;
      const c = isFlat?a.flatUSD:(tk*a.inputPer1M+tk*0.43*a.outputPer1M);
      txt += `  ${pad(a.label,36)} ${pad(isFlat?"flat":`${tk}M tok`,12)} ${rpad(fmtUSD(c),10)}  ${rpad(fmtMXN(c*fx),14)}\n`;
    });
    txt += `  ${div}\n  ${pad("SUBTOTAL MENSUAL",42)} ${rpad(fmtUSD(costs.aiUSD),12)}  ${rpad(fmtMXN(costs.aiUSD*fx),14)}\n`;
  }
  if (customAI && customAI.length) {
    const customAIUSD = customAI.reduce((sum, entry) => sum + entry.usd, 0);
    txt += `\n${div}\n  IA PERSONALIZADA\n${div}\n`;
    customAI.forEach(entry => {
      txt += `  ${pad(entry.label,36)} ${rpad(fmtUSD(entry.usd),10)}  ${rpad(fmtMXN(entry.usd * fx),14)}\n`;
    });
    txt += `  ${div}\n  ${pad("SUBTOTAL PERSONALIZADO",42)} ${rpad(fmtUSD(customAIUSD),12)}  ${rpad(fmtMXN(customAIUSD*fx),14)}\n`;
  }

  const activeSellers = sellers.filter(s => s.name && s.commPct > 0);
  if (activeSellers.length) {
    txt += `\n${div}\n  COMISIONES\n${div}\n`;
    activeSellers.forEach(s => {
      const base = s.appliesToNet ? costs.withCont : costs.withMargin;
      txt += `  ${pad(s.name,28)} ${pad(s.role,20)} ${s.commPct}%  ${rpad(fmtUSD(base*s.commPct/100),12)}\n`;
    });
    txt += `  ${div}\n  ${pad("TOTAL COMISIONES",42)} ${rpad(fmtUSD(costs.totalCommUSD),12)}  ${rpad(fmtMXN(costs.totalCommUSD*fx),14)}\n`;
  }

  txt += `\n${sep}\n  RESUMEN FINANCIERO\n${sep}\n\n`;
  txt += `  ${pad("",36)} ${"USD".padStart(14)} ${"MXN".padStart(18)}\n  ${div}\n`;
  const rows = [
    ["Costo mensual operativo", costs.monthlyUSD],
    [`Costo base del proyecto (x${months} meses)`, costs.projectBase],
    [`+ Contingencia ${contingency}%`, costs.withCont],
    [`= PRECIO AL CLIENTE (+ margen ${margin}%)`, costs.withMargin],
  ];
  if (costs.totalCommUSD>0) {
    rows.push([`  - Comisiones vendedores`, -costs.totalCommUSD]);
    rows.push([`= PRECIO NETO PARA TI`, costs.withMargin-costs.totalCommUSD]);
  }
  rows.push([`  Ganancia bruta`, costs.profit]);
  rows.forEach(([label, usd]) => {
    txt += `  ${pad(label,38)} ${rpad(fmtUSD(Math.abs(usd)),14)} ${rpad(fmtMXN(Math.abs(usd)*fx),18)}\n`;
    if (label.startsWith("=")) txt += `  ${div}\n`;
  });

  txt += `\n${div}\n  CONSIDERACIONES FISCALES (ORIENTATIVO)\n${div}\n`;
  txt += `  IVA 16% trasladado al cliente  : ${fmtUSD(costs.withMargin*0.16)} / ${fmtMXN(costs.withMargin*0.16*fx)}\n`;
  txt += `  Total a facturar (precio+IVA)  : ${fmtUSD(costs.withMargin*1.16)} / ${fmtMXN(costs.withMargin*1.16*fx)}\n`;
  txt += `  ISR estimado PM 30% s/ganancia : ${fmtUSD(costs.profit*0.30)} / ${fmtMXN(costs.profit*0.30*fx)}\n`;
  txt += `  * Datos orientativos. Consultar con contador.\n`;
  txt += `\n${sep}\n  Generado con COSTCALC · ${now}\n${sep}\n`;

  const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `estimacion-${(project.name||"proyecto").toLowerCase().replace(/\s+/g,"-")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [tab, setTab] = useState("human");
  const [fx, setFx] = useState(DEFAULT_FX);
  const [months, setMonths] = useState(3);
  const [margin, setMargin] = useState(30);
  const [contingency, setContingency] = useState(15);
  const [includeCargaSocial, setIncludeCargaSocial] = useState(true);
  const [project, setProject] = useState({ name: "", client: "", version: "1.0", description: "" });
  const setProj = (k, v) => setProject(p => ({ ...p, [k]: v }));
  const [teamCount, setTeamCount] = useState({});
  const [teamSeniority, setTeamSeniority] = useState({});
  const [infraOn, setInfraOn] = useState({});
  const [infraQty, setInfraQty] = useState({});
  const [stackOn, setStackOn] = useState({});
  const [stackQty, setStackQty] = useState({});
  const [aiOn, setAiOn] = useState({});
  const [aiTokensM, setAiTokensM] = useState({});
  const [sellers, setSellers] = useState([{ id: 1, name: "", role: "Vendedor / BDR", commPct: 10, appliesToNet: false }]);
  const [fiscalRegimen, setFiscalRegimen] = useState("pm_general");
  const [isrIncome, setIsrIncome] = useState(500000);
  const [customHumans, setCustomHumans] = useState([]);
  const [customHumanLabel, setCustomHumanLabel] = useState("");
  const [customHumanCost, setCustomHumanCost] = useState(0);
  const [customInfra, setCustomInfra] = useState([]);
  const [customInfraLabel, setCustomInfraLabel] = useState("");
  const [customInfraCost, setCustomInfraCost] = useState(0);
  const [customStack, setCustomStack] = useState([]);
  const [customStackLabel, setCustomStackLabel] = useState("");
  const [customStackCost, setCustomStackCost] = useState(0);
  const [customAI, setCustomAI] = useState([]);
  const [customAILabel, setCustomAILabel] = useState("");
  const [customAICost, setCustomAICost] = useState(0);

  const setCount = useCallback((id,v)=>setTeamCount(p=>({...p,[id]:Math.max(0,Math.floor(v))})),[]);
  const setSen = useCallback((id,v)=>setTeamSeniority(p=>({...p,[id]:v})),[]);
  const toggleI = useCallback((id)=>setInfraOn(p=>({...p,[id]:!p[id]})),[]);
  const setIQ = useCallback((id,v)=>setInfraQty(p=>({...p,[id]:Math.max(1,Math.floor(v))})),[]);
  const toggleS = useCallback((id)=>setStackOn(p=>({...p,[id]:!p[id]})),[]);
  const setSQ = useCallback((id,v)=>setStackQty(p=>({...p,[id]:Math.max(1,Math.floor(v))})),[]);
  const toggleA = useCallback((id)=>setAiOn(p=>({...p,[id]:!p[id]})),[]);
  const setATok = useCallback((id,v)=>setAiTokensM(p=>({...p,[id]:Math.max(0,v)})),[]);

  const addSeller = () => setSellers(p=>[...p,{id:Date.now(),name:"",role:"Vendedor",commPct:10,appliesToNet:false}]);
  const removeSeller = (id) => setSellers(p=>p.filter(s=>s.id!==id));
  const updateSeller = (id,k,v) => setSellers(p=>p.map(s=>s.id===id?{...s,[k]:v}:s));
  const addCustomHuman = () => {
    const label = customHumanLabel.trim();
    if (!label || customHumanCost <= 0) return;
    setCustomHumans(p => [...p, { id: Date.now(), label, mxn: customHumanCost }]);
    setCustomHumanLabel("");
    setCustomHumanCost(0);
  };
  const removeCustomHuman = (id) => setCustomHumans(p => p.filter(entry => entry.id !== id));
  const addCustomInfra = () => {
    const label = customInfraLabel.trim();
    if (!label || customInfraCost <= 0) return;
    setCustomInfra(p => [...p, { id: Date.now(), label, usd: customInfraCost }]);
    setCustomInfraLabel("");
    setCustomInfraCost(0);
  };
  const removeCustomInfra = (id) => setCustomInfra(p => p.filter(entry => entry.id !== id));
  const addCustomStack = () => {
    const label = customStackLabel.trim();
    if (!label || customStackCost <= 0) return;
    setCustomStack(p => [...p, { id: Date.now(), label, usd: customStackCost }]);
    setCustomStackLabel("");
    setCustomStackCost(0);
  };
  const removeCustomStack = (id) => setCustomStack(p => p.filter(entry => entry.id !== id));
  const addCustomAI = () => {
    const label = customAILabel.trim();
    if (!label || customAICost <= 0) return;
    setCustomAI(p => [...p, { id: Date.now(), label, usd: customAICost }]);
    setCustomAILabel("");
    setCustomAICost(0);
  };
  const removeCustomAI = (id) => setCustomAI(p => p.filter(entry => entry.id !== id));

  const costs = useMemo(()=>{
    let humanMXN=0;
    ROLES.forEach(r=>{
      const cnt=teamCount[r.id]||0; if(!cnt)return;
      const sen=teamSeniority[r.id]||"mid";
      const sal=sen==="min"?r.minMXN:sen==="max"?r.maxMXN:Math.round((r.minMXN+r.maxMXN)/2);
      humanMXN+=sal*cnt;
    });
    const customHumanMXN = customHumans.reduce((sum, entry) => sum + entry.mxn, 0);
    humanMXN += customHumanMXN;
    if(includeCargaSocial) humanMXN*=(1+CARGA_SOCIAL_FACTOR);
    const humanUSD=humanMXN/fx;
    let infraUSD=0; INFRA.forEach(i=>{if(infraOn[i.id])infraUSD+=i.usd*(infraQty[i.id]||1);});
    const customInfraUSD = customInfra.reduce((sum, entry) => sum + entry.usd, 0);
    infraUSD += customInfraUSD;
    let stackUSD=0; STACK.forEach(s=>{if(stackOn[s.id]&&s.usd>0)stackUSD+=s.usd*(stackQty[s.id]||1);});
    const customStackUSD = customStack.reduce((sum, entry) => sum + entry.usd, 0);
    stackUSD += customStackUSD;
    let aiUSD=0;
    AI_PROVIDERS.forEach(a=>{
      if(!aiOn[a.id])return;
      if(a.flatUSD!=null&&a.flatUSD>0)aiUSD+=a.flatUSD;
      else if(a.inputPer1M>0){const t=aiTokensM[a.id]||0;aiUSD+=t*a.inputPer1M+t*0.43*a.outputPer1M;}
    });
    const customAIUSD = customAI.reduce((sum, entry) => sum + entry.usd, 0);
    aiUSD += customAIUSD;
    const monthlyUSD=humanUSD+infraUSD+stackUSD+aiUSD;
    const projectBase=monthlyUSD*months;
    const withCont=projectBase*(1+contingency/100);
    const withMargin=withCont*(1+margin/100);
    const profit=withMargin-withCont;
    const totalCommUSD=sellers
      .filter(s=>s.name&&s.commPct>0)
      .reduce((sum,s)=>{
        const base = s.appliesToNet ? withCont : withMargin;
        return sum + base * s.commPct / 100;
      },0);
    return{humanMXN,humanUSD,infraUSD,stackUSD,aiUSD,monthlyUSD,projectBase,withCont,withMargin,profit,totalCommUSD};
  },[teamCount,teamSeniority,infraOn,infraQty,stackOn,stackQty,aiOn,aiTokensM,fx,months,margin,contingency,includeCargaSocial,sellers,customHumans,customInfra,customStack,customAI]);

  const selectedRegimen = REGIMENES.find(r=>r.id===fiscalRegimen)||REGIMENES[0];
  const isrAnual = calcISRFisicaAnual(isrIncome);

  const QtyCtrl = ({on,usd,id,qty,setQ})=> on ? (
    <div style={{display:"flex",alignItems:"center",gap:5,marginLeft:6}} onClick={e=>e.stopPropagation()}>
      <span style={{fontSize:10,color:"var(--text3)"}}>x</span>
      <NumInput value={qty[id]||1} onChange={v=>setQ(id,v)} min={1} max={200}/>
      <span style={{fontSize:11,color:"var(--green)",width:90,textAlign:"right"}}>
        {fmtUSD(usd*(qty[id]||1))}
        <div style={{fontSize:9,color:"var(--text3)"}}>{fmtMXN(usd*(qty[id]||1)*fx)}</div>
      </span>
    </div>
  ) : null;

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <header style={{borderBottom:"1px solid var(--border)",background:"var(--bg)",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1120,margin:"0 auto",padding:"12px 20px 0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12,marginBottom:10}}>
            <div>
              <div style={{fontFamily:"var(--display)",fontSize:20,fontWeight:900,color:"#fff",letterSpacing:"-0.02em"}}>
                COST<span style={{color:"var(--green)"}}>CALC</span>
                <span style={{fontSize:9,fontFamily:"var(--mono)",fontWeight:400,color:"var(--text3)",marginLeft:10,letterSpacing:"0.1em"}}>MX 2025</span>
              </div>
              <div style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.14em",marginTop:1}}>ESTIMADOR DE COSTOS PARA PROYECTOS TECNOLOGICOS</div>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
              {[
                {label:"TC MXN/USD",v:fx,s:setFx,min:10,max:25,step:0.1},
                {label:"MESES",v:months,s:setMonths,min:1,max:60},
                {label:"MARGEN %",v:margin,s:setMargin,min:0,max:200},
                {label:"CONTINGENCIA %",v:contingency,s:setContingency,min:0,max:50},
              ].map(c=>(
                <div key={c.label} style={{textAlign:"center"}}>
                  <div style={{fontSize:8,letterSpacing:"0.12em",color:"var(--text3)",marginBottom:3}}>{c.label}</div>
                  <NumInput value={c.v} onChange={c.s} min={c.min} max={c.max} step={c.step||1}/>
                </div>
              ))}
              <div style={{borderLeft:"1px solid var(--border)",paddingLeft:12,textAlign:"right"}}>
                <div style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:2}}>COSTO MENSUAL</div>
                <div style={{fontFamily:"var(--display)",fontSize:17,fontWeight:800,color:"var(--green)",lineHeight:1}}>{fmtUSD(costs.monthlyUSD)}</div>
                <div style={{fontSize:10,color:"var(--text3)",marginTop:1}}>{fmtMXN(costs.monthlyUSD*fx)}</div>
              </div>
            </div>
          </div>
          <div style={{display:"flex",overflowX:"auto"}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",fontFamily:"var(--mono)",fontSize:11,letterSpacing:"0.05em",padding:"7px 13px",color:tab===t.id?"var(--green)":"var(--text3)",borderBottom:`2px solid ${tab===t.id?"var(--green)":"transparent"}`,cursor:"pointer",whiteSpace:"nowrap",transition:"color 0.15s"}}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main style={{maxWidth:1120,margin:"0 auto",padding:"18px 20px",width:"100%",flex:1}}>

        {tab==="human" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:10,color:"var(--text3)",letterSpacing:"0.1em",textTransform:"uppercase"}}>Salarios mercado MX 2025 — OCC, LinkedIn Salary, Glassdoor MX</div>
              <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",fontSize:11,color:"var(--text2)"}}>
                <input type="checkbox" checked={includeCargaSocial} onChange={e=>setIncludeCargaSocial(e.target.checked)} style={{accentColor:"var(--green)"}}/>
                Incluir carga social +{Math.round(CARGA_SOCIAL_FACTOR*100)}% (IMSS, INFONAVIT, prestaciones)
              </label>
            </div>
            {ROLE_CATS.map(cat=>(
              <SectionCard key={cat}>
                <CatHeader label={cat}/>
                {ROLES.filter(r=>r.cat===cat).map(r=>{
                  const cnt=teamCount[r.id]||0;
                  const sen=teamSeniority[r.id]||"mid";
                  const base=sen==="min"?r.minMXN:sen==="max"?r.maxMXN:Math.round((r.minMXN+r.maxMXN)/2);
                  const eff=includeCargaSocial?Math.round(base*(1+CARGA_SOCIAL_FACTOR)):base;
                  return(
                    <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px",borderBottom:"1px solid var(--border)",flexWrap:"wrap"}}>
                      <div style={{flex:1,minWidth:170,fontSize:12}}>{r.label}</div>
                      <div style={{fontSize:10,color:"var(--text3)",width:135,textAlign:"right"}}>{fmtMXN(r.minMXN)} – {fmtMXN(r.maxMXN)}</div>
                      <SelectInput value={sen} onChange={v=>setSen(r.id,v)} options={[{value:"min",label:"Junior"},{value:"mid",label:"Mid"},{value:"max",label:"Senior"}]}/>
                      <div style={{fontSize:11,color:"var(--text2)",width:105,textAlign:"right"}}>
                        {fmtMXN(eff)}/mes
                        <div style={{fontSize:9,color:"var(--text3)"}}>{fmtUSD(eff/fx)}</div>
                      </div>
                      <NumInput value={cnt} onChange={v=>setCount(r.id,v)} min={0} max={30}/>
                      <div style={{width:115,textAlign:"right"}}>
                        {cnt>0?<><div style={{fontSize:12,color:"var(--green)"}}>{fmtMXN(eff*cnt)}</div><div style={{fontSize:10,color:"var(--text3)"}}>{fmtUSD(eff*cnt/fx)}</div></>:<span style={{color:"var(--border2)"}}>—</span>}
                      </div>
                    </div>
                  );
                })}
              </SectionCard>
            ))}
            <div style={{display:"flex",justifyContent:"flex-end",gap:12}}>
              <span style={{fontSize:11,color:"var(--text3)"}}>Total mensual capital humano:</span>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:15,color:"var(--green)"}}>{fmtMXN(costs.humanMXN)}/mes</div>
                <div style={{fontSize:12,color:"var(--text3)"}}>{fmtUSD(costs.humanUSD)}/mes</div>
              </div>
            </div>
            <SectionCard>
              <CatHeader label="Perfiles personalizados"/>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",padding:"10px 16px"}}>
                <TextInput value={customHumanLabel} onChange={setCustomHumanLabel} placeholder="Nombre del perfil" style={{flex:1}}/>
                <NumInput value={customHumanCost} onChange={setCustomHumanCost} min={0} max={200000} step={1000} style={{width:120}}/>
                <button onClick={addCustomHuman} style={{background:"var(--green)",border:"none",padding:"6px 12px",borderRadius:6,fontSize:11,fontFamily:"var(--mono)"}}>Agregar</button>
              </div>
              {customHumans.length ? (
                <div style={{padding:"0 16px 12px"}}>
                  {customHumans.map(entry=>(
                    <div key={entry.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:"1px solid var(--border)"}}>
                      <div>
                        <div style={{fontSize:12,color:"var(--text)"}}>{entry.label}</div>
                        <div style={{fontSize:10,color:"var(--text3)"}}>{fmtMXN(entry.mxn)}/mes · {fmtUSD(entry.mxn/fx)}</div>
                      </div>
                      <button onClick={()=>removeCustomHuman(entry.id)} style={{background:"none",border:"1px solid var(--border2)",color:"var(--text3)",borderRadius:4,padding:"2px 8px",fontSize:11}}>Eliminar</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{padding:"0 16px 12px",fontSize:10,color:"var(--text3)"}}>Sin perfiles personalizados aún.</div>
              )}
            </SectionCard>
          </div>
        )}

        {tab==="infra" && (
          <div>
            <div style={{fontSize:10,color:"var(--text3)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>Precios USD/mes — region us-east / global · Q1 2025</div>
            {INFRA_CATS.map(cat=>(
              <SectionCard key={cat}>
                <CatHeader label={cat}/>
                {INFRA.filter(i=>i.cat===cat).map(item=>(
                  <div key={item.id} style={{display:"flex",alignItems:"center",padding:"0 4px 0 0"}}>
                    <div style={{flex:1}}>
                      <Row checked={!!infraOn[item.id]} onToggle={()=>toggleI(item.id)} label={item.label} sublabel={item.note}
                        right={`$${item.usd}/mes`} rightDim={fmtMXN(item.usd*fx)}/>
                    </div>
                    <QtyCtrl on={infraOn[item.id]} usd={item.usd} id={item.id} qty={infraQty} setQ={setIQ}/>
                  </div>
                ))}
              </SectionCard>
            ))}
            <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
              <span style={{fontSize:11,color:"var(--text3)"}}>Total mensual infra:</span>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:14,color:"var(--blue)"}}>{fmtUSD(costs.infraUSD)}/mes</div>
                <div style={{fontSize:11,color:"var(--text3)"}}>{fmtMXN(costs.infraUSD*fx)}</div>
              </div>
            </div>
            <SectionCard>
              <CatHeader label="Infraestructura personalizada"/>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",padding:"10px 16px"}}>
                <TextInput value={customInfraLabel} onChange={setCustomInfraLabel} placeholder="Proveedor / servicio" style={{flex:1}}/>
                <NumInput value={customInfraCost} onChange={setCustomInfraCost} min={0} max={5000} step={10} style={{width:110}}/>
                <button onClick={addCustomInfra} style={{background:"var(--blue)",border:"none",padding:"6px 12px",borderRadius:6,fontSize:11,fontFamily:"var(--mono)"}}>Agregar</button>
              </div>
              {customInfra.length ? (
                <div style={{padding:"0 16px 12px"}}>
                  {customInfra.map(entry=>(
                    <div key={entry.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:"1px solid var(--border)"}}>
                      <div>
                        <div style={{fontSize:12,color:"var(--text)"}}>{entry.label}</div>
                        <div style={{fontSize:10,color:"var(--text3)"}}>{fmtUSD(entry.usd)}/mes · {fmtMXN(entry.usd*fx)}</div>
                      </div>
                      <button onClick={()=>removeCustomInfra(entry.id)} style={{background:"none",border:"1px solid var(--border2)",color:"var(--text3)",borderRadius:4,padding:"2px 8px",fontSize:11}}>Eliminar</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{padding:"0 16px 12px",fontSize:10,color:"var(--text3)"}}>Sin infra personalizada.</div>
              )}
            </SectionCard>
          </div>
        )}

        {tab==="stack" && (
          <div>
            <div style={{fontSize:10,color:"var(--text3)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>SaaS, APIs y proveedores — precios USD/mes 2025</div>
            {STACK_CATS.map(cat=>(
              <SectionCard key={cat}>
                <CatHeader label={cat}/>
                {STACK.filter(s=>s.cat===cat).map(item=>(
                  <div key={item.id} style={{display:"flex",alignItems:"center",padding:"0 4px 0 0"}}>
                    <div style={{flex:1}}>
                      <Row checked={!!stackOn[item.id]} onToggle={()=>toggleS(item.id)} label={item.label}
                        sublabel={item.usd>0?item.unit:null} note={item.note||null}
                        right={item.usd>0?`$${item.usd}/mes`:"variable"} rightDim={item.usd>0?fmtMXN(item.usd*fx):null}/>
                    </div>
                    {stackOn[item.id]&&item.usd>0&&<QtyCtrl on={true} usd={item.usd} id={item.id} qty={stackQty} setQ={setSQ}/>}
                  </div>
                ))}
              </SectionCard>
            ))}
            <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
              <span style={{fontSize:11,color:"var(--text3)"}}>Total mensual stack:</span>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:14,color:"var(--amber)"}}>{fmtUSD(costs.stackUSD)}/mes</div>
                <div style={{fontSize:11,color:"var(--text3)"}}>{fmtMXN(costs.stackUSD*fx)}</div>
              </div>
            </div>
            <SectionCard>
              <CatHeader label="Stack personalizado"/>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",padding:"10px 16px"}}>
                <TextInput value={customStackLabel} onChange={setCustomStackLabel} placeholder="Herramienta / SaaS" style={{flex:1}}/>
                <NumInput value={customStackCost} onChange={setCustomStackCost} min={0} max={5000} step={10} style={{width:110}}/>
                <button onClick={addCustomStack} style={{background:"var(--amber)",border:"none",padding:"6px 12px",borderRadius:6,fontSize:11,fontFamily:"var(--mono)"}}>Agregar</button>
              </div>
              {customStack.length ? (
                <div style={{padding:"0 16px 12px"}}>
                  {customStack.map(entry=>(
                    <div key={entry.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:"1px solid var(--border)"}}>
                      <div>
                        <div style={{fontSize:12,color:"var(--text)"}}>{entry.label}</div>
                        <div style={{fontSize:10,color:"var(--text3)"}}>{fmtUSD(entry.usd)}/mes · {fmtMXN(entry.usd*fx)}</div>
                      </div>
                      <button onClick={()=>removeCustomStack(entry.id)} style={{background:"none",border:"1px solid var(--border2)",color:"var(--text3)",borderRadius:4,padding:"2px 8px",fontSize:11}}>Eliminar</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{padding:"0 16px 12px",fontSize:10,color:"var(--text3)"}}>Sin stack personalizado.</div>
              )}
            </SectionCard>
          </div>
        )}

        {tab==="ai" && (
          <div>
            <div style={{fontSize:10,color:"var(--text3)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>
              LLMs: USD por millon de tokens (ratio est. 70/30 in/out) · Otros: tarifa fija mensual
            </div>
            {AI_CATS.map(cat=>(
              <SectionCard key={cat}>
                <CatHeader label={cat}/>
                {AI_PROVIDERS.filter(a=>a.cat===cat).map(item=>{
                  const isFlat=item.flatUSD!=null&&item.flatUSD>0;
                  const isLLM=item.inputPer1M>0&&!isFlat;
                  const tokens=aiTokensM[item.id]||0;
                  const cost=isFlat?item.flatUSD:isLLM?tokens*item.inputPer1M+tokens*0.43*item.outputPer1M:0;
                  return(
                    <div key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",borderBottom:"1px solid var(--border)",cursor:"pointer",flexWrap:"wrap",background:aiOn[item.id]?"rgba(110,255,160,0.025)":"transparent"}} onClick={()=>toggleA(item.id)}>
                      <div style={{width:16,height:16,border:`1.5px solid ${aiOn[item.id]?"var(--green)":"var(--border2)"}`,borderRadius:3,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:aiOn[item.id]?"rgba(110,255,160,0.12)":"transparent"}}>
                        {aiOn[item.id]&&<span style={{color:"var(--green)",fontSize:10}}>&#10003;</span>}
                      </div>
                      <div style={{flex:1,minWidth:160}}>
                        <div style={{fontSize:12}}>{item.label}</div>
                        <div style={{fontSize:10,color:"var(--text3)"}}>
                          {isFlat?`Flat ${fmtUSD(item.flatUSD)}/mes${item.note?` · ${item.note}`:""}`
                            :isLLM?`in: $${item.inputPer1M}/1M · out: $${item.outputPer1M}/1M`:item.note||""}
                        </div>
                      </div>
                      {aiOn[item.id]&&isLLM&&(
                        <div style={{display:"flex",alignItems:"center",gap:6}} onClick={e=>e.stopPropagation()}>
                          <span style={{fontSize:10,color:"var(--text3)"}}>M tokens/mes:</span>
                          <NumInput value={tokens} onChange={v=>setATok(item.id,v)} min={0} step={0.1} style={{width:80}}/>
                        </div>
                      )}
                      <div style={{width:110,textAlign:"right"}}>
                        {aiOn[item.id]?<><div style={{fontSize:12,color:"var(--purple)"}}>{fmtUSD(cost)}</div><div style={{fontSize:10,color:"var(--text3)"}}>{fmtMXN(cost*fx)}</div></>:<span style={{color:"var(--border2)",fontSize:12}}>—</span>}
                      </div>
                    </div>
                  );
                })}
              </SectionCard>
            ))}
            <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
              <span style={{fontSize:11,color:"var(--text3)"}}>Total mensual AI:</span>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:14,color:"var(--purple)"}}>{fmtUSD(costs.aiUSD)}/mes</div>
                <div style={{fontSize:11,color:"var(--text3)"}}>{fmtMXN(costs.aiUSD*fx)}</div>
              </div>
            </div>
            <SectionCard>
              <CatHeader label="IA personalizada"/>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",padding:"10px 16px"}}>
                <TextInput value={customAILabel} onChange={setCustomAILabel} placeholder="Proveedor / modelo" style={{flex:1}}/>
                <NumInput value={customAICost} onChange={setCustomAICost} min={0} max={5000} step={10} style={{width:110}}/>
                <button onClick={addCustomAI} style={{background:"var(--purple)",border:"none",padding:"6px 12px",borderRadius:6,fontSize:11,fontFamily:"var(--mono)"}}>Agregar</button>
              </div>
              {customAI.length ? (
                <div style={{padding:"0 16px 12px"}}>
                  {customAI.map(entry=>(
                    <div key={entry.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:"1px solid var(--border)"}}>
                      <div>
                        <div style={{fontSize:12,color:"var(--text)"}}>{entry.label}</div>
                        <div style={{fontSize:10,color:"var(--text3)"}}>{fmtUSD(entry.usd)}/mes · {fmtMXN(entry.usd*fx)}</div>
                      </div>
                      <button onClick={()=>removeCustomAI(entry.id)} style={{background:"none",border:"1px solid var(--border2)",color:"var(--text3)",borderRadius:4,padding:"2px 8px",fontSize:11}}>Eliminar</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{padding:"0 16px 12px",fontSize:10,color:"var(--text3)"}}>Sin IA personalizada.</div>
              )}
            </SectionCard>
          </div>
        )}

        {tab==="comision" && (
          <div style={{maxWidth:760}}>
            <div style={{fontSize:10,color:"var(--text3)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>
              Vendedores, BDR, agentes y socios — comision sobre precio final o base+contingencia
            </div>
            <SectionCard>
              <CatHeader label="Personas con comision"/>
              {sellers.map(s=>(
                <div key={s.id} style={{padding:"14px 16px",borderBottom:"1px solid var(--border)",display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
                  <div>
                    <div style={{fontSize:9,color:"var(--text3)",marginBottom:4,letterSpacing:"0.1em"}}>NOMBRE / ROL</div>
                    <TextInput value={s.name} onChange={v=>updateSeller(s.id,"name",v)} placeholder="Ej. Carlos Reyes" style={{width:155}}/>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:"var(--text3)",marginBottom:4,letterSpacing:"0.1em"}}>PUESTO</div>
                    <TextInput value={s.role} onChange={v=>updateSeller(s.id,"role",v)} placeholder="Vendedor / Partner" style={{width:145}}/>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:"var(--text3)",marginBottom:4,letterSpacing:"0.1em"}}>COMISION %</div>
                    <NumInput value={s.commPct} onChange={v=>updateSeller(s.id,"commPct",v)} min={0} max={50} step={0.5} style={{width:70}}/>
                  </div>
                  <div style={{flex:1,minWidth:160}}>
                    <div style={{fontSize:9,color:"var(--text3)",marginBottom:4,letterSpacing:"0.1em"}}>BASE DE CALCULO</div>
                    <SelectInput value={s.appliesToNet?"net":"gross"} onChange={v=>updateSeller(s.id,"appliesToNet",v==="net")}
                      options={[{value:"gross",label:"Precio final al cliente"},{value:"net",label:"Base + contingencia (sin margen)"}]} style={{width:200}}/>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:9,color:"var(--text3)",marginBottom:4}}>COMISION EST.</div>
                    <div style={{fontSize:14,color:"var(--cyan)"}}>{fmtUSD((s.appliesToNet?costs.withCont:costs.withMargin)*s.commPct/100)}</div>
                    <div style={{fontSize:10,color:"var(--text3)"}}>{fmtMXN((s.appliesToNet?costs.withCont:costs.withMargin)*s.commPct/100*fx)}</div>
                  </div>
                  {sellers.length>1&&<button onClick={()=>removeSeller(s.id)} style={{background:"none",border:"1px solid var(--border2)",color:"var(--text3)",borderRadius:4,padding:"4px 8px",fontSize:11,cursor:"pointer"}}>x</button>}
                </div>
              ))}
              <div style={{padding:"10px 16px"}}>
                <button onClick={addSeller} style={{background:"none",border:"1px dashed var(--border2)",color:"var(--text3)",borderRadius:5,padding:"6px 14px",fontSize:11,cursor:"pointer",letterSpacing:"0.06em"}}>
                  + Agregar vendedor / socio
                </button>
              </div>
            </SectionCard>

            <SectionCard>
              <CatHeader label="Impacto en precio final"/>
              <div style={{padding:"14px 18px"}}>
                {[
                  {label:"Precio al cliente (antes de comisiones)",usd:costs.withMargin,color:"var(--green)"},
                  {label:"Total comisiones a pagar",usd:costs.totalCommUSD,color:"var(--red)"},
                  {label:"Lo que queda para tu empresa",usd:costs.withMargin-costs.totalCommUSD,color:"var(--cyan)"},
                  {label:`Tu ganancia real tras comisiones`,usd:costs.profit-costs.totalCommUSD,color:"var(--green)"},
                ].map(r=>(
                  <div key={r.label} style={{display:"flex",justifyContent:"space-between",marginBottom:10,alignItems:"center",borderBottom:"1px solid var(--border)",paddingBottom:10}}>
                    <span style={{fontSize:12,color:"var(--text2)"}}>{r.label}</span>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:14,color:r.color}}>{fmtUSD(Math.abs(r.usd))}</div>
                      <div style={{fontSize:10,color:"var(--text3)"}}>{fmtMXN(Math.abs(r.usd*fx))}</div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <div style={{padding:14,background:"#050a10",border:"1px solid rgba(94,184,255,0.15)",borderRadius:8,fontSize:11,color:"var(--text3)",lineHeight:1.8}}>
              <div style={{color:"var(--blue)",marginBottom:4}}>Sobre comisiones en Mexico</div>
              <div>• Las comisiones son deducibles de ISR si se documentan con CFDI de honorarios o nomina.</div>
              <div>• Si el vendedor es PF, retenciones: 10% ISR + 10.67% IVA sobre el importe de su comision.</div>
              <div>• Si es empleado con comision variable, se suma al salario para calculo de IMSS e ISR nomina.</div>
              <div>• Comisiones a socios extranjeros pueden generar retenciones por pagos al extranjero (Art. 166 LISR).</div>
            </div>
          </div>
        )}

        {tab==="fiscal" && (
          <div style={{maxWidth:860}}>
            <div style={{fontSize:10,color:"var(--text3)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>
              Tributacion Mexico 2025 — informacion orientativa. Siempre consultar con contador CPC.
            </div>

            <SectionCard>
              <CatHeader label="Selecciona tu regimen fiscal"/>
              <div style={{padding:"14px 18px"}}>
                {REGIMENES.map(r=>(
                  <div key={r.id} onClick={()=>setFiscalRegimen(r.id)} style={{padding:"12px 14px",border:`1px solid ${fiscalRegimen===r.id?"var(--green)":"var(--border)"}`,borderRadius:8,marginBottom:10,cursor:"pointer",background:fiscalRegimen===r.id?"rgba(110,255,160,0.04)":"var(--bg3)",transition:"all 0.15s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:13,color:fiscalRegimen===r.id?"var(--green)":"var(--text)"}}>{r.label}</span>
                      <span style={{fontSize:12,color:"var(--amber)"}}>ISR efectivo ~{Math.round(r.isrEfectivo*100)}%</span>
                    </div>
                    <div style={{fontSize:11,color:"var(--text3)",marginBottom:4}}>{r.perfil}</div>
                    <div style={{fontSize:10,color:"var(--text2)"}}>{r.ventajas}</div>
                    <div style={{fontSize:10,color:"var(--text3)",marginTop:3}}>Consideraciones: {r.consideraciones}</div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard>
              <CatHeader label={`Impacto fiscal estimado — ${selectedRegimen.label}`}/>
              <div style={{padding:"14px 18px"}}>
                {[
                  {label:"Precio al cliente (base)",usd:costs.withMargin,note:"Lo que cobras",color:"var(--text)"},
                  {label:"IVA 16% (trasladado)",usd:costs.withMargin*0.16,note:"Lo cobras pero lo entregas al SAT mensual",color:"var(--amber)"},
                  {label:"Total a facturar al cliente",usd:costs.withMargin*1.16,note:"Precio + IVA 16%",color:"var(--green)"},
                  {label:"ISR sobre ganancia (est.)",usd:costs.profit*selectedRegimen.isrEfectivo,note:`${Math.round(selectedRegimen.isrEfectivo*100)}% x ganancia bruta`,color:"var(--red)"},
                  {label:"PTU estimada (10%)",usd:costs.profit*0.10,note:"Solo si tienes empleados",color:"var(--red)"},
                  {label:"Ganancia neta tras ISR+PTU",usd:costs.profit-costs.profit*selectedRegimen.isrEfectivo-costs.profit*0.10,note:"Estimado orientativo",color:"var(--cyan)"},
                ].map(r=>(
                  <div key={r.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                    <div>
                      <div style={{fontSize:12,color:"var(--text2)"}}>{r.label}</div>
                      <div style={{fontSize:10,color:"var(--text3)"}}>{r.note}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:13,color:r.color}}>{fmtUSD(r.usd)}</div>
                      <div style={{fontSize:10,color:"var(--text3)"}}>{fmtMXN(r.usd*fx)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard>
              <CatHeader label="Calculadora ISR Persona Fisica — Tabla Art. 152 LISR 2025"/>
              <div style={{padding:"16px 18px"}}>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16,flexWrap:"wrap"}}>
                  <div>
                    <div style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:4}}>INGRESO ANUAL (MXN)</div>
                    <NumInput value={isrIncome} onChange={setIsrIncome} min={0} max={10000000} step={10000} style={{width:130}}/>
                  </div>
                  <div style={{padding:"10px 16px",background:"var(--bg3)",borderRadius:8,flex:1}}>
                    <div style={{fontSize:10,color:"var(--text3)",marginBottom:4}}>ISR ANUAL ESTIMADO</div>
                    <div style={{fontSize:20,color:"var(--amber)",fontFamily:"var(--display)",fontWeight:700}}>{fmtMXN(isrAnual)}</div>
                    <div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>
                      Tasa efectiva: {isrIncome>0?(isrAnual/isrIncome*100).toFixed(1):0}% · Mensual: {fmtMXN(isrAnual/12)}
                    </div>
                  </div>
                </div>
                <div style={{fontSize:10,color:"var(--text3)",lineHeight:1.8,borderTop:"1px solid var(--border)",paddingTop:10}}>
                  <div>Con RESICO PF: {fmtMXN(isrIncome*0.025)} (2.5% max sobre cobrado)</div>
                  <div>Con PM General: {fmtMXN(isrIncome*0.30)} (30% sobre utilidad fiscal)</div>
                  <div>Con PM RESICO: {fmtMXN(isrIncome*0.01)} (1% sobre ingresos totales)</div>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <CatHeader label="Obligaciones periodicas — Tech Startup Mexico"/>
              <div style={{padding:"4px 0"}}>
                {[
                  {freq:"Mensual",desc:"Pago provisional ISR · DIOT · Retenciones ISR/IVA a empleados y honorarios"},
                  {freq:"Mensual",desc:"Declaracion IVA (traslado cobrado menos acreditable pagado)"},
                  {freq:"Mensual",desc:"IMSS SUA — dispersion de cuotas obrero-patronales (si tienes empleados)"},
                  {freq:"Anual",desc:"Declaracion anual ISR (abril PM, mayo PF) · PTU mayo · Conciliacion contable"},
                  {freq:"Eventual",desc:"CFDI de nomina por cada pago a empleados · CFDI honorarios a freelancers"},
                  {freq:"Eventual",desc:"Aviso SAT por inicio de actividades, cambio de regimen, apertura de sucursal"},
                ].map((o,i)=>(
                  <div key={i} style={{display:"flex",gap:14,padding:"9px 18px",borderBottom:"1px solid var(--border)",alignItems:"flex-start"}}>
                    <span style={{fontSize:10,padding:"2px 7px",borderRadius:3,background:o.freq==="Mensual"?"rgba(94,184,255,0.1)":o.freq==="Anual"?"rgba(255,184,48,0.1)":"rgba(110,255,160,0.08)",color:o.freq==="Mensual"?"var(--blue)":o.freq==="Anual"?"var(--amber)":"var(--green)",flexShrink:0,marginTop:1}}>{o.freq}</span>
                    <span style={{fontSize:11,color:"var(--text2)",lineHeight:1.6}}>{o.desc}</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <div style={{padding:12,background:"var(--bg3)",borderRadius:8,fontSize:10,color:"var(--text3)",lineHeight:1.7}}>
              Esta informacion es orientativa y no constituye asesoria fiscal. Mexico 2025. Consultar con contador CPC.
            </div>
          </div>
        )}

        {tab==="summary" && (
          <div>
            <SectionCard>
              <CatHeader label="Informacion del proyecto — aparece en el archivo exportado"/>
              <div style={{padding:"14px 18px",display:"grid",gridTemplateColumns:"1fr 1fr 120px auto",gap:12,alignItems:"flex-end"}}>
                <div>
                  <div style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:4}}>NOMBRE DEL PROYECTO</div>
                  <TextInput value={project.name} onChange={v=>setProj("name",v)} placeholder="Mi App / Sistema X" style={{width:"100%"}}/>
                </div>
                <div>
                  <div style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:4}}>CLIENTE / EMPRESA</div>
                  <TextInput value={project.client} onChange={v=>setProj("client",v)} placeholder="Empresa ABC S.A. de C.V." style={{width:"100%"}}/>
                </div>
                <div>
                  <div style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:4}}>VERSION</div>
                  <TextInput value={project.version} onChange={v=>setProj("version",v)} placeholder="1.0" style={{width:"100%"}}/>
                </div>
                <button
                  onClick={()=>exportTXT({project,costs,fx,months,margin,contingency,team:teamCount,teamSeniority,infraOn,infraQty,stackOn,stackQty,aiOn,aiTokensM,sellers,customHumans,customInfra,customStack,customAI,fiscalLabel:REGIMENES.find(r=>r.id===fiscalRegimen)?.label})}
                  style={{background:"var(--green)",color:"#000",fontFamily:"var(--mono)",fontWeight:500,fontSize:12,letterSpacing:"0.06em",padding:"8px 16px",border:"none",borderRadius:6,cursor:"pointer",whiteSpace:"nowrap",height:34}}>
                  Exportar .txt
                </button>
              </div>
              <div style={{padding:"0 18px 14px"}}>
                <div style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:4}}>DESCRIPCION BREVE DEL PROYECTO</div>
                <textarea value={project.description} onChange={e=>setProj("description",e.target.value)}
                  placeholder="Alcance, objetivos, stack principal, entregables..."
                  rows={2}
                  style={{width:"100%",background:"var(--bg)",border:"1px solid var(--border2)",color:"var(--text)",fontFamily:"var(--mono)",fontSize:11,padding:"7px 10px",borderRadius:5,outline:"none",resize:"vertical",lineHeight:1.6}}
                  onFocus={e=>e.target.style.borderColor="var(--green)"}
                  onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
              </div>
            </SectionCard>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
              <div>
                <div style={{fontSize:10,color:"var(--text3)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>Desglose mensual</div>
                <SectionCard>
                  <div style={{padding:"14px 18px"}}>
                    <BarRow label="Capital Humano" usd={costs.humanUSD} total={costs.monthlyUSD} color="var(--green)"/>
                    <BarRow label="Infraestructura" usd={costs.infraUSD} total={costs.monthlyUSD} color="var(--blue)"/>
                    <BarRow label="Stack & SaaS" usd={costs.stackUSD} total={costs.monthlyUSD} color="var(--amber)"/>
                    <BarRow label="IA & ML" usd={costs.aiUSD} total={costs.monthlyUSD} color="var(--purple)"/>
                  </div>
                </SectionCard>

                <SectionCard>
                  <CatHeader label="Costos mensuales"/>
                  {[
                    {label:"Capital Humano",usd:costs.humanUSD,mxn:costs.humanMXN,c:"var(--green)"},
                    {label:"Infraestructura",usd:costs.infraUSD,mxn:costs.infraUSD*fx,c:"var(--blue)"},
                    {label:"Stack & SaaS",usd:costs.stackUSD,mxn:costs.stackUSD*fx,c:"var(--amber)"},
                    {label:"IA & ML",usd:costs.aiUSD,mxn:costs.aiUSD*fx,c:"var(--purple)"},
                    ...(costs.totalCommUSD>0?[{label:"Comisiones",usd:costs.totalCommUSD,mxn:costs.totalCommUSD*fx,c:"var(--cyan)"}]:[]),
                  ].map(r=>(
                    <div key={r.label} style={{display:"flex",justifyContent:"space-between",padding:"8px 16px",borderBottom:"1px solid var(--border)",alignItems:"center"}}>
                      <span style={{fontSize:12,color:"var(--text2)"}}>{r.label}</span>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:12,color:r.c}}>{fmtUSD(r.usd)}</div>
                        <div style={{fontSize:10,color:"var(--text3)"}}>{fmtMXN(r.mxn)}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",padding:"10px 16px",alignItems:"center"}}>
                    <span style={{fontSize:13}}>TOTAL MENSUAL</span>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:16,color:"var(--green)",fontFamily:"var(--display)",fontWeight:700}}>{fmtUSD(costs.monthlyUSD)}</div>
                      <div style={{fontSize:12,color:"var(--text3)"}}>{fmtMXN(costs.monthlyUSD*fx)}</div>
                    </div>
                  </div>
                </SectionCard>

                <div style={{padding:12,background:"#0f0c00",border:"1px solid rgba(255,184,48,0.14)",borderRadius:8,fontSize:10,color:"var(--text3)",lineHeight:1.8}}>
                  <div style={{color:"var(--amber)",marginBottom:4,fontSize:11}}>Variables no incluidas en totales</div>
                  <div>· Pagos MX (Stripe, Conekta, Openpay, Clip, MP): % variable por transaccion</div>
                  <div>· Meta WhatsApp API: costo por conversacion segun tipo (marketing/utilidad/servicio)</div>
                  <div>· Google Maps: $200 USD credito gratuito mensual incluido</div>
                  <div>· Facturacion SAT: precio fijo MXN + costo por timbre/CFDI</div>
                  <div>· IVA: sumar 16% al precio final para monto total de factura al cliente</div>
                </div>
              </div>

              <div>
                <div style={{fontSize:10,color:"var(--text3)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>Precio final — {months} meses</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[
                    {label:`Costo base (${months} meses)`,usd:costs.projectBase,sub:`${fmtUSD(costs.monthlyUSD)}/mes x ${months}`,c:"var(--text2)"},
                    {label:`+ Contingencia ${contingency}%`,usd:costs.withCont,sub:`Riesgo: +${fmtUSD(costs.withCont-costs.projectBase)}`,c:"var(--amber)"},
                  ].map(b=>(
                    <div key={b.label} style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 18px"}}>
                      <div style={{fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--text3)",marginBottom:6}}>{b.label}</div>
                      <div style={{fontFamily:"var(--display)",fontSize:22,fontWeight:800,color:b.c,lineHeight:1}}>{fmtUSD(b.usd)}</div>
                      <div style={{fontSize:11,color:"var(--text3)",marginTop:3}}>{fmtMXN(b.usd*fx)}</div>
                      <div style={{fontSize:10,color:"var(--text3)",marginTop:4}}>{b.sub}</div>
                    </div>
                  ))}

                  <div style={{background:"linear-gradient(135deg,#0a1a0e,#050f08)",border:"1px solid rgba(110,255,160,0.4)",borderRadius:10,padding:"18px 20px"}}>
                    <div style={{fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--green)",marginBottom:8}}>PRECIO AL CLIENTE + MARGEN {margin}%</div>
                    <div style={{fontFamily:"var(--display)",fontSize:34,fontWeight:900,color:"var(--green)",lineHeight:1}}>{fmtUSD(costs.withMargin)}</div>
                    <div style={{fontSize:15,color:"rgba(110,255,160,0.6)",marginTop:5}}>{fmtMXN(costs.withMargin*fx)}</div>
                    <div style={{marginTop:14,paddingTop:12,borderTop:"1px solid rgba(110,255,160,0.15)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      {[
                        {label:"FACTURA AL CLIENTE (+IVA)",usd:costs.withMargin*1.16},
                        {label:"PRECIO/MES EQUIV.",usd:costs.withMargin/months},
                        {label:"GANANCIA BRUTA",usd:costs.profit},
                        {label:"NETO TRAS COMISIONES",usd:costs.withMargin-costs.totalCommUSD},
                      ].map(s=>(
                        <div key={s.label} style={{background:"rgba(0,0,0,0.3)",borderRadius:6,padding:"9px 12px"}}>
                          <div style={{fontSize:8,color:"rgba(110,255,160,0.45)",letterSpacing:"0.1em",marginBottom:4}}>{s.label}</div>
                          <div style={{fontSize:13,color:"var(--green)",fontFamily:"var(--display)",fontWeight:700}}>{fmtUSD(s.usd)}</div>
                          <div style={{fontSize:10,color:"rgba(110,255,160,0.35)",marginTop:1}}>{fmtMXN(s.usd*fx)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 18px"}}>
                    <div style={{fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--text3)",marginBottom:10}}>
                      Fiscal rapido — {selectedRegimen.label}
                    </div>
                    {[
                      {label:"IVA cobrado (16%)",usd:costs.withMargin*0.16,note:"Entregar al SAT"},
                      {label:"ISR sobre ganancia",usd:costs.profit*selectedRegimen.isrEfectivo,note:`${Math.round(selectedRegimen.isrEfectivo*100)}% x margen`},
                      {label:"Ganancia neta est.",usd:costs.profit*(1-selectedRegimen.isrEfectivo),note:"Orientativo"},
                    ].map(r=>(
                      <div key={r.label} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid var(--border)",alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:11,color:"var(--text2)"}}>{r.label}</div>
                          <div style={{fontSize:9,color:"var(--text3)"}}>{r.note}</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:12,color:"var(--amber)"}}>{fmtUSD(r.usd)}</div>
                          <div style={{fontSize:10,color:"var(--text3)"}}>{fmtMXN(r.usd*fx)}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{fontSize:9,color:"var(--text3)",marginTop:8}}>Cambia el regimen en pestana Fiscal MX</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={{borderTop:"1px solid var(--border)",padding:"10px 20px",fontSize:9,color:"var(--text3)",textAlign:"center",letterSpacing:"0.08em"}}>
        COSTCALC · Estimador de proyectos tech — Mercado mexicano · Q1 2025
      </footer>
    </div>
  );
}

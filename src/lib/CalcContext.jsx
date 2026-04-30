import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ROLES, CARGA_SOCIAL_FACTOR } from "../data/roles.js";
import { INFRA } from "../data/infra.js";
import { STACK } from "../data/stack.js";
import { AI_PROVIDERS } from "../data/ai.js";
import { EQUIPOS } from "../data/equipos.js";
import { OFICINA } from "../data/oficina.js";
import { ADMIN } from "../data/admin.js";
import { BENEFICIOS } from "../data/beneficios.js";
import { MOVILIDAD } from "../data/movilidad.js";
import { REGIMENES, getCargaSocialFactor, NOM_037 } from "../data/fiscal.js";
import {
  DEFAULT_FX, DEFAULT_PROJECT, DEFAULT_SELLER,
  FX_API_URL, CONFIG_VERSION, MODE_OPTIONS, TABS, emptyObject,
} from "./constants.js";
import { getRoleMonthlyMXN, getStackCost, getAICost, sumCatalog } from "./cost.js";
import { downloadJSON } from "./export.js";

const CalcContext = createContext(null);

export function useCalc() {
  const ctx = useContext(CalcContext);
  if (!ctx) throw new Error("useCalc must be used inside <CalcProvider>");
  return ctx;
}

export function CalcProvider({ children }) {
  // ─── UI / mode ────────────────────────────────────────────────────────────
  const [mode, setMode] = useState("project");
  const [hoursPerMonth, setHoursPerMonth] = useState(160);
  const [tab, setTab] = useState("human");
  const [themeMode, setThemeMode] = useState("system");

  // ─── Params globales ──────────────────────────────────────────────────────
  const [fx, setFx] = useState(DEFAULT_FX);
  const [fxAuto, setFxAuto] = useState(true);
  const [fxStatus, setFxStatus] = useState("idle");
  const [fxUpdatedAt, setFxUpdatedAt] = useState(null);
  const [months, setMonths] = useState(3);
  const [margin, setMargin] = useState(30);
  const [contingency, setContingency] = useState(15);
  const [project, setProject] = useState(DEFAULT_PROJECT);
  const fileInputRef = useRef(null);

  // ─── Carga social MX ──────────────────────────────────────────────────────
  const [includeCargaSocial, setIncludeCargaSocial] = useState(true);
  const [mxState, setMxState] = useState("cdmx");
  const [aguinaldo30, setAguinaldo30] = useState(false);
  const [includePTUFactor, setIncludePTUFactor] = useState(true);
  const [includeNOM037, setIncludeNOM037] = useState(false);
  const [nom037MXN, setNom037MXN] = useState(NOM_037.defaultMXN);

  // ─── Catálogos: estados on/qty/usage ──────────────────────────────────────
  const [teamCount, setTeamCount] = useState(emptyObject);
  const [teamSeniority, setTeamSeniority] = useState(emptyObject);
  const [infraOn, setInfraOn] = useState(emptyObject);
  const [infraQty, setInfraQty] = useState(emptyObject);
  const [stackOn, setStackOn] = useState(emptyObject);
  const [stackQty, setStackQty] = useState(emptyObject);
  const [stackVariable, setStackVariable] = useState(emptyObject);
  const [aiOn, setAiOn] = useState(emptyObject);
  const [aiUsage, setAiUsage] = useState(emptyObject);
  const [equiposOn, setEquiposOn] = useState(emptyObject);
  const [equiposQty, setEquiposQty] = useState(emptyObject);
  const [oficinaOn, setOficinaOn] = useState(emptyObject);
  const [oficinaQty, setOficinaQty] = useState(emptyObject);
  const [adminOn, setAdminOn] = useState(emptyObject);
  const [adminQty, setAdminQty] = useState(emptyObject);
  const [benefOn, setBenefOn] = useState(emptyObject);
  const [benefQty, setBenefQty] = useState(emptyObject);
  const [movilOn, setMovilOn] = useState(emptyObject);
  const [movilQty, setMovilQty] = useState(emptyObject);

  const [sellers, setSellers] = useState([DEFAULT_SELLER]);

  // ─── Fiscal MX + avanzado ─────────────────────────────────────────────────
  const [fiscalRegimen, setFiscalRegimen] = useState("pm_general");
  const [isrIncome, setIsrIncome] = useState(500000);
  const [extranjeroPagoUSD, setExtranjeroPagoUSD] = useState(0);
  const [extranjeroTratadoUSA, setExtranjeroTratadoUSA] = useState(true);
  const [extranjeroConcepto, setExtranjeroConcepto] = useState("regalia_software");
  const [ivaImportDigital, setIvaImportDigital] = useState(false);
  const [ivaExportacion, setIvaExportacion] = useState(false);
  const [usEstadoSel, setUsEstadoSel] = useState("us_ca");
  const [usSalaryUSD, setUsSalaryUSD] = useState(120000);

  // ─── Custom items ─────────────────────────────────────────────────────────
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

  // ─── Theme ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const applyTheme = () => {
      const resolved = themeMode === "system" ? (mediaQuery.matches ? "light" : "dark") : themeMode;
      document.documentElement.dataset.theme = resolved;
    };
    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [themeMode]);

  // ─── FX live ──────────────────────────────────────────────────────────────
  const fetchFx = useCallback(async () => {
    setFxStatus("loading");
    try {
      const response = await fetch(FX_API_URL);
      const data = await response.json();
      const rate = data?.rates?.MXN;
      if (typeof rate === "number" && rate > 0) {
        setFx(Math.round(rate * 100) / 100);
        setFxUpdatedAt(new Date().toISOString());
        setFxStatus("ok");
      } else {
        setFxStatus("error");
      }
    } catch {
      setFxStatus("error");
    }
  }, []);

  useEffect(() => { if (fxAuto) fetchFx(); }, [fxAuto, fetchFx]);

  // ─── Auto-redirigir tab si modo no lo permite ────────────────────────────
  useEffect(() => {
    const allowed = TABS.filter((t) => t.modes.includes(mode)).map((t) => t.id);
    if (!allowed.includes(tab)) setTab(allowed[0] || "summary");
  }, [mode, tab]);

  // ─── Auto-cambiar régimen al cambiar de modo ──────────────────────────────
  const prevModeRef = useRef(mode);
  useEffect(() => {
    if (prevModeRef.current === mode) return;
    prevModeRef.current = mode;
    if (mode === "freelancer" && (fiscalRegimen === "pm_general" || fiscalRegimen === "resico_moral")) {
      setFiscalRegimen("resico_fisica");
    }
    if (mode === "org" && (fiscalRegimen === "resico_fisica" || fiscalRegimen === "pf_profesional")) {
      setFiscalRegimen("pm_general");
    }
  }, [mode, fiscalRegimen]);

  // ─── Setters concretos ────────────────────────────────────────────────────
  const setProj = useCallback((key, v) => setProject((prev) => ({ ...prev, [key]: v })), []);
  const setCount = useCallback((id, v) => setTeamCount((prev) => ({ ...prev, [id]: Math.max(0, Math.floor(v)) })), []);
  const setSen = useCallback((id, v) => setTeamSeniority((prev) => ({ ...prev, [id]: v })), []);
  const toggleInfra = useCallback((id) => setInfraOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const setInfraQuantity = useCallback((id, v) => setInfraQty((prev) => ({ ...prev, [id]: Math.max(1, Math.floor(v)) })), []);
  const toggleStack = useCallback((id) => setStackOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const setStackQuantity = useCallback((id, v) => setStackQty((prev) => ({ ...prev, [id]: Math.max(1, Math.floor(v)) })), []);
  const updateStackVariable = useCallback((id, key, v) => {
    setStackVariable((prev) => {
      const current = prev[id] || { mode: "usage", rate: 0.1, quantity: 1000, label: "unidades" };
      return { ...prev, [id]: { ...current, [key]: v } };
    });
  }, []);
  const toggleAI = useCallback((id) => setAiOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const updateAIUsage = useCallback((id, key, v) => {
    setAiUsage((prev) => {
      const item = AI_PROVIDERS.find((p) => p.id === id);
      const defaults = item?.billing === "tokens" ? { units: 0, tokensM: 1, outputTokensM: 0.43 } : { units: 0, tokensM: 0, outputTokensM: 0 };
      const current = prev[id] || defaults;
      return { ...prev, [id]: { ...current, [key]: v } };
    });
  }, []);
  const toggleEquipos = useCallback((id) => setEquiposOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const setEquiposQuantity = useCallback((id, v) => setEquiposQty((prev) => ({ ...prev, [id]: Math.max(1, Math.floor(v)) })), []);
  const toggleOficina = useCallback((id) => setOficinaOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const setOficinaQuantity = useCallback((id, v) => setOficinaQty((prev) => ({ ...prev, [id]: Math.max(1, Math.floor(v)) })), []);
  const toggleAdmin = useCallback((id) => setAdminOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const setAdminQuantity = useCallback((id, v) => setAdminQty((prev) => ({ ...prev, [id]: Math.max(1, Math.floor(v)) })), []);
  const toggleBenef = useCallback((id) => setBenefOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const setBenefQuantity = useCallback((id, v) => setBenefQty((prev) => ({ ...prev, [id]: Math.max(1, Math.floor(v)) })), []);
  const toggleMovil = useCallback((id) => setMovilOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const setMovilQuantity = useCallback((id, v) => setMovilQty((prev) => ({ ...prev, [id]: Math.max(1, Math.floor(v)) })), []);

  const addSeller = () => setSellers((prev) => [...prev, { id: Date.now(), name: "", role: "Vendedor", commPct: 10, appliesToNet: false }]);
  const removeSeller = (id) => setSellers((prev) => prev.filter((s) => s.id !== id));
  const updateSeller = (id, key, v) => setSellers((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: v } : s)));

  const addCustomHuman = () => {
    const label = customHumanLabel.trim();
    if (!label || customHumanCost <= 0) return;
    setCustomHumans((prev) => [...prev, { id: Date.now(), label, mxn: customHumanCost }]);
    setCustomHumanLabel(""); setCustomHumanCost(0);
  };
  const addCustomInfra = () => {
    const label = customInfraLabel.trim();
    if (!label || customInfraCost <= 0) return;
    setCustomInfra((prev) => [...prev, { id: Date.now(), label, usd: customInfraCost }]);
    setCustomInfraLabel(""); setCustomInfraCost(0);
  };
  const addCustomStack = () => {
    const label = customStackLabel.trim();
    if (!label || customStackCost <= 0) return;
    setCustomStack((prev) => [...prev, { id: Date.now(), label, usd: customStackCost }]);
    setCustomStackLabel(""); setCustomStackCost(0);
  };
  const addCustomAI = () => {
    const label = customAILabel.trim();
    if (!label || customAICost <= 0) return;
    setCustomAI((prev) => [...prev, { id: Date.now(), label, usd: customAICost }]);
    setCustomAILabel(""); setCustomAICost(0);
  };
  const removeCustomHuman = (id) => setCustomHumans((prev) => prev.filter((e) => e.id !== id));
  const removeCustomInfra = (id) => setCustomInfra((prev) => prev.filter((e) => e.id !== id));
  const removeCustomStack = (id) => setCustomStack((prev) => prev.filter((e) => e.id !== id));
  const removeCustomAI = (id) => setCustomAI((prev) => prev.filter((e) => e.id !== id));

  // ─── Cálculo principal ────────────────────────────────────────────────────
  const cargaSocialFactor = useMemo(() => {
    if (mode === "freelancer") return 0;
    return includeCargaSocial
      ? getCargaSocialFactor({ stateId: mxState, includePTU: includePTUFactor, aguinaldo30Dias: aguinaldo30 })
      : 0;
  }, [mode, includeCargaSocial, mxState, includePTUFactor, aguinaldo30]);

  const selectedRegimen = REGIMENES.find((r) => r.id === fiscalRegimen) || REGIMENES[0];

  const costs = useMemo(() => {
    let humanBaseMXN = 0;
    let totalPersonas = 0;
    ROLES.forEach((role) => {
      const count = teamCount[role.id] || 0;
      if (!count) return;
      humanBaseMXN += getRoleMonthlyMXN(role, teamSeniority[role.id] || "mid") * count;
      totalPersonas += count;
    });
    humanBaseMXN += customHumans.reduce((sum, e) => sum + e.mxn, 0);
    totalPersonas += customHumans.length;

    let humanMXN = humanBaseMXN * (1 + cargaSocialFactor);
    if (mode !== "freelancer" && includeNOM037 && totalPersonas > 0) {
      humanMXN += nom037MXN * totalPersonas;
    }

    let infraUSD = customInfra.reduce((sum, e) => sum + e.usd, 0);
    INFRA.forEach((item) => { if (infraOn[item.id]) infraUSD += item.usd * (infraQty[item.id] || 1); });

    let stackUSD = customStack.reduce((sum, e) => sum + e.usd, 0);
    STACK.forEach((item) => { if (stackOn[item.id]) stackUSD += getStackCost(item, stackQty, stackVariable); });

    let aiUSD = customAI.reduce((sum, e) => sum + e.usd, 0);
    AI_PROVIDERS.forEach((item) => { if (aiOn[item.id]) aiUSD += getAICost(item, aiUsage); });

    const equiposUSD = sumCatalog(EQUIPOS, equiposOn, equiposQty, fx, totalPersonas);
    const oficinaUSD = sumCatalog(OFICINA, oficinaOn, oficinaQty, fx, totalPersonas);
    const adminUSD   = sumCatalog(ADMIN,   adminOn,   adminQty,   fx, totalPersonas);
    const benefUSD   = sumCatalog(BENEFICIOS, benefOn, benefQty,  fx, totalPersonas);
    const movilUSD   = sumCatalog(MOVILIDAD, movilOn, movilQty,   fx, totalPersonas);

    const humanUSD = humanMXN / fx;
    const monthlyUSD = humanUSD + infraUSD + stackUSD + aiUSD + equiposUSD + oficinaUSD + adminUSD + benefUSD + movilUSD;

    const monthlyWithMargin = monthlyUSD * (1 + margin / 100);
    const annualRunRateUSD = monthlyUSD * 12;
    const annualWithMarginUSD = monthlyWithMargin * 12;
    const safeHours = hoursPerMonth > 0 ? hoursPerMonth : 1;
    const hourlyCostUSD = monthlyUSD / safeHours;
    const hourlyClientUSD = hourlyCostUSD * (1 + margin / 100);

    const projectBase = monthlyUSD * months;
    const withCont = projectBase * (1 + contingency / 100);
    const withMargin = withCont * (1 + margin / 100);
    const grossProfit = withMargin - withCont;
    const totalCommUSD = sellers
      .filter((s) => s.name && s.commPct > 0)
      .reduce((sum, s) => sum + ((s.appliesToNet ? withCont : withMargin) * s.commPct) / 100, 0);
    const estimatedISR = grossProfit * selectedRegimen.isrEfectivo;
    const estimatedPTU = Object.values(teamCount).some((c) => c > 0) ? grossProfit * 0.1 : 0;
    const estimatedTaxBurden = estimatedISR + estimatedPTU;
    const netAfterCommissions = grossProfit - totalCommUSD;
    const estimatedNet = netAfterCommissions - estimatedTaxBurden;

    return {
      humanMXN, humanUSD, totalPersonas,
      infraUSD, stackUSD, aiUSD, equiposUSD, oficinaUSD, adminUSD, benefUSD, movilUSD,
      monthlyUSD, monthlyWithMargin, annualRunRateUSD, annualWithMarginUSD,
      hourlyCostUSD, hourlyClientUSD,
      projectBase, withCont, withMargin, grossProfit, totalCommUSD,
      estimatedISR, estimatedPTU, estimatedTaxBurden, netAfterCommissions, estimatedNet,
    };
  }, [
    mode, hoursPerMonth, fx, margin, months, contingency,
    cargaSocialFactor, includeNOM037, nom037MXN,
    teamCount, teamSeniority, customHumans,
    infraOn, infraQty, customInfra,
    stackOn, stackQty, stackVariable, customStack,
    aiOn, aiUsage, customAI,
    equiposOn, equiposQty, oficinaOn, oficinaQty, adminOn, adminQty, benefOn, benefQty, movilOn, movilQty,
    sellers, selectedRegimen.isrEfectivo,
  ]);

  // ─── Reset ────────────────────────────────────────────────────────────────
  const resetTab = useCallback((tabId) => {
    switch (tabId) {
      case "human":
        setTeamCount(emptyObject); setTeamSeniority(emptyObject);
        setIncludeCargaSocial(true); setCustomHumans([]); setCustomHumanLabel(""); setCustomHumanCost(0);
        break;
      case "infra":
        setInfraOn(emptyObject); setInfraQty(emptyObject);
        setCustomInfra([]); setCustomInfraLabel(""); setCustomInfraCost(0);
        break;
      case "stack":
        setStackOn(emptyObject); setStackQty(emptyObject); setStackVariable(emptyObject);
        setCustomStack([]); setCustomStackLabel(""); setCustomStackCost(0);
        break;
      case "ai":
        setAiOn(emptyObject); setAiUsage(emptyObject);
        setCustomAI([]); setCustomAILabel(""); setCustomAICost(0);
        break;
      case "equipos": setEquiposOn(emptyObject); setEquiposQty(emptyObject); break;
      case "oficina": setOficinaOn(emptyObject); setOficinaQty(emptyObject); break;
      case "admin":   setAdminOn(emptyObject);   setAdminQty(emptyObject);   break;
      case "benef":   setBenefOn(emptyObject);   setBenefQty(emptyObject);   break;
      case "movil":   setMovilOn(emptyObject);   setMovilQty(emptyObject);   break;
      case "comision": setSellers([DEFAULT_SELLER]); break;
      case "fiscal":
        setFiscalRegimen("pm_general"); setIsrIncome(500000);
        setExtranjeroPagoUSD(0); setExtranjeroTratadoUSA(true); setExtranjeroConcepto("regalia_software");
        setIvaImportDigital(false); setIvaExportacion(false);
        setUsEstadoSel("us_ca"); setUsSalaryUSD(120000);
        break;
      case "summary": setProject(DEFAULT_PROJECT); break;
      default: break;
    }
  }, []);

  const resetAll = useCallback(() => {
    setMode("project"); setHoursPerMonth(160);
    setTab("human"); setThemeMode("system");
    setFx(DEFAULT_FX); setMonths(3); setMargin(30); setContingency(15);
    setProject(DEFAULT_PROJECT);
    setMxState("cdmx"); setAguinaldo30(false); setIncludePTUFactor(true);
    setIncludeNOM037(false); setNom037MXN(NOM_037.defaultMXN);
    ["human", "equipos", "oficina", "movil", "infra", "stack", "ai", "benef", "admin", "comision", "fiscal", "summary"].forEach(resetTab);
  }, [resetTab]);

  // ─── JSON config import/export ────────────────────────────────────────────
  const exportConfig = useCallback(() => {
    const payload = {
      version: CONFIG_VERSION,
      exportedAt: new Date().toISOString(),
      project,
      params: { mode, fx, fxAuto, months, margin, contingency, hoursPerMonth },
      flags: { includeCargaSocial, mxState, aguinaldo30, includePTUFactor, includeNOM037, nom037MXN },
      team: { teamCount, teamSeniority, customHumans },
      infra: { infraOn, infraQty, customInfra },
      stack: { stackOn, stackQty, stackVariable, customStack },
      ai: { aiOn, aiUsage, customAI },
      equipos: { equiposOn, equiposQty },
      oficina: { oficinaOn, oficinaQty },
      admin:   { adminOn, adminQty },
      benef:   { benefOn, benefQty },
      movil:   { movilOn, movilQty },
      sellers,
      fiscal: {
        fiscalRegimen, isrIncome,
        extranjeroPagoUSD, extranjeroTratadoUSA, extranjeroConcepto,
        ivaImportDigital, ivaExportacion,
        usEstadoSel, usSalaryUSD,
      },
    };
    const slug = (project.name || "config").toLowerCase().replace(/\s+/g, "-");
    downloadJSON(`costcalc-${slug}-${Date.now()}.json`, payload);
  }, [
    mode, hoursPerMonth, project, fx, fxAuto, months, margin, contingency,
    includeCargaSocial, mxState, aguinaldo30, includePTUFactor, includeNOM037, nom037MXN,
    teamCount, teamSeniority, customHumans,
    infraOn, infraQty, customInfra,
    stackOn, stackQty, stackVariable, customStack,
    aiOn, aiUsage, customAI,
    equiposOn, equiposQty, oficinaOn, oficinaQty, adminOn, adminQty, benefOn, benefQty, movilOn, movilQty,
    sellers, fiscalRegimen, isrIncome,
    extranjeroPagoUSD, extranjeroTratadoUSA, extranjeroConcepto,
    ivaImportDigital, ivaExportacion, usEstadoSel, usSalaryUSD,
  ]);

  const importConfig = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data || typeof data !== "object") throw new Error("Archivo inválido");
        if (data.project) setProject({ ...DEFAULT_PROJECT, ...data.project });
        if (data.params) {
          if (typeof data.params.mode === "string" && MODE_OPTIONS.some((m) => m.value === data.params.mode)) setMode(data.params.mode);
          if (typeof data.params.hoursPerMonth === "number") setHoursPerMonth(data.params.hoursPerMonth);
          if (typeof data.params.fx === "number") setFx(data.params.fx);
          if (typeof data.params.fxAuto === "boolean") setFxAuto(data.params.fxAuto);
          if (typeof data.params.months === "number") setMonths(data.params.months);
          if (typeof data.params.margin === "number") setMargin(data.params.margin);
          if (typeof data.params.contingency === "number") setContingency(data.params.contingency);
        }
        if (data.flags) {
          if (typeof data.flags.includeCargaSocial === "boolean") setIncludeCargaSocial(data.flags.includeCargaSocial);
          if (typeof data.flags.mxState === "string") setMxState(data.flags.mxState);
          if (typeof data.flags.aguinaldo30 === "boolean") setAguinaldo30(data.flags.aguinaldo30);
          if (typeof data.flags.includePTUFactor === "boolean") setIncludePTUFactor(data.flags.includePTUFactor);
          if (typeof data.flags.includeNOM037 === "boolean") setIncludeNOM037(data.flags.includeNOM037);
          if (typeof data.flags.nom037MXN === "number") setNom037MXN(data.flags.nom037MXN);
        }
        if (data.team) {
          setTeamCount(data.team.teamCount || {});
          setTeamSeniority(data.team.teamSeniority || {});
          setCustomHumans(data.team.customHumans || []);
        }
        if (data.infra) { setInfraOn(data.infra.infraOn || {}); setInfraQty(data.infra.infraQty || {}); setCustomInfra(data.infra.customInfra || []); }
        if (data.stack) {
          setStackOn(data.stack.stackOn || {});
          setStackQty(data.stack.stackQty || {});
          setStackVariable(data.stack.stackVariable || {});
          setCustomStack(data.stack.customStack || []);
        }
        if (data.ai)      { setAiOn(data.ai.aiOn || {});       setAiUsage(data.ai.aiUsage || {}); setCustomAI(data.ai.customAI || []); }
        if (data.equipos) { setEquiposOn(data.equipos.equiposOn || {}); setEquiposQty(data.equipos.equiposQty || {}); }
        if (data.oficina) { setOficinaOn(data.oficina.oficinaOn || {}); setOficinaQty(data.oficina.oficinaQty || {}); }
        if (data.admin)   { setAdminOn(data.admin.adminOn || {});       setAdminQty(data.admin.adminQty || {}); }
        if (data.benef)   { setBenefOn(data.benef.benefOn || {});       setBenefQty(data.benef.benefQty || {}); }
        if (data.movil)   { setMovilOn(data.movil.movilOn || {});       setMovilQty(data.movil.movilQty || {}); }
        if (Array.isArray(data.sellers) && data.sellers.length > 0) setSellers(data.sellers);
        if (data.fiscal) {
          if (typeof data.fiscal.fiscalRegimen === "string") setFiscalRegimen(data.fiscal.fiscalRegimen);
          if (typeof data.fiscal.isrIncome === "number") setIsrIncome(data.fiscal.isrIncome);
          if (typeof data.fiscal.extranjeroPagoUSD === "number") setExtranjeroPagoUSD(data.fiscal.extranjeroPagoUSD);
          if (typeof data.fiscal.extranjeroTratadoUSA === "boolean") setExtranjeroTratadoUSA(data.fiscal.extranjeroTratadoUSA);
          if (typeof data.fiscal.extranjeroConcepto === "string") setExtranjeroConcepto(data.fiscal.extranjeroConcepto);
          if (typeof data.fiscal.ivaImportDigital === "boolean") setIvaImportDigital(data.fiscal.ivaImportDigital);
          if (typeof data.fiscal.ivaExportacion === "boolean") setIvaExportacion(data.fiscal.ivaExportacion);
          if (typeof data.fiscal.usEstadoSel === "string") setUsEstadoSel(data.fiscal.usEstadoSel);
          if (typeof data.fiscal.usSalaryUSD === "number") setUsSalaryUSD(data.fiscal.usSalaryUSD);
        }
      } catch (err) {
        alert(`No se pudo cargar la configuración: ${err.message}`);
      }
    };
    reader.readAsText(file);
  }, []);

  const triggerImport = useCallback(() => fileInputRef.current?.click(), []);
  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) importConfig(file);
    event.target.value = "";
  }, [importConfig]);

  const value = {
    // params
    mode, setMode, hoursPerMonth, setHoursPerMonth,
    tab, setTab, themeMode, setThemeMode,
    fx, setFx, fxAuto, setFxAuto, fxStatus, fxUpdatedAt, fetchFx,
    months, setMonths, margin, setMargin, contingency, setContingency,
    project, setProject, setProj,
    fileInputRef, triggerImport, handleFileChange,
    // carga social
    includeCargaSocial, setIncludeCargaSocial,
    mxState, setMxState, aguinaldo30, setAguinaldo30,
    includePTUFactor, setIncludePTUFactor, includeNOM037, setIncludeNOM037,
    nom037MXN, setNom037MXN, cargaSocialFactor,
    // human
    teamCount, teamSeniority, setCount, setSen,
    customHumans, customHumanLabel, customHumanCost,
    setCustomHumanLabel, setCustomHumanCost, addCustomHuman, removeCustomHuman,
    // catalogs
    infraOn, infraQty, toggleInfra, setInfraQuantity,
    customInfra, customInfraLabel, customInfraCost,
    setCustomInfraLabel, setCustomInfraCost, addCustomInfra, removeCustomInfra,
    stackOn, stackQty, stackVariable, toggleStack, setStackQuantity, updateStackVariable,
    customStack, customStackLabel, customStackCost,
    setCustomStackLabel, setCustomStackCost, addCustomStack, removeCustomStack,
    aiOn, aiUsage, toggleAI, updateAIUsage,
    customAI, customAILabel, customAICost,
    setCustomAILabel, setCustomAICost, addCustomAI, removeCustomAI,
    equiposOn, equiposQty, toggleEquipos, setEquiposQuantity,
    oficinaOn, oficinaQty, toggleOficina, setOficinaQuantity,
    adminOn, adminQty, toggleAdmin, setAdminQuantity,
    benefOn, benefQty, toggleBenef, setBenefQuantity,
    movilOn, movilQty, toggleMovil, setMovilQuantity,
    // sellers
    sellers, addSeller, removeSeller, updateSeller,
    // fiscal
    fiscalRegimen, setFiscalRegimen, isrIncome, setIsrIncome,
    extranjeroPagoUSD, setExtranjeroPagoUSD,
    extranjeroTratadoUSA, setExtranjeroTratadoUSA,
    extranjeroConcepto, setExtranjeroConcepto,
    ivaImportDigital, setIvaImportDigital,
    ivaExportacion, setIvaExportacion,
    usEstadoSel, setUsEstadoSel, usSalaryUSD, setUsSalaryUSD,
    selectedRegimen,
    // derived
    costs,
    // actions
    resetTab, resetAll, exportConfig, importConfig,
    // legacy
    LEGACY_CARGA_SOCIAL: CARGA_SOCIAL_FACTOR,
  };

  return <CalcContext.Provider value={value}>{children}</CalcContext.Provider>;
}

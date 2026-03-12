"use client"; 

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer as RadarResponsiveContainer,
  Tooltip as RadarTooltip,
} from "recharts";
import { Activity, ChevronUp, Clock, FilePlus, FileText, Home, Lightbulb, Lock, Minimize2, Radiation, RefreshCw, ShieldAlert, Stethoscope, Syringe, UserCircle, X, XCircle, Users } from "lucide-react";
import { ClinicalAdvisorModal } from "./ClinicalAdvisorModal";
import { AccountDashboard, saveSimulationToHistoryForUser, initializeUserProfile } from "./AccountDashboard";
import { CLINICAL_CASES, type ClinicalCase } from "./cases";
import { MasterPinGate } from "./MasterPinGate";

const CLINICAL_BLUE_GRADIENT = "from-cyan-600/90 via-sky-500/90 to-blue-600/90";
const PANEL_BG = "bg-[#0f172a]/80";
const PANEL_BG_ALT = "bg-[#111827]/80";
const BORDER_SOFT = "border-slate-700/50";
const BORDER_ACCENT = "border-cyan-900/30";
const NAVY_CENTER = "#002855";
const NAVY_OUTER = "#001220";
const SKY_ACCENT = "#00B4D8";
const SKY_LIGHT = "#72DDF7";
const GLASS_NAVY = "rgba(0, 27, 61, 0.7)";

const STORAGE_USERS = "omniscript-users";
const STORAGE_ACTIVE_USER = "omniscript-active-user";
const STORAGE_SESSION_PREFIX = "omniscript-session-data-";
const MASTER_PIN_SESSION_KEY = "omniscript-master-pin-authorized";

const DIAGNOSTIC_STOP_WORDS = new Set([
  "un",
  "una",
  "il",
  "lo",
  "la",
  "i",
  "gli",
  "le",
  "di",
  "del",
  "della",
  "per",
  "favore",
  "per",
  "piacere",
  "vorrei",
  "fai",
  "fammi",
  "richiedo",
  "richiedi",
  "richiedere",
  "fare",
  "esegui",
  "eseguire",
]);

const formatTime = () =>
  new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

const formatDuration = (ms: number) => {
  if (!Number.isFinite(ms) || ms < 0) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${mm}:${ss}`;
};

type MessageRole = "doctor" | "patient";
interface ChatMessage { id: number; role: MessageRole; content: string; timestamp: string; }
interface PunteggioOmni { accuratezzaClinica: number; appropriatezzaPrescrittiva: number; sostenibilitaEconomica: number; }
interface EvaluationResult {
  clinicalAccuracy: number;
  prescriptiveAppropriateness: number;
  sustainability: number;
  legalStatus: "CONFORME" | "NON CONFORME";
  legalMotivation: string;
  clinicalFeedback: string;
  isDiagnosisCorrect: boolean;
  diagnosisFeedback: string;
  caseSolution: {
    correctDiagnosis: string;
    requiredExams: string[];
    guidelinesSummary: string;
  };
}

interface OmniUser {
  nickname: string;
  password: string;
}

const INITIAL_CASE = CLINICAL_CASES[0];

const getRandomCase = (specialtyFilter: string): ClinicalCase => {
  const normalized = (specialtyFilter || "").trim();
  const useAll =
    normalized === "" || normalized.toLowerCase() === "tutte le specialità";
  const pool = useAll
    ? CLINICAL_CASES
    : CLINICAL_CASES.filter((c) => c.specialty === normalized);
  const effectivePool = pool.length > 0 ? pool : CLINICAL_CASES;
  const index = Math.floor(Math.random() * effectivePool.length);
  return effectivePool[index];
};

// FASE 2: I DATABASE DEGLI ESAMI E CONSULENZE
const BLOOD_TESTS = [
  "Emocromo completo",
  "Elettroliti (Na, K, Cl)",
  "Funzionalità renale (Azotemia, Creatinina)",
  "Funzionalità epatica (AST, ALT, GGT, ALP, Bilirubina)",
  "Coagulazione (PT, PTT, INR, Fibrinogeno)",
  "Glicemia",
  "Emoglobina glicata (HbA1c)",
  "Profilo lipidico completo (Colesterolo totale, HDL, LDL, Trigliceridi)",
  "PCR (Proteina C Reattiva)",
  "VES",
  "Procalcitonina",
  "Emogasanalisi arteriosa (EGA)",
  "Esame urine completo",
  "D-Dimero",
  "Troponina ad alta sensibilità",
  "CK-MB e CPK totali",
  "BNP/NT-proBNP",
  "Ormoni tiroidei (TSH, FT3, FT4)",
  "Cortisolo sierico",
  "Prolattina",
  "Ormoni sessuali (FSH, LH, Estradiolo, Testosterone)",
  "Funzionalità pancreatica (Amilasi, Lipasi)",
  "Assetto ferro (Ferro, Ferritina, Transferrina, SIDEREMIA)",
  "Vitamina B12 e Folati",
  "Autoimmunità di base (ANA, ENA)",
  "Fattore reumatoide (FR) e anti-CCP",
  "Markers epatite virale (HBsAg, Anti-HCV, ecc.)",
  "Markers tumorali base (CEA, CA 19-9, CA 125, PSA)",
  "Proteine totali ed elettroforesi sieroproteica",
  "Esami per coagulopatie congenite/acquisite (Antitrombina, Proteina C/S)",
  "Lattato",
  "Paracentesi diagnostica con esame del liquido ascitico",
  "Rachicentesi con esame del liquido cerebrospinale",
].sort((a, b) => a.localeCompare(b));
const IMAGING_EXAMS = [
  "TC Encefalo senza mezzo di contrasto",
  "TC Encefalo con e senza mezzo di contrasto",
  "RM Encefalo senza mezzo di contrasto",
  "RM Encefalo con e senza mezzo di contrasto",
  "TC Torace ad alta risoluzione (HRCT)",
  "TC Torace con mezzo di contrasto",
  "Angio-TC Aorta toraco-addominale",
  "Angio-TC arti inferiori",
  "TC Addome con mezzo di contrasto",
  "TC Addome senza mezzo di contrasto",
  "TC Total Body (trauma maggiore)",
  "RM Colonna cervicale",
  "RM Colonna dorsale",
  "RM Colonna lombosacrale",
  "RM Addome con e senza mezzo di contrasto",
  "Ecografia addome completo",
  "Ecografia Addome (FAST)",
  "Ecografia ostetrica/ginecologica transaddominale",
  "Ecografia tiroidea",
  "Ecografia reno-vescicale",
  "Ecocardiogramma transtoracico",
  "Ecocardiogramma transesofageo",
  "Ecocolordoppler arterioso arti inferiori",
  "Ecocolordoppler venoso arti inferiori",
  "Ecocolordoppler tronchi sovraortici (TSA)",
  "RX Torace in due proiezioni",
  "RX Colonna lombosacrale",
  "RX Bacino e anca",
  "RX Addome in bianco",
  "Scintigrafia polmonare ventilazione/perfusione",
  "Scintigrafia ossea total body",
  "PET-TC total body",
].sort((a, b) => a.localeCompare(b));
const CONSULTATIONS = [
  "Cardiologia", "Neurologia", "Neurochirurgia", "Ortopedia e Traumatologia", 
  "Rianimazione / Terapia Intensiva", "Geriatria", "Pneumologia", 
  "Gastroenterologia ed Endoscopia", "Nefrologia", "Urologia", 
  "Ematologia", "Oncologia Medica", "Malattie Infettive", "Psichiatria", 
  "Tossicologia Clinica", "Endocrinologia e Diabetologia", "Reumatologia", 
  "Dermatologia", "Oculistica", "Otorinolaringoiatrica (ORL)", 
  "Ginecologia", "Chirurgia Generale", "Chirurgia Vascolare", 
  "Chirurgia Toracica", "Chirurgia Maxillo-Facciale", "Chirurgia Plastica", 
  "Cardiochirurgia", "Terapia del Dolore", "Medicina Legale", 
  "Immunologia Clinica", "Genetica Medica", "Dietologia e Nutrizione Clinica"
].sort((a, b) => a.localeCompare(b));
const HOSPITAL_WARDS = [
  "Medicina Interna", "Geriatria", "Cardiologia (inclusa UTIC)", 
  "Neurologia (inclusa Stroke Unit)", "Pneumologia (inclusa UTIR)", 
  "Gastroenterologia", "Nefrologia", "Malattie Infettive", "Ematologia", 
  "Oncologia", "Chirurgia Generale", "Chirurgia Vascolare", 
  "Ortopedia e Traumatologia", "Neurochirurgia", "Cardiochirurgia", 
  "Chirurgia Toracica", "Urologia", "Rianimazione / Terapia Intensiva", 
  "Psichiatria (SPDC)", "Osservazione Breve Intensiva (OBI)", 
  "Medicina d'Urgenza", "Riabilitazione", "Hospice / Cure Palliative"
].sort((a, b) => a.localeCompare(b));

const KEYWORD_WEIGHTS = {
  base: { words: ["dolore", "testa", "sintomi", "caduta", "come sta"], points: 2 },
  intermedie: { words: ["dinamica", "anamnesi", "storia", "patologie", "farmaci", "medicine", "terapia"], points: 5 },
  avanzate: { words: ["anticoagulanti", "fluidificanti", "coumadin", "warfarin", "emorragia", "svenimento", "coscienza"], points: 15 }
};

export default function MedicalChat() {
  const [activeCase, setActiveCase] = useState<ClinicalCase>(INITIAL_CASE);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 1,
      role: "patient",
      content: INITIAL_CASE.initialMessage,
      timestamp: formatTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showPrescriptionMenu, setShowPrescriptionMenu] = useState(false);
  const [hasDiscoveredCoumadin, setHasDiscoveredCoumadin] = useState(false);
  const [clinicalRiskWarning, setClinicalRiskWarning] = useState<string | null>(null);
  const [hasPrescribedTC, setHasPrescribedTC] = useState(false);
  const [unnecessaryExamCount, setUnnecessaryExamCount] = useState(0);
  const [hasDischarged, setHasDischarged] = useState(false);
  const [finalDiagnosis, setFinalDiagnosis] = useState("");
  const [isSimulationComplete, setIsSimulationComplete] = useState(false);
  const [omniScore, setOmniScore] = useState<PunteggioOmni>({ accuratezzaClinica: 0, appropriatezzaPrescrittiva: 0, sostenibilitaEconomica: 100 });
  const [pertinentClinicalAccuracy, setPertinentClinicalAccuracy] = useState(0);
  const [usedKeywords, setUsedKeywords] = useState<Set<string>>(new Set());
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [prescribedExams, setPrescribedExams] = useState<string[]>([]);
  const [prescribedExamsHistory, setPrescribedExamsHistory] = useState<{ name: string; time: string }[]>([]);

  const [phase, setPhase] = useState<'chat' | 'hypothesis' | 'results' | 'evaluation'>('chat');
  const [currentHypothesis, setCurrentHypothesis] = useState('');
  const [examResults, setExamResults] = useState<{ name: string; result: string }[]>([]);
  const [diagnosisChoice, setDiagnosisChoice] = useState<'confirm' | 'modify' | null>(null);
  const [isGeneratingReferto, setIsGeneratingReferto] = useState(false);

  const [bootPhase, setBootPhase] = useState<'auth' | 'splash' | 'advisor' | 'ready'>('auth');
  const [showAccountDashboard, setShowAccountDashboard] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [masterPin, setMasterPin] = useState("");
  const [masterPinError, setMasterPinError] = useState<string | null>(null);
  const [hasMasterAccess, setHasMasterAccess] = useState(false);
  const [isCheckingMasterPin, setIsCheckingMasterPin] = useState(true);
  const [showAzioniClinicheModal, setShowAzioniClinicheModal] = useState(false);
  const [showCustomCaseModal, setShowCustomCaseModal] = useState(false);
  const [showScenarioModal, setShowScenarioModal] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("Tutte le specialità");
  const [showFinalReportModal, setShowFinalReportModal] = useState(false);

  const [customPatientName, setCustomPatientName] = useState("");
  const [customPatientAge, setCustomPatientAge] = useState("");
  const [customMainReason, setCustomMainReason] = useState("");
  const [customComorbidities, setCustomComorbidities] = useState("");
  const [customFamilyHistory, setCustomFamilyHistory] = useState("");
  const [customHomeTherapy, setCustomHomeTherapy] = useState("");
  const [customPhysicalExam, setCustomPhysicalExam] = useState("");
  const [customCorrectDiagnosis, setCustomCorrectDiagnosis] = useState("");
  const [customMandatoryExams, setCustomMandatoryExams] = useState("");
  const [isGeneratingCase, setIsGeneratingCase] = useState(false);
  const [aiOverwriteAll, setAiOverwriteAll] = useState(false);
  const [isDirectDiagnosis, setIsDirectDiagnosis] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [emergencyStartTime, setEmergencyStartTime] = useState<number | null>(null);
  const [emergencyElapsedMs, setEmergencyElapsedMs] = useState(0);
  const [emergencyFinalMs, setEmergencyFinalMs] = useState<number | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showEmergencyExitConfirm, setShowEmergencyExitConfirm] = useState(false);
  const [hasPerformedPhysicalExam, setHasPerformedPhysicalExam] = useState(false);
  const [stepDurations, setStepDurations] = useState<Record<'chat' | 'hypothesis' | 'results' | 'evaluation', number>>({
    chat: 0,
    hypothesis: 0,
    results: 0,
    evaluation: 0,
  });
  const [currentStep, setCurrentStep] = useState<'chat' | 'hypothesis' | 'results' | 'evaluation'>('chat');
  const [currentStepStart, setCurrentStepStart] = useState<number | null>(null);
  const [efficiencyScore, setEfficiencyScore] = useState<number | null>(null);
  const [users, setUsers] = useState<OmniUser[]>([]);
  const [currentUserNickname, setCurrentUserNickname] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authNickname, setAuthNickname] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authNicknameError, setAuthNicknameError] = useState<string | null>(null);
  const [authIsProcessing, setAuthIsProcessing] = useState(false);
  const [authBootChecked, setAuthBootChecked] = useState(false);
  
  // Menu a tendina per gli esami
  const [showBloodMenu, setShowBloodMenu] = useState(false);
  const [showImagingMenu, setShowImagingMenu] = useState(false);
  const [showConsultMenu, setShowConsultMenu] = useState(false);
  const [showRepartoSelector, setShowRepartoSelector] = useState(false);
  const [legalAlert, setLegalAlert] = useState<{ type: "minor" | "pregnancy"; examName: string; category: string } | null>(null);
  const [legalInfractions, setLegalInfractions] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authIsProcessing) return;
    setAuthIsProcessing(true);
    setAuthNicknameError(null);
    const trimmedNickname = authNickname.trim();
    const trimmedPassword = authPassword.trim();
    if (!trimmedNickname || !trimmedPassword) {
      setAuthMessage("Inserisci nickname e password.");
      setAuthIsProcessing(false);
      return;
    }
    if (typeof window === "undefined") return;
    try {
      // Usa sempre il database utenti esistente, inizializzato da localStorage
      const existingUsers = users;
      if (authMode === "register") {
        const normalizedNickname = trimmedNickname.toLowerCase();
        const exists = existingUsers.some(
          (u) => u.nickname.trim().toLowerCase() === normalizedNickname
        );
        if (exists) {
          setAuthNicknameError(
            "Identificativo già presente nel sistema. Se hai già un account, procedi al Login, altrimenti scegli un Nickname differente per garantire la tracciabilità della tua performance."
          );
          setAuthMessage(null);
          setAuthIsProcessing(false);
          return;
        }
        const nextUsers: OmniUser[] = [...existingUsers];
        nextUsers.push({ nickname: trimmedNickname, password: trimmedPassword });
        setUsers(nextUsers);
        localStorage.setItem(STORAGE_USERS, JSON.stringify(nextUsers));
        initializeUserProfile(trimmedNickname);
        localStorage.setItem(STORAGE_ACTIVE_USER, trimmedNickname);
        setCurrentUserNickname(trimmedNickname);
        // Reset totale della sessione per il nuovo utente
        handleResetSimulation();
        setAuthMessage("Creazione profilo in corso...");
        setTimeout(() => {
          setBootPhase("splash");
          setAuthIsProcessing(false);
        }, 1000);
      } else {
        const found = existingUsers.find(
          (u) => u.nickname === trimmedNickname && u.password === trimmedPassword
        );
        if (!found) {
          setAuthMessage("Credenziali non valide. Controlla nickname e password o registrati.");
          setAuthIsProcessing(false);
          return;
        }
        localStorage.setItem(STORAGE_ACTIVE_USER, trimmedNickname);
        setCurrentUserNickname(trimmedNickname);
        // Reset totale della sessione al login di un utente esistente
        handleResetSimulation();
        setAuthMessage("Accesso in corso...");
        setTimeout(() => {
          setBootPhase("splash");
          setAuthIsProcessing(false);
        }, 800);
      }
    } catch {
      setAuthMessage("Errore nell’accesso allo storage locale.");
      setAuthIsProcessing(false);
    }
  };

  useEffect(() => {
    if (bootPhase !== "splash") return;
    const timer = setTimeout(() => setBootPhase("advisor"), 4500);
    return () => clearTimeout(timer);
  }, [bootPhase]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      // Inizializzazione intelligente del database utenti dal localStorage
      const storedUsersRaw = localStorage.getItem(STORAGE_USERS);
      const storedUsers: OmniUser[] = storedUsersRaw
        ? JSON.parse(storedUsersRaw)
        : JSON.parse("[]");
      setUsers(storedUsers);
    } catch {
      // ignore parse / storage errors, fallback al database vuoto
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const authorized = sessionStorage.getItem(MASTER_PIN_SESSION_KEY);
      if (authorized === "true") {
        setHasMasterAccess(true);
      }
    } catch {
      // ignore
    } finally {
      setIsCheckingMasterPin(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const active = localStorage.getItem(STORAGE_ACTIVE_USER);
      if (active) {
        setCurrentUserNickname(active);
        setBootPhase("splash");
      }
    } catch {
      // ignore
    } finally {
      setAuthBootChecked(true);
    }
  }, []);

  useEffect(() => {
    const randomCase = getRandomCase(selectedSpecialty);
    setActiveCase(randomCase);
    setMessages([
      {
        id: Date.now(),
        role: "patient",
        content: randomCase.initialMessage,
        timestamp: formatTime(),
      },
    ]);
    setShowScenarioModal(true);
    setPhase('chat');
    setCurrentHypothesis('');
    setExamResults([]);
    setDiagnosisChoice(null);
  }, [selectedSpecialty]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenizeAndFilter = (text: string): string[] => {
  const tokens = normalizeText(text).split(" ");
  return tokens.filter((t) => t && !DIAGNOSTIC_STOP_WORDS.has(t));
};

type DiagnosticCategory = "sangue" | "imaging" | "consulenza";

interface DiagnosticAction {
  category: DiagnosticCategory;
  examName: string;
}

const buildDiagnosticMap = (): Record<string, DiagnosticAction> => {
  const map: Record<string, DiagnosticAction> = {};

  const register = (
    keyword: string,
    category: DiagnosticCategory,
    examName: string
  ) => {
    const norm = normalizeText(keyword);
    if (!norm) return;
    map[norm] = { category, examName };
  };

  BLOOD_TESTS.forEach((exam) => {
    const tokens = tokenizeAndFilter(exam);
    tokens.forEach((token) => register(token, "sangue", exam));
  });

  IMAGING_EXAMS.forEach((exam) => {
    const tokens = tokenizeAndFilter(exam);
    tokens.forEach((token) => register(token, "imaging", exam));
  });

  CONSULTATIONS.forEach((exam) => {
    const tokens = tokenizeAndFilter(exam);
    tokens.forEach((token) => register(token, "consulenza", exam));
  });

  register("emocromo", "sangue", "Emocromo completo");
  register("esame citometrico", "sangue", "Emocromo completo");
  register("cbc", "sangue", "Emocromo completo");

  register("tc", "imaging", "TC Encefalo senza mezzo di contrasto");
  register("tac", "imaging", "TC Encefalo senza mezzo di contrasto");
  register("tomografia", "imaging", "TC Encefalo senza mezzo di contrasto");
  register("tc addome", "imaging", "TC Addome con mezzo di contrasto");
  register("tac addome", "imaging", "TC Addome con mezzo di contrasto");
  register("tc torace", "imaging", "TC Torace con mezzo di contrasto");
  register("tac torace", "imaging", "TC Torace con mezzo di contrasto");

  register("ecografia", "imaging", "Ecografia addome completo");
  register("eco", "imaging", "Ecografia addome completo");
  register("ultrasuoni", "imaging", "Ecografia addome completo");

  register("rm", "imaging", "RM Encefalo senza mezzo di contrasto");
  register("rmn", "imaging", "RM Encefalo senza mezzo di contrasto");
  register("risonanza", "imaging", "RM Encefalo senza mezzo di contrasto");

  register("ecg", "imaging", "ECG a 12 derivazioni");
  register("elettrocardiogramma", "imaging", "ECG a 12 derivazioni");

  // Sinonimi aggiuntivi per esami chiave ad alta rilevanza clinica
  register("emogas", "sangue", "Emogasanalisi arteriosa (EGA)");
  register("ega", "sangue", "Emogasanalisi arteriosa (EGA)");

  register("paracentesi", "sangue", "Paracentesi diagnostica con esame del liquido ascitico");
  register("liquido ascitico", "sangue", "Paracentesi diagnostica con esame del liquido ascitico");

  register("rachicentesi", "sangue", "Rachicentesi con esame del liquido cerebrospinale");
  register("puntura lombare", "sangue", "Rachicentesi con esame del liquido cerebrospinale");
  register("liquor", "sangue", "Rachicentesi con esame del liquido cerebrospinale");

  return map;
};

const DIAGNOSTIC_MAP: Record<string, DiagnosticAction> = buildDiagnosticMap();

const levenshteinDistance = (a: string, b: string): number => {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
};

const detectClinicalActionsFromText = (rawText: string): DiagnosticAction[] => {
  const actionsByExam = new Map<string, DiagnosticAction>();

  const addAction = (action: DiagnosticAction) => {
    if (!actionsByExam.has(action.examName)) {
      actionsByExam.set(action.examName, action);
    }
  };

  const exclusionPhrases = [
    "ha fatto",
    "aveva fatto",
    "ha eseguito",
    "aveva eseguito",
    "in passato",
    "in precedenza",
    "precedenti",
    "riferisce",
    "riferiva",
  ];

  const imperativeKeywords = [
    "prescrivo",
    "prescrivere",
    "prescriva",
    "fai",
    "fammi",
    "richiedo",
    "richiedi",
    "esegui",
    "eseguire",
    "ordino",
    "effettua",
    "effettuare",
  ];

  const negationTokens = [
    "non",
    "nessun",
    "nessuna",
    "nessuno",
    "evita",
    "evitare",
    "sospendi",
    "sospendere",
  ];

  const allKeywords = Object.keys(DIAGNOSTIC_MAP);

  const sentences = rawText
    .split(/(?<=[\.\?\!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    // 1) Filtro interrogativo: ignora completamente le frasi che terminano con '?'
    if (trimmed.endsWith("?")) continue;

    const lower = trimmed.toLowerCase();

    // 2) Analisi contesto: escludi frasi con anamnesi remota / passato
    if (exclusionPhrases.some((p) => lower.includes(p))) continue;

    // 3) Intento imperativo o comando
    const hasImperative = imperativeKeywords.some((p) => lower.includes(p));

    // Tokenization per questa frase (dopo normalizzazione e stop words)
    const tokens = tokenizeAndFilter(trimmed);
    if (tokens.length === 0) continue;

    const isBareExamRequest = !hasImperative && tokens.length <= 3;

    const processTokenMatch = (normToken: string, originalIndex: number) => {
      const action = DIAGNOSTIC_MAP[normToken];
      if (!action) return;

      // 4) Controllo negazioni: la keyword non deve essere preceduta da negazioni
      const windowStart = Math.max(0, originalIndex - 3);
      const windowTokens = tokens.slice(windowStart, originalIndex);
      const hasNegation = windowTokens.some((t) => negationTokens.includes(t));
      if (hasNegation) return;

      // Attiva prescrizione solo se c'è intento imperativo
      // oppure la frase è sostanzialmente solo il nome dell'esame
      if (!hasImperative && !isBareExamRequest) return;

      addAction(action);
    };

    // Prima passata: match esatto sui token
    tokens.forEach((token, idx) => {
      const normToken = normalizeText(token);
      if (!normToken) return;
      if (DIAGNOSTIC_MAP[normToken]) {
        processTokenMatch(normToken, idx);
      }
    });

    // Seconda passata: fuzzy matching, ma solo se c'è già un chiaro intento prescrittivo
    if (hasImperative || isBareExamRequest) {
      tokens.forEach((token, idx) => {
        const normToken = normalizeText(token);
        if (!normToken || DIAGNOSTIC_MAP[normToken]) return;

        let bestMatch: string | null = null;
        let bestDistance = Infinity;
        for (const keyword of allKeywords) {
          const distance = levenshteinDistance(normToken, keyword);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestMatch = keyword;
          }
        }
        if (
          bestMatch &&
          ((normToken.length >= 5 && bestDistance <= 2) ||
            (normToken.length < 5 && bestDistance <= 1))
        ) {
          processTokenMatch(bestMatch, idx);
        }
      });
    }
  }

  return Array.from(actionsByExam.values());
};

  const advancePhase = (next: 'chat' | 'hypothesis' | 'results' | 'evaluation') => {
    setStepDurations((prev) => {
      if (currentStepStart == null) return prev;
      const now = Date.now();
      const elapsed = now - currentStepStart;
      return {
        ...prev,
        [currentStep]: (prev[currentStep] ?? 0) + elapsed,
      };
    });
    setCurrentStep(next);
    setCurrentStepStart(Date.now());
    setPhase(next);
  };

  useEffect(() => {
    const diagnosisMatches =
      finalDiagnosis.trim().toLowerCase().includes("anticoagul") ||
      finalDiagnosis.trim().toLowerCase().includes("coumadin");

    if (!diagnosisMatches) return;

    setOmniScore((prev) => {
      let nuovaAccuratezza = prev.accuratezzaClinica;
      if (diagnosisMatches) nuovaAccuratezza = Math.max(nuovaAccuratezza, 90);
      if (hasDiscoveredCoumadin && diagnosisMatches) nuovaAccuratezza = 100;
      return { ...prev, accuratezzaClinica: nuovaAccuratezza };
    });
  }, [finalDiagnosis, hasDiscoveredCoumadin]);

  useEffect(() => {
    if (!emergencyStartTime || isSimulationComplete) return;
    const interval = window.setInterval(() => {
      setEmergencyElapsedMs(Date.now() - emergencyStartTime);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [emergencyStartTime, isSimulationComplete]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isSending || isSimulationComplete) return;

    const content = input.trim();
    const contentLower = content.toLowerCase();

    let pointsToAdd = 0;
    const newUsedKeywords = new Set(usedKeywords);
    const checkWords = (category: { words: string[]; points: number }) => {
      category.words.forEach((word) => {
        if (contentLower.includes(word) && !newUsedKeywords.has(word)) {
          pointsToAdd += category.points;
          newUsedKeywords.add(word);
        }
      });
    };

    checkWords(KEYWORD_WEIGHTS.base);
    checkWords(KEYWORD_WEIGHTS.intermedie);
    checkWords(KEYWORD_WEIGHTS.avanzate);

    if (pointsToAdd > 0) {
      setPertinentClinicalAccuracy((prev) => Math.min(prev + pointsToAdd, 100));
      setUsedKeywords(newUsedKeywords);
      setOmniScore((prev) => ({
        ...prev,
        accuratezzaClinica: Math.min(
          prev.accuratezzaClinica + pointsToAdd,
          100
        ),
      }));
    }

    const now = Date.now();
    const newDoctorMessage: ChatMessage = {
      id: now,
      role: "doctor",
      content,
      timestamp: formatTime(),
    };

    const detectedActions = detectClinicalActionsFromText(content);

    const systemMessages: ChatMessage[] = detectedActions.map((action, idx) => ({
      id: now + idx + 1,
      role: "doctor",
      content: `✅ Esame prescritto: ${action.examName}`,
      timestamp: formatTime(),
    }));

    const updatedConversation: ChatMessage[] = [
      ...messages,
      newDoctorMessage,
      ...systemMessages,
    ];
    setMessages(updatedConversation);

    if (detectedActions.length > 0) {
      for (const action of detectedActions) {
        await handleOrderExam(action.category, action.examName);
      }
    }

    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedConversation.map((m) => ({
            role: m.role === "doctor" ? "user" : "assistant",
            content: m.content,
          })),
          patientProfile: activeCase.patientProfile,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Errore Server");

      let aiText = data.text || "Dottore, non so cosa dire...";
      if (
        aiText.toLowerCase().includes("coumadin") ||
        aiText.toLowerCase().includes("warfarin")
      ) {
        setHasDiscoveredCoumadin(true);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "patient",
          content: aiText,
          timestamp: formatTime(),
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "patient",
          content: `⚠️ ERRORE DI RETE: ${error.message}`,
          timestamp: formatTime(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };
  
  const runLegalEvaluation = async (finalActionLabel: string, isDirect = false, actionsCount?: number) => {
    try {
      setIsEvaluating(true);

      const chatHistory = messages.map((m) => ({
        role: m.role === "doctor" ? "medico" : "paziente",
        content: m.content,
        timestamp: m.timestamp,
      }));

      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatHistory,
          prescribedExams,
          finalAction: finalActionLabel,
          patientProfile: activeCase.patientProfile,
          truth: activeCase.truth,
          isDirectDiagnosis: isDirect,
          actionsCount:
            typeof actionsCount === "number"
              ? actionsCount
              : messages.filter((m) => m.role === "doctor").length + prescribedExams.length,
          userDiagnosis: finalDiagnosis,
          initialHypothesis: currentHypothesis || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Errore durante la valutazione medico-legale");

      const evalResult: EvaluationResult = data.evaluation;
      setEvaluationResult(evalResult);
      const infractions: string[] = [];

      if (evalResult) {
        const emergencyDurationMs =
          isEmergencyMode && emergencyStartTime
            ? Date.now() - emergencyStartTime
            : null;

        const hasKeyExams =
          (activeCase.truth.requiredExams ?? []).length === 0
            ? true
            : (activeCase.truth.requiredExams ?? []).some((exam) =>
                prescribedExams.includes(exam)
              );

        let clinicalAccuracyPenalty = 0;
        if (!hasPerformedPhysicalExam) clinicalAccuracyPenalty += 10;
        if (!hasKeyExams) clinicalAccuracyPenalty += 15;

        const totalStepMs =
          stepDurations.chat +
          stepDurations.hypothesis +
          stepDurations.results;

        // Regole di infrazione medico-legale lato front-end (tracciamento qualitativo)
        // 1) Mezzo di contrasto senza funzionalità renale
        const hasContrastImaging = prescribedExams.some((exam) =>
          /mezzo di contrasto/i.test(exam)
        );
        const hasRenalFunction = prescribedExams.includes(
          "Funzionalità renale (Azotemia, Creatinina)"
        );
        if (hasContrastImaging && !hasRenalFunction) {
          infractions.push(
            "Mancata richiesta di funzionalità renale prima di esame con mezzo di contrasto. Mancata osservanza delle raccomandazioni ISS/SNLG e dei protocolli SIMEU sulla sicurezza degli esami con mezzo di contrasto."
          );
        }

        // 2) Omissione di esami salvavita in scenario emergenza tempo-dipendente
        const requiredExams = activeCase.truth.requiredExams ?? [];
        const hasAnyRequiredExam =
          requiredExams.length === 0
            ? true
            : requiredExams.some((exam) => prescribedExams.includes(exam));
        if (isEmergencyMode && requiredExams.length > 0 && !hasAnyRequiredExam) {
          let guidelineContext = "Mancata osservanza dei protocolli SIMEU per la gestione delle urgenze tempo-dipendenti e delle linee guida ISS/SNLG pertinenti.";
          const dx = (activeCase.truth.correctDiagnosis || "").toLowerCase();

          if (dx.includes("ictus")) {
            guidelineContext =
              "Mancata osservanza dei percorsi tempo-dipendenti per l'ictus acuto (stroke code) descritti nelle linee guida ISS/SNLG e nelle raccomandazioni delle Stroke Unit nazionali.";
          } else if (dx.includes("infarto") || dx.includes("sindrome coronarica acuta")) {
            guidelineContext =
              "Mancata osservanza delle linee guida ESC/ISS/SNLG per la gestione delle sindromi coronariche acute e dei percorsi per il dolore toracico in PS.";
          } else if (dx.includes("scompenso cardiaco acuto") || dx.includes("edema polmonare acuto")) {
            guidelineContext =
              "Mancata osservanza delle linee guida ESC per lo scompenso cardiaco acuto e delle raccomandazioni ISS/SNLG per la gestione delle emergenze cardio-respiratorie.";
          } else if (dx.includes("appendicite")) {
            guidelineContext =
              "Mancata osservanza delle raccomandazioni ISS/SNLG e dei PDTA chirurgici per la gestione dell'addome acuto appendicolare.";
          } else if (dx.includes("diverticolite")) {
            guidelineContext =
              "Mancata osservanza delle raccomandazioni ISS/SNLG per la diverticolite acuta complicata e dei protocolli di imaging TC in urgenza.";
          } else if (dx.includes("frattura del collo del femore")) {
            guidelineContext =
              "Mancata osservanza delle linee guida ISS/SNLG e dei percorsi orto-geriatrci per la frattura di femore nell'anziano (tempestività diagnostica e chirurgica).";
          } else if (dx.includes("polmonite")) {
            guidelineContext =
              "Mancata osservanza delle linee guida ISS/SNLG e delle raccomandazioni internazionali per la gestione della polmonite acquisita in comunità (CAP) in urgenza.";
          }

          infractions.push(
            `Omissione di esami salvavita in scenario di emergenza tempo-dipendente. ${guidelineContext}`
          );
        }

        // 3) Tempo di inquadramento diagnostico oltre soglia di sicurezza in emergenza
        if (isEmergencyMode && totalStepMs > 10 * 60_000) {
          infractions.push(
            "Tempo di inquadramento diagnostico superiore ai limiti di sicurezza (per casi emergenti). Scostamento rispetto ai tempi-obiettivo dei percorsi di triage e trattamento in Pronto Soccorso (protocolli SIMEU/SSN per codici ad alta priorità)."
          );
        }

        setLegalInfractions(infractions);

        let efficiency = 100;
        if (totalStepMs > 0) {
          if (isEmergencyMode) {
            const idealTotal = 5 * 60_000;
            const excess = Math.max(0, totalStepMs - idealTotal);
            const excessMinutes = excess / 60_000;
            const timePenalty = Math.min(30, Math.round(excessMinutes * 5));
            efficiency = Math.max(40, 100 - timePenalty);
          } else {
            const idealTotal = 10 * 60_000;
            const excess = Math.max(0, totalStepMs - idealTotal);
            const excessMinutes = excess / 60_000;
            const timePenalty = Math.min(20, Math.round(excessMinutes * 2));
            efficiency = Math.max(50, 100 - timePenalty);
          }
        }

        setEfficiencyScore(efficiency);

        const baseClinicalAccuracy = Math.max(
          0,
          Math.min(100, evalResult.clinicalAccuracy ?? 0)
        );
        const penaltyAdjustedAccuracy = Math.max(
          0,
          baseClinicalAccuracy - clinicalAccuracyPenalty
        );

        const nextOmniScore = {
          accuratezzaClinica: penaltyAdjustedAccuracy,
          appropriatezzaPrescrittiva: Math.max(
            0,
            Math.min(100, evalResult.prescriptiveAppropriateness ?? 0)
          ),
          sostenibilitaEconomica: Math.max(
            0,
            Math.min(100, evalResult.sustainability ?? 0)
          ),
        };

        // Ottimizzazione specifica per casi tempo-dipendenti e ad alta complessità diagnostica
        const dxLower = (activeCase.truth.correctDiagnosis || "").toLowerCase();

        // Sepsi / Shock settico: premia in modo più marcato la rapidità gestionale
        if (
          isEmergencyMode &&
          (activeCase.id.includes("shock-settico") || dxLower.includes("shock settico")) &&
          emergencyDurationMs != null
        ) {
          if (emergencyDurationMs <= 5 * 60_000) {
            // gestione molto rapida: spinta aggiuntiva all'efficienza globale
            efficiency = Math.min(100, efficiency + 10);
          } else if (emergencyDurationMs <= 10 * 60_000) {
            efficiency = Math.min(100, efficiency + 5);
          }
        }

        // Cirrosi epatica scompensata: enfatizza la precisione diagnostica
        if (
          !evalResult.isDiagnosisCorrect &&
          (activeCase.id.includes("cirrosi-scompensata") || dxLower.includes("cirrosi epatica"))
        ) {
          // in caso di diagnosi imprecisa sulla cirrosi, riduci leggermente l'accuratezza per
          // riflettere la maggiore rilevanza medico-legale dell'inquadramento corretto
          nextOmniScore.accuratezzaClinica = Math.max(
            0,
            Math.round(nextOmniScore.accuratezzaClinica * 0.85)
          );
        }
        setOmniScore(nextOmniScore);

        const hasLegalIssues =
          evalResult.legalStatus === "NON CONFORME" || infractions.length > 0;
        const legalComplianceScore = hasLegalIssues ? 0 : 100;
        const weighted =
          nextOmniScore.accuratezzaClinica * 0.4 +
          nextOmniScore.appropriatezzaPrescrittiva * 0.3 +
          nextOmniScore.sostenibilitaEconomica * 0.1 +
          legalComplianceScore * 0.2;

        const finalWeighted = Math.round(Math.max(Math.min(weighted, 100), 0));

        const baseReportTextLines = [
          "Valutazione di Conformità ex Art. 5 Legge 24/2017",
          "",
          `Paziente: ${activeCase.patientName}, ${activeCase.patientAge} anni`,
          `Caso: ${activeCase.id}`,
          "",
          `OmniScore (Aderenza alle Linee Guida ISS/SNLG): ${finalWeighted}/100`,
          "",
          "1) Efficacia Clinica:",
          "- Valutazione della risoluzione del quadro patologico e della correttezza della diagnosi finale in relazione al gold standard previsto.",
          "",
          "2) Appropriatezza Diagnostica:",
          "- Coerenza tra sintomi, sospetto clinico ed esami richiesti, con riferimento alle linee guida e raccomandazioni del SSN (SNLG-ISS, società scientifiche accreditate).",
          "- Accuratezza Clinica: " + nextOmniScore.accuratezzaClinica + "/100",
          "- Appropriatezza Prescrittiva: " + nextOmniScore.appropriatezzaPrescrittiva + "/100",
          "",
          "3) Sicurezza e Rispetto delle Buone Pratiche:",
          "- Analisi dei rischi, prevenzione di eventi avversi e rispetto delle buone pratiche clinico-assistenziali (es. controllo della funzione renale prima di mezzo di contrasto, gestione tempi soglia in patologie tempo-dipendenti).",
          "- Sostenibilità / uso responsabile delle risorse: " + nextOmniScore.sostenibilitaEconomica + "/100",
        ];

        if (isEmergencyMode && emergencyDurationMs != null) {
          baseReportTextLines.push(
            `Tempo gestione emergenza: ${formatDuration(emergencyDurationMs)}`
          );
        }

        if (efficiency != null) {
          baseReportTextLines.push(
            "",
            `Punteggio di efficienza temporale del percorso: ${Math.round(
              efficiency
            )}/100`
          );
        }

        baseReportTextLines.push(
          "",
          `Conformità Legge Gelli-Bianco: ${evalResult.legalStatus}`,
          "",
          "Motivazione Legale:",
          evalResult.legalMotivation,
          "",
          "Feedback Clinico:",
          evalResult.clinicalFeedback
        );

        // Aree di Miglioramento strutturate (formative e medico-legali)
        const hasLowScore = finalWeighted < 80;
        const hasDiagnosisIssues = !evalResult.isDiagnosisCorrect;
        const hasTherapyIssues = hasLegalIssues || infractions.length > 0;

        if (hasLowScore || hasDiagnosisIssues || hasTherapyIssues) {
          baseReportTextLines.push(
            "",
            "4) Aree di Miglioramento (Formazione e aderenza alle Linee Guida):"
          );

          if (hasDiagnosisIssues) {
            baseReportTextLines.push(
              "- Diagnosi:",
              `  • La diagnosi formulata non è pienamente sovrapponibile al gold standard atteso.`,
              `  • Diagnosi di riferimento: ${evalResult.caseSolution.correctDiagnosis}.`,
              `  • Suggerimento: rileggi la sequenza sintomi-esame obiettivo-esami chiave e confrontala con le raccomandazioni di caso riportate nella sezione “Soluzione del Caso”.`
            );
          }

          const requiredExams = activeCase.truth.requiredExams ?? [];
          if (requiredExams.length > 0) {
            const missing = requiredExams.filter(
              (exam) => !prescribedExams.includes(exam)
            );
            if (missing.length > 0) {
              baseReportTextLines.push(
                "",
                "- Esami/Procedure imprescindibili:",
                `  • Non risultano eseguiti alcuni esami considerati salvavita o obbligatori per questo scenario: ${missing.join(
                  "; "
                )}.`,
                "  • Rivedi le linee guida di riferimento e integra sistematicamente questi step nei casi analoghi."
              );
            }
          }

          if (infractions.length > 0) {
            baseReportTextLines.push(
              "",
              "- Profili di rischio medico-legale:",
              ...infractions.map((inf) => `  • ${inf}`)
            );
          }

          if (
            isEmergencyMode &&
            emergencyDurationMs != null &&
            emergencyDurationMs > 10 * 60_000
          ) {
            baseReportTextLines.push(
              "",
              "- Gestione tempo-dipendente:",
              `  • Il tempo complessivo di inquadramento dell'emergenza (${formatDuration(
                emergencyDurationMs
              )}) supera le finestre raccomandate per i percorsi tempo-dipendenti.`,
              "  • Allena la rapidità decisionale fissando obiettivi di tempo per triage, diagnosi di sospetto e attivazione delle terapie salvavita."
            );
          }
        }

        if (finalWeighted < 60) {
          baseReportTextLines.push(
            "",
            "Nota di Risk Management:",
            "La condotta presenta profili di scostamento dalle linee guida accreditate, aumentando il rischio di responsabilità professionale ai sensi della normativa vigente."
          );
        }

        if (currentUserNickname) {
          saveSimulationToHistoryForUser(currentUserNickname, {
            patientName: activeCase.patientName,
            mode: isEmergencyMode ? "Emergenza" : "Standard",
            caseId: activeCase.id,
            caseTitle: activeCase.specialty,
            weightedScore: finalWeighted,
            clinicalAccuracy: nextOmniScore.accuratezzaClinica,
            prescriptiveAppropriateness: nextOmniScore.appropriatezzaPrescrittiva,
            sustainability: nextOmniScore.sostenibilitaEconomica,
            emergencyDurationMs,
            efficiencyScore: efficiency,
            report: baseReportTextLines.join("\n"),
          });
        }
      }
    } catch (error: any) {
      console.error("Errore valutazione medico-legale:", error);
    } finally {
      setIsEvaluating(false);
      if (isEmergencyMode && emergencyStartTime) {
        const totalMs = Date.now() - emergencyStartTime;
        setEmergencyFinalMs(totalMs);
        setEmergencyElapsedMs(totalMs);
      }
      setIsSimulationComplete(true);
      setShowFinalReportModal(true);
    }
  };

  const handleFinalPrescription = (choice: "dimissione" | "obi" | "ricovero") => {
    setShowPrescriptionMenu(false);

    if (choice === "ricovero") {
      setShowRepartoSelector(true);
      return;
    }

    if (choice === "dimissione") {
      setHasDischarged(true);
      setClinicalRiskWarning("Rischio Clinico Grave: Dimissione non sicura.");
    } else if (choice === "obi") {
      setHasDischarged(false);
      setClinicalRiskWarning(null);
    }

    const label = choice === "dimissione" ? "Dimissione" : "Osservazione Breve Intensiva (OBI)";
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        role: "doctor",
        content: `[ATTO MEDICO CONCLUSO] Prescrizione finale: ${label}`,
        timestamp: formatTime(),
      },
    ]);
    runLegalEvaluation(label);
  };

  const handleRicoveroRepartoSelect = (reparto: string) => {
    setShowRepartoSelector(false);
    setHasDischarged(false);
    setClinicalRiskWarning(null);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        role: "doctor",
        content: `[ATTO MEDICO CONCLUSO] Disposto Ricovero in: ${reparto}`,
        timestamp: formatTime(),
      },
    ]);
    runLegalEvaluation(`Ricovero in ${reparto}`);
  };

  const handleDirectDiagnosisConfirm = () => {
    if (!finalDiagnosis.trim() || isSimulationComplete) return;

    const totalActions =
      messages.filter((m) => m.role === "doctor").length + prescribedExams.length;

    setIsDirectDiagnosis(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "doctor",
        content: `[DIAGNOSI DIRETTA] Il medico formula direttamente la seguente diagnosi finale: "${finalDiagnosis.trim()}".`,
        timestamp: formatTime(),
      },
    ]);

    runLegalEvaluation("Diagnosi Diretta (Azzardo Clinico)", true, totalActions);
  };

  const confirmOrderExam = (category: "sangue" | "imaging" | "consulenza", examName: string) => {
    const now = formatTime();

    if (category === "imaging" && /contrasto/i.test(examName)) {
      window.alert(
        "ATTENZIONE: Ricordarsi di valutare la funzionalità renale (Creatinina/eGFR) prima di procedere con mezzo di contrasto"
      );
    }

    setShowBloodMenu(false);
    setShowImagingMenu(false);
    setShowConsultMenu(false);
    setShowAzioniClinicheModal(false);
    setPrescribedExams((prev) => [...prev, examName]);
    setPrescribedExamsHistory((prev) => [...prev, { name: examName, time: now }]);

    let prefix = "Richiesta esami del sangue: ";
    if (category === "imaging") prefix = "Richiesta imaging: ";
    if (category === "consulenza") prefix = "Richiedi Consulenza: ";

    setMessages((prev) => [...prev, { id: Date.now(), role: "doctor", content: `${prefix}${examName}.`, timestamp: now }]);

    if (examName === "TC Encefalo" || examName === "TC Encefalo senza mezzo di contrasto" || examName === "TC Encefalo urgente per escludere emorragia") {
      setHasPrescribedTC(true);
      setOmniScore((prev) => ({
        ...prev,
        appropriatezzaPrescrittiva: 100,
      }));
    }

    const isUnnecessary = activeCase.truth.unnecessaryExams.includes(examName);
    if (isUnnecessary) {
      setUnnecessaryExamCount((c) => c + 1);

      setOmniScore((prev) => ({
        ...prev,
        accuratezzaClinica: Math.max(prev.accuratezzaClinica - 3, 0),
      }));

      setOmniScore((prev) => ({
        ...prev,
        appropriatezzaPrescrittiva: Math.max(prev.appropriatezzaPrescrittiva - 10, 0),
      }));

      setOmniScore((prev) => {
        let delta = 0;
        if (category === "sangue") delta = 5;
        else if (category === "imaging") delta = 15;
        else if (category === "consulenza") delta = 10;

        return {
          ...prev,
          sostenibilitaEconomica: Math.max(prev.sostenibilitaEconomica - delta, 0),
        };
      });
    } else {
      if (activeCase.truth.requiredExams.includes(examName)) {
        setOmniScore((prev) => ({
          ...prev,
          appropriatezzaPrescrittiva: 100,
        }));
      }
    }
  };

  const handleOrderExam = async (category: "sangue" | "imaging" | "consulenza", examName: string) => {
    const existingExam = prescribedExamsHistory.find((exam) => exam.name === examName);
    if (existingExam) {
      const confirmed = window.confirm(
        `Attenzione: L'esame ${examName} è già stato prescritto alle ore ${existingExam.time}. Sei sicuro di volerlo prescrivere nuovamente?`
      );
      if (!confirmed) return;
    }

    // Check Minori: consenso informato per paziente < 18 anni
    if (activeCase.patientAge < 18) {
      setLegalAlert({ type: "minor", examName, category });
      return;
    }

    // Check Gravidanza: donna in età fertile, imaging con radiazioni ionizzanti (RX, TC, TAC, Scintigrafia; esclusi Eco, Ecografia, RM)
    const isIonizingImaging =
      category === "imaging" &&
      /(RX|TC|TAC|Scintigrafia)/i.test(examName) &&
      !/(Eco|Ecografia|RM)/i.test(examName);
    if (
      activeCase.patientSex === "F" &&
      activeCase.patientAge >= 12 &&
      activeCase.patientAge <= 55 &&
      isIonizingImaging
    ) {
      setLegalAlert({ type: "pregnancy", examName, category });
      return;
    }

    confirmOrderExam(category, examName);
  };
  
  const handlePerformPhysicalExam = () => {
    setShowBloodMenu(false);
    setShowImagingMenu(false);
    setShowConsultMenu(false);
    setShowAzioniClinicheModal(false);
    setHasPerformedPhysicalExam(true);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "doctor",
        content: "Procedo con l'esame obiettivo completo, valutando parametri vitali e stato neurologico...",
        timestamp: formatTime(),
      },
      {
        id: Date.now() + 1,
        role: "patient",
        content: activeCase.physicalExam,
        timestamp: formatTime(),
      },
    ]);
  };

  useEffect(() => {
    // L'esecuzione dell'esame obiettivo migliora l'accuratezza clinica se ancora bassa
    const lastDoctorPhysicalExam = messages.findLast?.(
      (m) => m.role === "doctor" && m.content.toLowerCase().includes("esame obiettivo")
    );

    if (!lastDoctorPhysicalExam) return;

    setOmniScore((prev) => ({
      ...prev,
      accuratezzaClinica: Math.min(Math.max(prev.accuratezzaClinica, 60), 100),
    }));
  }, [messages]);
  
  const handleCreateCustomCase = (e: FormEvent) => {
    e.preventDefault();

    const ageNumber = parseInt(customPatientAge || "0", 10) || 0;
    const mandatoryExamsArray = customMandatoryExams
      .split(",")
      .map((exam) => exam.trim())
      .filter(Boolean);

    const profileParts: string[] = [];

    if (customPatientName || ageNumber) {
      profileParts.push(
        `${customPatientName || "Paziente"}, ${ageNumber} anni.`
      );
    }
    if (customMainReason) {
      profileParts.push(`Motivo dell'accesso / sintomo principale: ${customMainReason}.`);
    }
    if (customComorbidities) {
      profileParts.push(`Patologie pregresse: ${customComorbidities}.`);
    }
    if (customFamilyHistory) {
      profileParts.push(`Familiarità: ${customFamilyHistory}.`);
    }
    if (customHomeTherapy) {
      profileParts.push(`Terapia domiciliare (farmaci assunti): ${customHomeTherapy}.`);
    }
    if (customPhysicalExam) {
      profileParts.push(`Esame obiettivo (parametri vitali e reperti): ${customPhysicalExam}.`);
    }

    profileParts.push(
      "IMPORTANTE per l'IA: Il medico condurrà un'anamnesi molto lunga e dettagliata. Non rivelare tutto subito. Rispondi in modo naturale, un pezzo alla volta, permettendo una simulazione estesa e approfondita."
    );

    const newCase: ClinicalCase = {
      id: `custom-${Date.now()}`,
      specialty: "Caso Personalizzato",
      patientName: customPatientName || "Paziente",
      patientAge: ageNumber,
      patientSex: "M",
      initialMessage:
        customMainReason ||
        "Dottore, vorrei spiegare meglio cosa mi sta succedendo...",
      patientProfile: profileParts.join(" "),
      physicalExam:
        customPhysicalExam ||
        "L'esame obiettivo dettagliato verrà definito dal medico durante la simulazione.",
      truth: {
        correctDiagnosis:
          customCorrectDiagnosis ||
          "Diagnosi da definire in base al ragionamento clinico durante la simulazione.",
        mandatoryQuestions: [],
        requiredExams: mandatoryExamsArray,
        unnecessaryExams: [],
        legalReference:
          "Caso clinico personalizzato: la conformità medico-legale dipenderà dalle scelte del medico e dall'aderenza alle linee guida pertinenti per lo scenario specifico.",
      },
    };

    setActiveCase(newCase);
    setMessages([
      {
        id: Date.now(),
        role: "patient",
        content: newCase.initialMessage,
        timestamp: formatTime(),
      },
    ]);
    setInput("");
    setIsSending(false);
    setShowPrescriptionMenu(false);
    setHasDiscoveredCoumadin(false);
    setClinicalRiskWarning(null);
    setHasPrescribedTC(false);
    setUnnecessaryExamCount(0);
    setHasDischarged(false);
    setFinalDiagnosis("");
    setIsSimulationComplete(false);
    setOmniScore({
      accuratezzaClinica: 0,
      appropriatezzaPrescrittiva: 0,
      sostenibilitaEconomica: 100,
    });
    setPertinentClinicalAccuracy(0);
    setUsedKeywords(new Set());
    setShowRepartoSelector(false);
    setPhase("chat");
    setCurrentHypothesis("");
    setExamResults([]);
    setDiagnosisChoice(null);

    setShowCustomCaseModal(false);
    setShowScenarioModal(true);
    setHasPerformedPhysicalExam(false);
    setStepDurations({ chat: 0, hypothesis: 0, results: 0, evaluation: 0 });
    setCurrentStep('chat');
    setCurrentStepStart(null);
    setEfficiencyScore(null);
  };

  const handleGenerateCaseWithAI = async () => {
    try {
      setIsGeneratingCase(true);

      const response = await fetch("/api/generate-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: customPatientName,
          patientAge: customPatientAge,
          mainReason: customMainReason,
          comorbidities: customComorbidities,
          familyHistory: customFamilyHistory,
          homeTherapy: customHomeTherapy,
          physicalExam: customPhysicalExam,
          correctDiagnosis: customCorrectDiagnosis,
          mandatoryExams: customMandatoryExams,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Errore nella generazione del caso con IA");
      }

      const generated = data.case;

      const shouldOverwrite = aiOverwriteAll;

      if ((shouldOverwrite || !customPatientName) && generated.patientName) {
        setCustomPatientName(generated.patientName);
      }
      if ((shouldOverwrite || !customPatientAge) && generated.patientAge) {
        setCustomPatientAge(String(generated.patientAge));
      }
      if ((shouldOverwrite || !customMainReason) && generated.initialMessage) {
        setCustomMainReason(generated.initialMessage);
      }
      if ((shouldOverwrite || !customPhysicalExam) && generated.truth?.physicalExam) {
        setCustomPhysicalExam(generated.truth.physicalExam);
      }
      if ((shouldOverwrite || !customCorrectDiagnosis) && generated.truth?.correctDiagnosis) {
        setCustomCorrectDiagnosis(generated.truth.correctDiagnosis);
      }
      if ((shouldOverwrite || !customMandatoryExams) && Array.isArray(generated.truth?.requiredExams)) {
        setCustomMandatoryExams(generated.truth.requiredExams.join(", "));
      }
    } catch (error: any) {
      console.error("Errore Genera con IA:", error);
      alert(error.message || "Errore sconosciuto durante la generazione del caso.");
    } finally {
      setIsGeneratingCase(false);
    }
  };

  const handleResetSimulation = () => {
    const nextCase = getRandomCase(selectedSpecialty);
    setActiveCase(nextCase);
    setMessages([
      {
        id: Date.now(),
        role: "patient",
        content: nextCase.initialMessage,
        timestamp: formatTime(),
      },
    ]);
    setInput("");
    setIsSending(false);
    setShowPrescriptionMenu(false);
    setHasDiscoveredCoumadin(false);
    setClinicalRiskWarning(null);
    setHasPrescribedTC(false);
    setUnnecessaryExamCount(0);
    setHasDischarged(false);
    setFinalDiagnosis("");
    setIsSimulationComplete(false);
    setOmniScore({ accuratezzaClinica: 0, appropriatezzaPrescrittiva: 0, sostenibilitaEconomica: 100 });
    setPertinentClinicalAccuracy(0);
    setUsedKeywords(new Set());
    setShowRepartoSelector(false);
    setShowScenarioModal(true);
    setPhase('chat');
    setCurrentHypothesis('');
    setExamResults([]);
    setDiagnosisChoice(null);
    setEmergencyStartTime(null);
    setEmergencyElapsedMs(0);
    setEmergencyFinalMs(null);
    setHasPerformedPhysicalExam(false);
    setStepDurations({ chat: 0, hypothesis: 0, results: 0, evaluation: 0 });
    setCurrentStep('chat');
    setCurrentStepStart(null);
    setEfficiencyScore(null);
    setLegalInfractions([]);
  };

  const attemptedUnsafeDischarge = hasDischarged && (!hasPrescribedTC || !hasDiscoveredCoumadin);
  const isLegallyProtected = evaluationResult
    ? evaluationResult.legalStatus === "CONFORME"
    : null;

  function computeWeightedOmniScore() {
    if (!isSimulationComplete || !evaluationResult) return 0;

    // Base: aderenza clinica/diagnostica alle linee guida ISS/SNLG
    const baseClinical = Math.max(
      0,
      Math.min(100, evaluationResult.clinicalAccuracy ?? omniScore.accuratezzaClinica)
    );
    const baseDiagnosticAppropriateness = Math.max(
      0,
      Math.min(100, evaluationResult.prescriptiveAppropriateness ?? omniScore.appropriatezzaPrescrittiva)
    );

    // Penalità medico-legali per omissioni o violazioni di sicurezza / tempi soglia
    let medicoLegalMalus = 0;

    const missingMandatoryExams = (() => {
      const required = evaluationResult.caseSolution.requiredExams ?? [];
      return required.filter((exam) => !prescribedExams.includes(exam));
    })();

    if (missingMandatoryExams.length > 0) {
      medicoLegalMalus += 30;
    }

    if (legalInfractions.length > 0 || evaluationResult.legalStatus === "NON CONFORME") {
      medicoLegalMalus += 30;
    }

    if (efficiencyScore != null && efficiencyScore < 70) {
      medicoLegalMalus += 20;
    }

    medicoLegalMalus = Math.min(medicoLegalMalus, 70);

    // Bonus di diligenza per anamnesi approfondita e scelta del gold standard diagnostico
    let diligenceBonus = 0;
    if (pertinentClinicalAccuracy >= 70) {
      diligenceBonus += 5;
    }
    if (evaluationResult.isDiagnosisCorrect) {
      diligenceBonus += 10;
    }
    diligenceBonus = Math.min(diligenceBonus, 15);

    const aderenzaLineeGuidaScore = Math.max(
      0,
      Math.min(
        100,
        baseClinical * 0.6 + baseDiagnosticAppropriateness * 0.4 - medicoLegalMalus + diligenceBonus
      )
    );

    // OmniScore finale basato sull'aderenza alle linee guida
    const weighted = aderenzaLineeGuidaScore;
    return Math.round(Math.max(Math.min(weighted, 100), 0));
  }

  const weightedOmniScore = useMemo(
    () => computeWeightedOmniScore(),
    [omniScore, isLegallyProtected, isSimulationComplete, evaluationResult]
  );

  const handleLogoutUser = () => {
    const prevNickname = currentUserNickname;
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_ACTIVE_USER);
      if (prevNickname) {
        const sessionKey = `${STORAGE_SESSION_PREFIX}${prevNickname}`;
        try {
          localStorage.removeItem(sessionKey);
        } catch {
          // ignore
        }
        try {
          sessionStorage.removeItem(sessionKey);
        } catch {
          // ignore
        }
      }
    }
    // Reset totale della sessione al cambio utente
    handleResetSimulation();
    setCurrentUserNickname(null);
    setBootPhase("auth");
  };

  const handleMasterPinSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = masterPin.trim();
    if (trimmed === "C12122001!") {
      try {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(MASTER_PIN_SESSION_KEY, "true");
        }
      } catch {
        // ignore storage errors but still allow access
      }
      setHasMasterAccess(true);
      setMasterPinError(null);
    } else {
      setMasterPinError(
        "Accesso negato. Inserire il codice di autorizzazione fornito dalla direzione sanitaria."
      );
    }
  };

  if (!hasMasterAccess) {
    return (
      <MasterPinGate
        masterPin={masterPin}
        masterPinError={masterPinError}
        isCheckingMasterPin={isCheckingMasterPin}
        mounted={mounted}
        onChangePin={setMasterPin}
        onSubmit={handleMasterPinSubmit}
      />
    );
  }

  if (bootPhase === "auth" && !authBootChecked) {
    return (
      <div className="fixed inset-0 bg-[#020814] flex items-center justify-center z-[99999] px-4">
        <div className="bg-[#050b16]/90 backdrop-blur-2xl border border-cyan-900/50 px-8 py-7 rounded-3xl shadow-[0_0_60px_rgba(0,180,216,0.18)] w-full max-w-md text-center text-slate-200 text-sm">
          <p className="mb-2 font-medium text-cyan-200">
            Verifica del profilo in corso...
          </p>
          <p className="text-xs text-slate-400">
            Stiamo controllando se è presente un profilo salvato sul dispositivo.
          </p>
        </div>
      </div>
    );
  }

  if (bootPhase === "auth") {
    return (
      <div className="fixed inset-0 bg-[#020814] flex items-center justify-center z-[99999] px-4">
        <div className="bg-[#050b16]/90 backdrop-blur-2xl border border-cyan-900/50 px-8 py-7 rounded-3xl shadow-[0_0_60px_rgba(0,180,216,0.18)] w-full max-w-2xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/90 to-red-900/80 text-white font-semibold shadow-[0_0_20px_rgba(225,29,72,0.45)]">
                  Om
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-light text-white tracking-[0.25em] uppercase">
                    Benvenuto in OmniScript
                  </h1>
                  <p className="text-[11px] md:text-xs text-slate-400 mt-1 tracking-widest uppercase">
                    Piattaforma di simulazione clinica per l&apos;urgenza-emergenza
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-900/10 via-amber-900/5 to-transparent px-4 py-3 mb-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-amber-300">
                      Disclaimer Legge 24/2017 &quot;Gelli-Bianco&quot;
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-amber-100/90">
                      OmniScript è uno strumento didattico di simulazione clinica. I casi proposti
                      hanno finalità esclusivamente formative e non sostituiscono in alcun modo il
                      giudizio clinico, le linee guida ufficiali o i protocolli della tua Azienda
                      Sanitaria. L&apos;utilizzo della piattaforma non genera alcuna forma di
                      responsabilità professionale ai sensi della Legge 24/2017.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-2">
                Per accedere alla dashboard di simulazione è necessario creare un account personale
                o effettuare il login. I tuoi progressi verranno salvati localmente e associati al
                nickname scelto.
              </p>
              <p className="text-[11px] text-slate-500 italic">
                Proseguendo confermi di aver letto e compreso il presente disclaimer e di utilizzare
                OmniScript esclusivamente per finalità formative.
              </p>
            </div>

            <div className="w-full md:w-80 bg-[#050816]/90 border border-slate-800 rounded-2xl p-5 shadow-[0_0_30px_rgba(15,23,42,0.6)]">
              <div className="flex items-center justify-center mb-2">
                <Lock className="text-cyan-500 w-8 h-8 mr-2" />
                <span className="text-sm font-medium tracking-[0.25em] text-slate-100 uppercase">
                  {authMode === "login" ? "Login Utente" : "Nuovo Account"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 text-center">
                {authMode === "login"
                  ? "Accedi con il tuo Nickname registrato per riprendere la generazione del tuo OmniScore."
                  : "Definisci un Nickname univoco e una password sicura per iniziare a tracciare la tua performance OmniScore."}
              </p>
              <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-400">
                    Nickname<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={authNickname}
                    onChange={(e) => {
                      setAuthNickname(e.target.value);
                      if (authNicknameError) {
                        setAuthNicknameError(null);
                      }
                      if (authMessage) {
                        setAuthMessage(null);
                      }
                    }}
                    onBlur={() => {
                      const trimmed = authNickname.trim();
                      if (trimmed !== authNickname) {
                        setAuthNickname(trimmed);
                      }
                    }}
                    className={`bg-slate-950/80 text-white rounded-lg px-3 py-2 w-full text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 ${
                      authNicknameError
                        ? "border border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border border-slate-700 focus:border-cyan-500 focus:ring-cyan-500"
                    }`}
                    placeholder="Es. DrRossi"
                    autoComplete="off"
                    disabled={authIsProcessing}
                    required
                  />
                  {authNicknameError && (
                    <p className="text-red-400 text-xs mt-1">
                      {authNicknameError}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-400">
                    Password<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="bg-slate-950/80 border border-slate-700 text-white rounded-lg px-3 py-2 w-full text-sm placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder={authMode === "login" ? "Inserisci la password" : "Definisci una password sicura"}
                    autoComplete={authMode === "login" ? "one-time-code" : "new-password"}
                    disabled={authIsProcessing}
                    required
                  />
                </div>
                {authMessage && (
                  <p className={`text-xs mt-1 min-h-[1.25rem] ${authMessage.includes("in corso") ? "text-cyan-300" : "text-red-400"}`}>
                    {authMessage}
                  </p>
                )}
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={authIsProcessing}
                    className={`w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2.5 rounded-lg transition-all font-medium text-sm ${
                      authIsProcessing
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:shadow-[0_0_20px_rgba(0,180,216,0.4)]"
                    }`}
                  >
                    {authIsProcessing
                      ? authMode === "login"
                        ? "Accesso in corso..."
                        : "Creazione profilo in corso..."
                      : authMode === "login"
                        ? "Accedi a OmniScript"
                        : "Crea il tuo account"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (authIsProcessing) return;
                      setAuthMode((m) => (m === "login" ? "register" : "login"));
                      setAuthMessage(null);
                    }}
                    disabled={authIsProcessing}
                    className={`w-full border border-slate-700 text-slate-200 py-2.5 rounded-lg transition-all text-sm ${
                      authIsProcessing ? "opacity-60 cursor-not-allowed" : "hover:bg-slate-800/80"
                    }`}
                  >
                    {authMode === "login"
                      ? "Nuovo utente? Crea un account"
                      : "Hai già un account? Vai al login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (bootPhase === "splash") {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500/90 to-red-900/80 text-4xl font-bold text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] animate-pulse">
            Om
          </div>
          <span className="text-6xl font-light tracking-widest text-white mt-6 transition-all duration-700">
            OmniScript
          </span>
          <span className="text-xl font-light tracking-[0.2em] text-cyan-200/80 mt-3 animate-pulse">
            Formazione Clinica Avanzata
          </span>
        </div>
      </div>
    );
  }

  if (bootPhase === "advisor") {
    return (
      <ClinicalAdvisorModal
        open={true}
        onAccept={() => {
          setBootPhase("ready");
          setCurrentStep("chat");
          setCurrentStepStart(Date.now());
          setStepDurations({ chat: 0, hypothesis: 0, results: 0, evaluation: 0 });
          setEfficiencyScore(null);
        }}
      />
    );
  }

  return (
    <>
      <div
        className="min-h-screen antialiased font-sans text-[16px] text-slate-200 leading-relaxed relative pb-10 pt-8"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(5, 15, 30, 0.85), rgba(2, 8, 20, 0.95)), url('https://images.unsplash.com/photo-1674027444485-cec3da58eef4?q=80&w=2000&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {isEvaluating && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0f1c]/90 backdrop-blur-xl" aria-live="polite" aria-busy="true">
            <div className="mb-6">
              <svg
                width="200"
                height="80"
                viewBox="0 0 200 80"
                className="text-cyan-400"
              >
                <defs>
                  <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <rect
                  x="0"
                  y="0"
                  width="200"
                  height="80"
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.25)"
                  strokeWidth="0.5"
                />
                <path
                  d="M 10 40 L 40 40 L 55 20 L 70 60 L 85 30 L 100 40 L 130 40 L 145 15 L 160 65 L 175 35 L 190 40"
                  stroke="url(#ecgGradient)"
                  strokeWidth="3"
                  fill="none"
                  className="ecg-line"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-2xl font-mono text-cyan-400 tracking-widest animate-pulse">
              IN VALUTAZIONE...
            </p>
            <p className="text-slate-500 font-mono text-sm mt-4">
              Analisi conformità Legge Gelli-Bianco e calcolo OmniScore...
            </p>
          </div>
        )}

        {legalAlert && (
          <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-[#0a0f1c] border border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.2)] max-w-lg w-full p-6 rounded-2xl">
              <h3 className="text-lg font-bold tracking-wider text-red-400 mb-4">
                {legalAlert.type === "minor"
                  ? "CONSENSO INFORMATO MINORE"
                  : "RADIOPROTEZIONE - RISCHIO BIOLOGICO"}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {legalAlert.type === "minor"
                  ? `Il paziente è minorenne (${activeCase.patientAge} anni). Prima di procedere con [${legalAlert.examName}], la Legge richiede l'acquisizione del consenso informato firmato dagli esercenti la responsabilità genitoriale.`
                  : `La paziente è una donna in età fertile (${activeCase.patientAge} anni). L'esame richiesto [${legalAlert.examName}] impiega radiazioni ionizzanti. È obbligatorio escludere uno stato di gravidanza e far firmare l'apposito modulo di scarico responsabilità prima dell'esposizione.`}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setLegalAlert(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Annulla Prescrizione
                </button>
                <button
                  type="button"
                  onClick={() => {
                    confirmOrderExam(legalAlert.category as "sangue" | "imaging" | "consulenza", legalAlert.examName);
                    setLegalAlert(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600/20 text-red-500 border border-red-500 hover:bg-red-600 hover:text-white transition-colors"
                >
                  Dichiaro di aver acquisito la firma
                </button>
              </div>
            </div>
          </div>
        )}

      <div className="relative z-10 min-h-screen">
        <header className={`border-b ${BORDER_SOFT} ${PANEL_BG} shadow-[0_0_30px_rgba(15,23,42,0.4)] backdrop-blur-2xl px-4 py-3 flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/90 to-red-900/80 text-white font-bold shadow-[0_0_15px_rgba(225,29,72,0.4)]">
              Om
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-medium tracking-wide text-slate-100">
                OmniScript
              </span>
              <span className="text-sm text-slate-400">
                {activeCase.patientName}, {activeCase.patientAge} anni
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {currentUserNickname && (
              <div className="hidden sm:flex flex-col items-end mr-2">
                <div className="flex items-center text-[13px] font-medium text-sky-300">
                  <UserCircle className="h-5 w-5 mr-2 text-sky-300" />
                  <span>Bentornato, {currentUserNickname}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogoutUser}
                  className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-slate-700/60 bg-slate-900/70 px-2 py-0.5 text-[10px] font-medium text-slate-300 hover:bg-slate-800 hover:text-sky-300 transition-colors"
                >
                  <X className="h-3 w-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowScenarioModal(true)}
              className="group flex items-center gap-2 rounded-full border border-slate-700/50 bg-[#111827]/60 px-3 py-1.5 text-xs text-slate-400 hover:bg-[#111827]/80 hover:border-cyan-900/40 hover:text-cyan-400 transition-all duration-300"
            >
              <FileText className="h-3 w-3" /> Info Caso
            </button>
            <button
              onClick={() => setShowCustomCaseModal(true)}
              className="group flex items-center gap-2 rounded-full border border-slate-700/50 bg-[#111827]/60 px-3 py-1.5 text-sm text-slate-400 hover:bg-[#111827]/80 hover:border-cyan-900/40 hover:text-cyan-400 transition-all duration-300"
            >
              <FilePlus className="h-4 w-4" /> Crea Caso
            </button>
            <button
              onClick={handleResetSimulation}
              className="group flex items-center gap-2 rounded-full border border-slate-700/50 bg-[#111827]/60 px-3 py-1.5 text-sm text-slate-400 hover:bg-[#111827]/80 hover:border-cyan-900/40 hover:text-cyan-400 transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4" /> Nuovo Caso
            </button>
            <button
              onClick={() => setShowAccountDashboard(true)}
              className="group flex items-center gap-2 rounded-full border border-slate-700/50 bg-[#111827]/60 px-3 py-1.5 text-sm text-slate-400 hover:bg-[#111827]/80 hover:border-cyan-900/40 hover:text-cyan-400 transition-all duration-300"
            >
              <UserCircle className="h-4 w-4" /> Statistiche
            </button>
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="group flex items-center gap-2 rounded-full border border-red-600/80 bg-gradient-to-r from-red-700 to-orange-600 px-4 py-2 text-sm font-semibold text-red-50 hover:from-red-500 hover:to-orange-500 hover:shadow-[0_0_22px_rgba(248,113,113,0.7)] transition-all duration-300 ml-2"
            >
              <ShieldAlert className="h-4 w-4" />
              MODALITÀ EMERGENZA
            </button>
            {isEmergencyMode && emergencyStartTime && !isSimulationComplete && (
              <>
                <button
                  type="button"
                  onClick={() => setShowEmergencyExitConfirm(true)}
                  className="ml-2 inline-flex items-center gap-2 rounded-full border border-red-500/80 bg-[#111827]/80 px-3 py-1 text-xs font-semibold text-red-100 hover:bg-red-900/70 hover:text-red-50 hover:border-red-400 transition-all duration-200"
                >
                  <X className="h-3 w-3" />
                  Interrompi Emergenza
                </button>
              <span className="ml-2 inline-flex items-center gap-2 rounded-full bg-red-900/40 border border-red-600/60 px-3 py-1 text-xs font-mono text-red-100 shadow-[0_0_12px_rgba(248,113,113,0.45)]">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <ShieldAlert className="h-3 w-3 text-red-300" />
                Modalità Emergenza — Timer: {formatDuration(emergencyElapsedMs)}
              </span>
              </>
            )}
          </div>
        </header>

        {showScenarioModal && (
          <>
            <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md" />
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="w-full max-w-xl rounded-3xl border-2 border-red-600/80 shadow-[0_0_50px_rgba(220,38,38,0.6)] animate-pulse bg-[#0a0f1c]/95 backdrop-blur-2xl">
                <div className="flex items-center gap-2 mb-4 justify-center pt-4">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                  <span className="text-red-500 text-xs font-mono tracking-[0.2em] font-bold uppercase">Scenario Clinico - Paziente in Attesa</span>
                </div>
                <div className={`border-b ${BORDER_ACCENT} px-5 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-slate-400" />
                    <h2 className="text-lg font-medium text-slate-100">
                      Scenario Clinico
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      Caso in simulazione
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowScenarioModal(false)}
                      className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="px-5 py-4 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar text-base leading-relaxed">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-slate-400">
                      Seleziona la specialità del turno
                    </label>
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedSpecialty(value);
                        const nextCase = getRandomCase(value);
                        setActiveCase(nextCase);
                        setMessages([
                          {
                            id: Date.now(),
                            role: "patient",
                            content: nextCase.initialMessage,
                            timestamp: formatTime(),
                          },
                        ]);
                        const normalized = value.toLowerCase();
                        const isEmergencyCategory =
                          normalized.includes("emergenza") ||
                          normalized.includes("urgenza");
                        setIsEmergencyMode(isEmergencyCategory);
                      }}
                      className="w-full rounded-lg border border-slate-700/50 bg-[#111827]/60 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500/50 text-slate-200"
                    >
                      <option value="Tutte le specialità">Tutte le specialità</option>
                      {Array.from(new Set(CLINICAL_CASES.map((c) => c.specialty)))
                        .sort()
                        .map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                    </select>
                  </div>
                  <p className="font-medium text-slate-100">
                    {activeCase.patientName}, {activeCase.patientAge} anni
                  </p>
                  <p className="text-base leading-relaxed text-slate-400">
                    {activeCase.patientProfile}
                  </p>
                </div>
                <div className={`border-t ${BORDER_ACCENT} px-5 py-4 flex justify-between gap-3`}>
                  <button
                    type="button"
                    onClick={() => {
                      const nextCase = getRandomCase(selectedSpecialty);
                      setActiveCase(nextCase);
                      setMessages([
                        {
                          id: Date.now(),
                          role: "patient",
                          content: nextCase.initialMessage,
                          timestamp: formatTime(),
                        },
                      ]);
                    }}
                    className="rounded-full px-5 py-2 text-sm font-medium text-red-50/95 shadow-[0_0_12px_rgba(248,113,113,0.25)] border border-red-800/50 bg-gradient-to-r from-red-600/70 to-orange-600/70 hover:from-red-500/90 hover:to-orange-500/90 hover:shadow-[0_0_18px_rgba(248,113,113,0.4)] transition-all duration-300"
                  >
                    Rifiuta Caso (Nuovo Profilo)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowScenarioModal(false);
                      if (isEmergencyMode) {
                        const start = Date.now();
                        setEmergencyStartTime(start);
                        setEmergencyElapsedMs(0);
                        setEmergencyFinalMs(null);
                      } else {
                        setEmergencyStartTime(null);
                        setEmergencyElapsedMs(0);
                        setEmergencyFinalMs(null);
                      }
                      setCurrentStep("chat");
                      setCurrentStepStart(Date.now());
                      setStepDurations({ chat: 0, hypothesis: 0, results: 0, evaluation: 0 });
                      setEfficiencyScore(null);
                    }}
                    className="rounded-full px-6 py-2 text-sm font-medium text-slate-950 bg-gradient-to-r from-cyan-600/85 to-blue-600/85 hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_15px_rgba(0,180,216,0.45)] shadow-[0_0_10px_rgba(0,180,216,0.25)] transition-all duration-300"
                  >
                    Accetta Caso e Inizia Turno
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <main className="mx-auto mt-16 flex max-w-6xl flex-col lg:flex-row gap-4 p-4 lg:p-8 pt-16">
          <section className={`flex flex-1 flex-col rounded-3xl border ${BORDER_ACCENT} ${PANEL_BG} backdrop-blur-xl shadow-[0_0_30px_rgba(15,23,42,0.35)] relative`}>
            <div className={`p-4 border-b ${BORDER_ACCENT} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}>
              <h2 className="text-2xl font-medium text-slate-100">
                {phase === "chat"
                  ? "Chat (Anamnesi)"
                  : phase === "hypothesis"
                  ? "Esame Obiettivo e Prescrizioni"
                  : phase === "results"
                  ? "Diagnostica: Esami e Referti"
                  : "Prescrizione Finale e Report"}
              </h2>
              <nav className="flex flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm">
                {[
                  { id: "chat" as const, label: "Chat (Anamnesi)" },
                  { id: "hypothesis" as const, label: "Esame Obiettivo" },
                  { id: "results" as const, label: "Diagnostica" },
                  { id: "evaluation" as const, label: "Prescrizione / Report" },
                ].map((tab) => {
                  const isActive = phase === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => advancePhase(tab.id)}
                      className={[
                        "px-3 py-1.5 rounded-full border transition-all duration-200 font-medium",
                        "backdrop-blur-md",
                        isActive
                          ? "bg-cyan-500/90 text-slate-950 border-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.45)]"
                          : "bg-slate-900/60 text-slate-300 border-slate-700/60 hover:border-cyan-700/60 hover:text-cyan-200",
                      ].join(" ")}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* FASE 1: Chat (Anamnesi) */}
            {phase === "chat" && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[500px] custom-scrollbar text-base leading-relaxed">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.role === "doctor" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-3xl px-4 py-3 shadow-md border ${
                          m.role === "doctor"
                            ? "bg-gradient-to-r from-cyan-600/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 text-slate-100 border-cyan-900/40 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                            : "bg-[#111827]/70 border-slate-700/50 text-slate-200"
                        }`}
                      >
                        <p className="text-xs mb-1 text-slate-400">
                          {m.role === "doctor" ? "Medico" : activeCase.patientName} - {m.timestamp}
                        </p>
                        <p className="text-[16px] leading-relaxed">{m.content}</p>
                      </div>
                    </div>
                  ))}
                  {isSending && (
                    <div className="text-right text-sm text-slate-400 animate-pulse">
                      {activeCase.patientName} sta formulando una risposta...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className={`p-4 border-t ${BORDER_ACCENT}`}>
                  <textarea 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    disabled={isSimulationComplete || showScenarioModal}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    className="w-full rounded-2xl border border-slate-700/50 bg-[#111827]/70 px-4 py-3 text-slate-200 text-[16px] leading-relaxed outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none" 
                    placeholder={`Formula una domanda clinicamente mirata a ${activeCase.patientName}...`} 
                    rows={3} 
                  />
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-slate-400">
                      Migliora i punteggi formulando domande strutturate e pertinenti.
                    </span>
                    <button
                      type="submit"
                      disabled={!input.trim() || isSending || isSimulationComplete || showScenarioModal}
                      className="rounded-full px-6 py-2 font-medium text-slate-950 bg-gradient-to-r from-cyan-600/85 to-blue-600/85 hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_14px_rgba(0,180,216,0.4)] shadow-[0_0_10px_rgba(0,180,216,0.25)] transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
                    >
                      Invia
                    </button>
                  </div>
                </form>
                <div className={`p-4 border-t ${BORDER_ACCENT}`}>
                  <button
                    type="button"
                    onClick={() => advancePhase("hypothesis")}
                    disabled={isSending || showScenarioModal}
                    className="w-full rounded-2xl py-3 px-4 font-medium text-slate-950 bg-gradient-to-r from-amber-500/90 to-orange-500/90 hover:from-amber-400 hover:to-orange-400 shadow-[0_0_12px_rgba(245,158,11,0.35)] hover:shadow-[0_0_16px_rgba(245,158,11,0.45)] transition-all duration-300 border border-amber-700/50 flex items-center justify-center gap-2"
                  >
                    <Lightbulb className="h-5 w-5" />
                    Vai allo step successivo
                  </button>
                </div>
              </>
            )}

            {/* FASE 2: Formulazione Ipotesi e Prescrizioni */}
            {phase === "hypothesis" && (
              <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
                <button
                  type="button"
                  onClick={() => advancePhase("chat")}
                  className="inline-flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-100 transition-colors mb-1"
                >
                  <span className="text-base">←</span>
                  <span>Torna al colloquio col paziente</span>
                </button>
                <h3 className="text-lg font-medium text-slate-100 border-b border-slate-700/50 pb-2">
                  Formulazione Ipotesi e Prescrizioni
                </h3>
                <label className="block text-sm font-medium text-slate-400">
                  Ipotesi Diagnostica Attuale
                </label>
                <textarea
                  value={currentHypothesis}
                  onChange={(e) => setCurrentHypothesis(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700/50 bg-[#111827]/70 px-4 py-3 text-slate-200 text-[16px] leading-relaxed outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none min-h-[120px]"
                  placeholder="Es. Sospetto trauma cranico con rischio emorragia in paziente anticoagulato..."
                  rows={4}
                />
                <button
                  type="button"
                  onClick={() => setShowAzioniClinicheModal(true)}
                  className="w-full rounded-2xl border border-slate-700/50 bg-[#111827]/70 px-4 py-3 text-slate-200 hover:bg-[#111827]/90 hover:border-cyan-900/40 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Syringe className="h-5 w-5 text-cyan-400/90" />
                  Apri Menu Prescrizioni
                </button>
                {prescribedExams.length > 0 && (
                  <div className={`rounded-2xl border ${BORDER_ACCENT} bg-[#111827]/50 p-3`}>
                    <p className="text-xs font-medium text-slate-400 mb-2">Esami prescritti in questa fase</p>
                    <ul className="space-y-1 text-sm text-slate-200">
                      {prescribedExams.map((name, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-cyan-400/90">•</span> {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-auto pt-4 border-t border-slate-700/50">
                  <button
                    type="button"
                    onClick={async () => {
                      const toGenerate = prescribedExams.filter((name) => !examResults.some((r) => r.name === name));
                      if (toGenerate.length > 0) {
                        setIsGeneratingReferto(true);
                        try {
                          for (const examName of toGenerate) {
                            try {
                              const res = await fetch("/api/chat", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  generateReferto: true,
                                  examName,
                                  correctDiagnosis: activeCase.truth.correctDiagnosis,
                                }),
                              });
                              const data = await res.json();
                              const resultText = data.text || "Referto non disponibile.";
                              setExamResults((prev) => [...prev, { name: examName, result: resultText }]);
                            } catch {
                              setExamResults((prev) => [...prev, { name: examName, result: "Errore generazione referto." }]);
                            }
                          }
                        } finally {
                          setIsGeneratingReferto(false);
                        }
                      }
                      advancePhase("results");
                    }}
                    disabled={isGeneratingReferto}
                    className="w-full rounded-2xl py-3 px-4 font-medium text-slate-950 bg-gradient-to-r from-cyan-600/85 to-blue-600/85 hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_14px_rgba(0,180,216,0.4)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGeneratingReferto ? "Generazione referti in corso..." : "Invia Ipotesi e Attendi Referti"}
                  </button>
                </div>
              </div>
            )}

            {/* FASE 3: Esiti e Diagnosi Finale */}
            {phase === "results" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[500px] custom-scrollbar text-base leading-relaxed">
                <button
                  type="button"
                  onClick={() => advancePhase("chat")}
                  className="inline-flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-100 transition-colors mb-1"
                >
                  <span className="text-base">←</span>
                  <span>Torna al colloquio col paziente</span>
                </button>
                <div className={`rounded-2xl border ${BORDER_ACCENT} bg-[#111827]/70 p-4`}>
                  <p className="text-xs font-medium text-slate-400 mb-1">Ipotesi formulata</p>
                  <p className="text-slate-200 font-medium whitespace-pre-wrap">{currentHypothesis || "—"}</p>
                </div>
                <h3 className="text-sm font-medium text-slate-400">Esami prescritti e referti</h3>
                {examResults.length === 0 ? (
                  <p className="text-slate-400">Nessun referto disponibile.</p>
                ) : (
                  <div className="space-y-3">
                    {examResults.map((r, i) => (
                      <div key={i} className={`rounded-2xl border ${BORDER_ACCENT} bg-[#111827]/70 p-4`}>
                        <p className="text-xs font-medium text-cyan-400/90 mb-1">{r.name}</p>
                        <p className="text-sm text-slate-200 leading-relaxed">{r.result}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700/50">
                  <button
                    type="button"
                    onClick={() => setPhase("hypothesis")}
                    className="flex-1 rounded-2xl py-3 px-4 font-medium text-slate-50 bg-gradient-to-r from-orange-600/85 to-red-600/85 hover:from-orange-500 hover:to-red-500 shadow-[0_0_12px_rgba(249,115,22,0.35)] hover:shadow-[0_0_16px_rgba(249,115,22,0.45)] transition-all duration-300 border border-orange-700/50 flex items-center justify-center gap-2"
                  >
                    Modifica Ipotesi e Integra Esami
                  </button>
                  <button
                    type="button"
                onClick={() => {
                  setFinalDiagnosis(currentHypothesis);
                  advancePhase("evaluation");
                  runLegalEvaluation("Diagnosi formulata e conclusione turno", false);
                }}
                    disabled={isEvaluating}
                    className="flex-1 rounded-2xl py-3 px-4 font-medium text-slate-950 bg-gradient-to-r from-cyan-600/85 to-emerald-600/85 hover:from-cyan-500 hover:to-emerald-500 shadow-[0_0_12px_rgba(0,180,216,0.35)] hover:shadow-[0_0_16px_rgba(0,180,216,0.45)] transition-all duration-300 border border-cyan-700/50 flex items-center justify-center gap-2"
                  >
                    {isEvaluating ? "Valutazione in corso..." : "Conferma Diagnosi e Concludi"}
                  </button>
                </div>
              </div>
            )}

            {phase === "evaluation" && (
              <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center text-slate-400">
                <div className="flex flex-col items-center gap-3 text-center">
                  <button
                    type="button"
                    onClick={() => advancePhase("chat")}
                    className="inline-flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-100 transition-colors"
                  >
                    <span className="text-base">←</span>
                    <span>Torna al colloquio col paziente</span>
                  </button>
                  <p>Turno concluso. Consulta il referto di fine turno e la dashboard.</p>
                </div>
              </div>
            )}

            {!isSimulationComplete && phase === "chat" && (
              <div className={`p-4 border-t ${BORDER_ACCENT} flex justify-between items-center ${PANEL_BG_ALT} rounded-b-3xl backdrop-blur-xl`}>
                <div>
                  <h3 className="font-medium text-lg text-slate-100">
                    Decisione finale di gestione
                  </h3>
                  <p className="text-sm text-slate-400">
                    Concludi il percorso clinico e attiva la valutazione medico-legale.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrescriptionMenu(!showPrescriptionMenu)}
                  className="group rounded-full border border-slate-700/50 bg-[#111827]/70 px-4 py-2 text-sm text-slate-400 hover:bg-[#111827]/90 hover:border-cyan-900/40 hover:text-cyan-400 transition-all duration-300"
                >
                  Prescrivi / Dimetti
                </button>
              </div>
            )}
            
            {showPrescriptionMenu && !isSimulationComplete && (
              <div className={`p-4 grid grid-cols-1 md:grid-cols-3 gap-3 ${PANEL_BG_ALT} rounded-b-3xl backdrop-blur-xl`}>
                <button
                  onClick={() => handleFinalPrescription("dimissione")}
                  className="rounded-2xl border border-red-900/50 bg-gradient-to-br from-red-800/50 to-orange-800/50 p-3 hover:from-red-700/60 hover:to-orange-700/60 text-left transition-all duration-300"
                >
                  <span className="block font-medium text-red-100/90">
                    Dimissioni
                  </span>
                  <span className="text-sm text-red-200/70">
                    Rischio Legale Alto
                  </span>
                </button>
                <button
                  onClick={() => handleFinalPrescription("obi")}
                  className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-sky-900/40 to-cyan-900/40 p-3 hover:from-sky-800/50 hover:to-cyan-800/50 text-left transition-all duration-300"
                >
                  <span className="block font-medium text-slate-200">
                    Osservazione Breve Intensiva (OBI)
                  </span>
                  <span className="text-sm text-slate-400">
                    Monitoraggio clinico in area dedicata
                  </span>
                </button>
                <button
                  onClick={() => handleFinalPrescription("ricovero")}
                  className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-emerald-800/45 to-teal-800/45 p-3 hover:from-emerald-700/55 hover:to-teal-700/55 text-left transition-all duration-300"
                >
                  <span className="block font-medium text-emerald-100/95">
                    Ricovero
                  </span>
                  <span className="text-sm text-emerald-200/80">
                    Invio in reparto ospedaliero
                  </span>
                </button>
              </div>
            )}

            {showRepartoSelector && !isSimulationComplete && (
              <div className={`p-4 ${PANEL_BG_ALT} border-t ${BORDER_ACCENT} space-y-2 backdrop-blur-xl rounded-b-3xl`}>
                <p className="text-sm font-medium mb-1 text-slate-100">
                  Seleziona il reparto di ricovero:
                </p>
                <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                  {HOSPITAL_WARDS.map((reparto) => (
                    <button
                      key={reparto}
                      onClick={() => handleRicoveroRepartoSelect(reparto)}
                      className="w-full rounded-2xl border border-slate-700/50 bg-[#111827]/60 px-3 py-2 text-base leading-relaxed hover:bg-[#111827]/80 hover:border-cyan-900/30 text-slate-200 text-left transition-all duration-300"
                    >
                      {reparto}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          <aside className="w-full lg:w-96 rounded-2xl border border-[#1E293B] p-5 bg-[#070B14]/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,180,216,0.05)] flex flex-col gap-4">
            <div className="border-b border-[#1E293B] pb-4">
              <p className="text-slate-500 font-bold tracking-[0.2em] text-xs uppercase">OMNISCORE INDEX</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span
                  className={`text-5xl font-mono font-medium tabular-nums ${
                    isSimulationComplete
                      ? "text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                      : "text-slate-500"
                  }`}
                >
                  {isSimulationComplete ? weightedOmniScore : "—"}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                  <span
                    className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                      isEvaluating ? "bg-cyan-400 animate-pulse" : isSimulationComplete ? "bg-emerald-400" : "bg-slate-500"
                    }`}
                  />
                  {isEvaluating ? "ANALYZING..." : isSimulationComplete ? "SYS. READY" : "STANDBY"}
                </span>
              </div>
            </div>

            {/* PANNELLO EVIDENZE CLINICHE (profilo + E.O.) */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-500">
                Evidenze Cliniche
              </p>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-300">
                  Profilo / Anamnesi sintetica
                </p>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">
                  {activeCase.patientProfile}
                </p>
              </div>
              <div className="pt-1 space-y-1">
                <p className="text-xs font-semibold text-slate-300">
                  Esame Obiettivo
                </p>
                <p className="text-xs text-slate-400 leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">
                  {hasPerformedPhysicalExam
                    ? activeCase.physicalExam
                    : "Non ancora eseguito. Usa il comando \"Esegui Esame Obiettivo\" nel menu Azioni Cliniche per registrare i reperti e valorizzare l'accuratezza clinica."}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-base leading-relaxed">
              <ScoreBar
                label="Accuratezza Clinica"
                subLabel="DATI ACQUISITI"
                value={omniScore.accuratezzaClinica}
                color="bg-cyan-500"
                colorGlow="rgba(34,211,238,0.85)"
                valueColorWhenEvaluated="text-cyan-400"
                isEvaluated={phase === "evaluation"}
              />
              <ScoreBar
                label="Appropriatezza Prescrittiva"
                subLabel="PRESCRIZIONI ATTIVE"
                value={omniScore.appropriatezzaPrescrittiva}
                color="bg-sky-500"
                colorGlow="rgba(56,189,248,0.85)"
                valueColorWhenEvaluated="text-sky-400"
                isEvaluated={phase === "evaluation"}
              />
              <ScoreBar
                label="Sostenibilità Economica"
                subLabel="RISORSE IMPIEGATE"
                value={omniScore.sostenibilitaEconomica}
                color="bg-emerald-500"
                colorGlow="rgba(52,211,153,0.85)"
                valueColorWhenEvaluated="text-emerald-400"
                isEvaluated={phase === "evaluation"}
                standbyFullValue={100}
                standbyLabel="[ BUDGET INIZIALE INTATTO ]"
              />
              
              <div className="mt-4">
                <p className="text-sm text-slate-400 mb-1">Diagnosi stimata:</p>
                <input
                  type="text"
                  value={finalDiagnosis}
                  onChange={(e) => setFinalDiagnosis(e.target.value)}
                  disabled={isSimulationComplete}
                  className="w-full rounded-2xl border border-slate-700/50 bg-[#111827]/70 text-base px-3 py-2 text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Es. Trauma cranico..."
                />
              </div>

              <div className="mt-3 rounded-2xl border border-red-900/50 bg-gradient-to-br from-red-900/40 via-red-900/30 to-orange-900/30 p-3 space-y-2">
                <h3 className="text-sm font-medium text-red-100/95">
                  Formula Diagnosi Diretta (Azzardo Clinico)
                </h3>
                <p className="text-xs text-red-200/80 leading-relaxed">
                  Usa questa opzione solo se vuoi &quot;forzare&quot; una diagnosi finale senza completare
                  l&apos;iter diagnostico di base. In caso di percorso incompleto, anche una diagnosi corretta
                  verrà considerata medico-legalmente NON CONFORME (rosso).
                </p>
                <button
                  type="button"
                  onClick={handleDirectDiagnosisConfirm}
                  disabled={
                    !finalDiagnosis.trim() || isSimulationComplete || isEvaluating
                  }
                  className="mt-1 w-full rounded-full px-4 py-2 text-sm font-medium text-slate-50 bg-gradient-to-r from-orange-600/80 to-red-600/80 hover:from-orange-500 hover:to-red-500 transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
                >
                  Conferma Diagnosi e Termina Turno
                </button>
              </div>

              <div className="rounded-none border border-slate-800 bg-slate-950 p-3 mt-2 font-mono text-xs">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-slate-500 uppercase tracking-wider">Legal Compliance</span>
                  {!evaluationResult ? (
                    <span className="text-slate-500 flex items-center gap-1">
                      [ IN VALUTAZIONE... ]
                      <span className="inline-block w-2 h-3 bg-slate-500 animate-pulse ml-0.5" aria-hidden />
                    </span>
                  ) : (
                    <span
                      className={
                        isLegallyProtected
                          ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                          : "text-red-500 animate-pulse"
                      }
                    >
                      {isLegallyProtected ? "[ STATUS: SECURE ]" : "[ ALERT: VIOLAZIONE ]"}
                      {evaluationResult ? ` ${evaluationResult.legalStatus}` : ""}
                    </span>
                  )}
                </div>
                {isSimulationComplete && evaluationResult && (
                  <>
                    <p className="text-slate-400 leading-relaxed">
                      {evaluationResult.legalStatus === "CONFORME" && legalInfractions.length === 0
                        ? "La gestione del caso è risultata aderente alle raccomandazioni previste dalle linee guida pubblicate dall'ISS, ai sensi dell'art. 5 della Legge 24/2017 (Gelli-Bianco)."
                        : "Attenzione: Scostamento dalle buone pratiche clinico-assistenziali o dalle linee guida ministeriali/ISS."}
                    </p>
                    {evaluationResult.legalMotivation && (
                      <p className="text-slate-400 leading-relaxed mt-2">
                        {evaluationResult.legalMotivation}
                      </p>
                    )}
                    <div className="mt-3 border border-slate-800 bg-slate-900/50 p-3">
                      <p className="text-slate-500 uppercase tracking-wider mb-1">Feedback clinico</p>
                      <p className="text-slate-400 leading-relaxed">
                        {evaluationResult.clinicalFeedback}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>
        </main>

        <AccountDashboard
          open={showAccountDashboard}
          onClose={() => setShowAccountDashboard(false)}
          activeNickname={currentUserNickname}
        />

        {showEmergencyExitConfirm && (
          <>
            <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="w-full max-w-md rounded-2xl border border-red-700/70 bg-slate-950/95 shadow-[0_0_40px_rgba(248,113,113,0.6)]">
                <div className="px-5 py-4 border-b border-red-800/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-red-400" />
                    <h3 className="text-sm font-semibold text-red-100 uppercase tracking-[0.16em]">
                      Interrompi Modalità Emergenza
                    </h3>
                  </div>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <p className="text-sm text-slate-200">
                    Vuoi davvero abbandonare la simulazione di emergenza?
                  </p>
                  <p className="text-xs text-slate-400">
                    Il timer verrà azzerato e verrai riportato alla dashboard principale. Nessun dato di questa simulazione verrà salvato o utilizzato per generare report.
                  </p>
                </div>
                <div className="px-5 py-4 border-t border-red-800/70 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmergencyExitConfirm(false)}
                    className="rounded-full px-4 py-2 text-xs font-medium text-slate-200 border border-slate-600/80 bg-[#111827]/80 hover:bg-[#1f2937] transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmergencyExitConfirm(false);
                      setEmergencyStartTime(null);
                      setEmergencyElapsedMs(0);
                      setEmergencyFinalMs(null);
                      setIsSimulationComplete(false);
                      setShowFinalReportModal(false);
                      setEvaluationResult(null);
                      setShowEmergencyModal(false);
                      setShowScenarioModal(true);
                      setPhase("chat");
                      setShowAccountDashboard(true);
                      setOmniScore({
                        accuratezzaClinica: 0,
                        appropriatezzaPrescrittiva: 0,
                        sostenibilitaEconomica: 100,
                      });
                      setPertinentClinicalAccuracy(0);
                      setUsedKeywords(new Set());
                      setUnnecessaryExamCount(0);
                      setHasDischarged(false);
                      setFinalDiagnosis("");
                      setPrescribedExams([]);
                      setPrescribedExamsHistory([]);
                      setLegalAlert(null);
                      setStepDurations({
                        chat: 0,
                        hypothesis: 0,
                        results: 0,
                        evaluation: 0,
                      });
                      setCurrentStep("chat");
                      setCurrentStepStart(null);
                      setEfficiencyScore(null);
                      setLegalInfractions([]);
                      setIsEmergencyMode(false);
                    }}
                    className="rounded-full px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 shadow-[0_0_16px_rgba(248,113,113,0.6)] transition-all"
                  >
                    Conferma uscita
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {showFinalReportModal && isSimulationComplete && evaluationResult && (
          <>
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md" />
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border ${BORDER_ACCENT} ${PANEL_BG} backdrop-blur-xl shadow-[0_0_45px_rgba(15,23,42,0.4)] flex flex-col`}>
                <div className={`flex items-center justify-between border-b ${BORDER_ACCENT} px-6 py-4`}>
                  <div>
                    <h2 className="text-2xl font-medium tracking-wide text-slate-100">
                      Valutazione di Conformità ex Art. 5 Legge 24/2017
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Sintesi strutturata della performance clinica e della conformità medico-legale.
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-slate-400">
                      Paziente: {activeCase.patientName}, {activeCase.patientAge} anni
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-2 rounded-full bg-[#111827]/70 px-3 py-1 text-xs font-medium text-slate-200 border ${BORDER_ACCENT}`}>
                        <Clock className="h-3 w-3 text-slate-400" />
                        OmniScore (Aderenza Linee Guida): {weightedOmniScore} / 100
                      </span>
                      <div className="h-2 w-40 rounded-full bg-slate-800 overflow-hidden border border-slate-600/70">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.max(0, Math.min(100, weightedOmniScore))}%`,
                            background:
                              weightedOmniScore < 40
                                ? "linear-gradient(to right, #b91c1c, #f97316)"
                                : weightedOmniScore < 70
                                ? "linear-gradient(to right, #facc15, #22c55e)"
                                : "linear-gradient(to right, #22c55e, #38bdf8)",
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                        {weightedOmniScore < 40
                          ? "Non conforme"
                          : weightedOmniScore < 70
                          ? "Parziale conformità"
                          : "Piena conformità alle linee guida"}
                      </span>
                    </div>
                    {isEmergencyMode && emergencyFinalMs != null && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-red-900/40 px-3 py-1 text-[11px] font-mono text-red-100 border border-red-700/70">
                        <Clock className="h-3 w-3 text-red-300" />
                        Tempo gestione emergenza: {formatDuration(emergencyFinalMs)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 px-6 py-5 overflow-y-auto custom-scrollbar space-y-6 text-base leading-relaxed">
                  {/* Top: Radar Chart */}
                  <div className={`h-64 w-full rounded-2xl bg-[#111827]/70 border ${BORDER_ACCENT} p-4`}>
                    <h3 className="text-sm font-medium mb-2 text-slate-100">
                      Profilo di Performance Clinica
                    </h3>
                    <RadarResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        data={[
                          {
                            parametro: "Accuratezza Clinica",
                            valore: omniScore.accuratezzaClinica,
                          },
                          {
                            parametro: "Appropriatezza Prescrittiva",
                            valore: omniScore.appropriatezzaPrescrittiva,
                          },
                          {
                            parametro: "Sostenibilità",
                            valore: omniScore.sostenibilitaEconomica,
                          },
                        ]}
                        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      >
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis
                          dataKey="parametro"
                          tick={{ fill: "#e2e8f0", fontSize: 11 }}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          tick={{ fill: "#cbd5e1", fontSize: 10 }}
                          stroke="#475569"
                        />
                        <Radar
                          name="Punteggio"
                          dataKey="valore"
                          stroke="#67e8f9"
                          fill="#67e8f9"
                          fillOpacity={0.3}
                        />
                        <RadarTooltip
                          cursor={{ fill: "rgba(15,23,42,0.6)" }}
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderRadius: 10,
                            border: "1px solid rgba(51, 65, 85, 0.6)",
                            fontSize: 11,
                            color: "#e2e8f0",
                            boxShadow: "0 0 18px rgba(15,23,42,0.5)",
                          }}
                        />
                      </RadarChart>
                    </RadarResponsiveContainer>
                  </div>

                  {/* Banner valutazione diagnosi */}
                  {typeof evaluationResult.isDiagnosisCorrect === "boolean" && (
                    <div
                      className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-medium ${
                        evaluationResult.isDiagnosisCorrect
                          ? "bg-emerald-900/30 border-emerald-800/50 text-emerald-200"
                          : "bg-red-900/30 border-red-800/50 text-red-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs uppercase tracking-wide text-slate-400">
                          {evaluationResult.isDiagnosisCorrect
                            ? "DIAGNOSI CORRETTA"
                            : "DIAGNOSI ERRATA"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {evaluationResult.diagnosisFeedback}
                      </p>
                    </div>
                  )}

                  {/* Middle: Punteggi, Badge legale, Commento e Feedback */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className={`rounded-2xl border ${BORDER_ACCENT} bg-[#111827]/70 p-4 space-y-3`}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Conformità Legge Gelli-Bianco
                          </span>
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium ${
                              evaluationResult.legalStatus === "CONFORME" && legalInfractions.length === 0
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-700/50"
                                : "bg-red-500/15 text-red-300 border border-red-700/50"
                            }`}
                          >
                            <span className="text-base">
                              {evaluationResult.legalStatus === "CONFORME" && legalInfractions.length === 0
                                ? "✅"
                                : "⚠️"}
                            </span>
                            {evaluationResult.legalStatus === "CONFORME" && legalInfractions.length === 0
                              ? "CONFORME"
                              : "NON CONFORME"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Questo indicatore riassume la coerenza del percorso assistenziale con le
                          linee guida e le buone pratiche cliniche richiamate dalla Legge 24/2017
                          (Gelli-Bianco), con riferimento ai protocolli standard del SSN (es. SIMEU per l&apos;emergenza, AIFA per l&apos;uso dei farmaci, database SNLG-ISS).
                        </p>
                        {(evaluationResult.legalStatus === "NON CONFORME" || legalInfractions.length > 0) && (
                          <div className="mt-3 rounded-xl bg-red-900/15 border border-red-700/60 p-3 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-red-200 uppercase tracking-wide">
                              <span className="text-sm">⚠️</span>
                              <span>Note sulla Conformità Legale</span>
                            </div>
                            <ul className="list-disc list-inside text-xs text-red-100 space-y-1">
                              {evaluationResult.legalMotivation && (
                                <li>{evaluationResult.legalMotivation}</li>
                              )}
                              {Array.from(new Set(legalInfractions)).map((note, idx) => (
                                <li key={idx}>{note}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                          <div className={`rounded-xl bg-[#0f172a]/60 border ${BORDER_ACCENT} p-2 text-center`}>
                            <p className="text-[11px] text-slate-400">
                              Accuratezza
                            </p>
                            <p className="text-lg font-medium text-sky-300">
                              {omniScore.accuratezzaClinica}
                            </p>
                          </div>
                          <div className={`rounded-xl bg-[#0f172a]/60 border border-slate-600/40 p-2 text-center`}>
                            <p className="text-[11px] text-slate-400">
                              Appropriatezza
                            </p>
                            <p className="text-lg font-medium text-cyan-300">
                              {omniScore.appropriatezzaPrescrittiva}
                            </p>
                          </div>
                          <div className={`rounded-xl bg-[#0f172a]/60 border border-emerald-800/40 p-2 text-center`}>
                            <p className="text-[11px] text-slate-400">
                              Sostenibilità
                            </p>
                            <p className="text-lg font-medium text-emerald-300">
                              {omniScore.sostenibilitaEconomica}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className={`rounded-2xl border ${BORDER_ACCENT} bg-[#111827]/70 p-4`}>
                        <h3 className="text-sm font-medium mb-2 text-slate-100">
                          Feedback Clinico Strutturato
                        </h3>
                        <p className="text-sm text-slate-400 whitespace-pre-wrap leading-relaxed">
                          {evaluationResult.clinicalFeedback}
                        </p>
                      </div>
                      <div className={`rounded-2xl border ${BORDER_ACCENT} bg-[#111827]/70 p-4`}>
                        <h3 className="text-sm font-medium mb-2 text-slate-100">
                          Motivazione Legale
                        </h3>
                        <p className="text-sm text-slate-400 whitespace-pre-wrap leading-relaxed">
                          {evaluationResult.legalMotivation}
                        </p>
                      </div>
                      <div className={`rounded-2xl border ${BORDER_ACCENT} bg-[#111827]/70 p-4`}>
                        <h3 className="text-sm font-medium mb-2 text-slate-100">
                          Analisi delle Competenze Specialistiche
                        </h3>
                        <div className="space-y-1 text-sm text-slate-400">
                          {(() => {
                            const items: string[] = [];
                            const specialtyArea = activeCase.specialty || "Medicina Interna";
                            const requiredExams = activeCase.truth.requiredExams ?? [];
                            const missingRequired = requiredExams.filter(
                              (exam) => !prescribedExams.includes(exam)
                            );

                            if (!hasPerformedPhysicalExam) {
                              items.push(
                                `Area di miglioramento: ${specialtyArea} - esame obiettivo non eseguito o poco valorizzato nella gestione del caso.`
                              );
                            }

                            if (missingRequired.length > 0) {
                              const preview = missingRequired.slice(0, 3).join(", ");
                              items.push(
                                `Area di miglioramento: ${specialtyArea} - esami chiave non richiesti o richiesti tardivamente (${preview}${
                                  missingRequired.length > 3 ? ", ..." : ""
                                }).`
                              );
                            }

                            if (
                              isEmergencyMode &&
                              efficiencyScore != null &&
                              efficiencyScore < 75
                            ) {
                              items.push(
                                "Area di miglioramento: Medicina d'urgenza - tempi di decisione e passaggio tra gli step non ottimali in contesto tempo-dipendente."
                              );
                            }

                            if (evaluationResult && !evaluationResult.isDiagnosisCorrect) {
                              items.push(
                                `Area di miglioramento: ${specialtyArea} - ragionamento diagnostico da affinare per quadri clinici simili.`
                              );
                            }

                            if (items.length === 0) {
                              items.push(
                                "Nessuna area critica evidente in questo caso. Mantieni questo livello di accuratezza e completezza del percorso."
                              );
                            }

                            return items.map((text, idx) => (
                              <p key={idx}>• {text}</p>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Soluzione ufficiale del caso */}
                  {evaluationResult.caseSolution && (
                    <div className="mt-2 rounded-2xl border border-amber-800/50 bg-amber-950/20 p-4">
                      <h3 className="text-sm font-medium mb-3 text-amber-200/90 uppercase tracking-wide">
                        Soluzione Ufficiale del Caso
                      </h3>
                      <div className="space-y-2 text-sm text-slate-200 leading-relaxed">
                        <p>
                          <span className="font-medium text-amber-100/90">
                            Diagnosi corretta attesa:
                          </span>{" "}
                          {evaluationResult.caseSolution.correctDiagnosis}
                        </p>
                        <p>
                          <span className="font-medium text-amber-100/90">
                            Esami obbligatori / necessari per la L. 24/2017:
                          </span>{" "}
                          {evaluationResult.caseSolution.requiredExams &&
                          evaluationResult.caseSolution.requiredExams.length > 0
                            ? evaluationResult.caseSolution.requiredExams.join(", ")
                            : "Non specificati."}
                        </p>
                        <p>
                          <span className="font-medium text-amber-100/90">
                            Sintesi delle linee guida applicate:
                          </span>{" "}
                          {evaluationResult.caseSolution.guidelinesSummary}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className={`border-t ${BORDER_ACCENT} px-6 py-4 flex justify-end gap-3`}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFinalReportModal(false);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700/50 px-5 py-2 text-sm font-medium text-slate-400 hover:bg-[#111827]/70 hover:text-cyan-400 hover:border-cyan-900/40 transition-all duration-300"
                  >
                    <Minimize2 className="h-4 w-4" />
                    Chiudi
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFinalReportModal(false);
                      setShowAccountDashboard(true);
                      handleResetSimulation();
                    }}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-slate-950 bg-gradient-to-r from-emerald-500/90 to-cyan-500/90 hover:from-emerald-400 hover:to-cyan-400 hover:shadow-[0_0_14px_rgba(16,185,129,0.45)] shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-300"
                  >
                    <Home className="h-4 w-4" />
                    Torna alla Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFinalReportModal(false);
                      setShowAccountDashboard(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-slate-950 bg-gradient-to-r from-cyan-600/85 to-blue-600/85 hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_14px_rgba(0,180,216,0.4)] shadow-[0_0_10px_rgba(0,180,216,0.25)] transition-all duration-300"
                  >
                    <FileText className="h-4 w-4" />
                    Chiudi e Salva in Cartella
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* MODALE AZIONI CLINICHE (CON I MENU A TENDINA SCORREVOLI) */}
        {showAzioniClinicheModal && mounted && (
          <>
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md" onClick={() => setShowAzioniClinicheModal(false)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className={`${PANEL_BG} border ${BORDER_ACCENT} rounded-3xl w-full max-w-md p-5 shadow-[0_0_38px_rgba(15,23,42,0.4)] backdrop-blur-xl pointer-events-auto`}>
                <div className={`flex justify-between items-center mb-4 border-b ${BORDER_ACCENT} pb-2`}>
                  <h3 className="text-xl font-medium text-slate-100">
                    Azioni Cliniche
                  </h3>
                  <button
                    onClick={() => setShowAzioniClinicheModal(false)}
                    className="text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar text-base leading-relaxed">
                  {/* ESAME OBIETTIVO */}
                  <div>
                    <button
                      onClick={handlePerformPhysicalExam}
                      className="flex w-full items-center gap-3 rounded-2xl border border-emerald-800/50 bg-gradient-to-r from-emerald-700/50 to-teal-700/50 px-4 py-3 hover:from-emerald-600/60 hover:to-teal-600/60 transition-all duration-300"
                    >
                      <Stethoscope className="h-5 w-5 text-emerald-200/90" />{" "}
                      <span className="text-sm font-medium text-slate-200">
                        Esegui Esame Obiettivo
                      </span>
                    </button>
                  </div>
                  
                  {/* ESAMI SANGUE */}
                  <div>
                    <button
                      onClick={() => { setShowBloodMenu(!showBloodMenu); setShowImagingMenu(false); setShowConsultMenu(false); }}
                      className="flex w-full items-center gap-3 rounded-2xl border border-slate-700/50 bg-[#111827]/70 px-4 py-3 hover:bg-[#111827]/90 hover:border-cyan-900/40 transition-all duration-300 group"
                    >
                      <Syringe className="h-5 w-5 text-slate-400 group-hover:text-cyan-400" />{" "}
                      <span className="text-sm font-medium text-slate-200">
                        Esami Ematochimici
                      </span>
                    </button>
                    {showBloodMenu && (
                      <div className={`mt-1 ml-4 border-l ${BORDER_ACCENT} pl-3 py-1 space-y-1`}>
                        {BLOOD_TESTS.map(exam => (
                          <button
                            key={exam}
                            onClick={() => handleOrderExam("sangue", exam)}
                            className="block w-full text-left px-3 py-2 text-sm rounded-xl bg-[#111827]/60 hover:bg-[#111827]/90 text-slate-400 hover:text-cyan-400 transition-all duration-200"
                          >
                            {exam}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* IMAGING */}
                  <div>
                    <button
                      onClick={() => { setShowImagingMenu(!showImagingMenu); setShowBloodMenu(false); setShowConsultMenu(false); }}
                      className="flex w-full items-center gap-3 rounded-2xl border border-slate-700/50 bg-[#111827]/70 px-4 py-3 hover:bg-[#111827]/90 hover:border-cyan-900/40 transition-all duration-300 group"
                    >
                      <Radiation className="h-5 w-5 text-slate-400 group-hover:text-cyan-400" />{" "}
                      <span className="text-sm font-medium text-slate-200">
                        Esami Radiologici
                      </span>
                    </button>
                    {showImagingMenu && (
                      <div className={`mt-1 ml-4 border-l ${BORDER_ACCENT} pl-3 py-1 space-y-1`}>
                        {IMAGING_EXAMS.map(exam => (
                          <button
                            key={exam}
                            onClick={() => handleOrderExam("imaging", exam)}
                            className="block w-full text-left px-3 py-2 text-sm rounded-xl bg-[#111827]/60 hover:bg-[#111827]/90 text-slate-400 hover:text-cyan-400 transition-all duration-200"
                          >
                            {exam}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CONSULENZE */}
                  <div>
                    <button
                      onClick={() => { setShowConsultMenu(!showConsultMenu); setShowBloodMenu(false); setShowImagingMenu(false); }}
                      className="flex w-full items-center gap-3 rounded-2xl border border-slate-700/50 bg-[#111827]/70 px-4 py-3 hover:bg-[#111827]/90 hover:border-cyan-900/40 transition-all duration-300 group"
                    >
                      <Users className="h-5 w-5 text-slate-400 group-hover:text-cyan-400" />{" "}
                      <span className="text-sm font-medium text-slate-200">
                        Consulenze Specialistiche
                      </span>
                    </button>
                    {showConsultMenu && (
                      <div className={`mt-1 ml-4 border-l ${BORDER_ACCENT} pl-3 py-1 space-y-1`}>
                        {CONSULTATIONS.map(exam => (
                          <button
                            key={exam}
                            onClick={() => handleOrderExam("consulenza", exam)}
                            className="block w-full text-left px-3 py-2 text-sm rounded-xl bg-[#111827]/60 hover:bg-[#111827]/90 text-slate-400 hover:text-cyan-400 transition-all duration-200"
                          >
                            {exam}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </>
        )}

        {/* MODALE CREAZIONE CASO PERSONALIZZATO */}
        {showCustomCaseModal && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
              onClick={() => setShowCustomCaseModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className={`pointer-events-auto ${PANEL_BG} border ${BORDER_ACCENT} rounded-3xl w-full max-w-2xl shadow-[0_0_40px_rgba(15,23,42,0.4)] backdrop-blur-xl`}>
                <div className={`flex justify-between items-center px-5 py-3 border-b ${BORDER_ACCENT}`}>
                  <div className="flex items-center gap-2">
                    <FilePlus className="h-5 w-5 text-slate-400" />
                    <h3 className="text-lg font-medium text-slate-100">
                      Crea Caso Clinico Personalizzato
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowCustomCaseModal(false)}
                    className="text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleCreateCustomCase} className="px-5 py-4 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1 text-slate-400">
                        Nome Paziente
                      </label>
                      <input
                        type="text"
                        value={customPatientName}
                        onChange={(e) => setCustomPatientName(e.target.value)}
                        className="w-full rounded-lg border border-slate-700/50 bg-[#111827]/70 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500/50 text-slate-200"
                        placeholder="Es. Giovanni"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-slate-400">
                        Età
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={customPatientAge}
                        onChange={(e) => setCustomPatientAge(e.target.value)}
                        className="w-full rounded-lg border border-slate-700/50 bg-[#111827]/70 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500/50 text-slate-200"
                        placeholder="Es. 67"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-slate-400">
                      Motivo dell'accesso / Sintomo principale
                    </label>
                    <textarea
                      value={customMainReason}
                      onChange={(e) => setCustomMainReason(e.target.value)}
                      className="w-full rounded-lg border border-slate-700/50 bg-[#111827]/70 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-slate-200"
                      rows={2}
                      placeholder='Es. "Dolore toracico oppressivo da 2 ore che si irradia al braccio sinistro"'
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1 text-slate-400">
                        Patologie pregresse
                      </label>
                      <textarea
                        value={customComorbidities}
                        onChange={(e) => setCustomComorbidities(e.target.value)}
                        className="w-full rounded-lg border border-slate-700/50 bg-[#111827]/70 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-slate-200"
                        rows={3}
                        placeholder="Es. Ipertensione, diabete mellito tipo 2, BPCO..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-slate-400">
                        Familiarità
                      </label>
                      <textarea
                        value={customFamilyHistory}
                        onChange={(e) => setCustomFamilyHistory(e.target.value)}
                        className="w-full rounded-lg border border-slate-700/50 bg-[#111827]/70 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-slate-200"
                        rows={3}
                        placeholder="Es. Infarto miocardico in età &lt; 55 anni, ictus in familiari di primo grado..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1 text-slate-400">
                        Terapia domiciliare (Farmaci assunti)
                      </label>
                      <textarea
                        value={customHomeTherapy}
                        onChange={(e) => setCustomHomeTherapy(e.target.value)}
                        className="w-full rounded-lg border border-slate-700/50 bg-[#111827]/70 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-slate-200"
                        rows={3}
                        placeholder="Es. ACE-inibitori, beta-bloccanti, anticoagulanti, ipoglicemizzanti..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-slate-400">
                        Esame Obiettivo (parametri vitali e reperti)
                      </label>
                      <textarea
                        value={customPhysicalExam}
                        onChange={(e) => setCustomPhysicalExam(e.target.value)}
                        className="w-full rounded-lg border border-slate-700/50 bg-[#111827]/70 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-slate-200"
                        rows={3}
                        placeholder="Es. PA, FC, FR, SpO2, reperti neurologici, cardiaci, respiratori..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-slate-400">
                      Diagnosi Corretta (per l'OmniScore)
                    </label>
                    <input
                      type="text"
                      value={customCorrectDiagnosis}
                      onChange={(e) => setCustomCorrectDiagnosis(e.target.value)}
                        className="w-full rounded-lg border border-slate-700/50 bg-[#111827]/70 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500/50 text-slate-200"
                      placeholder="Es. Sindrome coronarica acuta, polmonite lobare, trauma cranico minore..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-slate-400">
                      Esami Salvavita/Obbligatori (separati da virgola)
                    </label>
                    <textarea
                      value={customMandatoryExams}
                      onChange={(e) => setCustomMandatoryExams(e.target.value)}
                      className="w-full rounded-lg border border-slate-700/50 bg-[#111827]/70 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-slate-200"
                      rows={2}
                      placeholder='Es. "TC Encefalo senza mezzo di contrasto, Emocromo completo, Emogasanalisi arteriosa"'
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Questi esami verranno utilizzati per valutare l'appropriatezza prescrittiva e la
                      tutela medico-legale.
                    </p>
                  </div>

                  <div className={`pt-2 flex justify-between items-center border-t ${BORDER_ACCENT} mt-2 gap-3`}>
                    <div className="flex flex-col gap-1 text-xs text-slate-400 max-w-md">
                      <p>
                        Il profilo del paziente verrà generato automaticamente combinando i campi inseriti e
                        guidando l'IA a rispondere in modo graduale, per una simulazione estesa e realistica.
                      </p>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={aiOverwriteAll}
                          onChange={(e) => setAiOverwriteAll(e.target.checked)}
                          className="h-3 w-3 rounded border border-slate-600/50 bg-[#111827]/70"
                        />
                        <span className="text-[11px] opacity-80">
                          Sovrascrivi tutti i campi con l'IA (modalità completamente automatica)
                        </span>
                      </label>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        type="button"
                        onClick={handleGenerateCaseWithAI}
                        disabled={isGeneratingCase}
                        className="rounded-full px-4 py-1.5 text-xs font-medium text-slate-950 bg-gradient-to-r from-cyan-600/85 to-sky-500/85 hover:from-cyan-500 hover:to-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)] hover:shadow-[0_0_14px_rgba(56,189,248,0.45)] transition-all duration-300 disabled:opacity-60 disabled:shadow-none"
                      >
                        {isGeneratingCase ? "Creazione scenario complesso in corso..." : "Genera con IA (Basta un parametro)"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCustomCaseModal(false)}
                        className="rounded-full border border-slate-700/50 px-4 py-1.5 text-sm text-slate-400 hover:bg-[#111827]/70 hover:text-cyan-400 hover:border-cyan-900/40 transition-all duration-300"
                      >
                        Annulla
                      </button>
                      <button
                        type="submit"
                        className="rounded-full px-5 py-1.5 text-sm font-medium text-slate-950 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_14px_rgba(0,180,216,0.6)] hover:shadow-[0_0_18px_rgba(0,180,216,0.85)] transition-all duration-300"
                      >
                        Avvia simulazione
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        {/* MODALE MODALITÀ EMERGENZA */}
        {showEmergencyModal && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md"
              onClick={() => setShowEmergencyModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className={`pointer-events-auto ${PANEL_BG} border border-red-700/70 rounded-3xl w-full max-w-3xl shadow-[0_0_50px_rgba(248,113,113,0.6)] backdrop-blur-xl`}>
                <div className="flex justify-between items-center px-6 py-4 border-b border-red-700/70 bg-gradient-to-r from-red-900/70 to-orange-900/40">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                    <div className="flex flex-col">
                      <h3 className="text-xl font-semibold tracking-wide text-red-50">
                        MODALITÀ EMERGENZA
                      </h3>
                      <p className="text-xs text-red-200/80">
                        Seleziona uno dei casi tempo-dipendenti per attivare il percorso di emergenza.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEmergencyModal(false)}
                    className="text-red-200 hover:text-red-100 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="px-6 py-5 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {CLINICAL_CASES.filter((c) => c.specialty === "Emergenza").map((emCase) => (
                      <button
                        key={emCase.id}
                        type="button"
                        onClick={() => {
                          setSelectedSpecialty("Emergenza");
                          setActiveCase(emCase);
                          setMessages([
                            {
                              id: Date.now(),
                              role: "patient",
                              content: emCase.initialMessage,
                              timestamp: formatTime(),
                            },
                          ]);
                          setInput("");
                          setIsSending(false);
                          setShowPrescriptionMenu(false);
                          setHasDiscoveredCoumadin(false);
                          setClinicalRiskWarning(null);
                          setHasPrescribedTC(false);
                          setUnnecessaryExamCount(0);
                          setHasDischarged(false);
                          setFinalDiagnosis("");
                          setIsSimulationComplete(false);
                          setOmniScore({
                            accuratezzaClinica: 0,
                            appropriatezzaPrescrittiva: 0,
                            sostenibilitaEconomica: 100,
                          });
                          setPertinentClinicalAccuracy(0);
                          setUsedKeywords(new Set());
                          setShowRepartoSelector(false);
                          setShowScenarioModal(false);
                          setPhase("chat");
                          setCurrentHypothesis("");
                          setExamResults([]);
                          setDiagnosisChoice(null);
                          setEvaluationResult(null);
                          setPrescribedExams([]);
                          setPrescribedExamsHistory([]);
                          setLegalAlert(null);
                          setIsEmergencyMode(true);
                          const start = Date.now();
                          setEmergencyStartTime(start);
                          setEmergencyElapsedMs(0);
                          setEmergencyFinalMs(null);
                          setShowEmergencyModal(false);
                        }}
                        className="flex flex-col items-start gap-2 rounded-2xl border border-red-700/70 bg-gradient-to-br from-red-900/70 via-slate-950/80 to-orange-900/60 px-4 py-4 text-left hover:shadow-[0_0_22px_rgba(248,113,113,0.7)] hover:scale-[1.02] transition-all duration-200"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] uppercase tracking-[0.2em] text-red-200/80">
                            Caso Urgente
                          </span>
                          <span className="text-[11px] text-red-100/80 font-mono">
                            {emCase.patientAge} anni
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-red-50">
                          {emCase.patientName}
                        </p>
                        <p className="text-[12px] text-slate-200 line-clamp-4">
                          {emCase.initialMessage}
                        </p>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    Tutti i casi in questa sezione sono ad alta priorità e tempo-dipendenti. Il timer di emergenza si attiverà automaticamente all&apos;avvio dello scenario.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

      </div>

      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.6) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.4);
          border-radius: 999px;
          transition: background 0.2s ease-in-out;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.65);
        }
        .ecg-line {
          stroke-dasharray: 260;
          stroke-dashoffset: 260;
          animation: ecg-draw 1.6s ease-in-out infinite;
          filter: drop-shadow(0 0 12px rgba(34, 211, 238, 0.8));
        }
        @keyframes ecg-draw {
          0% {
            stroke-dashoffset: 260;
            opacity: 0.1;
          }
          40% {
            opacity: 1;
          }
          60% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
    </>
  );
}

function ScoreBar({
  label,
  subLabel,
  value,
  color,
  colorGlow,
  valueColorWhenEvaluated = "text-slate-200",
  isEvaluated = false,
  standbyFullValue,
  standbyLabel,
}: {
  label: string;
  subLabel: string;
  value: number;
  color: string;
  colorGlow: string;
  valueColorWhenEvaluated?: string;
  isEvaluated?: boolean;
  standbyFullValue?: number;
  standbyLabel?: string;
}) {
  const isStandbyFull = !isEvaluated && standbyFullValue != null;
  const displayValue = isEvaluated ? value : (isStandbyFull ? standbyFullValue! : 0);
  const barWidth = isEvaluated ? value : (isStandbyFull ? standbyFullValue! : 0);
  const barColor = isEvaluated ? color : (isStandbyFull ? "bg-slate-700" : color);
  const barGlow = isEvaluated ? colorGlow : "none";
  return (
    <div className="rounded-none border border-slate-800/80 bg-slate-900/30 p-3">
      <div className="flex justify-between items-baseline mb-0.5">
        <div>
          <p className="font-medium text-slate-200 text-sm">{label}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">{subLabel}</p>
        </div>
        <span
          className={`font-mono text-lg font-medium tabular-nums transition-all duration-1000 ease-out ${
            isEvaluated ? valueColorWhenEvaluated : isStandbyFull ? "text-slate-500" : "text-cyan-900/50"
          }`}
        >
          {displayValue}%
        </span>
      </div>
      {!isEvaluated && (
        <p className={`text-slate-500 font-mono text-[10px] mt-0.5 ${standbyLabel == null ? "animate-pulse" : ""}`}>{standbyLabel ?? "[ IN ATTESA DI DATI... ]"}</p>
      )}
      <div className="h-1 w-full rounded-none bg-slate-800 overflow-hidden mt-2">
        <div
          className={`h-full ${barColor} transition-all duration-1000 ease-out`}
          style={{
            width: `${barWidth}%`,
            boxShadow: isEvaluated ? `0 0 14px ${barGlow}, 0 0 6px ${barGlow}` : "none",
          }}
        />
      </div>
      {isEvaluated && (
        <p className="text-[10px] text-slate-600 mt-1.5 font-mono uppercase tracking-wider">
          {value >= 80 ? "OK" : value >= 50 ? "WARN" : "LOW"} — sync
        </p>
      )}
    </div>
  );
}

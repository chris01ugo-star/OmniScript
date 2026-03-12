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
import { Activity, ChevronUp, Clock, FilePlus, FileText, Lightbulb, Lock, Minimize2, Radiation, RefreshCw, ShieldAlert, Stethoscope, Syringe, UserCircle, X, Users } from "lucide-react";
import { ClinicalAdvisorModal } from "./ClinicalAdvisorModal";
import { AccountDashboard, saveSimulationToHistory } from "./AccountDashboard";
import { CLINICAL_CASES, type ClinicalCase } from "./cases";

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

const formatTime = () => new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit" }).format(new Date());

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
  const [accessCode, setAccessCode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [showAccountDashboard, setShowAccountDashboard] = useState(false);
  const [mounted, setMounted] = useState(false);
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
  
  // Menu a tendina per gli esami
  const [showBloodMenu, setShowBloodMenu] = useState(false);
  const [showImagingMenu, setShowImagingMenu] = useState(false);
  const [showConsultMenu, setShowConsultMenu] = useState(false);
  const [showRepartoSelector, setShowRepartoSelector] = useState(false);
  const [legalAlert, setLegalAlert] = useState<{ type: "minor" | "pregnancy"; examName: string; category: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === "C12122001!") {
      setAuthError(false);
      setBootPhase("splash");
    } else {
      setAuthError(true);
    }
  };

  useEffect(() => {
    if (bootPhase !== "splash") return;
    const heartbeat = new Audio("https://assets.mixkit.co/active_storage/sfx/108/108-preview.mp3");
    heartbeat.volume = 0.6;
    heartbeat.play().catch((e) => console.log("Autoplay bloccato", e));
    const timer = setTimeout(() => setBootPhase("advisor"), 4500);
    return () => clearTimeout(timer);
  }, [bootPhase]);

  useEffect(() => {
    setMounted(true);
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

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isSending || isSimulationComplete) return;

    const content = input.trim();
    const contentLower = content.toLowerCase();

    let pointsToAdd = 0;
    const newUsedKeywords = new Set(usedKeywords);
    const checkWords = (category: {words: string[], points: number}) => {
      category.words.forEach(word => {
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
      setPertinentClinicalAccuracy(prev => Math.min(prev + pointsToAdd, 100));
      setUsedKeywords(newUsedKeywords);
      setOmniScore((prev) => ({
        ...prev,
        accuratezzaClinica: Math.min(prev.accuratezzaClinica + pointsToAdd, 100),
      }));
    }

    const newDoctorMessage: ChatMessage = { id: Date.now(), role: "doctor", content, timestamp: formatTime() };
    const updatedConversation = [...messages, newDoctorMessage];
    setMessages(updatedConversation);
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
      if (aiText.toLowerCase().includes("coumadin") || aiText.toLowerCase().includes("warfarin")) {
        setHasDiscoveredCoumadin(true);
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "patient", content: aiText, timestamp: formatTime() }]);
    } catch (error: any) {
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "patient", content: `⚠️ ERRORE DI RETE: ${error.message}`, timestamp: formatTime() }]);
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

      if (evalResult) {
        const nextOmniScore = {
          accuratezzaClinica: Math.max(0, Math.min(100, evalResult.clinicalAccuracy ?? 0)),
          appropriatezzaPrescrittiva: Math.max(0, Math.min(100, evalResult.prescriptiveAppropriateness ?? 0)),
          sostenibilitaEconomica: Math.max(0, Math.min(100, evalResult.sustainability ?? 0)),
        };
        setOmniScore(nextOmniScore);

        const legalComplianceScore = evalResult.legalStatus === "CONFORME" ? 100 : 0;
        const weighted =
          nextOmniScore.accuratezzaClinica * 0.4 +
          nextOmniScore.appropriatezzaPrescrittiva * 0.3 +
          nextOmniScore.sostenibilitaEconomica * 0.1 +
          legalComplianceScore * 0.2;

        const finalWeighted = Math.round(Math.max(Math.min(weighted, 100), 0));

        saveSimulationToHistory({
          patientName: activeCase.patientName,
          weightedScore: finalWeighted,
          clinicalAccuracy: nextOmniScore.accuratezzaClinica,
          prescriptiveAppropriateness: nextOmniScore.appropriatezzaPrescrittiva,
          sustainability: nextOmniScore.sostenibilitaEconomica,
          report: [
            "Referto Ufficiale di Fine Turno",
            "",
            `Paziente: ${activeCase.patientName}, ${activeCase.patientAge} anni`,
            `Caso: ${activeCase.id}`,
            "",
            `Accuratezza Clinica: ${nextOmniScore.accuratezzaClinica}/100`,
            `Appropriatezza Prescrittiva: ${nextOmniScore.appropriatezzaPrescrittiva}/100`,
            `Sostenibilità Economica: ${nextOmniScore.sostenibilitaEconomica}/100`,
            `OmniScore Ponderato: ${finalWeighted}/100`,
            "",
            `Conformità Legge Gelli-Bianco: ${evalResult.legalStatus}`,
            "",
            "Motivazione Legale:",
            evalResult.legalMotivation,
            "",
            "Feedback Clinico:",
            evalResult.clinicalFeedback,
          ].join("\n"),
        });
      }
    } catch (error: any) {
      console.error("Errore valutazione medico-legale:", error);
    } finally {
      setIsEvaluating(false);
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
  };

  const attemptedUnsafeDischarge = hasDischarged && (!hasPrescribedTC || !hasDiscoveredCoumadin);
  const isLegallyProtected = evaluationResult
    ? evaluationResult.legalStatus === "CONFORME"
    : !attemptedUnsafeDischarge;

  function computeWeightedOmniScore() {
    if (!isSimulationComplete) return 0;
    const legalComplianceScore = isLegallyProtected ? 100 : 0;
    const weighted =
      omniScore.accuratezzaClinica * 0.4 +
      omniScore.appropriatezzaPrescrittiva * 0.3 +
      omniScore.sostenibilitaEconomica * 0.1 +
      legalComplianceScore * 0.2;
    return Math.round(Math.max(Math.min(weighted, 100), 0));
  }

  const weightedOmniScore = useMemo(() => computeWeightedOmniScore(), [omniScore, isLegallyProtected, isSimulationComplete]);

  if (bootPhase === "auth") {
    return (
      <div className="fixed inset-0 bg-[#020814] flex items-center justify-center z-[99999]">
        <div className="bg-[#0a0f1c]/80 backdrop-blur-xl border border-cyan-900/50 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,180,216,0.1)] w-full max-w-md text-center">
          <Lock className="text-cyan-500 w-12 h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-light text-white tracking-widest mb-2">ACCESSO RISERVATO</h1>
          <p className="text-slate-400 text-sm mb-6">Inserisci il codice di accesso per avviare il simulatore.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 w-full text-center tracking-[0.3em] font-mono focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="Codice"
              autoComplete="off"
            />
            {authError && (
              <p className="text-red-500 text-xs mt-2 font-mono animate-pulse">CODICE ERRATO O SCADUTO</p>
            )}
            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,180,216,0.4)] transition-all font-medium"
            >
              SBLOCCA TERMINALE
            </button>
          </form>
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
      <ClinicalAdvisorModal open={true} onAccept={() => setBootPhase("ready")} />
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
            <Activity className="h-16 w-16 text-cyan-400 animate-spin mb-6" aria-hidden />
            <p className="text-2xl font-mono text-cyan-400 tracking-widest animate-pulse">
              ELABORAZIONE REFERTO IN CORSO...
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
              <UserCircle className="h-4 w-4" /> Il Mio Profilo / Statistiche
            </button>
          </div>
        </header>

        {showScenarioModal && (
          <>
            <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md" />
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="w-full max-w-xl rounded-3xl border-2 border-red-600/80 shadow-[0_0_50px_rgba(220,38,38,0.6)] animate-pulse bg-[#0a0f1c]/95 backdrop-blur-2xl">
                <div className="flex items-center gap-2 mb-4 justify-center pt-4">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                  <span className="text-red-500 text-xs font-mono tracking-[0.2em] font-bold uppercase">Codice Rosso - Paziente in Attesa</span>
                </div>
                <div className={`border-b ${BORDER_ACCENT} px-5 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-slate-400" />
                    <h2 className="text-lg font-medium text-slate-100">
                      Scenario Clinico
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400">
                    Caso in simulazione
                  </span>
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
            <div className={`p-4 border-b ${BORDER_ACCENT} flex justify-between items-center`}>
              <h2 className="text-2xl font-medium text-slate-100">
                {phase === "hypothesis" ? "Formulazione Ipotesi e Prescrizioni" : phase === "results" ? "Esiti e Diagnosi Finale" : phase === "evaluation" ? "Referto di Fine Turno" : "Triage Pronto Soccorso"}
              </h2>
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
                    onClick={() => setPhase("hypothesis")}
                    disabled={isSending || showScenarioModal}
                    className="w-full rounded-2xl py-3 px-4 font-medium text-slate-950 bg-gradient-to-r from-amber-500/90 to-orange-500/90 hover:from-amber-400 hover:to-orange-400 shadow-[0_0_12px_rgba(245,158,11,0.35)] hover:shadow-[0_0_16px_rgba(245,158,11,0.45)] transition-all duration-300 border border-amber-700/50 flex items-center justify-center gap-2"
                  >
                    <Lightbulb className="h-5 w-5" />
                    Termina Anamnesi e Procedi
                  </button>
                </div>
              </>
            )}

            {/* FASE 2: Formulazione Ipotesi e Prescrizioni */}
            {phase === "hypothesis" && (
              <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
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
                      setPhase("results");
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
                      setPhase("evaluation");
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
                Turno concluso. Consulta il referto di fine turno e la dashboard.
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
                  {!isSimulationComplete && !evaluationResult ? (
                    <span className="text-slate-500 flex items-center gap-1">
                      [ STANDBY - IN ATTESA DI PRESCRIZIONE FINALE ]
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
                      {evaluationResult.legalMotivation}
                    </p>
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
        />

        {showFinalReportModal && isSimulationComplete && evaluationResult && (
          <>
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md" />
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border ${BORDER_ACCENT} ${PANEL_BG} backdrop-blur-xl shadow-[0_0_45px_rgba(15,23,42,0.4)] flex flex-col`}>
                <div className={`flex items-center justify-between border-b ${BORDER_ACCENT} px-6 py-4`}>
                  <div>
                    <h2 className="text-2xl font-medium tracking-wide text-slate-100">
                      Referto Ufficiale di Fine Turno
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Sintesi strutturata della performance clinica e della conformità medico-legale.
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-slate-400">
                      Paziente: {activeCase.patientName}, {activeCase.patientAge} anni
                    </span>
                    <span className={`inline-flex items-center gap-2 rounded-full bg-[#111827]/70 px-3 py-1 text-xs font-medium text-slate-200 border ${BORDER_ACCENT}`}>
                      <Clock className="h-3 w-3 text-slate-400" />
                      OmniScore Ponderato: {weightedOmniScore} / 100
                    </span>
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
                              evaluationResult.legalStatus === "CONFORME"
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-700/50"
                                : "bg-red-500/15 text-red-300 border border-red-700/50"
                            }`}
                          >
                            <ShieldAlert className="h-4 w-4" />
                            {evaluationResult.legalStatus === "CONFORME"
                              ? "CONFORME"
                              : "NON CONFORME"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Questo indicatore riassume la coerenza del percorso assistenziale con le
                          linee guida e le buone pratiche cliniche richiamate dalla Legge 24/2017
                          (Gelli-Bianco).
                        </p>
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

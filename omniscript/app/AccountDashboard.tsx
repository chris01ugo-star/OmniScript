"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import { User, History, Users, X } from "lucide-react";

const STORAGE_USER = "omniscript-user";
const STORAGE_USERS = "omniscript-users";
const STORAGE_HISTORY_PREFIX = "omniscript-simulation-history_";
const MAX_HISTORY = 50;
const CHART_LAST_N = 10;

export interface SimulationRecord {
  id: string;
  patientName: string;
  /** Modalità della simulazione: Standard o Emergenza */
  mode?: "Standard" | "Emergenza";
  /** Identificativo tecnico del caso (id da `ClinicalCase`) */
  caseId?: string;
  /** Titolo / specialità del caso mostrato in dashboard */
  caseTitle?: string;
  weightedScore: number;
  clinicalAccuracy: number;
  prescriptiveAppropriateness: number;
  sustainability: number;
  /** Durata gestione emergenza in millisecondi (solo per modalità Emergenza) */
  emergencyDurationMs?: number | null;
  /** Punteggio di efficienza temporale del percorso (0-100) */
  efficiencyScore?: number | null;
  report: string | null;
  date: string;
}

export interface UserInfo {
  email: string;
  name: string;
}

interface StoredNicknameUser {
  nickname: string;
  password?: string;
}

function getStoredUser(): UserInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    if (!raw) return null;
    return JSON.parse(raw) as UserInfo;
  } catch {
    return null;
  }
}

function getAllNicknamesFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (!raw) return [];
    const users = JSON.parse(raw) as StoredNicknameUser[] | null;
    if (!Array.isArray(users)) return [];
    return users
      .map((u) => u?.nickname)
      .filter((n): n is string => typeof n === "string" && n.trim().length > 0);
  } catch {
    return [];
  }
}

function getHistoryKeyForNickname(nickname: string | null): string | null {
  if (!nickname) return null;
  return `${STORAGE_HISTORY_PREFIX}${nickname}`;
}

function getStoredHistoryForNickname(nickname: string | null): SimulationRecord[] {
  if (typeof window === "undefined") return [];
  const key = getHistoryKeyForNickname(nickname);
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const arr = JSON.parse(raw) as SimulationRecord[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveUser(user: UserInfo | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(STORAGE_USER, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_USER);
}

export function initializeUserProfile(nickname: string) {
  if (typeof window === "undefined") return;
  const key = getHistoryKeyForNickname(nickname);
  if (!key) return;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      const emptyList: SimulationRecord[] = [];
      localStorage.setItem(key, JSON.stringify(emptyList));
    }
  } catch {
    // ignore initialization errors
  }
}

export function saveSimulationToHistoryForUser(
  nickname: string | null,
  record: Omit<SimulationRecord, "id" | "date">
) {
  if (typeof window === "undefined") return;
  const key = getHistoryKeyForNickname(nickname);
  if (!key) return;
  const list = getStoredHistoryForNickname(nickname);
  const newRecord: SimulationRecord = {
    ...record,
    id: `sim-${Date.now()}`,
    date: new Date().toISOString(),
  };
  const next = [newRecord, ...list].slice(0, MAX_HISTORY);
  localStorage.setItem(key, JSON.stringify(next));
}

interface AccountDashboardProps {
  open: boolean;
  onClose: () => void;
  /** Ultime N simulazioni per il grafico (dal parent o da storage) */
  simulationHistory?: SimulationRecord[];
  /** Nickname utente attivo per caricare le statistiche corrette */
  activeNickname: string | null;
}

export function AccountDashboard({
  open,
  onClose,
  simulationHistory: propHistory,
  activeNickname,
}: AccountDashboardProps) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [selectedReport, setSelectedReport] = useState<SimulationRecord | null>(null);
  const [history, setHistory] = useState<SimulationRecord[]>([]);
  const [allUserHistories, setAllUserHistories] = useState<
    { nickname: string; history: SimulationRecord[] }[]
  >([]);

  const isAdmin = useMemo(
    () => !!user && typeof user.email === "string" && user.email.toLowerCase().includes("admin"),
    [user]
  );

  const chartData = history.slice(0, CHART_LAST_N).reverse().map((s, i) => ({
    name: `Sim ${CHART_LAST_N - i}`,
    OmniScore: s.weightedScore,
  }));

  useEffect(() => {
    setUser(getStoredUser());
    if (propHistory) {
      setHistory(propHistory);
    } else {
      setHistory(getStoredHistoryForNickname(activeNickname));
    }
  }, [open, propHistory, activeNickname]);

  useEffect(() => {
    if (!open) return;
    const nicknames = getAllNicknamesFromStorage();
    const aggregated = nicknames.map((nickname) => ({
      nickname,
      history: getStoredHistoryForNickname(nickname),
    }));
    setAllUserHistories(aggregated.filter((u) => u.history.length > 0));
  }, [open]);

  const handleAuth = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError("");
      const trimmedEmail = email.trim();
      const trimmedName = name.trim();
      if (!trimmedEmail) {
        setAuthError("Inserisci l'email.");
        return;
      }
      if (authMode === "register" && !trimmedName) {
        setAuthError("Inserisci il nome.");
        return;
      }
      if (authMode === "register") {
        saveUser({ email: trimmedEmail, name: trimmedName });
        setUser({ email: trimmedEmail, name: trimmedName });
        setPassword("");
      } else {
        const stored = getStoredUser();
        if (stored?.email === trimmedEmail) {
          setUser(stored);
        } else {
          setAuthError("Utente non trovato. Registrati prima.");
        }
      }
    },
    [authMode, email, name]
  );

  const handleLogout = useCallback(() => {
    saveUser(null);
    setUser(null);
    setEmail("");
    setName("");
    setPassword("");
    setAuthError("");
  }, []);

  const handleClearHistory = useCallback(() => {
    if (typeof window === "undefined") return;
    const confirmed = window.confirm(
      "Sei sicuro di voler cancellare tutte le statistiche e lo storico casi? L'operazione non è reversibile."
    );
    if (!confirmed) return;
    const key = getHistoryKeyForNickname(activeNickname);
    if (key) {
      localStorage.removeItem(key);
    }
    setHistory([]);
    setSelectedReport(null);
  }, [activeNickname]);

  const totalSimulations = history.length;
  const averageAccuracy =
    history.length > 0
      ? Math.round(
          history.reduce((sum, rec) => sum + (rec.clinicalAccuracy ?? 0), 0) /
            history.length
        )
      : 0;

  const emergencySessions = history.filter(
    (rec) => rec.mode === "Emergenza" && rec.emergencyDurationMs != null
  );
  const averageEmergencyMs =
    emergencySessions.length > 0
      ? Math.round(
          emergencySessions.reduce(
            (sum, rec) => sum + (rec.emergencyDurationMs ?? 0),
            0
          ) / emergencySessions.length
        )
      : 0;

  const residualRiskIndex =
    history.length > 0
      ? Math.round(
          history.reduce((sum, rec) => {
            const acc = rec.clinicalAccuracy ?? 0;
            const presc = rec.prescriptiveAppropriateness ?? 0;
            const sust = rec.sustainability ?? 0;
            const composite = 0.4 * acc + 0.3 * presc + 0.3 * sust;
            const risk = 100 - composite;
            return sum + Math.max(0, Math.min(100, risk));
          }, 0) / history.length
        )
      : 0;

  const benchmarkRows = useMemo(() => {
    if (allUserHistories.length === 0) return [];
    return allUserHistories.map(({ nickname, history: userHistory }) => {
      const total = userHistory.length;
      const avgAdherence =
        total > 0
          ? Math.round(
              userHistory.reduce(
                (sum, rec) => sum + (rec.clinicalAccuracy ?? 0),
                0
              ) / total
            )
          : 0;
      const emergencyOnly = userHistory.filter(
        (rec) => rec.mode === "Emergenza" && rec.emergencyDurationMs != null
      );
      const avgLatencyMs =
        emergencyOnly.length > 0
          ? Math.round(
              emergencyOnly.reduce(
                (sum, rec) => sum + (rec.emergencyDurationMs ?? 0),
                0
              ) / emergencyOnly.length
            )
          : 0;
      const successRate =
        total > 0
          ? Math.round(
              (userHistory.filter((rec) => (rec.clinicalAccuracy ?? 0) >= 80)
                .length /
                total) *
                100
            )
          : 0;
      return {
        nickname,
        avgAdherence,
        avgLatencyMs,
        successRate,
      };
    });
  }, [allUserHistories]);

  const anonymizedBenchmarkRows = useMemo(() => {
    if (benchmarkRows.length === 0) return [];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let anonIndex = 0;
    return benchmarkRows
      .slice()
      .sort((a, b) => b.avgAdherence - a.avgAdherence)
      .map((row) => {
        if (isAdmin || row.nickname === activeNickname) {
          return { ...row, displayName: row.nickname };
        }
        const label =
          anonIndex < alphabet.length
            ? `Utente ${alphabet[anonIndex]}`
            : `Utente ${anonIndex + 1}`;
        anonIndex += 1;
        return { ...row, displayName: label };
      });
  }, [benchmarkRows, isAdmin, activeNickname]);

  const currentUserBenchmark = useMemo(
    () =>
      benchmarkRows.find((row) => row.nickname === activeNickname) ??
      null,
    [benchmarkRows, activeNickname]
  );

  const adherencePercentile = useMemo(() => {
    if (!currentUserBenchmark || benchmarkRows.length === 0) return null;
    const lowerCount = benchmarkRows.filter(
      (row) => row.avgAdherence < currentUserBenchmark.avgAdherence
    ).length;
    return Math.round((lowerCount / benchmarkRows.length) * 100);
  }, [benchmarkRows, currentUserBenchmark]);

  const distributionData = useMemo(() => {
    if (benchmarkRows.length === 0) return [];
    const buckets: { [range: string]: number } = {};
    for (let start = 0; start < 100; start += 10) {
      const label = `${start}-${start + 9}`;
      buckets[label] = 0;
    }
    buckets["100"] = 0;
    benchmarkRows.forEach((row) => {
      const v = Math.max(0, Math.min(100, row.avgAdherence));
      if (v === 100) {
        buckets["100"] += 1;
      } else {
        const bucketStart = Math.floor(v / 10) * 10;
        const label = `${bucketStart}-${bucketStart + 9}`;
        buckets[label] += 1;
      }
    });
    return Object.entries(buckets).map(([range, count]) => ({
      range,
      count,
    }));
  }, [benchmarkRows]);

  const radarData = useMemo(() => {
    const buckets: { [area: string]: number } = {
      Cardiologia: 0,
      Neurologia: 0,
      Chirurgia: 0,
      Altro: 0,
    };
    history.forEach((rec) => {
      const title = (rec.caseTitle || "").toLowerCase();
      if (title.includes("cardio")) buckets.Cardiologia += 1;
      else if (title.includes("neuro")) buckets.Neurologia += 1;
      else if (
        title.includes("chirurg") ||
        title.includes("ortopedia") ||
        title.includes("trauma")
      )
        buckets.Chirurgia += 1;
      else buckets.Altro += 1;
    });
    return Object.entries(buckets).map(([area, value]) => ({
      area,
      value,
    }));
  }, [history]);

  const formatMsAsClock = (ms: number) => {
    if (!Number.isFinite(ms) || ms <= 0) return "—";
    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Mock: percentile utente vs media globale (es. 78° percentile)
  const mockPercentile = 78;
  const mockGlobalAvg = 72;

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 z-[61] h-full w-full max-w-lg overflow-y-auto border-l border-slate-700 bg-slate-900 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-dashboard-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700 bg-slate-900/95 px-4 py-3 backdrop-blur">
          <h2 id="account-dashboard-title" className="text-base font-semibold text-slate-100">
            Account & Dashboard Clinica
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
            aria-label="Chiudi"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-4">
          {/* Auth */}
          <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
            <div className="mb-3 flex items-center gap-2 text-sky-300">
              <User className="h-4 w-4" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                {user
                  ? activeNickname
                    ? `Profilo – ${activeNickname}`
                    : "Profilo"
                  : "Registrazione / Login"}
              </h3>
            </div>
            {user ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-200">
                  <span className="text-slate-400">Nome:</span> {user.name}
                </p>
                <p className="text-sm text-slate-200">
                  <span className="text-slate-400">Email:</span> {user.email}
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 rounded-xl border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
                >
                  Esci
                </button>
              </div>
            ) : (
              <form onSubmit={handleAuth} className="space-y-3">
                {authMode === "register" && (
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-400">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      placeholder="Mario Rossi"
                    />
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-400">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="mario.rossi@email.it"
                  />
                </div>
                {authError && (
                  <p className="text-xs text-red-400">{authError}</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500"
                  >
                    {authMode === "login" ? "Accedi" : "Registrati"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode((m) => (m === "login" ? "register" : "login"));
                      setAuthError("");
                    }}
                    className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
                  >
                    {authMode === "login" ? "Registrati" : "Già registrato?"}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Dashboard di Performance Clinica (IPC) */}
          <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-sky-300">
                Indice di Performance Clinica (IPC)
              </h3>
              <button
                type="button"
                onClick={handleClearHistory}
                className="rounded-full border border-slate-600 bg-slate-900/70 px-3 py-1 text-[11px] font-medium text-slate-300 hover:border-red-500/70 hover:text-red-200 hover:bg-red-900/40 transition-colors"
              >
                Pulisci Dati
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex flex-col justify-between rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Totale simulazioni
                </p>
                <p className="mt-1 text-3xl font-semibold text-sky-300">
                  {totalSimulations}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Sessioni concluse con generazione report.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-sky-500/70 bg-slate-900 text-xs font-semibold text-sky-200">
                  {averageAccuracy}%
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Aderenza media alle linee guida
                  </p>
                  <p className="text-sm text-slate-200">
                    Accuratezza diagnostica media rispetto alle raccomandazioni (ex L. 24/2017).
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-900/40 text-sm font-semibold text-red-200 border border-red-500/60">
                  {formatMsAsClock(averageEmergencyMs)}
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Latenza diagnostica media (emergenze)
                  </p>
                  <p className="text-sm text-slate-200">
                    Tempo medio di risposta nelle sessioni in Modalità Emergenza.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Grafico andamento OmniScore (ultime 10 simulazioni) */}
          <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-sky-300">
              Andamento OmniScore (ultime 10 simulazioni)
            </h3>
            {chartData.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">
                Nessuna simulazione completata. Completa casi e genera l&apos;LPR per vedere l&apos;andamento.
              </p>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#e2e8f0" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Line
                      type="monotone"
                      dataKey="OmniScore"
                      stroke="#38bdf8"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="OmniScore ponderato"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* Dashboard di Performance Clinica e Benchmarking tra Pari */}
          <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sky-300">
                <Users className="h-4 w-4" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">
                  Dashboard di Performance Clinica e Benchmarking tra Pari
                </h3>
              </div>
              {adherencePercentile != null && (
                <div className="rounded-full border border-sky-600/70 bg-slate-900/60 px-3 py-1 text-[11px] text-sky-200">
                  Percentile di Aderenza:{" "}
                  <span className="font-semibold">{adherencePercentile}°</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400">
              Confronto anonimo tra colleghi sulle principali metriche cliniche: aderenza alle
              linee guida, latenza diagnostica e tasso di successo diagnostico.
            </p>

            {/* Tabella di benchmarking tra pari */}
            {anonymizedBenchmarkRows.length === 0 ? (
              <p className="py-2 text-xs text-slate-500">
                I dati di confronto saranno disponibili dopo che più utenti avranno completato
                simulazioni.
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/60">
                <div className="grid grid-cols-4 gap-2 border-b border-slate-700/70 bg-slate-900 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  <span>Nickname / ID</span>
                  <span className="text-center">
                    Aderenza media<br />(%){" "}
                  </span>
                  <span className="text-center">
                    Latenza media<br />(mm:ss)
                  </span>
                  <span className="text-center">
                    Tasso di successo<br />(%){" "}
                  </span>
                </div>
                <ul className="divide-y divide-slate-800/80">
                  {anonymizedBenchmarkRows.map((row) => (
                    <li
                      key={row.nickname}
                      className="grid grid-cols-4 items-center gap-2 px-3 py-1.5 text-[11px]"
                    >
                      <span
                        className={`truncate ${
                          row.nickname === activeNickname ? "font-semibold text-sky-200" : "text-slate-200"
                        }`}
                      >
                        {row.displayName}
                        {row.nickname === activeNickname ? " (tu)" : ""}
                      </span>
                      <span className="text-center text-slate-100">
                        {row.avgAdherence}%
                      </span>
                      <span className="text-center text-slate-200">
                        {formatMsAsClock(row.avgLatencyMs)}
                      </span>
                      <span className="text-center text-emerald-300">
                        {row.successRate}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Indicatore di Rischio Clinico Residuo */}
            <div className="flex items-center justify-between gap-4 rounded-xl border border-red-600/60 bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/60 p-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-red-300">
                  Rischio Clinico Residuo
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Stima sintetica del rischio residuo associato a omissioni procedurali o documentali
                  nelle simulazioni concluse.
                </p>
              </div>
              <div
                className={`flex h-14 w-24 flex-col items-center justify-center rounded-xl border text-xs font-semibold ${
                  residualRiskIndex >= 70
                    ? "border-red-500/80 bg-red-900/70 text-red-100"
                    : residualRiskIndex >= 40
                    ? "border-amber-500/80 bg-amber-900/40 text-amber-100"
                    : "border-emerald-500/80 bg-emerald-900/40 text-emerald-100"
                }`}
              >
                <span className="text-[10px] uppercase tracking-wide">Indice</span>
                <span className="text-lg">{residualRiskIndex}</span>
                <span className="text-[9px]">
                  {residualRiskIndex >= 70
                    ? "Elevato"
                    : residualRiskIndex >= 40
                    ? "Moderato"
                    : "Controllato"}
                </span>
              </div>
            </div>

            {/* Distribuzione dell'aderenza (grafico a barre) */}
            {distributionData.length > 0 && (
              <div className="mt-2 rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                  Distribuzione dell&apos;Indice di Performance Clinica tra i colleghi
                </p>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis
                        dataKey="range"
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        stroke="#64748b"
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        stroke="#64748b"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#020617",
                          border: "1px solid #1e293b",
                          borderRadius: 8,
                          color: "#e2e8f0",
                        }}
                      />
                      {currentUserBenchmark && (
                        <ReferenceLine
                          x={
                            (() => {
                              const v = Math.max(
                                0,
                                Math.min(100, currentUserBenchmark.avgAdherence)
                              );
                              if (v === 100) return "100";
                              const bucketStart = Math.floor(v / 10) * 10;
                              return `${bucketStart}-${bucketStart + 9}`;
                            })()
                          }
                          stroke="#38bdf8"
                          strokeDasharray="3 3"
                        />
                      )}
                      <Bar dataKey="count" fill="#38bdf8" opacity={0.85} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Radar chart per competenze specialistiche */}
            {history.length > 0 && (
              <div className="mt-2 rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                  Profilo di esposizione per area specialistica
                </p>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis
                        dataKey="area"
                        tick={{ fontSize: 11, fill: "#cbd5f5" }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        stroke="#64748b"
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                      />
                      <Radar
                        name="Esposizione"
                        dataKey="value"
                        stroke="#38bdf8"
                        fill="#38bdf8"
                        fillOpacity={0.35}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px", color: "#e2e8f0" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </section>

          {/* Storico casi */}
          <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
            <div className="mb-3 flex items-center gap-2 text-emerald-300">
              <History className="h-4 w-4" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Storico Casi (Case History)
              </h3>
            </div>
            <p className="mb-3 text-xs text-slate-400">
              Ultime sessioni svolte. Clicca per rivedere il report finale.
            </p>
            {history.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-500">
                Nessun caso ancora. Completa una simulazione e genera l&apos;LPR.
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/60">
                <div className="grid grid-cols-4 gap-2 border-b border-slate-700/70 bg-slate-900 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  <span>Caso</span>
                  <span className="text-center">Modalità</span>
                  <span className="text-center">Accuratezza</span>
                  <span className="text-center">Data</span>
                </div>
                <ul className="divide-y divide-slate-800/80">
                  {history.map((rec) => (
                    <li key={rec.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedReport(rec)}
                        className="grid w-full grid-cols-4 items-center gap-2 px-3 py-2 text-left text-xs hover:bg-slate-800/70 transition"
                      >
                        <span className="truncate text-slate-200">
                          {rec.caseTitle || rec.patientName}
                        </span>
                        <span className="text-center text-[11px] text-slate-300">
                          {rec.mode || "Standard"}
                        </span>
                        <span className="text-center text-[11px] text-sky-200">
                          {rec.clinicalAccuracy ?? "—"}%
                        </span>
                        <span className="text-center text-[11px] text-slate-400">
                          {new Date(rec.date).toLocaleDateString("it-IT", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          })}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Modale report */}
      {selectedReport && (
        <>
          <div
            className="fixed inset-0 z-[62] bg-black/60 backdrop-blur-sm"
            aria-hidden
            onClick={() => setSelectedReport(null)}
          />
          <div className="fixed left-1/2 top-1/2 z-[63] w-[min(95vw,500px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-3">
              <h4 className="font-semibold text-slate-100">
                Report: {selectedReport.patientName} ({selectedReport.weightedScore}%)
              </h4>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-100"
                aria-label="Chiudi"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {selectedReport.report ? (
                <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300">
                  {selectedReport.report}
                </pre>
              ) : (
                <p className="text-sm text-slate-500">
                  Report non disponibile per questo caso.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

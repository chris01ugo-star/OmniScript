"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { User, Trophy, History, X } from "lucide-react";

const STORAGE_USER = "omniscript-user";
const STORAGE_HISTORY = "omniscript-simulation-history";
const MAX_HISTORY = 50;
const CHART_LAST_N = 10;

export interface SimulationRecord {
  id: string;
  patientName: string;
  weightedScore: number;
  clinicalAccuracy: number;
  prescriptiveAppropriateness: number;
  sustainability: number;
  report: string | null;
  date: string;
}

export interface UserInfo {
  email: string;
  name: string;
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

function getStoredHistory(): SimulationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY);
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

export function saveSimulationToHistory(record: Omit<SimulationRecord, "id" | "date">) {
  if (typeof window === "undefined") return;
  const list = getStoredHistory();
  const newRecord: SimulationRecord = {
    ...record,
    id: `sim-${Date.now()}`,
    date: new Date().toISOString(),
  };
  const next = [newRecord, ...list].slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_HISTORY, JSON.stringify(next));
}

interface AccountDashboardProps {
  open: boolean;
  onClose: () => void;
  /** Ultime N simulazioni per il grafico (dal parent o da storage) */
  simulationHistory?: SimulationRecord[];
}

export function AccountDashboard({
  open,
  onClose,
  simulationHistory: propHistory,
}: AccountDashboardProps) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [selectedReport, setSelectedReport] = useState<SimulationRecord | null>(null);

  const history = propHistory ?? getStoredHistory();
  const chartData = history.slice(0, CHART_LAST_N).reverse().map((s, i) => ({
    name: `Sim ${CHART_LAST_N - i}`,
    OmniScore: s.weightedScore,
  }));

  useEffect(() => {
    setUser(getStoredUser());
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
          <h2
            id="account-dashboard-title"
            className="text-base font-semibold text-slate-100"
          >
            Account & Statistiche
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
                {user ? "Profilo" : "Registrazione / Login"}
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

          {/* Leaderboard - percentile vs media globale */}
          <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
            <div className="mb-3 flex items-center gap-2 text-amber-300">
              <Trophy className="h-4 w-4" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Leaderboard
              </h3>
            </div>
            <p className="mb-2 text-xs text-slate-400">
              Il tuo percentile rispetto alla media globale dei medici registrati.
            </p>
            <div className="flex items-center gap-4 rounded-xl bg-slate-900/80 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-2xl font-bold text-amber-400">
                {mockPercentile}°
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">
                  Sei nel {mockPercentile}° percentile
                </p>
                <p className="text-xs text-slate-500">
                  Media globale: {mockGlobalAvg}% OmniScore ponderato
                </p>
              </div>
            </div>
          </section>

          {/* Storico casi */}
          <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
            <div className="mb-3 flex items-center gap-2 text-emerald-300">
              <History className="h-4 w-4" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Storico Casi
              </h3>
            </div>
            <p className="mb-3 text-xs text-slate-400">
              Pazienti trattati. Clicca per rivedere il report finale.
            </p>
            {history.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-500">
                Nessun caso ancora. Completa una simulazione e genera l&apos;LPR.
              </p>
            ) : (
              <ul className="space-y-2">
                {history.map((rec) => (
                  <li key={rec.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedReport(rec)}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-600 bg-slate-900/60 px-3 py-2.5 text-left text-sm transition hover:border-sky-500/50 hover:bg-slate-800"
                    >
                      <span className="font-medium text-slate-200">
                        {rec.patientName}
                      </span>
                      <span className="rounded-full bg-sky-900/80 px-2 py-0.5 text-xs font-semibold text-sky-200">
                        {rec.weightedScore}%
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
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

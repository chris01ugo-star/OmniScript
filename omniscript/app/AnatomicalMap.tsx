import React, { useMemo, useState } from "react";
import type { ClinicalCase } from "./cases";

type HotspotCategory = "auscultation" | "ecg";

interface AnatomicalHotspot {
  id: string;
  name: string;
  x: number; // percentage (0-100) relative to width
  y: number; // percentage (0-100) relative to height
  category: HotspotCategory;
  isKey: boolean;
}

export const ANATOMICAL_HOTSPOTS: AnatomicalHotspot[] = [
  {
    id: "aortic",
    name: "Focolaio aortico (2° spazio intercostale dx)",
    x: 45,
    y: 32,
    category: "auscultation",
    isKey: true,
  },
  {
    id: "pulmonic",
    name: "Focolaio polmonare (2° spazio intercostale sn)",
    x: 55,
    y: 32,
    category: "auscultation",
    isKey: true,
  },
  {
    id: "tricuspid",
    name: "Focolaio tricuspidale (margine sternale dx)",
    x: 48,
    y: 46,
    category: "auscultation",
    isKey: true,
  },
  {
    id: "mitral",
    name: "Focolaio mitralico (itto della punta)",
    x: 58,
    y: 52,
    category: "auscultation",
    isKey: true,
  },
  // Campi polmonari — apici
  {
    id: "lung-apex-right",
    name: "Apice polmonare destro",
    x: 44,
    y: 24,
    category: "auscultation",
    isKey: false,
  },
  {
    id: "lung-apex-left",
    name: "Apice polmonare sinistro",
    x: 56,
    y: 24,
    category: "auscultation",
    isKey: false,
  },
  // Campi polmonari — basi
  {
    id: "lung-base-right",
    name: "Base polmonare destra",
    x: 46,
    y: 64,
    category: "auscultation",
    isKey: false,
  },
  {
    id: "lung-base-left",
    name: "Base polmonare sinistra",
    x: 54,
    y: 64,
    category: "auscultation",
    isKey: false,
  },
  // Campi polmonari — linee ascellari
  {
    id: "lung-axillary-right",
    name: "Campo polmonare linea ascellare destra",
    x: 36,
    y: 56,
    category: "auscultation",
    isKey: false,
  },
  {
    id: "lung-axillary-left",
    name: "Campo polmonare linea ascellare sinistra",
    x: 64,
    y: 56,
    category: "auscultation",
    isKey: false,
  },
  {
    id: "ecg-v1",
    name: "ECG V1",
    x: 40,
    y: 40,
    category: "ecg",
    isKey: false,
  },
  {
    id: "ecg-v2",
    name: "ECG V2",
    x: 44,
    y: 40,
    category: "ecg",
    isKey: false,
  },
  {
    id: "ecg-v3",
    name: "ECG V3",
    x: 48,
    y: 44,
    category: "ecg",
    isKey: false,
  },
  {
    id: "ecg-v4",
    name: "ECG V4",
    x: 56,
    y: 44,
    category: "ecg",
    isKey: false,
  },
  {
    id: "ecg-v5",
    name: "ECG V5",
    x: 62,
    y: 46,
    category: "ecg",
    isKey: false,
  },
  {
    id: "ecg-v6",
    name: "ECG V6",
    x: 66,
    y: 46,
    category: "ecg",
    isKey: false,
  },
];

export const KEY_HOTSPOT_IDS: string[] = ANATOMICAL_HOTSPOTS.filter((h) => h.isKey).map(
  (h) => h.id
);

type CaseHotspotFindings = Record<string, string>;

type CaseSpecificFindings = Record<string, CaseHotspotFindings>;

// Mappa di default se il caso non ha una configurazione specifica
const DEFAULT_FINDINGS: CaseHotspotFindings = {
  // Cuore
  aortic: "Toni cardiaci regolari, nessun soffio patologico apprezzabile.",
  pulmonic: "Murmure vescicolare normotrasmesso, assenza di rumori patologici focali.",
  tricuspid: "Toni cardiaci conservati, nessun soffio significativo.",
  mitral: "Toni cardiaci ritmici, itto di punta normoconfigurato, nessun soffio evidente.",

  // Polmoni — apici, basi e linee ascellari
  "lung-apex-right": "Murmure vescicolare presente in sede apicale destra, senza rantoli o sibili.",
  "lung-apex-left": "Murmure vescicolare presente in sede apicale sinistra, senza rantoli o sibili.",
  "lung-base-right": "Murmure vescicolare normotrasmesso alle basi polmonari destre, assenza di rantoli crepitanti.",
  "lung-base-left": "Murmure vescicolare normotrasmesso alle basi polmonari sinistre, assenza di rantoli crepitanti.",
  "lung-axillary-right": "Campi polmonari pervi alla linea ascellare destra, senza rumori aggiunti.",
  "lung-axillary-left": "Campi polmonari pervi alla linea ascellare sinistra, senza rumori aggiunti.",

  // ECG — punti di repere per le derivazioni precordiali
  "ecg-v1": "Sede di posizionamento elettrodo V1 (IV spazio intercostale parasternale destro) per ECG standard a 12 derivazioni.",
  "ecg-v2": "Sede di posizionamento elettrodo V2 (IV spazio intercostale parasternale sinistro) per ECG standard a 12 derivazioni.",
  "ecg-v3": "Sede di posizionamento elettrodo V3 (a metà strada tra V2 e V4) per ECG standard a 12 derivazioni.",
  "ecg-v4": "Sede di posizionamento elettrodo V4 (V spazio intercostale sulla linea emiclaveare sinistra) per ECG standard a 12 derivazioni.",
  "ecg-v5": "Sede di posizionamento elettrodo V5 (sulla linea ascellare anteriore sinistra, orizzontale a V4) per ECG standard a 12 derivazioni.",
  "ecg-v6": "Sede di posizionamento elettrodo V6 (sulla linea ascellare media sinistra, orizzontale a V4) per ECG standard a 12 derivazioni.",
};

// Struttura pronta per scenari specifici (es. dissezione aortica)
// Gli scenari esistenti che non sono esplicitamente mappati ricadranno nei DEFAULT_FINDINGS
const CASE_SPECIFIC_FINDINGS: CaseSpecificFindings = {
  // Esempio: caso di dissezione aortica (ID da allineare quando lo scenario verrà definito in ./cases.ts)
  "cardio-dissezione-aortica": {
    aortic: "Soffio diastolico ad alta frequenza, meglio udibile lungo il margine sternale destro.",
  },
};

export interface AnatomicalMapProps {
  activeCase: ClinicalCase;
  examinedHotspots: Set<string> | null;
  onHotspotExamined?: (payload: {
    id: string;
    name: string;
    result: string;
    category: HotspotCategory;
    isKey: boolean;
  }) => void;
}

export function AnatomicalMap({
  activeCase,
  examinedHotspots,
  onHotspotExamined,
}: AnatomicalMapProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const caseFindings = useMemo<CaseHotspotFindings>(() => {
    const specific = CASE_SPECIFIC_FINDINGS[activeCase.id] ?? {};
    return {
      ...DEFAULT_FINDINGS,
      ...specific,
    };
  }, [activeCase.id]);

  const handleHotspotClick = (hotspot: AnatomicalHotspot) => {
    setActiveId(hotspot.id === activeId ? null : hotspot.id);

    const result =
      caseFindings[hotspot.id] ??
      "Nessun reperto patologico rilevante in questo punto per il caso attivo.";

    if (onHotspotExamined) {
      onHotspotExamined({
        id: hotspot.id,
        name: hotspot.name,
        result,
        category: hotspot.category,
        isKey: hotspot.isKey,
      });
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative aspect-[3/4] w-full rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800 overflow-hidden shadow-[0_0_30px_rgba(15,23,42,0.7)]">
        <svg viewBox="0 0 300 400" className="w-full h-full">
          <defs>
            <radialGradient id="torsoGradient" cx="50%" cy="20%" r="70%">
              <stop offset="0%" stopColor="#1f2937" />
              <stop offset="40%" stopColor="#020617" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>
          </defs>

          {/* Torace stilizzato */}
          <path
            d="M150 40 C 115 40 85 65 80 105 C 75 145 70 210 80 270 C 90 330 115 360 150 360 C 185 360 210 330 220 270 C 230 210 225 145 220 105 C 215 65 185 40 150 40 Z"
            fill="url(#torsoGradient)"
            stroke="#1e293b"
            strokeWidth="2"
          />

          {/* Sterno */}
          <line
            x1="150"
            y1="80"
            x2="150"
            y2="260"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Clavicole */}
          <path
            d="M120 80 C 130 70 140 65 150 65 C 160 65 170 70 180 80"
            stroke="#0f172a"
            strokeWidth="3"
            fill="none"
          />

          {/* Hotspot */}
          {ANATOMICAL_HOTSPOTS.map((h) => {
            const isVisited = examinedHotspots?.has(h.id) ?? false;
            const isActive = activeId === h.id;
            const cx = (h.x / 100) * 300;
            const cy = (h.y / 100) * 400;

            return (
              <g
                key={h.id}
                onClick={() => handleHotspotClick(h)}
                className="cursor-pointer"
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isActive ? 10 : 8}
                  fill={
                    h.category === "auscultation"
                      ? isVisited
                        ? "#22c55e"
                        : "#38bdf8"
                      : isVisited
                      ? "#a855f7"
                      : "#f97316"
                  }
                  fillOpacity={isActive ? 0.95 : 0.8}
                  stroke="#020617"
                  strokeWidth="2"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={isActive ? 16 : 13}
                  fill="none"
                  stroke={
                    h.category === "auscultation"
                      ? "rgba(56,189,248,0.6)"
                      : "rgba(248,113,113,0.7)"
                  }
                  strokeWidth={isActive ? 2.2 : 1.5}
                  className="animate-pulse"
                />
              </g>
            );
          })}
        </svg>

        {/* Popover testuale fuori dallo SVG per migliore leggibilità */}
        {activeId && (
          <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-slate-900/95 border border-slate-700/70 p-3 text-xs text-slate-200 shadow-[0_0_18px_rgba(15,23,42,0.8)]">
            {(() => {
              const h = ANATOMICAL_HOTSPOTS.find((x) => x.id === activeId);
              if (!h) return null;
              const result =
                caseFindings[h.id] ??
                "Nessun reperto patologico rilevante in questo punto per il caso attivo.";
              return (
                <>
                  <p className="font-semibold text-[11px] uppercase tracking-wide text-cyan-300 mb-1">
                    {h.category === "auscultation" ? "AUSCULTAZIONE" : "ECG / ELETTRODI"} —{" "}
                    {h.name}
                  </p>
                  <p className="text-xs leading-relaxed">{result}</p>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}


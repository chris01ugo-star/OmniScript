"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

interface ClinicalAdvisorModalProps {
  open: boolean;
  onAccept: () => void;
}

export function ClinicalAdvisorModal({ open, onAccept }: ClinicalAdvisorModalProps) {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (!open || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [open, timeLeft]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl">
      <div className="w-full max-w-2xl bg-[#0a0f1c] border border-cyan-900/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,180,216,0.1)] text-slate-200">
        <div className="flex justify-center mb-4">
          <ShieldAlert className="w-12 h-12 text-orange-500" aria-hidden />
        </div>

        <h2 className="text-2xl font-bold text-white mb-4 text-center tracking-wide">
          DISCLAIMER MEDICO-LEGALE E CONDIZIONI D&apos;USO
        </h2>

        <p className="mb-4 text-slate-200 leading-relaxed">
          Questo software è un ambiente strettamente simulato. Le dinamiche diagnostiche e prescrittive si basano sull&apos;osservanza delle Linee Guida e delle buone pratiche clinico-assistenziali sancite dalla Legge Gelli-Bianco (L. 24/2017).
        </p>

        <p className="mb-4 text-slate-200 leading-relaxed">
          OmniScript ha uno scopo ESCLUSIVAMENTE FORMATIVO e didattico per professionisti sanitari o studenti. Non è un dispositivo medico e non deve mai essere utilizzato per prendere decisioni cliniche su pazienti reali.
        </p>

        <p className="mb-8 text-cyan-400 font-medium leading-relaxed">
          Per qualsiasi consulto reale, dubbio o necessità medica personale è obbligatorio rivolgersi a un medico reale o contattare i servizi di emergenza. OmniScript è solo per la formazione; non sostituisce mai un consulto medico vero.
        </p>

        <button
          type="button"
          onClick={onAccept}
          disabled={timeLeft > 0}
          className={`w-full rounded-xl px-5 py-3.5 text-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0a0f1c] ${
            timeLeft > 0
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(0,180,216,0.5)]"
          }`}
        >
          {timeLeft > 0
            ? `Lettura obbligatoria... (${timeLeft}s)`
            : "Dichiaro di aver letto e compreso - Accedi alla Simulazione"}
        </button>
      </div>
    </div>
  );
}

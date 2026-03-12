import { Lock, ShieldAlert } from "lucide-react";
import { useEffect, useRef, type FormEvent } from "react";

interface MasterPinGateProps {
  masterPin: string;
  masterPinError: string | null;
  isCheckingMasterPin: boolean;
  mounted: boolean;
  onChangePin: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function MasterPinGate({
  masterPin,
  masterPinError,
  isCheckingMasterPin,
  mounted,
  onChangePin,
  onSubmit,
}: MasterPinGateProps) {
  const pinInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!mounted || isCheckingMasterPin) return;
    // Imposta il focus automatico sul campo PIN solo quando il portale è pronto
    pinInputRef.current?.focus();
  }, [mounted, isCheckingMasterPin]);

  if (!mounted || isCheckingMasterPin) {
    return (
      <div className="fixed inset-0 bg-[#020617] flex items-center justify-center z-[99999]">
        <div className="text-slate-300 text-sm">Inizializzazione portale sicuro...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 flex items-center justify-center z-[99999] px-4">
      <div className="bg-slate-950/90 backdrop-blur-2xl border border-cyan-900/60 shadow-[0_0_60px_rgba(0,180,216,0.25)] rounded-3xl w-full max-w-md px-8 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 text-white shadow-[0_0_25px_rgba(56,189,248,0.6)]">
            <Lock className="w-7 h-7" />
          </div>
          <p className="text-xs tracking-[0.35em] text-cyan-300 uppercase mb-1 text-center">
            Master Access
          </p>
          <h1 className="text-xl font-semibold text-slate-50 text-center">
            Portale Clinico Protetto
          </h1>
          <p className="mt-2 text-xs text-slate-400 text-center max-w-sm">
            Inserire il codice di autorizzazione fornito dalla direzione sanitaria per accedere al portale.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Codice di Accesso
            </label>
            <input
              ref={pinInputRef}
              type="password"
              autoComplete="off"
              value={masterPin}
              onChange={(e) => onChangePin(e.target.value)}
              className="w-full rounded-lg bg-slate-950/80 border border-slate-700/70 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-400"
              placeholder="Inserisci il codice di accesso"
              required
            />
            {masterPinError && (
              <p className="mt-2 text-[11px] text-red-400">{masterPinError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600/90 hover:bg-cyan-500/90 active:bg-cyan-700 text-sm font-medium text-slate-950 py-2.5 transition-colors shadow-[0_0_18px_rgba(8,145,178,0.7)]"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Accedi al Portale</span>
          </button>

          <p className="mt-3 text-[10px] text-slate-500 text-center leading-relaxed">
            L&apos;accesso è riservato esclusivamente a personale sanitario autorizzato.
          </p>
        </form>
      </div>
    </div>
  );
}


interface TelaLockdownProps {
  onResetDev: () => void;
}

export function TelaLockdown({ onResetDev }: TelaLockdownProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-status-bloqueado/95 px-6 text-center backdrop-blur-sm">
      <svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
        />
      </svg>

      <h1 className="text-2xl font-bold text-white">Trava Lockdown</h1>
      <p className="max-w-md text-white/80">Aguarde o professor desbloquear a estação para continuar a prova.</p>

      {import.meta.env.DEV && (
        <button
          type="button"
          onClick={onResetDev}
          className="mt-6 rounded-lg border border-white/30 px-4 py-2 text-xs text-white/70 hover:bg-white/10"
        >
          [dev] resetar strikes
        </button>
      )}
    </div>
  );
}

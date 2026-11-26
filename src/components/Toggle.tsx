/** iOS-style on/off switch with a large touch area. */
export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${on ? 'bg-save' : 'bg-surface-2'}`}
    >
      <span className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-6' : ''}`} />
    </button>
  )
}

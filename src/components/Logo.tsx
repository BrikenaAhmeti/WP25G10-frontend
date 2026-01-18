export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg width="34" height="34" viewBox="0 0 64 64" fill="none" className="drop-shadow">
        <path
          d="M32 6c13.8 0 25 11.2 25 25S45.8 56 32 56 7 44.8 7 31 18.2 6 32 6Z"
          stroke="currentColor"
          strokeWidth="2.2"
          opacity="0.6"
        />
        <path
          d="M12 37c7.5-10.5 16.7-16 28.5-16 4.7 0 8.7.8 11.5 1.7"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M24 44l6.5-18.5c.6-1.7 2.8-2.2 4.1-.9l10.9 10.9c1.3 1.3.8 3.5-.9 4.1L26.1 46c-1.4.5-2.6-.7-2.1-2Z"
          fill="currentColor"
          opacity="0.95"
        />
      </svg>
      <div className="leading-tight">
        <div className="text-lg font-semibold tracking-wide">AeroPulse</div>
        <div className="text-xs text-white/60">Airport Manager Console</div>
      </div>
    </div>
  );
}
export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img src={'/airport-logo.png'} className="object-contain h-[30px]"/>
      <div className="leading-tight">
        <div className="text-lg font-semibold tracking-wide">AeroPulse</div>
        <div className="text-xs text-white/60">Airport Manager Console</div>
      </div>
    </div>
  );
}
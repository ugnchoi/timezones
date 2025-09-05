'use client';

import { PhaseIcon } from './PhaseIcon';
import { formatHHmm, classifyPhaseAt, isWeekend } from '@/lib/time-utils';

interface TimeCellProps {
  tz: string;
  instant: Date;
  timeClassName?: string;
  iconClassName?: string;
  isBusinessTime?: boolean;
}

export function TimeCell({ tz, instant, timeClassName, iconClassName, isBusinessTime }: TimeCellProps) {
  const time = formatHHmm(instant, tz);
  const phase = classifyPhaseAt(instant, tz);
  const weekend = isWeekend(instant);
  
  // Apply primary color to icon when it's business time
  const iconClasses = `${iconClassName || "h-5 w-5 -mt-px"} ${isBusinessTime ? "text-primary" : ""}`;
  
  return (
    <div className="flex items-center justify-center gap-2">
      <PhaseIcon 
        phase={phase} 
        className={iconClasses} 
        aria-label={phase}
      />
      <div className="flex flex-col items-center">
        <h2 className={`${timeClassName || "font-mono tabular-nums leading-none text-2xl font-semibold"} ${isBusinessTime ? "text-accent-foreground" : ""}`}>
          {time}
        </h2>
        {weekend && (
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Weekend
          </span>
        )}
      </div>
    </div>
  );
}

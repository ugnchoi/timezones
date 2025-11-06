import { Moon, MoonStar, Sun, Sunrise, Sunset } from 'lucide-react'
import type { DayPhase } from '@/types'

export function PhaseIcon({ phase, className }: { phase: DayPhase; className?: string }) {
  const map = {
    sleep: Moon,
    early: Sunrise,
    day: Sun,
    evening: Sunset,
    night: MoonStar,
  } as const
  const Cmp = map[phase]
  return <Cmp aria-label={phase} className={className} />
}

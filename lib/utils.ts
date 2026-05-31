import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function bankersRound(value: number, decimals = 2) {
  if (!Number.isFinite(value)) return 0

  const factor = 10 ** decimals
  const scaled = value * factor
  const sign = scaled < 0 ? -1 : 1
  const absScaled = Math.abs(scaled)
  const floor = Math.floor(absScaled)
  const diff = absScaled - floor
  const epsilon = 1e-9

  let rounded = floor

  if (diff > 0.5 + epsilon) {
    rounded = floor + 1
  } else if (Math.abs(diff - 0.5) <= epsilon) {
    rounded = floor % 2 === 0 ? floor : floor + 1
  }

  return (sign * rounded) / factor
}

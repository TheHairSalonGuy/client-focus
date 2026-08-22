import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Progressively formats a US phone number as the visitor types, so a full
 * 10-digit entry lands as "(xxx) xxx-xxxx".
 *
 * Non-digits are stripped and input is capped at 10 digits, which keeps the
 * caret behaving predictably when the value is fed straight back into a
 * controlled input. Partial entries format as far as they can:
 *   "555"        -> "(555"
 *   "5551234"    -> "(555) 123"
 *   "5551234567" -> "(555) 123-4567"
 */
export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length < 4) return `(${digits}`
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

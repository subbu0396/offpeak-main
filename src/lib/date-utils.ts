import { formatDistanceToNow, format } from "date-fns"

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "d MMM yyyy")
}

export function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), "d MMM yyyy, HH:mm")
}

export function formatRelative(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function formatShortDate(dateStr: string): string {
  return format(new Date(dateStr), "dd/MM/yyyy")
}

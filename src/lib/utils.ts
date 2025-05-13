import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>
): void {
  const img = e.currentTarget;
  img.onerror = null; // Prevent infinite loop
  img.src = '/placeholder.jpg';
}
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to convert coordinates to city name
export const fetchCityName = async (lat: number, lng: number) => {
  if (!lat || !lng || isNaN(lat) || isNaN(lng)) return 'Unknown location';
  try {
    if (!process.env.NEXT_PUBLIC_OPENCAGE_API_KEY) {
      return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
    }
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}&q=${lat}%2C${lng}`
    );
    const data = await response.json();
    return data.results?.[0]?.components?.state || 'Unknown location';
  } catch (error) {
    console.warn('Geocoding notice (using coordinates fallback):', error);
    return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
  }
};

export function cleanText(text?: string | null | unknown) {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/\s?\(.*?\)/g, '').trim(); // Removes anything inside parentheses
}

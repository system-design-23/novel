import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(miliseconds) {
  let startTime = performance.now();
  while (performance.now() - startTime < miliseconds) {

  }
}

export function convertPreferenceToStyle(preferences) {
  if (!preferences) {
    return {};
  }
  return {
    ...preferences,
    fontSize: preferences.fontSize ? preferences.fontSize.toString() + 'px' : '16px',
    lineHeight: preferences.lineHeight ?? '1.5rem',
  };
}

export function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
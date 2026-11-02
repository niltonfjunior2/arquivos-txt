/**
 * Camada de Infraestrutura Client-Side: Controle de Tema (Claro / Escuro)
 * Mantém compatibilidade com 'json_tutorial_theme' e notifica todos os módulos ativos.
 */
import { playTone } from './audio.js';
import { showToast } from './sanitizer.js';

export const THEME_STORAGE_KEY = 'json_tutorial_theme';

let isDarkMode = true;
const themeSubscribers = [];

export function getIsDarkMode() {
  return isDarkMode;
}

export function onThemeChange(callback) {
  if (typeof callback === 'function') {
    themeSubscribers.push(callback);
  }
}

export function applyTheme(isDark) {
  isDarkMode = Boolean(isDark);
  const html = document.documentElement;
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');

  if (isDarkMode) {
    html.classList.add('dark');
    if (themeIcon) themeIcon.className = 'fa-solid fa-sun text-amber-300';
    if (themeLabel) themeLabel.innerText = 'Modo Claro';
  } else {
    html.classList.remove('dark');
    if (themeIcon) themeIcon.className = 'fa-solid fa-moon text-indigo-600';
    if (themeLabel) themeLabel.innerText = 'Modo Escuro';
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
  } catch {
    // Ignora falha de localStorage em modo restrito
  }

  themeSubscribers.forEach((cb) => cb(isDarkMode));
}

export function toggleTheme() {
  applyTheme(!isDarkMode);
  playTone(isDarkMode ? 'F5' : 'D5');
  showToast(isDarkMode ? 'Tema Escuro ativado' : 'Tema Claro com alto contraste ativado');
}

export function loadSavedTheme() {
  let savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
  } catch {
    savedTheme = 'dark';
  }
  applyTheme(savedTheme === 'dark');
}

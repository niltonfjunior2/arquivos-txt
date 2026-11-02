/**
 * Camada de Infraestrutura Client-Side: Síntese de Áudio (Tone.js)
 */
export const DEFAULT_NOTE = 'C5';

let isSoundMuted = false;
let synth = null;

export function getIsSoundMuted() {
  return isSoundMuted;
}

export function initAudio() {
  if (!synth && typeof Tone !== 'undefined') {
    try {
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.0, release: 0.1 },
      }).toDestination();
      synth.volume.value = -12;
    } catch {
      // Ignora caso Web Audio API esteja bloqueada pelo navegador
    }
  }
}

export function playTone(note = DEFAULT_NOTE) {
  if (isSoundMuted || typeof Tone === 'undefined') return;
  try {
    if (Tone.context && Tone.context.state !== 'running') {
      Tone.start();
    }
    initAudio();
    if (synth) synth.triggerAttackRelease(note, '16n');
  } catch {
    // Fallback silencioso
  }
}

export function toggleMute() {
  isSoundMuted = !isSoundMuted;
  const icon = document.getElementById('sound-icon');
  const label = document.getElementById('sound-label');
  if (icon && label) {
    if (isSoundMuted) {
      icon.className = 'fa-solid fa-volume-xmark text-slate-400';
      label.innerText = 'Som: Mudo';
    } else {
      icon.className = 'fa-solid fa-volume-high text-amber-500';
      label.innerText = 'Som: Ativo';
      playTone('E5');
    }
  }
  return isSoundMuted;
}

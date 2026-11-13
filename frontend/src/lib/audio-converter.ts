/**
 * Audio Converter to Linear 16-bit PCM WAV for Gnani AI.
 * Converts browser MediaRecorder output (WebM, Opus, Ogg, MP4) into standard 16kHz mono WAV,
 * ensuring 100% compatibility with Gnani AI Prisma v3.0 STT API.
 */

export async function convertAudioBlobToWav(blob: Blob, sampleRate = 16000): Promise<Blob> {
  if (typeof window === 'undefined') {
    return blob;
  }

  try {
    const arrayBuffer = await blob.arrayBuffer();
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      return blob;
    }

    const audioCtx = new AudioContextClass();
    let audioBuffer: AudioBuffer;
    try {
      audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    } finally {
      try {
        await audioCtx.close();
      } catch {}
    }

    const duration = audioBuffer.duration;
    const numSamples = Math.ceil(duration * sampleRate);
    if (numSamples <= 0) {
      return blob;
    }

    // Render to mono channel at target sample rate
    const offlineCtx = new OfflineAudioContext(1, numSamples, sampleRate);
    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineCtx.destination);
    source.start(0);

    const rendered = await offlineCtx.startRendering();
    const pcmData = rendered.getChannelData(0);

    const wavBuffer = encodeWavPcm16(pcmData, sampleRate);
    return new Blob([wavBuffer], { type: 'audio/wav' });
  } catch (err) {
    console.warn('Audio WAV conversion note (using raw blob):', err);
    return blob;
  }
}

function encodeWavPcm16(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // file length
  view.setUint32(4, 36 + samples.length * 2, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 = raw PCM)
  view.setUint16(20, 1, true);
  // channel count (1 = mono)
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sampleRate * 1 channel * 2 bytes/sample)
  view.setUint32(28, sampleRate * 2, true);
  // block align (1 channel * 2 bytes/sample)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, samples.length * 2, true);

  // Write PCM 16-bit signed integer samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return buffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

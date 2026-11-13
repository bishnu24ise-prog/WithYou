'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Pure helper: build a closed SVG path that approximates a sine wave.
// width: total path width, amplitude: wave height in px,
// wavelength: horizontal period in px, phase: horizontal offset in px,
// baseY: vertical centre of the wave within the viewBox.
function buildWavePath(
  width: number,
  amplitude: number,
  wavelength: number,
  phase: number,
  baseY: number,
  viewBoxHeight: number
): string {
  const points: string[] = [];
  const steps = Math.ceil(width / (wavelength / 4)) + 2;

  points.push(`M 0 ${baseY + amplitude}`);

  for (let i = 0; i <= steps; i++) {
    const x = i * (wavelength / 2);
    const y = baseY - Math.sin((i * Math.PI) + (phase * Math.PI * 2)) * amplitude;
    const cpX = x - wavelength / 4;
    const cpY = i % 2 === 0
      ? baseY - amplitude
      : baseY + amplitude;
    if (i === 0) {
      points.push(`Q ${cpX} ${cpY} ${x} ${y}`);
    } else {
      points.push(`Q ${x - wavelength / 4} ${cpY} ${x} ${y}`);
    }
  }

  // Close bottom of path
  points.push(`L ${width} ${viewBoxHeight}`);
  points.push(`L 0 ${viewBoxHeight}`);
  points.push('Z');

  return points.join(' ');
}

const VIEW_WIDTH = 1600;
const VIEW_HEIGHT = 400;

const WAVE_LAYERS = [
  {
    id: 'waveGrad1',
    amplitude: 18,
    wavelength: 260,
    phase: 0,
    baseY: 320,
    gradFrom: '#C32F6E',
    gradTo: '#54102C',
    driftDuration: 22,
    breathDuration: 14,
    opacityNormal: [0.10, 0.18, 0.10] as [number, number, number],
    opacityStatic: 0.14,
    yBreath: [0, -6, 0] as [number, number, number],
  },
  {
    id: 'waveGrad2',
    amplitude: 26,
    wavelength: 340,
    phase: 0.33,
    baseY: 350,
    gradFrom: '#F5EBE1',
    gradTo: '#E0538D',
    driftDuration: 26,
    breathDuration: 16,
    opacityNormal: [0.14, 0.22, 0.14] as [number, number, number],
    opacityStatic: 0.17,
    yBreath: [0, -6, 0] as [number, number, number],
  },
  {
    id: 'waveGrad3',
    amplitude: 14,
    wavelength: 200,
    phase: 0.66,
    baseY: 370,
    gradFrom: '#74173D',
    gradTo: '#220510',
    driftDuration: 18,
    breathDuration: 12,
    opacityNormal: [0.08, 0.15, 0.08] as [number, number, number],
    opacityStatic: 0.12,
    yBreath: [0, -6, 0] as [number, number, number],
  },
];

export default function WaterDropRipple() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
      aria-hidden="true"
      style={{ mixBlendMode: 'screen' }}
    >
      {WAVE_LAYERS.map((layer) => {
        const pathD = buildWavePath(
          VIEW_WIDTH,
          layer.amplitude,
          layer.wavelength,
          layer.phase,
          layer.baseY,
          VIEW_HEIGHT
        );

        return (
          <motion.svg
            key={layer.id}
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              width: '120%',
              left: '-10%',
              bottom: 0,
              height: '45vh',
            }}
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    x: ['0%', '-12%', '0%'],
                    y: layer.yBreath,
                    opacity: layer.opacityNormal,
                  }
            }
            initial={{
              x: '0%',
              y: 0,
              opacity: prefersReducedMotion ? layer.opacityStatic : layer.opacityNormal[0],
            }}
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    x: {
                      duration: layer.driftDuration,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatType: 'mirror',
                    },
                    y: {
                      duration: layer.breathDuration,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatType: 'mirror',
                    },
                    opacity: {
                      duration: layer.breathDuration,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatType: 'mirror',
                    },
                  }
            }
          >
            <defs>
              <linearGradient
                id={layer.id}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={layer.gradFrom} />
                <stop offset="100%" stopColor={layer.gradTo} />
              </linearGradient>
            </defs>
            <path
              d={pathD}
              fill={`url(#${layer.id})`}
            />
          </motion.svg>
        );
      })}
    </div>
  );
}

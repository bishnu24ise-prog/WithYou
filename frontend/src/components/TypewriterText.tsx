'use client';

import React, { useState, useEffect, useRef, ElementType } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  startDelay?: number;
  loop?: boolean;
  deleteAndRetype?: boolean;
  deleteSpeed?: number;
  pauseEnd?: number;
  caret?: boolean;
  caretClassName?: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export default function TypewriterText({
  text,
  speed = 45,
  startDelay = 0,
  loop = false,
  deleteAndRetype = false,
  deleteSpeed = 30,
  pauseEnd = 1500,
  caret = false,
  caretClassName = '',
  className = '',
  as: Tag = 'span',
}: TypewriterTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(prefersReducedMotion ? text : '');
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(text);
      return;
    }

    const minSpeed = Math.max(speed, 10);
    const minDeleteSpeed = Math.max(deleteSpeed, 10);
    let charIndex = 0;
    let deleting = false;
    let lastTime: number | null = null;
    let started = false;

    const tick = (now: number) => {
      if (!started) return;

      if (lastTime === null) {
        lastTime = now;
      }

      const elapsed = now - lastTime;
      const currentSpeed = deleting ? minDeleteSpeed : minSpeed;

      if (elapsed >= currentSpeed) {
        lastTime = now;

        if (!deleting) {
          charIndex = Math.min(charIndex + 1, text.length);
          setDisplayed(text.slice(0, charIndex));

          if (charIndex === text.length) {
            if (loop && deleteAndRetype) {
              // pause then start deleting
              timeoutRef.current = setTimeout(() => {
                deleting = true;
                rafRef.current = requestAnimationFrame(tick);
              }, pauseEnd);
              return;
            }
            // Done — stop looping
            return;
          }
        } else {
          charIndex = Math.max(charIndex - 1, 0);
          setDisplayed(text.slice(0, charIndex));

          if (charIndex === 0) {
            deleting = false;
            // Brief pause before retyping
            timeoutRef.current = setTimeout(() => {
              rafRef.current = requestAnimationFrame(tick);
            }, 300);
            return;
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const startDelaySafe = Math.max(startDelay, 0);

    timeoutRef.current = setTimeout(() => {
      started = true;
      rafRef.current = requestAnimationFrame(tick);
    }, startDelaySafe);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, startDelay, loop, deleteAndRetype, deleteSpeed, pauseEnd, prefersReducedMotion]);

  // The component renders an aria-hidden animated element plus a visually-hidden full text for screen readers
  const TagTyped = Tag as ElementType;

  return (
    <>
      <TagTyped aria-hidden="true" className={className}>
        {displayed}
        {caret && (
          prefersReducedMotion ? (
            <span
              aria-hidden="true"
              className={`inline-block w-[2px] h-[0.9em] bg-current align-middle ml-0.5 ${caretClassName}`}
            />
          ) : (
            <motion.span
              aria-hidden="true"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.06, ease: 'easeInOut', repeat: Infinity }}
              className={`inline-block w-[2px] h-[0.9em] bg-current align-middle ml-0.5 ${caretClassName}`}
            />
          )
        )}
      </TagTyped>
      <span className="sr-only">{text}</span>
    </>
  );
}

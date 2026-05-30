import React, { useEffect, useMemo, useState } from 'react';

const EMOJIS = ['😊', '😍', '😌', '😴', '😟', '😡', '🍏', '🍓', '🥑', '🌈', '🫐', '🍋'];

type EmojiSpec = { id: number; char: string; top: number; left: number; size: number; drift: number };

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

export default function FloatingEmojis() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const specs = useMemo<EmojiSpec[]>(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      char: EMOJIS[i % EMOJIS.length],
      top: randomBetween(5, 85),
      left: randomBetween(5, 90),
      size: randomBetween(18, 36),
      drift: randomBetween(1, 4),
    }));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {specs.map((s) => {
        const offsetX = ((mouse.x / window.innerWidth) - 0.5) * s.drift * 6;
        const offsetY = ((mouse.y / window.innerHeight) - 0.5) * s.drift * 6;
        return (
          <div
            key={s.id}
            className="floating-emoji"
            style={{
              position: 'absolute',
              top: `${s.top}%`,
              left: `${s.left}%`,
              fontSize: s.size,
              transform: `translate(${offsetX}px, ${offsetY}px)`,
              opacity: 0.85,
            }}
          >
            {s.char}
          </div>
        );
      })}
    </div>
  );
}
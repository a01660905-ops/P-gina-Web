'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const HEART_EMOJIS = ['💗', '💖', '💕', '💘', '💝', '💞', '💓', '❤️'];

export default function Home() {
  const arenaRef = useRef(null);
  const noBtnRef = useRef(null);
  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0, ready: false });
  const [hearts, setHearts] = useState([]);

  const spawnHearts = useCallback(() => {
    const total = 42;
    const nextHearts = Array.from({ length: total }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2.5 + Math.random() * 2,
      size: 16 + Math.random() * 26,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)]
    }));
    setHearts(nextHearts);
    window.setTimeout(() => setHearts([]), 4800);
  }, []);

  const moveNoButtonAway = useCallback((pointerX, pointerY) => {
    const arena = arenaRef.current;
    const btn = noBtnRef.current;
    if (!arena || !btn) {
      return;
    }

    const arenaRect = arena.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const currentCenterX = btnRect.left + btnRect.width / 2;
    const currentCenterY = btnRect.top + btnRect.height / 2;

    const dx = currentCenterX - pointerX;
    const dy = currentCenterY - pointerY;
    const distance = Math.hypot(dx, dy);
    const dangerZone = 130;

    if (distance > dangerZone) {
      return;
    }

    const pushX = dx / (distance || 1);
    const pushY = dy / (distance || 1);
    const extraJitter = () => (Math.random() - 0.5) * 30;

    const minX = 10;
    const minY = 10;
    const maxX = arenaRect.width - btnRect.width - 10;
    const maxY = arenaRect.height - btnRect.height - 10;

    const currentX = btnRect.left - arenaRect.left;
    const currentY = btnRect.top - arenaRect.top;

    const candidateX = currentX + pushX * 95 + extraJitter();
    const candidateY = currentY + pushY * 95 + extraJitter();

    setNoPos({
      x: Math.max(minX, Math.min(candidateX, maxX)),
      y: Math.max(minY, Math.min(candidateY, maxY)),
      ready: true
    });
  }, []);

  useEffect(() => {
    const placeNoButtonInitially = () => {
      const arena = arenaRef.current;
      const btn = noBtnRef.current;
      if (!arena || !btn) {
        return;
      }
      const arenaRect = arena.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setNoPos({
        x: Math.max((arenaRect.width - btnRect.width) / 2 + 90, 10),
        y: Math.max((arenaRect.height - btnRect.height) / 2 - 24, 10),
        ready: true
      });
    };

    placeNoButtonInitially();
    window.addEventListener('resize', placeNoButtonInitially);
    return () => window.removeEventListener('resize', placeNoButtonInitially);
  }, []);

  const onYesClick = () => {
    if (accepted) return;
    setAccepted(true);
    spawnHearts();
  };

  return (
    <main className="page">
      <section className="card" ref={arenaRef}>
        <p className="sparkle">✨💘✨</p>
        <h1>¿Quieres ser mi Valentín? 🥰</h1>
        <p className="subtitle">Prometo risas, abrazos y muchos momentos bonitos 💕😊</p>

        <div className="buttonArena" onMouseMove={(e) => moveNoButtonAway(e.clientX, e.clientY)}>
          <button className="btn yes" onClick={onYesClick}>
            Sí 💖
          </button>

          <button
            ref={noBtnRef}
            className="btn no"
            onMouseEnter={(e) => moveNoButtonAway(e.clientX, e.clientY)}
            onPointerDown={(e) => {
              e.preventDefault();
              moveNoButtonAway(e.clientX, e.clientY);
            }}
            style={noPos.ready ? { left: `${noPos.x}px`, top: `${noPos.y}px` } : undefined}
            aria-label="No"
            type="button"
          >
            No 🙈
          </button>
        </div>

        <div className={`result ${accepted ? 'show' : ''}`}>
          Best decision ever. Te amo. Prepárate para el desayuno del 14 de febrero. 💞☕🥐
        </div>
      </section>

      <div className="heartsLayer" aria-hidden>
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className="heart"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
              fontSize: `${heart.size}px`
            }}
          >
            {heart.emoji}
          </span>
        ))}
      </div>
    </main>
  );
}

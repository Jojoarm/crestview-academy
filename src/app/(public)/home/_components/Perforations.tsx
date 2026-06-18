'use client';

import { useRef, useEffect, useState } from 'react';

export function Perforations() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(28);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      // each perforation is w-2.5 (10px) + gap-1.75 (7px) = 17px per slot
      const slotWidth = 10 + 7;
      setCount(Math.floor(containerWidth / slotWidth));
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center gap-1.75 px-2 overflow-hidden"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-2.5 h-3.5 rounded-xs bg-card/50 shrink-0" />
      ))}
    </div>
  );
}

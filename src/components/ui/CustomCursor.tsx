'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverTarget, setHoverTarget] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const updateMousePosition = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const navLink = target.closest('.nav-link') as HTMLElement;
      if (navLink) {
        setHoverTarget(navLink.getBoundingClientRect());
        setIsHovering(true);
        return;
      } else {
        setHoverTarget(null);
      }

      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('interactive') ||
        target.closest('.interactive')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  // ── Position & size ──────────────────────────────────────────────────────
  let x = mousePosition.x - (isHovering ? 20 : 6);
  let y = mousePosition.y - (isHovering ? 20 : 6);
  let width = isHovering ? 40 : 12;
  let height = isHovering ? 40 : 12;
  let borderRadius = '50%';

  if (hoverTarget) {
    x = hoverTarget.left;
    y = hoverTarget.top;
    width = hoverTarget.width;
    height = hoverTarget.height;
    borderRadius = '9999px';
  }

  return (
    <>
      {/* ── Glass pill: snap to nav-link, NO blur (text must stay readable) ── */}
      {hoverTarget && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.10)',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            boxShadow:
              '0 2px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.20)',
            // NO backdropFilter — blur destroys text readability
          }}
          animate={{ x, y, width, height }}
          transition={{
            x: { type: 'spring', damping: 28, stiffness: 280 },
            y: { type: 'spring', damping: 28, stiffness: 280 },
            width: { type: 'spring', damping: 30, stiffness: 300, mass: 0.5 },
            height: { type: 'spring', damping: 30, stiffness: 300, mass: 0.5 },
          }}
        />
      )}

      {/* ── Dot / hover ring: mix-blend-difference = always readable ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          backgroundColor: isHovering && !hoverTarget ? 'transparent' : 'rgba(255,255,255,1)',
          border: isHovering && !hoverTarget ? '1.5px solid rgba(255,255,255,1)' : 'none',
          borderRadius,
        }}
        animate={{
          x: mousePosition.x - (isHovering && !hoverTarget ? 20 : 6),
          y: mousePosition.y - (isHovering && !hoverTarget ? 20 : 6),
          width: isHovering && !hoverTarget ? 40 : 12,
          height: isHovering && !hoverTarget ? 40 : 12,
        }}
        transition={{
          x: { type: 'tween', duration: 0 },
          y: { type: 'tween', duration: 0 },
          width: { type: 'spring', damping: 30, stiffness: 300, mass: 0.5 },
          height: { type: 'spring', damping: 30, stiffness: 300, mass: 0.5 },
        }}
      >
        {isHovering && !hoverTarget && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full rounded-full bg-white"
          />
        )}
      </motion.div>
    </>
  );
}

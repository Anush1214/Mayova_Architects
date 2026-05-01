'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverTarget, setHoverTarget] = useState<DOMRect | null>(null);

  useEffect(() => {
    // Only show custom cursor on devices with a mouse
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

  // Determine styles and position
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
    borderRadius = '9999px'; // pill shape
  }

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center mix-blend-difference"
      style={{
        backgroundColor: isHovering ? 'transparent' : 'rgba(255, 255, 255, 1)',
        border: isHovering ? '1.5px solid rgba(255, 255, 255, 1)' : 'none',
        borderRadius,
      }}
      animate={{
        x,
        y,
        width,
        height,
      }}
      transition={{
        x: { type: hoverTarget ? 'spring' : 'tween', duration: hoverTarget ? undefined : 0, damping: 25, stiffness: 300 },
        y: { type: hoverTarget ? 'spring' : 'tween', duration: hoverTarget ? undefined : 0, damping: 25, stiffness: 300 },
        width: { type: 'spring', damping: 30, stiffness: 300, mass: 0.5 },
        height: { type: 'spring', damping: 30, stiffness: 300, mass: 0.5 },
      }}
    >
      {isHovering && !hoverTarget && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-1.5 h-1.5 bg-white rounded-full" 
        />
      )}
    </motion.div>
  );
}

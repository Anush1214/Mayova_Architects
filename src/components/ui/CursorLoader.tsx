'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Desktop-only component — dynamic import with ssr:false
const Cursor = dynamic(() => import('./CustomCursor'), { ssr: false });

export default function CursorLoader() {
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    // Only load the cursor on devices with a fine pointer (mouse/trackpad)
    setIsFinePointer(window.matchMedia('(pointer: fine)').matches);
  }, []);

  if (!isFinePointer) return null;
  return <Cursor />;
}

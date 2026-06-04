'use client';

import dynamic from 'next/dynamic';

// Desktop-only component — dynamic import with ssr:false
// prevents loading on mobile (CustomCursor checks for pointer:coarse internally)
const Cursor = dynamic(() => import('./CustomCursor'), { ssr: false });

export default function CursorLoader() {
  return <Cursor />;
}

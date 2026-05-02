'use client'

import dynamic from 'next/dynamic'

const StudioPage = dynamic(
  () => import('next-sanity/studio').then((mod) => {
    const { NextStudio } = mod
    // Dynamically import config only on the client
    return import('../../../../sanity.config').then((configMod) => {
      return function Studio() {
        return <NextStudio config={configMod.default} />
      }
    })
  }),
  { ssr: false, loading: () => <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#101112', color: '#fff', fontFamily: 'system-ui' }}>Loading Studio…</div> }
)

export default function StudioRoute() {
  return <StudioPage />
}

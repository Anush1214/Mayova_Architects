'use client';

import { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LETTERS = ['M', 'A', 'Y', 'O', 'V', 'A'];

const FORMED_POSITIONS = [
  { x: -4.8, y: -0.5, z: 0 },
  { x: -2.8, y: -0.5, z: 0 },
  { x: -1.0, y: -0.5, z: 0 },
  { x: 0.8, y: -0.5, z: 0 },
  { x: 2.8, y: -0.5, z: 0 },
  { x: 4.5, y: -0.5, z: 0 },
];

const SCATTERED_INITIAL = [
  { x: -8, y: 5, z: -4, rotX: 0.8, rotY: -1.2, rotZ: 0.5 },
  { x: 6, y: -4, z: -6, rotX: -0.6, rotY: 0.9, rotZ: -0.3 },
  { x: -3, y: 7, z: -3, rotX: 1.1, rotY: -0.5, rotZ: 0.7 },
  { x: 7, y: 3, z: -5, rotX: -0.9, rotY: 1.3, rotZ: -0.6 },
  { x: -6, y: -5, z: -4, rotX: 0.4, rotY: -0.8, rotZ: 1.0 },
  { x: 4, y: 6, z: -7, rotX: -1.0, rotY: 0.6, rotZ: -0.4 },
];

const SCATTER_OUT = [
  { x: -14, y: 6, z: -10, rotX: 1.2, rotY: -2.5, rotZ: 0.6 },
  { x: 12, y: -8, z: -12, rotX: -1.0, rotY: 2.0, rotZ: -0.5 },
  { x: -2, y: 14, z: -8, rotX: 2.5, rotY: 0.3, rotZ: 1.5 },
  { x: -13, y: -6, z: -11, rotX: -0.6, rotY: -1.8, rotZ: 0.4 },
  { x: 10, y: 10, z: -9, rotX: 0.8, rotY: 2.8, rotZ: -1.2 },
  { x: 15, y: -2, z: -14, rotX: -1.8, rotY: 0.5, rotZ: -0.7 },
];

interface LetterProxy {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  opacity: number;
}

// ===== Camera Rig =====
function CameraRig({ target }: { target: React.RefObject<{ x: number; y: number; z: number }> }) {
  useFrame(({ camera }) => {
    if (!target.current) return;
    camera.position.x += (target.current.x - camera.position.x) * 0.04;
    camera.position.y += (target.current.y - camera.position.y) * 0.04;
    camera.position.z += (target.current.z - camera.position.z) * 0.04;
    camera.lookAt(0, -0.3, 0);
  });
  return null;
}

// ===== Single 3D Letter =====
function AnimatedLetter({ letter, proxy, font }: { letter: string; proxy: LetterProxy; font: Font }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const geometry = useMemo(() => new TextGeometry(letter, {
    font,
    size: 1.4,
    depth: 0.35,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.015,
    bevelOffset: 0,
    bevelSegments: 5,
  }), [letter, font]);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.set(proxy.x, proxy.y, proxy.z);
    meshRef.current.rotation.set(proxy.rotX, proxy.rotY, proxy.rotZ);
    if (matRef.current) matRef.current.opacity = proxy.opacity;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow>
      <meshStandardMaterial
        ref={matRef}
        color="#D5C8BB"
        metalness={0.15}
        roughness={0.55}
        envMapIntensity={0.8}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

// ===== Letters + Animation Controller =====
function LettersWithAnimation({
  proxies,
  cameraTargetRef,
  onAssemblyComplete,
}: {
  proxies: LetterProxy[];
  cameraTargetRef: React.RefObject<{ x: number; y: number; z: number }>;
  onAssemblyComplete: () => void;
}) {
  const font = useLoader(FontLoader, '/fonts/optimer_regular.typeface.json');
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  // Store callback in ref to avoid re-triggering the effect
  const onCompleteRef = useRef(onAssemblyComplete);
  useEffect(() => {
    onCompleteRef.current = onAssemblyComplete;
  }, [onAssemblyComplete]);
  const hasRun = useRef(false);

  // Start animation exactly once when this component mounts (font is loaded)
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Reset proxies to scattered positions
    LETTERS.forEach((_, i) => {
      proxies[i].x = SCATTERED_INITIAL[i].x;
      proxies[i].y = SCATTERED_INITIAL[i].y;
      proxies[i].z = SCATTERED_INITIAL[i].z;
      proxies[i].rotX = SCATTERED_INITIAL[i].rotX;
      proxies[i].rotY = SCATTERED_INITIAL[i].rotY;
      proxies[i].rotZ = SCATTERED_INITIAL[i].rotZ;
      proxies[i].opacity = 1;
    });
    if (cameraTargetRef.current) {
      cameraTargetRef.current.x = 0;
      cameraTargetRef.current.y = 0.5;
      cameraTargetRef.current.z = 10.5;
    }

    // Create the assembly timeline
    const tl = gsap.timeline({
      delay: 0.8,
      onComplete: () => {
        onCompleteRef.current();
      },
    });
    tlRef.current = tl;

    // Each letter flies to its formed position
    LETTERS.forEach((_, i) => {
      tl.to(proxies[i], {
        x: FORMED_POSITIONS[i].x,
        y: FORMED_POSITIONS[i].y,
        z: FORMED_POSITIONS[i].z,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        duration: 2.5,
        ease: 'power3.inOut',
      }, i * 0.15);
    });

    // Camera push-in
    tl.to(cameraTargetRef.current, {
      x: 0, y: 0, z: 9,
      duration: 3.5,
      ease: 'power2.inOut',
    }, 0);

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {LETTERS.map((letter, index) => (
        <AnimatedLetter
          key={`letter-${index}`}
          letter={letter}
          proxy={proxies[index]}
          font={font}
        />
      ))}
    </>
  );
}

// ===== Main Scene =====
function Scene({
  proxies,
  cameraTargetRef,
  onAssemblyComplete,
}: {
  proxies: LetterProxy[];
  cameraTargetRef: React.RefObject<{ x: number; y: number; z: number }>;
  onAssemblyComplete: () => void;
}) {
  return (
    <>
      <CameraRig target={cameraTargetRef} />
      <ambientLight intensity={0.35} color="#FFF8F0" />
      <directionalLight position={[8, 12, 6]} intensity={1.0} color="#FFF5E6" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-5, 8, -4]} intensity={0.25} color="#E8DDD3" />
      <pointLight position={[0, -2, 8]} intensity={0.15} color="#C9A96E" distance={20} />
      <Environment preset="studio" environmentIntensity={0.35} />

      <Suspense fallback={null}>
        <LettersWithAnimation
          proxies={proxies}
          cameraTargetRef={cameraTargetRef}
          onAssemblyComplete={onAssemblyComplete}
        />
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <shadowMaterial opacity={0.08} />
      </mesh>
    </>
  );
}

// ===== Exported Component =====
interface HeroSceneProps {
  onReady: () => void;
}

export default function HeroScene({ onReady }: HeroSceneProps) {
  const [isClient, setIsClient] = useState(false);
  const assemblyDone = useRef(false);

  const proxies = useMemo(() => 
    LETTERS.map((_, i) => ({
      x: SCATTERED_INITIAL[i].x,
      y: SCATTERED_INITIAL[i].y,
      z: SCATTERED_INITIAL[i].z,
      rotX: SCATTERED_INITIAL[i].rotX,
      rotY: SCATTERED_INITIAL[i].rotY,
      rotZ: SCATTERED_INITIAL[i].rotZ,
      opacity: 1,
    })),
  []);

  const cameraTargetRef = useRef({ x: 0, y: 0.5, z: 10.5 });

  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleAssemblyComplete = () => {
    assemblyDone.current = true;
    onReady();
  };

  // Scroll scatter — starts after assembly
  useEffect(() => {
    if (!isClient) return;

    let ctx: gsap.Context | null = null;
    const checkInterval = setInterval(() => {
      if (!assemblyDone.current) return;
      clearInterval(checkInterval);

      // Wait a tick for GSAP pin to be set up by ScrollContainer
      requestAnimationFrame(() => {
        // Find the pin-spacer wrapper that GSAP creates, or fallback
        const scrollSection = document.getElementById('scroll-section');
        const trigger = scrollSection?.closest('.pin-spacer') || scrollSection || document.body;

        ctx = gsap.context(() => {
          const scatterTl = gsap.timeline({
            scrollTrigger: {
              trigger: trigger,
              start: 'top top',
              end: '+=600',  // scatter completes quickly
              scrub: 1,
            },
          });

          LETTERS.forEach((_, i) => {
            const segStart = i / LETTERS.length;
            const segDur = 0.85 / LETTERS.length;

            scatterTl.to(proxies[i], {
              x: SCATTER_OUT[i].x, y: SCATTER_OUT[i].y, z: SCATTER_OUT[i].z,
              rotX: SCATTER_OUT[i].rotX, rotY: SCATTER_OUT[i].rotY, rotZ: SCATTER_OUT[i].rotZ,
              duration: segDur, ease: 'power2.inOut',
            }, segStart);

            scatterTl.to(proxies[i], {
              opacity: 0, duration: segDur * 0.6, ease: 'power2.in',
            }, segStart + segDur * 0.4);
          });

          scatterTl.to(cameraTargetRef.current, {
            y: -0.3, z: 11.5, duration: 1, ease: 'none',
          }, 0);
        });
      });
    }, 200);

    return () => {
      clearInterval(checkInterval);
      if (ctx) ctx.revert();
    };
  }, [isClient, proxies]);

  if (!isClient) return null;

  return (
    <div className="canvas-container interactive">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.5, 10.5], fov: 45, near: 0.1, far: 100 }}
        shadows
        frameloop="always"
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        style={{ background: 'transparent' }}
      >
        <Scene
          proxies={proxies}
          cameraTargetRef={cameraTargetRef}
          onAssemblyComplete={handleAssemblyComplete}
        />
      </Canvas>
    </div>
  );
}

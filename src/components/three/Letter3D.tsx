'use client';

import { useRef, useMemo, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D } from '@react-three/drei';
import * as THREE from 'three';

export interface LetterProxy {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  opacity: number;
}

interface Letter3DProps {
  letter: string;
  proxy: LetterProxy;
  color?: string;
  fontPath?: string;
}

const Letter3D = forwardRef<THREE.Mesh, Letter3DProps>(
  (
    {
      letter,
      proxy,
      color = '#D5C8BB',
      fontPath = '/fonts/optimer_regular.typeface.json',
    },
    ref
  ) => {
    const internalRef = useRef<THREE.Mesh>(null);
    const meshRef = (ref as React.RefObject<THREE.Mesh | null>) || internalRef;
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);

    const materialProps = useMemo(
      () => ({
        color: new THREE.Color(color),
        metalness: 0.15,
        roughness: 0.55,
        envMapIntensity: 0.8,
      }),
      [color]
    );

    useFrame(() => {
      if (!meshRef.current) return;
      const mesh = meshRef.current;

      // Directly set position from proxy — GSAP drives the values
      mesh.position.set(proxy.x, proxy.y, proxy.z);
      mesh.rotation.set(proxy.rotX, proxy.rotY, proxy.rotZ);

      if (materialRef.current) {
        materialRef.current.opacity = proxy.opacity;
      }
    });

    return (
      <mesh ref={meshRef} castShadow receiveShadow>
        <Text3D
          font={fontPath}
          size={1.4}
          height={0.35}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.025}
          bevelSize={0.015}
          bevelOffset={0}
          bevelSegments={5}
        >
          {letter}
          <meshStandardMaterial
            ref={materialRef}
            {...materialProps}
            transparent
            opacity={1}
          />
        </Text3D>
      </mesh>
    );
  }
);

Letter3D.displayName = 'Letter3D';

export default Letter3D;

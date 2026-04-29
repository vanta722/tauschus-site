"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { Suspense } from "react";

export type ImmersiveMode = "lionx" | "wuntoo" | "fca";

type Props = {
  mode: ImmersiveMode;
  quality?: "low" | "med" | "high";
  interactive?: boolean;
};

const modeColor: Record<ImmersiveMode, string> = {
  lionx: "#7C3AED",
  wuntoo: "#D4AF37",
  fca: "#F97316",
};

function SceneObjects({ mode }: { mode: ImmersiveMode }) {
  const color = modeColor[mode];
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 4, 3]} intensity={1.3} color={color} />
      <directionalLight position={[-4, -2, -2]} intensity={0.6} color="#ffffff" />
      <Stars radius={120} depth={80} count={2500} factor={3} saturation={0} fade speed={0.4} />

      <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1.1}>
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.25} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      </Float>

      <Float speed={2.1} rotationIntensity={1.6} floatIntensity={1.3}>
        <mesh position={[-2.7, 1.2, -1.5]}>
          <torusKnotGeometry args={[0.45, 0.14, 120, 18]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.55} roughness={0.3} />
        </mesh>
      </Float>

      <Float speed={1.2} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh position={[2.6, -1.1, -1.2]}>
          <dodecahedronGeometry args={[0.65, 0]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
    </>
  );
}

export default function ImmersiveScene({ mode, quality = "med", interactive = true }: Props) {
  const low = quality === "low";
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 7], fov: 55 }} dpr={low ? [1, 1] : [1, 2]}>
        <Suspense fallback={null}>
          <SceneObjects mode={mode} />
          {!low && (
            <EffectComposer>
              <Bloom intensity={0.55} luminanceThreshold={0.3} />
              <Noise opacity={quality === "high" ? 0.035 : 0.02} />
              <Vignette eskil={false} offset={0.2} darkness={0.85} />
            </EffectComposer>
          )}
          {interactive ? <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.2} /> : null}
        </Suspense>
      </Canvas>
    </div>
  );
}

import React, { Suspense, useState } from "react";

import { BakeShadows, CameraControls, Loader, MeshReflectorMaterial } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer, Scanline, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Perf } from "r3f-perf";

import { Computers } from "./components/Computers";
import { Instances } from "./context/MeshContext";

export const ComputerScene: React.FC = () => {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0.63, -0.67, 3.66], fov: 45, near: 0.5, far: 20 }}
      eventPrefix="client">
      <Suspense fallback={null}>
        {/* {process.env.NODE_ENV === "development" && <Perf showGraph={false} position="top-left" />} */}
        {/* Lights */}
        <color attach="background" args={["black"]} />
        {/* <hemisphereLight intensity={0.05} groundColor="black" /> */}
        <hemisphereLight intensity={0.02} groundColor="black" />
        <spotLight position={[10, 20, 20]} angle={0.08} penumbra={1} intensity={0.8} castShadow shadow-mapSize={1024} />
        {/* Main scene */}
        <group position={[-0, -1, 0]}>
          <Instances>
            <Computers scale={0.5} />
          </Instances>

          {/* Plane reflections + distance blur */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
              blur={[300, 30]}
              resolution={2048}
              mixBlur={1}
              mixStrength={80}
              roughness={5}
              depthScale={1.3}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#202020"
              metalness={0.8}
              mirror={0}
            />
          </mesh>
        </group>
        {/* Postprocessing */}
        <EffectComposer disableNormalPass>
          {/* <Scanline opacity={0.1} /> */}
          <Bloom luminanceThreshold={0.3} mipmapBlur luminanceSmoothing={0.2} intensity={2} />
          {/* <Glitch
          delay={[1, 10]} // min and max glitch delay
          duration={[0.05, 0.1]} // min and max glitch duration
          strength={[0.3, 0.7]} // min and max glitch strength
          mode={GlitchMode.SPORADIC} // glitch mode
          active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
          ratio={0.85} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
        /> */}

          {/* <DepthOfField target={[0, 0, 11]} focalLength={0.05} bokehScale={5} height={700} /> */}
          {/* <DepthOfField target={[0, 0, 6.5]} focalLength={0.1} bokehScale={5} height={200} /> */}
          <Vignette
            offset={0} // vignette offset
            darkness={0.5} // vignette darkness
            eskil={false} // Eskil's vignette technique
            blendFunction={BlendFunction.NORMAL} // blend mode
          />
        </EffectComposer>
        {/* <CameraControls makeDefault /> */}
        {/* Small helper that freezes the shadows for better performance */}
        <BakeShadows />
      </Suspense>
    </Canvas>
  );
};

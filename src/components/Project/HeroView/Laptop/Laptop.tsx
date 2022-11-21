/* eslint-disable @typescript-eslint/no-explicit-any */
// Disabling any for this file, since types has changed in current update of drei.
import React, { Suspense, useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";

import { Box } from "@mui/material";
import { ContactShadows, Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, Vector3, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { Project } from "../../../../types/Project";
import ProjectSlideshow from "./ProjectSlideshow/ProjectSlideshow";

interface LaptopProps {
  project?: Project;
}

const Laptop: React.FC<LaptopProps> = ({ project }) => {
  return (
    <Canvas camera={{ position: [0, 0, -25], fov: 55 }}>
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Suspense fallback={null}>
        <group rotation={[0, Math.PI / 1.2, 0]} position={[-8, 0, 0]} scale={[1.2, 1.2, 1.2]}>
          <Model project={project} />
        </group>
        <Environment preset="city" />
      </Suspense>
      <ContactShadows position={[0, -4.5, 0]} scale={30} blur={2} far={4.5} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
};

interface ModelProps {
  position?: Vector3;
  project?: Project;
}

function Model({ position, project }: ModelProps) {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [isTrackPadHover, setIsTrackPadHover] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const group = useRef<THREE.Group>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load model
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore next-line
  const { nodes, materials } = useGLTF("/mac-draco.glb");

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  // Make it float and follow mouse
  useFrame(state => {
    if (group.current) {
      const t = state.clock.getElapsedTime();
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -state.mouse.y / 15 + Math.cos(t / 2) / 20 + 0.25,
        0.1,
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        (state.mouse.x + Math.sin(t / 4)) / 15,
        0.1,
      );
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, Math.sin(t / 8) / 20, 0.1);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, (-1.5 + Math.sin(t / 2)) / 2, 0.1);
    }
  });

  useEffect(() => {
    if (isTrackPadHover) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
  }, [isTrackPadHover]);

  useEffect(() => {
    if (project && currentImage === project?.images.length) {
      setCurrentImage(0);
    }

    resetTimeout();

    const ref = setTimeout(
      () => setCurrentImage(prevIndex => (project && prevIndex === project?.images.length ? 0 : prevIndex + 1)),
      3000,
    );

    timeoutRef.current = ref;

    return () => {
      resetTimeout();
    };
  }, [currentImage, project, project?.images.length]);

  return (
    <group ref={group} dispose={null}>
      <group rotation-x={-0.425} position={[0, -0.04, 0.41]}>
        <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh material={materials.aluminium} geometry={(nodes["Cube008"] as any).geometry} />
          <mesh material={materials["matte.001"]} geometry={(nodes["Cube008_1"] as any).geometry} />
          <mesh geometry={(nodes["Cube008_2"] as any).geometry}>
            <Html className="slideshow-content" rotation-x={-Math.PI / 2} position={[0, 0.05, -0.09]} transform occlude>
              {!showEasterEgg ? (
                <ProjectSlideshow project={project} currentImage={currentImage} setCurrentImage={setCurrentImage} />
              ) : (
                <YouTube
                  iframeClassName="slideshow-content"
                  opts={{
                    playerVars: {
                      autoplay: 1,
                    },
                  }}
                  videoId="dQw4w9WgXcQ"
                />
              )}
            </Html>
          </mesh>
        </group>
      </group>
      <mesh material={materials.keys} geometry={(nodes.keyboard as any).geometry} position={[1.79, 0, 3.45]} />
      <group position={[0, -0.1, 3.39]}>
        <mesh material={materials.aluminium} geometry={(nodes["Cube002"] as any).geometry} />
        <mesh
          onPointerOver={() => setIsTrackPadHover(true)}
          onPointerLeave={() => setIsTrackPadHover(false)}
          onClick={() => setCurrentImage(prev => prev + 1)}
          material={materials.trackpad}
          geometry={(nodes["Cube002_1"] as any).geometry}
          onDoubleClick={() => setShowEasterEgg(prev => !prev)}
        />
      </group>
      <mesh material={materials.touchbar} geometry={(nodes.touchbar as any).geometry} position={[0, -0.03, 1.2]} />
    </group>
  );
}

export default Laptop;

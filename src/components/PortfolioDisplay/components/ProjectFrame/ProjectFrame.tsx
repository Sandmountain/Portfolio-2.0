import React, { Dispatch, MutableRefObject, SetStateAction, useRef, useState } from "react";

import { Html, useCursor } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useSnapshot } from "valtio";

import { ProjectResourceOverlay } from "../../HorizontalDisplay/components/ProjectResourceOverlay";
import { GOLDENRATIO, state } from "../../PortfolioView";

interface FrameProps {
  url: string;
  focused: boolean;
  id: string;
  c?: THREE.Color;

  mode?: "horizontal" | "grid";
}

export const ProjectFrame: React.FC<FrameProps> = ({
  url,
  id,
  focused,
  c = new THREE.Color(),
  mode = "horizontal",

  ...props
}) => {
  const [hovered, setHovered] = useState(false);
  const [rnd] = useState(() => Math.random());
  const image = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(null);
  const imgTextRef = useRef<THREE.MeshBasicMaterial>(null);
  const frame = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(null);
  const project = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(null);

  const snap = useSnapshot(state);
  const imageTexture = useLoader(THREE.TextureLoader, url);

  useCursor(hovered);
  useFrame((_state, delta) => {
    if (project?.current?.scale && mode !== "grid") {
      // Make project scale slowly instead of immediately
      if (focused) {
        project.current.scale.x = THREE.MathUtils.damp(project.current.scale.x, 1.2, 6, delta);
        project.current.scale.y = THREE.MathUtils.damp(project.current.scale.y, 1.2, 6, delta);

        const zoomLevel = 0.9 - Math.sin(rnd * 10000 + _state.clock.elapsedTime / 6) / 12;

        imgTextRef.current?.map?.repeat.set(
          THREE.MathUtils.damp(imgTextRef.current?.map?.repeat.x, zoomLevel, 6, delta),
          THREE.MathUtils.damp(imgTextRef.current?.map?.repeat.y, zoomLevel, 6, delta),
        );
      } else {
        project.current.scale.x = THREE.MathUtils.damp(project.current.scale.x, 1, 6, delta);
        project.current.scale.y = THREE.MathUtils.damp(project.current.scale.y, 1, 6, delta);

        imgTextRef.current?.map?.repeat.set(
          THREE.MathUtils.damp(imgTextRef.current?.map?.repeat.x, 1, 6, delta),
          THREE.MathUtils.damp(imgTextRef.current?.map?.repeat.y, 1, 6, delta),
        );
      }
    }

    if (frame.current) {
      if (focused && !hovered) {
        (frame.current.material as unknown as THREE.MeshBasicMaterial)?.color.lerp(c.set("#00A6FB"), 0.1);
      } else if (!focused && !hovered) {
        (frame.current.material as unknown as THREE.MeshBasicMaterial)?.color.lerp(c.set("white"), 0.1);
      } else {
        (frame.current.material as unknown as THREE.MeshBasicMaterial)?.color.lerp(c.set("#00A6FB"), 0.1);
      }
    }
  });

  return (
    <group {...props}>
      <mesh ref={project}>
        <mesh
          name={id}
          onPointerOver={e => (e.stopPropagation(), setHovered(true))}
          onPointerOut={() => setHovered(false)}
          scale={[1.05 * GOLDENRATIO, 1.075, 0.05]}
          position={[0, GOLDENRATIO / 2, 0.67]}>
          <boxGeometry />
          <meshStandardMaterial color="#8f8f8f" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        </mesh>

        <mesh ref={image} raycast={() => null} scale={[GOLDENRATIO, 1, 0.6]} position={[0, GOLDENRATIO / 2, 0.7]}>
          <planeBufferGeometry attach="geometry" />
          <meshBasicMaterial ref={imgTextRef} attach="material" map={imageTexture} fog={false} />
        </mesh>
        {focused && (
          <Html
            scale={100}
            raycast={() => null}
            position={[-GOLDENRATIO / 1.99, GOLDENRATIO / 1.277, 0.69]}
            zIndexRange={[200, 300]}>
            <div
              onMouseEnter={() => {
                if (snap.currentView === "grid") state.isFrameLocked = true;
              }}
              onMouseLeave={() => {
                if (snap.currentView === "grid") state.isFrameLocked = false;
              }}
              className={`${focused ? "show-on-delay" : "hidden"} clickable`}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "end",
                opacity: 0,
                animation: "fade-in 0.4s ease-in forwards",
                animationDelay: "0", //"0.4s",
                transition: "height, width 0.1s ease-in",
                minWidth: "500px",
              }}>
              <ProjectResourceOverlay
                projects={JSON.parse(JSON.stringify(state.projectsData))}
                projectId={snap.currentProject?.id}
                dialog={true}
              />
            </div>
          </Html>
        )}

        <mesh
          ref={frame}
          raycast={() => null}
          scale={[1.05 * GOLDENRATIO, 1.075, 0]}
          position={[0, GOLDENRATIO / 2, 0.699]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
      </mesh>
    </group>
  );
};

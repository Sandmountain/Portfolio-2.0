import React, { useContext, useEffect, useRef, useState } from "react";

import { PerspectiveCamera, RenderTexture, Text } from "@react-three/drei";
import { GroupProps, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { MeshContext } from "../../context/MeshContext";

interface IVideoNoice extends GroupProps {
  frame: string;
  panel: string;
  x?: number;
  y?: number;
}

const VideoNoice: React.FC<IVideoNoice> = ({ frame, panel, x = 0, y = 0, ...props }) => {
  const { nodes, materials } = useContext(MeshContext);
  const [video] = useState(() =>
    Object.assign(document.createElement("video"), {
      src: "/video.mp4",
      crossOrigin: "Anonymous",
      loop: true,
      muted: true,
    }),
  );

  useEffect(() => void video.play(), [video]);
  const textRef = useRef<THREE.MeshBasicMaterial | null>(null);

  useFrame(state => {
    if (!textRef.current) return;
    const rand = Math.random();
    if (rand > 0.4) {
      textRef.current.opacity = THREE.MathUtils.lerp(textRef.current.opacity, 2, 0.1);
    } else {
      textRef.current.opacity = THREE.MathUtils.lerp(textRef.current.opacity, 8, 0.1);
    }
  });

  return (
    <group {...props}>
      <mesh castShadow receiveShadow geometry={nodes[frame].geometry} material={materials.Texture} />

      <mesh geometry={nodes[panel].geometry} castShadow receiveShadow>
        <meshBasicMaterial toneMapped={true} ref={textRef} transparent>
          <videoTexture attach="map" args={[video]} encoding={THREE.sRGBEncoding} />
        </meshBasicMaterial>
      </mesh>
    </group>
  );
};

export default VideoNoice;

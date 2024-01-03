import React from "react";

import { SpringValue } from "@react-spring/three";
import { MeshReflectorMaterial, Reflector, useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

import { theme } from "../../../../theme/mui-theme";

interface GroundProps {
  opacity?: SpringValue<number>;
}

const Ground: React.FC<GroundProps> = ({ opacity }) => {
  const normal = useLoader(THREE.TextureLoader, "/SurfaceImperfections003_1K_Normal.jpg");
  const floor = useLoader(THREE.TextureLoader, "/SurfaceImperfections003_1K_var1.jpg");

  return (
    <group position={[0, 0.11, 2.5]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[100, 0.5, 0.2]} />
        {/* Shelf  */}
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={0.5}
          mixStrength={2}
          roughness={1}
          depthScale={1.5}
          minDepthThreshold={0.2}
          maxDepthThreshold={1.6}
          color="#101010"
          metalness={0.8}
          normalMap={normal}
          roughnessMap={floor}
          opacity={1}
          transparent
          mirror={1}
        />
      </mesh>
      {/* Silver border */}
      <mesh position={[0, 0.1, 0.26]} rotation={[0, 0, 0]}>
        <boxGeometry args={[100, 0.01, 0.01]} />
        <MeshReflectorMaterial
          resolution={1}
          mixBlur={0.5}
          mixStrength={2}
          roughness={1}
          depthScale={1.5}
          color={"#FFF"}
          metalness={0}
          opacity={1}
          transparent
          mirror={0.8}
        />
      </mesh>
    </group>
  );
};

export default Ground;

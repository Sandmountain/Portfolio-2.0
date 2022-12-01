import React from "react";

import { SpringValue } from "@react-spring/three";
import { MeshReflectorMaterial } from "@react-three/drei";

interface GroundProps {
  opacity?: SpringValue<number>;
}

const Ground: React.FC<GroundProps> = ({ opacity }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
      <planeGeometry args={[120, 120]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={2048}
        mixBlur={0.7}
        mixStrength={2.3}
        roughness={1}
        depthScale={1.5}
        minDepthThreshold={0.2}
        maxDepthThreshold={1.6}
        color="#101010"
        metalness={0.8}
        mirror={1}
        opacity={opacity?.get() ?? 1}
        transparent
      />
    </mesh>
  );
};

export default Ground;

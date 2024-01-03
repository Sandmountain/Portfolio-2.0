import React, { Ref, useContext, useMemo, useRef } from "react";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { MeshContext } from "../../context/MeshContext";

const Leds: React.FC = () => {
  const ref: Ref<THREE.Group> | undefined = useRef<THREE.Group>(null);
  const { instances: Mesh, nodes } = useContext(MeshContext);

  useMemo(() => {
    nodes.Sphere.material = new THREE.MeshBasicMaterial();
    nodes.Sphere.material.toneMapped = false;
  }, [nodes.Sphere]);

  useFrame(state => {
    if (ref.current) {
      ref.current.children.forEach(instance => {
        const rand = Math.abs(2 + instance.position.x);
        const t = Math.round((1 + Math.sin(rand * 10000 + state.clock.elapsedTime * rand)) / 2);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        instance.color.setRGB(0, t * 1.1, t);
      });
    }
  });
  return (
    <group ref={ref}>
      <Mesh.Sphere position={[-0.486, 1.096, 0.95]} scale={0.005} color={[1, 2, 1]} />
      <Mesh.Sphere position={[0.755, 1.326, 0.79]} scale={0.005} color={[1, 2, 1]} />

      <Mesh.Sphere position={[1.93, 3.8, -3.69]} scale={0.005} color={[1, 2, 1]} />
      <Mesh.Sphere position={[-2.35, 3.8, -3.48]} scale={0.005} color={[1, 2, 1]} />
      <Mesh.Sphere position={[-3.03, 2.85, 1.19]} scale={0.005} color={[1, 2, 1]} />
      <Mesh.Sphere position={[-1.31, 1.74, -1.49]} scale={0.005} color={[1, 2, 1]} />
    </group>
  );
};

export default Leds;

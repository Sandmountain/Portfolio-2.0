/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.15 public/snes/scene.gltf -t -r public 
Author: elouisetrewartha (https://sketchfab.com/etrewartha)
License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
Source: https://sketchfab.com/3d-models/snes-09af5794ddf2414f98fbe7bdc7620ac5
Title: SNES
*/
import React, { useRef } from "react";

import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    SNES_SNES_Gray_0: THREE.Mesh;
    SNES_SNES_Dark_Gray_0: THREE.Mesh;
    SNES_SNES_Black_0: THREE.Mesh;
  };
  materials: {
    SNES_Gray: THREE.MeshStandardMaterial;
    SNES_Dark_Gray: THREE.MeshStandardMaterial;
    SNES_Black: THREE.MeshStandardMaterial;
  };
};

export function SNES(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/snes/scene.gltf") as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <group position={[0, 0, 0]} scale={[17.474, 1, 17.474]}>
        <mesh castShadow receiveShadow geometry={nodes.SNES_SNES_Gray_0.geometry} material={materials.SNES_Gray} />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SNES_SNES_Dark_Gray_0.geometry}
          material={materials.SNES_Dark_Gray}
        />
        <mesh castShadow receiveShadow geometry={nodes.SNES_SNES_Black_0.geometry} material={materials.SNES_Black} />
      </group>
    </group>
  );
}

useGLTF.preload("/snes/scene.gltf");

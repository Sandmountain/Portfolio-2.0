/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.15 public/television/scene.gltf -t -r public 
Author: matoteus (https://sketchfab.com/matoteus)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/lowpoly-old-tv-1ab0b494e6e4424eb629ad1963356461
Title: Lowpoly Old TV
*/
import React, { Ref, RefObject, useRef } from "react";

import { useGLTF } from "@react-three/drei";
import { shaderMaterial } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { extend } from "@react-three/fiber";
import * as THREE from "three";
import { BufferGeometry, Material, Mesh, VideoTexture } from "three";
import { GLTF } from "three-stdlib";

import { useProjectContext } from "../../../context/ProjectContext";
import ProjectScreen from "./ProjectScreen";

type GLTFResult = GLTF & {
  nodes: {
    defaultMaterial: THREE.Mesh;
    defaultMaterial_1: THREE.Mesh;
    defaultMaterial_2: THREE.Mesh;
    defaultMaterial_3: THREE.Mesh;
    defaultMaterial_4: THREE.Mesh;
    defaultMaterial_5: THREE.Mesh;
    defaultMaterial_6: THREE.Mesh;
  };
  materials: {
    lambert2SG: THREE.MeshStandardMaterial;
    initialShadingGroup: THREE.MeshStandardMaterial;
  };
};

const TelevisionMesh = ({ ...props }: JSX.IntrinsicElements["group"]) => {
  const { nodes, materials } = useGLTF("/television/scene.gltf") as GLTFResult;

  const flimmerRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const imageRef: Ref<Mesh<BufferGeometry, Material | Material[]>> | undefined = useRef(null);

  useFrame(() => {
    if (imageRef.current) {
      imageRef.current.scale.x = Math.max(
        16,
        Math.min(20, imageRef.current.scale.x + 0.001 * Math.sin(Date.now() * 0.001)),
      );
    }
  });

  useFrame(() => {
    if (!flimmerRef.current) return;
    const rand = Math.random();
    if (rand > 0.5) {
      flimmerRef.current.opacity = THREE.MathUtils.lerp(flimmerRef.current.opacity, 1 * rand, 0.1);
    } else {
      flimmerRef.current.opacity = 1;
    }
  });

  return (
    <group {...props} castShadow receiveShadow dispose={null}>
      <group rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            receiveShadow
            position={[0, 0.1, -0.03]}
            geometry={nodes.defaultMaterial.geometry}
            material={materials.lambert2SG}
            rotation={[Math.PI / 2, 0, 0]}>
            <ProjectScreen imageRef={imageRef} flimmerRef={flimmerRef} />
          </mesh>
          {/* <mesh
            castShadow
            receiveShadow
            geometry={nodes.defaultMaterial.geometry}
            material={materials.lambert2SG}
            rotation={[Math.PI / 2, 0, 0]}></mesh> */}

          <mesh
            castShadow
            receiveShadow
            geometry={nodes.defaultMaterial_1.geometry}
            material={materials.initialShadingGroup}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.defaultMaterial_2.geometry}
            material={materials.initialShadingGroup}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.defaultMaterial_3.geometry}
            material={materials.initialShadingGroup}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.defaultMaterial_4.geometry}
            material={materials.initialShadingGroup}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.defaultMaterial_5.geometry}
            material={materials.initialShadingGroup}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.defaultMaterial_6.geometry}
            material={materials.initialShadingGroup}
          />
        </group>
      </group>
    </group>
  );
};

export const Television = React.memo(TelevisionMesh);

useGLTF.preload("/television/scene.gltf");

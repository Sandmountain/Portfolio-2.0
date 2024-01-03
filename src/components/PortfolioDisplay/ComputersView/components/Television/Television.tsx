/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.15 public/television/scene.gltf -t -r public 
Author: matoteus (https://sketchfab.com/matoteus)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/lowpoly-old-tv-1ab0b494e6e4424eb629ad1963356461
Title: Lowpoly Old TV
*/
import React from "react";

import { Image, PerspectiveCamera, RenderTexture, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

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

export function Television({ ...props }: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/television/scene.gltf") as GLTFResult;

  return (
    <group {...props} castShadow receiveShadow dispose={null}>
      <group rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.defaultMaterial.geometry}
            // material={materials.lambert2SG}
            rotation={[Math.PI / 2, 0, 0]}>
            <meshPhysicalMaterial clearcoat={2} transmission={2.3} color="#FFFFFF" thickness={1}>
              <RenderTexture height={512} width={512} attach="map" anisotropy={16}>
                <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 0, 6]} />
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image
                  url="/thumbnail.png"
                  position={[0.3, 0, 0]}
                  zoom={0.3}
                  transparent={true}
                  opacity={0.9}
                  scale={[16, 2]}
                />
              </RenderTexture>
            </meshPhysicalMaterial>
          </mesh>

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
}

useGLTF.preload("/television/scene.gltf");

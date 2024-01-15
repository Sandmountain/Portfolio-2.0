import React, { Ref, RefObject } from "react";

import { Image, PerspectiveCamera, RenderTexture } from "@react-three/drei";
import { BufferGeometry, Material, Mesh } from "three";

import { useProjectContext } from "../../../context/ProjectContext";

type ProjectScreenProps = {
  flimmerRef: RefObject<THREE.MeshPhysicalMaterial | null>;
  // Linter goes crazy for typing this ref.
  imageRef: any;
};

const ProjectScreen: React.FC<ProjectScreenProps> = ({ flimmerRef, imageRef }) => {
  const { selectedProject } = useProjectContext();

  return (
    <meshPhysicalMaterial
      clearcoat={0.4}
      transmission={0.3}
      color="#fff"
      thickness={1.3}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      ref={flimmerRef}
      opacity={1}>
      <RenderTexture height={512} width={512} attach="map" anisotropy={16}>
        <PerspectiveCamera makeDefault manual position={[0, 0, 5]} />
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          ref={imageRef}
          url={`http:${selectedProject.squareThumbnail?.fields?.file.url ?? ""}`}
          position={[0, 0, 0]}
          zoom={0.26}
          transparent={true}
          opacity={0.9}
          scale={[16, 3]}
          toneMapped={false}
          //scale={[16, 2]}
        />
      </RenderTexture>
    </meshPhysicalMaterial>
  );
};

export default ProjectScreen;

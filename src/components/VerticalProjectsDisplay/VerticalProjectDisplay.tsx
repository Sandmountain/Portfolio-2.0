import {
  Environment,
  Image,
  Merged,
  MeshReflectorMaterial,
  RoundedBox,
  ScrollControls,
  useScroll,
} from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { Group } from "three";

import React, { Suspense, useRef, useState } from "react";

const projectsAngle = 0; //-Math.PI / 2;

const images = [
  "https://images.ctfassets.net/pesye57ju1o0/79b9VRv3W5mFfYqLr9Nl5Y/47d859ade2c16f9214c8fa9b079290b4/thumbnail.png?h=250",
  "https://images.ctfassets.net/pesye57ju1o0/79b9VRv3W5mFfYqLr9Nl5Y/47d859ade2c16f9214c8fa9b079290b4/thumbnail.png?h=250",
  "https://images.ctfassets.net/pesye57ju1o0/79b9VRv3W5mFfYqLr9Nl5Y/47d859ade2c16f9214c8fa9b079290b4/thumbnail.png?h=250",
  "https://images.ctfassets.net/pesye57ju1o0/79b9VRv3W5mFfYqLr9Nl5Y/47d859ade2c16f9214c8fa9b079290b4/thumbnail.png?h=250",
  "https://images.ctfassets.net/pesye57ju1o0/79b9VRv3W5mFfYqLr9Nl5Y/47d859ade2c16f9214c8fa9b079290b4/thumbnail.png?h=250",
  "https://images.ctfassets.net/pesye57ju1o0/79b9VRv3W5mFfYqLr9Nl5Y/47d859ade2c16f9214c8fa9b079290b4/thumbnail.png?h=250",
  "https://images.ctfassets.net/pesye57ju1o0/79b9VRv3W5mFfYqLr9Nl5Y/47d859ade2c16f9214c8fa9b079290b4/thumbnail.png?h=250",
  "https://images.ctfassets.net/pesye57ju1o0/79b9VRv3W5mFfYqLr9Nl5Y/47d859ade2c16f9214c8fa9b079290b4/thumbnail.png?h=250",
];

interface ProjectIndex {
  index: number;
}

interface ProjectProps {
  url: string;
  opacity?: number;
}

const ProjectImage: React.FC<ProjectProps & ProjectIndex> = ({ url, index }) => {
  const texture = useLoader(THREE.TextureLoader, url);

  const frame = useRef(null);

  return (
    <mesh position={[0, 3, 10 + -index * 7]} rotation={[0, projectsAngle, 0]} scale={6}>
      <boxGeometry />
      <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
      <mesh ref={frame} raycast={() => null} scale={[1.1, 1.1, 0.01]} position={[0, 0, -0.01]}>
        <RoundedBox radius={0.05} smoothness={1}></RoundedBox>
      </mesh>
      {/* Image */}
      <planeBufferGeometry attach="geometry" />
      <meshBasicMaterial attach="material" map={texture} toneMapped={false} />
    </mesh>
  );
};

const ProjectPedestal: React.FC<ProjectIndex> = ({ index }) => {
  return (
    <mesh rotation={[0, projectsAngle, 0]} position={[0, -1, 10 + -index * 7]} castShadow>
      <RoundedBox args={[10, 1, 5]} radius={0.2} smoothness={1}>
        <MeshReflectorMaterial
          color="#8b8b8b"
          metalness={1}
          roughness={0.1}
          resolution={1024}
          mixBlur={1}
          mixStrength={10}
          minDepthThreshold={0.4}
          maxDepthThreshold={3}
        />
      </RoundedBox>
    </mesh>
  );
};

const Project: React.FC<ProjectProps & ProjectIndex> = ({ url, index }) => {
  const ref = useRef<Group>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (ref.current) {
      ref.current.position.z = -(index * 0.5) + scroll.offset * 150;
    }
  });

  return (
    <group ref={ref}>
      <ProjectPedestal key={index} index={index} />
      <ProjectImage url={url} index={index} />
      {/* <ProjectImageComponent url={url} index={index} /> */}
    </group>
  );
};

const VerticalProjectDisplay = () => {
  return (
    <div style={{ height: "80vh" }}>
      {/* Train perspective */}
      {/* [-20, 15, 18] */}
      {/* File perspective */}
      {/* [10, 15, 25] */}
      <Canvas dpr={[1, 1]} shadows camera={{ position: [-10, 15, 25], fov: 50 }} gl={{ alpha: false }}>
        <fog attach="fog" args={["#17171b", 30, 50]} />
        <color attach="background" args={["#17171b"]} />
        <ambientLight intensity={0.25} />
        <directionalLight castShadow intensity={0.3} position={[-5, 10, 0]} shadow-mapSize={[1024, 1024]}>
          <orthographicCamera attach="shadow-camera" left={-20} right={20} top={20} bottom={-20} />
        </directionalLight>
        <Suspense fallback={null}>
          <group>
            <ScrollControls pages={1}>
              {images.map((image, idx) => (
                <Project url={image} index={idx} key={idx} />
              ))}
            </ScrollControls>
            <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[100, 100]} />
              <MeshReflectorMaterial
                blur={[400, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={15}
                depthScale={1}
                minDepthThreshold={0.85}
                color="#151515"
                metalness={0.7}
                roughness={1}
              />
            </mesh>
          </group>
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default VerticalProjectDisplay;

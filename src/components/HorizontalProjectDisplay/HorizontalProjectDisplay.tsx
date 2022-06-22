/* eslint-disable jsx-a11y/alt-text */
import { Environment, Image, MeshReflectorMaterial, useCursor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Object3D } from "three";
import getUuid from "uuid-by-string";

import { useEffect, useRef, useState } from "react";

const GOLDENRATIO = 1.61803398875;

interface HorizontalProjectDisplayProps {
  images: { position: number[]; rotation: number[]; url: string }[];
}

export const HorizontalProjectDisplay: React.FC<HorizontalProjectDisplayProps> = ({ images }) => {
  return (
    <Canvas camera={{ fov: 70, position: [0, 10, 15] }}>
      <color attach="background" args={["#151515"]} />
      <fog attach="fog" args={["#151515", 0, 5]} />
      <Environment preset="city" />
      {/* Align group in center of frame */}
      <group position={[0, -0.8, 0]}>
        <Frames images={images} />
        <Ground />
      </group>
    </Canvas>
  );
};

interface FramesProps {
  images: { position: number[]; rotation: number[]; url: string }[];
  q?: THREE.Quaternion;
  p?: THREE.Vector3;
}

const Frames: React.FC<FramesProps> = ({ images, q = new THREE.Quaternion(), p = new THREE.Vector3() }) => {
  const [clickedImage, setClickedImage] = useState<Object3D | null>(null);

  const ref = useRef(null);
  const clicked = useRef<Object3D | null>(null);

  useEffect(() => {
    clicked.current = clickedImage;
    if (clicked?.current?.parent) {
      clicked.current.parent.updateWorldMatrix(true, true);
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25));
      clicked.current.parent.getWorldQuaternion(q);
    } else {
      p.set(0, 0, 6.0);
      q.identity();
    }
  });

  // Onload animation
  useFrame(state => {
    state.camera.position.lerp(p, 0.05);
    state.camera.quaternion.slerp(q, 0.05);
  });

  return (
    <group
      ref={ref}
      onClick={e => {
        e.stopPropagation();

        // If the same project is clicked again, zoom out.
        if (clickedImage && clickedImage.uuid === e.object.uuid) {
          setClickedImage(null);
          // Zoom in on the clicked project
        } else {
          setClickedImage(e.object);
        }
      }}
      onPointerMissed={() => {
        setClickedImage(null);
      }}>
      {images.map(props => (
        <Frame key={props.url} {...props} />
      ))}
    </group>
  );
};

interface FrameProps {
  url: string;
  c?: THREE.Color;
}

const Frame: React.FC<FrameProps> = ({ url, c = new THREE.Color(), ...props }) => {
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());

  const image = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(null);
  const frame = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(null);

  const name = getUuid(url);
  useCursor(hovered);

  useFrame(state => {
    if (image?.current?.material) {
      (image.current.material as unknown as THREE.PerspectiveCamera).zoom =
        2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 4;
      image.current.scale.x = THREE.MathUtils.lerp(image.current.scale.x, 0.9 * (hovered ? 0.975 : 1), 0.4);
      image.current.scale.y = THREE.MathUtils.lerp(image.current.scale.y, 0.85 * (hovered ? 0.9505 : 1), 0.4);
    }
    if (frame.current) {
      (frame.current.material as unknown as THREE.MeshBasicMaterial).color.lerp(
        c.set(hovered ? "#00A6FB" : "white"),
        0.1,
      );
    }
  });

  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={e => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[GOLDENRATIO, 1, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.93, 0.9, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
    </group>
  );
};

const Ground: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[300, 50]}
        resolution={2048}
        mixBlur={1.5}
        mixStrength={20}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#101010"
        metalness={0.5}
        mirror={1}
      />
    </mesh>
  );
};

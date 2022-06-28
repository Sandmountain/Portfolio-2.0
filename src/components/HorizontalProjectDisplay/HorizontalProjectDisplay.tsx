/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useRef, useState } from "react";

import { Environment, MeshReflectorMaterial, useCursor } from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { Object3D } from "three";
import { proxy, useSnapshot } from "valtio";

import { ProjectImageType } from "../../types/Project";

const GOLDENRATIO = 16 / 9;

// Using a Valtio state model to bridge reactivity between
// the canvas and the dom.
interface ProjectState {
  current: null | string;
  currentProject: null | ProjectImageType;
  allProjects: null | ProjectImageType[];
}

const state = proxy<ProjectState>({
  current: null,
  currentProject: null,
  allProjects: null,
});

interface HorizontalProjectDisplayProps {
  images: ProjectImageType[];
}

const HorizontalProjectDisplay: React.FC<HorizontalProjectDisplayProps> = ({ images }) => {
  // Set the images in the Valtio state
  state.allProjects = images;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas dpr={[1, 2]} camera={{ fov: 70, position: [0, 10, 15] }}>
        <color attach="background" args={["#151515"]} />
        <fog attach="fog" args={["#151515", 0, 5]} />
        <ambientLight intensity={2} />
        <Environment preset="city" />
        {/* Align group in center of frame */}
        <group position={[0, -0.8, 0]}>
          <Frames images={images} />
          <Ground />
        </group>
      </Canvas>
      <SwitchArrows />
    </div>
  );
};

export default HorizontalProjectDisplay;

interface FramesProps {
  images: ProjectImageType[];
  q?: THREE.Quaternion;
  p?: THREE.Vector3;
  v?: THREE.Vector3;
}

const Frames: React.FC<FramesProps> = ({
  images,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
  v = new THREE.Vector3(),
}) => {
  const [clickedImage, setClickedImage] = useState<Object3D | null>(null);
  const snap = useSnapshot(state);

  // get current viewport
  // const { width, height } = useThree(state => state.viewport);

  const ref = useRef(null);
  const clicked = useRef<Object3D | null>(null);

  useEffect(() => {
    clicked.current = clickedImage;

    if (clicked?.current?.parent) {
      clicked.current.parent.updateWorldMatrix(true, true);
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.5));
      clicked.current.parent.getWorldQuaternion(q);
    } else {
      p.set(0, 0, 5.7);
      q.identity();
    }
  }, [clickedImage, p, q]);

  useEffect(() => {
    if (snap.currentProject?.id !== clickedImage?.name) {
      const groupRef = (ref.current ?? null) as unknown as Object3D<Event>;
      if (snap.currentProject?.id) {
        setClickedImage(groupRef.getObjectByName(snap.currentProject.id) ?? null);
      } else {
        // reset if arrow selection goes out of bounds
        setClickedImage(null);
      }
    }
  }, [clickedImage?.name, snap.currentProject]);

  // Animate camera on load and on new focus animation
  useFrame(state => {
    state.camera.position.lerp(p, 0.05);
    state.camera.quaternion.slerp(q, 0.05);

    // Only wobble camera if a project is not in focus
    if (!clicked.current) {
      state.camera.position.lerp(v.set(state.mouse.x / 4, state.mouse.y / 4, p.z), 0.05);
    }
  });

  const handleOnClick = (target: ThreeEvent<MouseEvent> | null) => {
    // if clicked outside or clicked on the same project, reset
    if (!target || target.object.name === clickedImage?.name) {
      setClickedImage(null);
      state.currentProject = null;
      return;
    }

    const projects = JSON.parse(JSON.stringify(snap.allProjects)) as ProjectImageType[];

    const [project] = projects.filter(proj => proj.id === target.object.name);

    setClickedImage(target.object);
    state.currentProject = project;
  };

  return (
    <group
      ref={ref}
      onClick={e => {
        e.stopPropagation();
        handleOnClick(e);
      }}
      onPointerMissed={() => {
        handleOnClick(null);
      }}>
      {images.map((props, index) => (
        <Frame focused={clickedImage?.name === props.id || !index} key={props.url} {...props} />
      ))}
    </group>
  );
};

interface FrameProps {
  url: string;
  focused: boolean;
  id?: string;
  c?: THREE.Color;
}

const Frame: React.FC<FrameProps> = ({ url, id, focused, c = new THREE.Color(), ...props }) => {
  const [hovered, setHovered] = useState(false);
  const [rnd] = useState(() => Math.random());

  const image = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(null);
  const frame = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(null);

  const imageTexture = useLoader(THREE.TextureLoader, url);

  useCursor(hovered);
  useFrame(state => {
    if (image?.current?.material) {
      const zoomLevel = 1.2 - Math.sin(rnd * 10000 + state.clock.elapsedTime / 6) / 7;
      (image.current.material as unknown as THREE.PerspectiveCamera).zoom = zoomLevel;
      image.current.scale.x = THREE.MathUtils.lerp(image.current.scale.x, GOLDENRATIO * (hovered ? 0.99 : 1), 0.4);
      image.current.scale.y = THREE.MathUtils.lerp(image.current.scale.y, 1 * (hovered ? 0.98 : 1), 0.4);
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
        name={id}
        onPointerOver={e => (e.stopPropagation(), setHovered(true))}
        onPointerOut={() => setHovered(false)}
        scale={[1.05 * GOLDENRATIO, 1.075, 0.05]}
        position={[0, GOLDENRATIO / 2, 0.66]}>
        <boxGeometry />
        <meshStandardMaterial color="#8f8f8f" metalness={0.5} roughness={0.5} envMapIntensity={2} />
      </mesh>

      <mesh ref={image} raycast={() => null} scale={[GOLDENRATIO, 1, 0.6]} position={[0, GOLDENRATIO / 2, 0.7]}>
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial attach="material" map={imageTexture} fog={false} />
      </mesh>

      <mesh
        ref={frame}
        raycast={() => null}
        scale={[1.05 * GOLDENRATIO, 1.075, 0]}
        position={[0, GOLDENRATIO / 2, 0.699]}>
        <boxGeometry />
        <meshBasicMaterial toneMapped={false} fog={false} />
      </mesh>
    </group>
  );
};

const Ground: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={2048}
        mixBlur={1}
        mixStrength={20}
        roughness={1}
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

const SwitchArrows: React.FC = () => {
  const snap = useSnapshot(state);

  const changeProject = (back: boolean) => {
    // convert from proxy to js-object
    const projects = JSON.parse(JSON.stringify(snap.allProjects)) as ProjectImageType[];

    const idx = projects.findIndex(proj => proj.id === snap.currentProject?.id);

    if (idx === -1) {
      return;
    }

    const newIndex = idx + (back ? -1 : 1);

    const newProject = state.allProjects?.[newIndex];

    state.currentProject = newProject ?? null;
  };

  return (
    <>
      {snap.currentProject !== null && (
        <div
          style={{
            width: "100%",
            position: "absolute",
            left: "0",
            top: "calc(50% - 50px)",
            display: "flex",
            justifyContent: "space-between",
          }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 40,
              height: 40,
              background: "gray",
              borderRadius: "50%",
            }}
            onClick={() => changeProject(true)}>
            <span style={{ pointerEvents: "none" }}>⇦</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 40,
              height: 40,
              background: "gray",
              borderRadius: "50%",
            }}
            onClick={() => changeProject(false)}>
            <span style={{ pointerEvents: "none" }}>⇨</span>
          </div>
        </div>
      )}
    </>
  );
};

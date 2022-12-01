/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useRef, useState } from "react";

import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Object3D, Vector3 } from "three";
import { useSnapshot } from "valtio";

import { ProjectImageType } from "../../../types/Project";
import { state } from "../PortfolioView";
import { ProjectFrame } from "../components/ProjectFrame/ProjectFrame";
import { moveProjectFramesOnFocus, resetProjectsPosition } from "./helpers/handleProjects";

export const GOLDENRATIO = 16 / 9;

interface HorizontalDisplayProps {
  images: ProjectImageType[];
  q?: THREE.Quaternion;
  p?: THREE.Vector3;
  v?: THREE.Vector3;
}

export const HorizontalDisplay: React.FC<HorizontalDisplayProps> = ({
  images,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
}) => {
  const [clickedImage, setClickedImage] = useState<Object3D | null>(null);

  const snap = useSnapshot(state);
  const camera = useThree(state => state.camera);
  const priorPosition = useRef<Vector3>();
  // get current viewport
  // const { width, height } = useThree(state => state.viewport);

  const ref = useRef<THREE.Group>(null);
  const clicked = useRef<Object3D | null>(null);

  const setPriorPosition = (obj: THREE.Object3D<THREE.Event>) => {
    const pos = new THREE.Vector3();
    pos.copy(obj.position);
    priorPosition.current = obj?.parent?.localToWorld(pos);
  };

  useEffect(() => {
    if (clickedImage?.parent) {
      clicked.current = clickedImage;

      if (!clicked.current.parent) return;

      clicked.current.parent.updateWorldMatrix(true, true);
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 3));
      clicked.current.parent.getWorldQuaternion(q);
    } else {
      p.set(0, 0, 5.7);
      q.identity();
    }
  }, [camera, clickedImage, images, p, q]);

  useEffect(() => {
    if (state.currentProject?.id !== clickedImage?.name) {
      const groupRef = (ref.current ?? null) as unknown as Object3D<Event>;

      if (state.currentProject?.id) {
        // Reset positions before moving focus
        const obj = groupRef.getObjectByName(state.currentProject.id);

        if (obj) {
          setPriorPosition(obj);
          setClickedImage(obj);
        }
      } else {
        // reset if arrow selection goes out of bounds
        setClickedImage(null);
      }
    }
  }, [clickedImage?.name, images, snap.currentProject]);

  // Animate camera on load and on new focus animation
  useFrame((state, delta) => {
    // Only wobble camera if a project is not in focus
    if (!snap.currentProject) {
      if (priorPosition.current) {
        state.camera.position.lerp(
          new Vector3(
            priorPosition.current.x + state.mouse.x / 6,
            (state.camera.position.y + state.mouse.y / 6) / 4,
            p.z,
          ),
          0.05,
        );
      } else {
        state.camera.position.lerp(new Vector3(p.x + state.mouse.x / 6, p.y + state.mouse.y / 6, p.z), 0.05);
      }
    } else {
      state.camera.position.lerp(new Vector3(p.x, state.camera.position.y, state.camera.position.z), 0.05);
    }
    state.camera.quaternion.slerp(q, 0.2);

    // Move image's position smoothly when a project is in focus and when resetting.
    // This is called on every frame and goes through all projects. Could be very cpu intensive.
    if (clickedImage?.parent) {
      if (ref.current && ref.current?.children) {
        // A project is enlarged when focused, other projects needs to move a tad.
        moveProjectFramesOnFocus(images, ref.current.children, clickedImage?.name ?? "", delta);
      }
    } else {
      if (ref.current && ref.current?.parent?.children) {
        resetProjectsPosition(images, ref.current.children, delta);
      }
    }
  });

  const handleOnClick = (target: ThreeEvent<MouseEvent> | null) => {
    // if clicked outside, reset
    if (!target) {
      setClickedImage(null);
      state.currentProject = null;
      clicked.current = null;
      return;
    }

    const projects = JSON.parse(JSON.stringify(snap.allProjects)) as ProjectImageType[];

    const [project] = projects.filter(proj => proj.id === target.object.name);

    setClickedImage(target.object);
    state.currentProject = project;

    setPriorPosition(target.object);
  };

  return (
    <group
      ref={ref}
      onClick={e => {
        e.stopPropagation();
        handleOnClick(e);
      }}
      onPointerMissed={e => {
        if ((e.target as HTMLElement).classList.contains("clickable")) {
          // If an element with the class clickable (buttons, and html), don't reset.
          return;
        } else {
          handleOnClick(null);
        }
      }}>
      {images.map(props => (
        <ProjectFrame key={props.url} focused={clickedImage?.name === props.id} {...props} />
      ))}
    </group>
  );
};

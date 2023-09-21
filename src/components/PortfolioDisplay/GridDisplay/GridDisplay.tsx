import { useEffect, useRef, useState } from "react";

import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Box, Flex } from "@react-three/flex";
import * as THREE from "three";
import { Object3D } from "three";
import { useSnapshot } from "valtio";

import { ProjectImageType } from "../../../types/Project";
import { GOLDENRATIO } from "../HorizontalDisplay/HorizontalDisplay";
import { state } from "../PortfolioView";
import { ProjectFrame } from "../components/ProjectFrame/ProjectFrame";

interface GridDisplayProps {
  images: ProjectImageType[];
  q?: THREE.Quaternion;
  p?: THREE.Vector3;
  v?: THREE.Vector3;
}

export const GridDisplay: React.FC<GridDisplayProps> = ({
  images,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
  v = new THREE.Vector3(),
}) => {
  const [clickedImage, setClickedImage] = useState<Object3D | null>(null);

  const snap = useSnapshot(state);

  const ref = useRef<THREE.Group>(null);
  const clicked = useRef<Object3D | null>(null);

  useEffect(() => {
    clicked.current = clickedImage;

    if (clicked?.current?.parent) {
      clicked.current.parent.updateWorldMatrix(true, true);
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 3));
      clicked.current.parent.getWorldQuaternion(q);
    } else {
      // Create a zoomLevel that works for an arbitrary amount of projects
      const projectAmount = snap.allProjects?.length ?? 0;
      const zoomLevel = projectAmount < 16 ? 6 : Math.floor(projectAmount / 8) + 4;

      p.set(0, 0, zoomLevel);
      q.identity();
      // Rotate the grid upwards instead of having same position as row
      // .setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 4)
      // .normalize();
    }
  }, [clickedImage, images, p, q, snap.allProjects?.length]);

  // Animate camera on load and on new focus animation
  useFrame(state => {
    state.camera.position.lerp(p, 0.05);
    state.camera.quaternion.slerp(q, 0.1);

    // Only wobble camera if a project is not in focus
    state.camera.position.lerp(v.set(state.mouse.x / 4, state.mouse.y / 4, p.z), 0.01);
  });

  const handleOnClick = (target: ThreeEvent<MouseEvent> | null) => {
    // if clicked outside or clicked on the same project, reset
    if (!target || target.object.name === clickedImage?.name) {
      setClickedImage(null);
      state.currentProject = null;
      state.isFrameLocked = false;
      return;
    }

    const projects = JSON.parse(JSON.stringify(snap.allProjects)) as ProjectImageType[];

    const [project] = projects.filter(proj => proj.id === target.object.name);

    setClickedImage(target.object);
    state.currentProject = project;
  };

  const renderGrid = (data: ProjectImageType[]) => {
    const perChunk = 5;
    const result = data.reduce(
      (resultArray, item, index) => {
        const chunkIndex = Math.floor(index / perChunk);

        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []; // start a new chunk
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
      },
      [[]] as [ProjectImageType[]],
    );

    /* margin centers the grid*/

    // TODO: implement pagination here. Should probably be 20 per page.
    return (
      <Flex justifyContent="center" alignItems="center" margin={-0.36} raycast={() => null}>
        {result.map((val, rowId) => (
          <Box key={rowId} flexDirection="row" width="auto" height="auto" flexGrow={1} raycast={() => null}>
            {val.map(proj => (
              <Box flexDirection="column" key={proj.id} margin={0.04} raycast={() => null}>
                <ProjectFrame
                  url={proj.url}
                  focused={clickedImage?.name === proj.id}
                  key={proj.id}
                  id={proj.id}
                  mode="grid"
                />
              </Box>
            ))}
          </Box>
        ))}
      </Flex>
    );
  };

  return (
    <group
      // rotation={[Math.PI / 4, 0, 0]}
      //position={[0, 6, 0]}
      ref={ref}
      onClick={e => {
        e.stopPropagation();

        if (!state.isFrameLocked) {
          handleOnClick(e);
        }
      }}
      onPointerMissed={(e: MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains("clickable")) {
          // If an element with the class clickable (buttons, and html), don't reset.
          return;
        } else {
          handleOnClick(null);
        }
      }}>
      {renderGrid(images)}
    </group>
  );
};

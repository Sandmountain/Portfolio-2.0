/* eslint-disable jsx-a11y/alt-text */
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { animated as a, useSpring as useSprng } from "react-spring";

import { Autocomplete, Icon, IconButton, Popover, TextField } from "@mui/material";
import { SpringValue, animated, useTransition } from "@react-spring/three";
import { Environment, MeshReflectorMaterial, useCursor } from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Box, Flex } from "@react-three/flex";
import * as THREE from "three";
import { Object3D } from "three";
import { proxy, useSnapshot } from "valtio";

import { Project, ProjectImageType } from "../../types/Project";
import { ProjectDescription } from "./components/ProjectDescription";
import { moveProjectFramesOnFocus, resetProjectsPosition } from "./handleProjects";

const GOLDENRATIO = 16 / 9;

// Using a Valtio state model to bridge reactivity between
// the canvas and the dom.
interface ProjectState {
  current: null | string;
  currentProject: null | ProjectImageType;
  currentView: "horizontal" | "grid";
  allProjects: null | ProjectImageType[];
}

export const state = proxy<ProjectState>({
  current: null,
  currentProject: null,
  allProjects: null,
  currentView: "horizontal",
});

interface HorizontalProjectDisplayProps {
  images: ProjectImageType[];
  projects: Project[];
}

const HorizontalProjectDisplay: React.FC<HorizontalProjectDisplayProps> = ({ images, projects }) => {
  const snap = useSnapshot(state);

  const styles = useSprng({
    to: [{ opacity: 1 }],
    from: { opacity: 0 },
    delay: 500,
  });

  useEffect(() => {
    state.allProjects = images;
  }, [images]);

  return (
    <div id="canvas-container" style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas dpr={[1, 2]} camera={{ fov: 70, position: [0, 10, 15] }}>
        <fog attach="fog" args={["#151515", 0, 5]} />
        <ambientLight intensity={2} />
        <Environment preset="city" />
        {/* <Stars /> */}
        {/* Align group in center of frame */}
        <group position={[0, -0.8, 0]}>
          <ProjectDisplay images={images} />
        </group>
      </Canvas>
      <a.div style={styles}>
        <ProjectNavigator />
      </a.div>
      {snap.currentProject && (
        <ProjectDescription projects={projects} projectId={snap.currentProject.id} dialog={true} />
      )}
      <SwitchArrows />
      <Indicators projects={images} />
    </div>
  );
};

export default HorizontalProjectDisplay;

interface HorizontalDisplayProps {
  images: ProjectImageType[];
}
const ProjectDisplay: React.FC<HorizontalDisplayProps> = ({ images }) => {
  const snap = useSnapshot(state);

  const transition = useTransition(snap.currentView, {
    from: { scale: 0, opacity: 0 },
    enter: () => ({ scale: 1, opacity: 1 }),
    leave: { scale: 0, opacity: 0 },
    config: { mass: 100, duration: 100 },
  });

  return transition(({ scale, opacity }, view) => (
    <>
      {view === "horizontal" && (
        <animated.mesh scale={scale}>
          <HorizontalDisplay images={images} />
          {snap.currentView !== "grid" && <Ground opacity={opacity} />}
        </animated.mesh>
      )}
      {view === "grid" && (
        <animated.mesh scale={scale}>
          <GridDisplay images={images} />
        </animated.mesh>
      )}
    </>
  ));
};

interface HorizontalDisplayProps {
  images: ProjectImageType[];
  q?: THREE.Quaternion;
  p?: THREE.Vector3;
  v?: THREE.Vector3;
}

const HorizontalDisplay: React.FC<HorizontalDisplayProps> = ({
  images,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
  v = new THREE.Vector3(),
}) => {
  const [clickedImage, setClickedImage] = useState<Object3D | null>(null);
  const snap = useSnapshot(state);
  const camera = useThree(state => state.camera);
  // get current viewport
  // const { width, height } = useThree(state => state.viewport);

  const ref = useRef<THREE.Group>(null);
  const clicked = useRef<Object3D | null>(null);

  useEffect(() => {
    clicked.current = clickedImage;

    if (clicked?.current?.parent) {
      clicked.current.parent.updateWorldMatrix(true, true);
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 3));
      clicked.current.parent.getWorldQuaternion(q);

      if (ref.current && ref.current?.children) {
        // A project is enlarged when focused, other projects needs to move a tad.
        moveProjectFramesOnFocus(images, ref.current.children, clickedImage?.name ?? "");
      }
    } else {
      p.set(0, 0, 5.7);
      q.identity();

      if (ref.current && ref.current?.children) {
        // A project is enlarged when focused, other projects needs to move a tad.
        resetProjectsPosition(images, ref.current.children);
      }
    }
  }, [camera, clickedImage, images, p, q]);

  useEffect(() => {
    if (snap.currentProject?.id !== clickedImage?.name) {
      const groupRef = (ref.current ?? null) as unknown as Object3D<Event>;

      if (snap.currentProject?.id) {
        // Reset positions before moving focus
        if (ref.current && ref.current?.children) {
          resetProjectsPosition(images, ref.current.children);
        }
        setClickedImage(groupRef.getObjectByName(snap.currentProject.id) ?? null);
      } else {
        // reset if arrow selection goes out of bounds
        setClickedImage(null);
      }
    }
  }, [clickedImage?.name, images, snap.currentProject]);

  // Animate camera on load and on new focus animation
  useFrame(state => {
    state.camera.position.lerp(p, 0.05);
    state.camera.quaternion.slerp(q, 0.1);

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
      {images.map(props => (
        <Frame focused={clickedImage?.name === props.id} key={props.url} {...props} />
      ))}
    </group>
  );
};
interface GridDisplayProps {
  images: ProjectImageType[];
  q?: THREE.Quaternion;
  p?: THREE.Vector3;
  v?: THREE.Vector3;
}

const GridDisplay: React.FC<GridDisplayProps> = ({
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

    return (
      <Flex justifyContent="center" alignItems="center" margin={-0.36}>
        {result.map((val, rowId) => (
          <Box key={rowId} flexDirection="row" width="auto" height="auto" flexGrow={1}>
            {val.map((proj, index) => (
              <Box flexDirection="column" key={index} margin={0.04}>
                <Frame url={proj.url} focused={clickedImage?.name === proj.id} key={proj.id} id={proj.id} mode="grid" />
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
        handleOnClick(e);
      }}
      onPointerMissed={() => {
        handleOnClick(null);
      }}>
      {renderGrid(images)}
    </group>
  );
};

interface FrameProps {
  url: string;
  focused: boolean;
  id: string;
  c?: THREE.Color;
  mode?: "horizontal" | "grid";
}

const Frame: React.FC<FrameProps> = ({ url, id, focused, c = new THREE.Color(), mode = "horizontal", ...props }) => {
  const [hovered, setHovered] = useState(false);
  // const [rnd] = useState(() => Math.random());
  const image = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(null);
  const frame = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(null);
  const project = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(null);

  const imageTexture = useLoader(THREE.TextureLoader, url);

  useCursor(hovered);
  useFrame(() => {
    if (image?.current?.material) {
      // TODO: doesn't work, look into how to move the zoom level on the basic material.
      // const zoomLevel = 1.2 - Math.sin(rnd * 10000 + state.clock.elapsedTime / 6) / 7;
      // (image.current.material as unknown as THREE.PerspectiveCamera).zoom = zoomLevel;
      // image.current.scale.x = THREE.MathUtils.lerp(image.current.scale.x, GOLDENRATIO * (hovered ? 0.99 : 1), 0.4);
      // image.current.scale.y = THREE.MathUtils.lerp(image.current.scale.y, 1 * (hovered ? 0.98 : 1), 0.4);
    }

    if (project?.current?.scale && mode !== "grid") {
      project.current.scale.x = THREE.MathUtils.lerp(project.current.scale.x, focused ? 1.2 : 1, 0.4);
      project.current.scale.y = THREE.MathUtils.lerp(project.current.scale.y, focused ? 1.2 : 1, 0.4);
    }

    if (frame.current) {
      if (focused && !hovered) {
        (frame.current.material as unknown as THREE.MeshBasicMaterial).color.lerp(c.set("#00A6FB"), 0.1);
      } else if (!focused && !hovered) {
        (frame.current.material as unknown as THREE.MeshBasicMaterial).color.lerp(c.set("white"), 0.1);
      } else {
        (frame.current.material as unknown as THREE.MeshBasicMaterial).color.lerp(c.set("#00A6FB"), 0.1);
      }
    }
  });
  return (
    <group {...props}>
      <mesh ref={project}>
        <mesh
          name={id}
          onPointerOver={e => (e.stopPropagation(), setHovered(true))}
          onPointerOut={() => setHovered(false)}
          scale={[1.05 * GOLDENRATIO, 1.075, 0.05]}
          position={[0, GOLDENRATIO / 2, 0.67]}>
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
      </mesh>
    </group>
  );
};

interface GroundProps {
  opacity?: SpringValue<number>;
}

const Ground: React.FC<GroundProps> = ({ opacity }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
      <planeGeometry args={[150, 150]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={2048}
        mixBlur={1}
        mixStrength={2.3}
        roughness={1}
        depthScale={1.5}
        minDepthThreshold={0.2}
        maxDepthThreshold={1.5}
        color="#101010"
        metalness={0.8}
        mirror={1}
        opacity={opacity?.get() ?? 1}
        transparent
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
      {snap.currentProject !== null && snap.currentView === "horizontal" && (
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
              width: 60,
              height: 60,
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
              width: 60,
              height: 60,
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

interface IndicatorProps {
  projects: ProjectImageType[];
}

const Indicators: React.FC<IndicatorProps> = ({ projects }) => {
  const [hoveredProject, setHoveredProject] = useState<string>();
  const [focusedIdx, setFocusedIdx] = useState<number>();

  const snap = useSnapshot(state);

  useEffect(() => {
    setFocusedIdx(projects.findIndex(proj => proj.id === snap.currentProject?.id));
  }, [projects, snap.currentProject]);

  const onIndicatorClick = (index: number) => {
    // Reset if same project is clicked again
    if (state.currentProject?.id === projects[index].id) {
      state.currentProject = null;
    } else {
      state.currentProject = projects[index];
    }
  };

  return (
    <>
      {state.currentProject && snap.currentView === "horizontal" && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            bottom: "10%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <div
            style={{
              padding: 6,
              opacity: 0.6,
              gap: 4,
              backgroundColor: "#cacaca20",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}>
            {hoveredProject && (
              <div
                style={{
                  position: "absolute",
                  pointerEvents: "none",
                  top: -30,
                  whiteSpace: "nowrap",
                }}>
                <p style={{ fontSize: "0.8rem" }}>{hoveredProject}</p>
              </div>
            )}
            {projects.map((proj, idx) => {
              return (
                <IndicatorItem
                  key={idx}
                  project={proj}
                  focused={focusedIdx === idx}
                  index={idx}
                  onIndicatorClick={onIndicatorClick}
                  setHoveredProject={setHoveredProject}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

interface IndicatorItemProps {
  project: ProjectImageType;
  focused: boolean;
  index: number;
  onIndicatorClick: (index: number) => void;
  setHoveredProject: Dispatch<SetStateAction<string | undefined>>;
}

const IndicatorItem: React.FC<IndicatorItemProps> = ({
  project,
  focused,
  index,
  onIndicatorClick,
  setHoveredProject,
}) => {
  // const theme = useTheme();

  /* Add hover effect when creating SC of this */

  return (
    <div
      onMouseEnter={() => setHoveredProject(project.title)}
      onMouseLeave={() => setHoveredProject(undefined)}
      onClick={() => onIndicatorClick(index)}
      key={project.id}
      style={{
        cursor: "pointer",
        width: 7,
        height: 7,
        borderRadius: "50%",
        backgroundColor: focused ? "#00A6FB" : "rgba(255,255,255,.3)",
      }}
    />
  );
};

const ProjectNavigator: React.FC = () => {
  const autoCompleteRef = useRef(null);

  const changeView = (view: "horizontal" | "grid") => {
    state.currentProject = null;
    state.currentView = view;
  };
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // const filterProject = () => {};

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        top: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 8,
        marginTop: 8,
        paddingRight: 8,
      }}>
      <IconButton component="button" size="small" color="primary" onClick={(e: any) => handleClick(e)}>
        <Icon>search_icon</Icon>
      </IconButton>
      <IconButton
        component="button"
        size="small"
        color="primary"
        onClick={() => {
          changeView("horizontal");
        }}>
        <Icon>view_column</Icon>
      </IconButton>
      <IconButton component="button" size="small" color="primary" onClick={() => changeView("grid")}>
        <Icon>view_comfy</Icon>
      </IconButton>

      <Popover
        marginThreshold={8}
        id={id}
        open={open}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 100, left: typeof window !== "undefined" ? window?.innerWidth : 0 }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={handleClose}>
        <Autocomplete
          ref={autoCompleteRef}
          sx={{ width: 400 }}
          size="small"
          options={[{ label: "Forrest Gump", year: 1994 }]}
          renderInput={params => (
            <TextField {...params} placeholder="Search for projects, libraries or techniques" />
          )}></Autocomplete>
      </Popover>
    </div>
  );
};

/* 

  // TODO: Tomorrow- create a new component or update Frame to have a "grid prop". It will either render the horizonal or the grid.
  // Keep track of the current setting in valtio. Add some tools in the top right corner or something similar, 
  // Should have a carousel icon, a grid icon and a search. 
  // When a project is in focus: there should be a window showing the "short text" and some other info. 
  // Should be accompanied with a button to read the full project - similar to what was done on the old portfolio.
  // This should route to a new page viktorsandberg.com/project/<title>
  // Make sure this actually works.

  <Flex justifyContent="center">
        <Box flexDirection="row">
          {images.slice(0, 3).map((props, index) => (
            <Box flexDirection="column" key={index}>
              <Frame url={props.url} focused={clickedImage?.name === props.id} key={props.url} />
            </Box>
          ))}
        </Box>
        <Box flexDirection="row">
          {images.slice(3, 6).map((props, index) => (
            <Box flexDirection="column" key={index}>
              <Frame url={props.url} focused={clickedImage?.name === props.id} key={props.url} />
            </Box>
          ))}
        </Box>
      </Flex>
*/

/*
Centered box
 <div
        style={{
          position: "absolute",
          width: "100%",
          top: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <div style={{ backgroundColor: "red", height: 50, width: 50, position: "relative" }}></div>
      </div>
*/

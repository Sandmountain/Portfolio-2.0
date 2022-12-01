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

// interface GridDisplayProps {
//   images: ProjectImageType[];
//   q?: THREE.Quaternion;
//   p?: THREE.Vector3;
//   v?: THREE.Vector3;
// }

// const GridDisplay: React.FC<GridDisplayProps> = ({
//   images,
//   q = new THREE.Quaternion(),
//   p = new THREE.Vector3(),
//   v = new THREE.Vector3(),
// }) => {
//   const [clickedImage, setClickedImage] = useState<Object3D | null>(null);

//   const snap = useSnapshot(state);

//   const ref = useRef<THREE.Group>(null);
//   const clicked = useRef<Object3D | null>(null);

//   // Used to lock clicking project in Grid view because of weird raycast bug over HTML.
//   const lockedClick = useRef(false);

//   useEffect(() => {
//     clicked.current = clickedImage;

//     if (clicked?.current?.parent) {
//       clicked.current.parent.updateWorldMatrix(true, true);
//       clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 3));
//       clicked.current.parent.getWorldQuaternion(q);
//     } else {
//       // Create a zoomLevel that works for an arbitrary amount of projects
//       const projectAmount = snap.allProjects?.length ?? 0;
//       const zoomLevel = projectAmount < 16 ? 6 : Math.floor(projectAmount / 8) + 4;

//       p.set(0, 0, zoomLevel);
//       q.identity();
//       // Rotate the grid upwards instead of having same position as row
//       // .setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 4)
//       // .normalize();
//     }
//   }, [clickedImage, images, p, q, snap.allProjects?.length]);

//   // Animate camera on load and on new focus animation
//   useFrame(state => {
//     state.camera.position.lerp(p, 0.05);
//     state.camera.quaternion.slerp(q, 0.1);

//     // Only wobble camera if a project is not in focus
//     state.camera.position.lerp(v.set(state.mouse.x / 4, state.mouse.y / 4, p.z), 0.01);
//   });

//   const handleOnClick = (target: ThreeEvent<MouseEvent> | null) => {
//     // if clicked outside or clicked on the same project, reset
//     if (!target || target.object.name === clickedImage?.name) {
//       setClickedImage(null);
//       state.currentProject = null;
//       return;
//     }

//     const projects = JSON.parse(JSON.stringify(snap.allProjects)) as ProjectImageType[];

//     const [project] = projects.filter(proj => proj.id === target.object.name);

//     setClickedImage(target.object);
//     state.currentProject = project;
//   };

//   const renderGrid = (data: ProjectImageType[]) => {
//     const perChunk = 5;
//     const result = data.reduce(
//       (resultArray, item, index) => {
//         const chunkIndex = Math.floor(index / perChunk);

//         if (!resultArray[chunkIndex]) {
//           resultArray[chunkIndex] = []; // start a new chunk
//         }

//         resultArray[chunkIndex].push(item);

//         return resultArray;
//       },
//       [[]] as [ProjectImageType[]],
//     );

//     /* margin centers the grid*/

//     // TODO: implement pagination here. Should probably be 20 per page.
//     return (
//       <Flex justifyContent="center" alignItems="center" margin={-0.36} raycast={() => null}>
//         {result.map((val, rowId) => (
//           <Box key={rowId} flexDirection="row" width="auto" height="auto" flexGrow={1} raycast={() => null}>
//             {val.map(proj => (
//               <Box flexDirection="column" key={proj.id} margin={0.04} raycast={() => null}>
//                 <Frame
//                   url={proj.url}
//                   focused={clickedImage?.name === proj.id}
//                   key={proj.id}
//                   id={proj.id}
//                   lockedClick={lockedClick}
//                   mode="grid"
//                 />
//               </Box>
//             ))}
//           </Box>
//         ))}
//       </Flex>
//     );
//   };

//   return (
//     <group
//       // rotation={[Math.PI / 4, 0, 0]}
//       //position={[0, 6, 0]}
//       ref={ref}
//       onClick={e => {
//         e.stopPropagation();

//         if (!lockedClick.current) {
//           handleOnClick(e);
//         }
//       }}
//       onPointerMissed={(e: MouseEvent) => {
//         if ((e.target as HTMLElement).classList.contains("clickable")) {
//           // If an element with the class clickable (buttons, and html), don't reset.
//           return;
//         } else {
//           handleOnClick(null);
//         }
//       }}>
//       {renderGrid(images)}
//     </group>
//   );
// };

// interface FrameProps {
//   url: string;
//   focused: boolean;
//   id: string;
//   c?: THREE.Color;
//   // Using Ref to lock click if hovering the HTML.
//   lockedClick?: MutableRefObject<boolean>;
//   mode?: "horizontal" | "grid";
// }

// const Frame: React.FC<FrameProps> = ({
//   url,
//   id,
//   focused,
//   c = new THREE.Color(),
//   mode = "horizontal",
//   lockedClick,
//   ...props
// }) => {
//   const [hovered, setHovered] = useState(false);
//   const snap = useSnapshot(state);
//   // const [rnd] = useState(() => Math.random());
//   const image = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(null);
//   const frame = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(null);
//   const project = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(null);

//   const imageTexture = useLoader(THREE.TextureLoader, url);

//   useCursor(hovered);
//   useFrame((_state, delta) => {
//     if (image?.current?.material) {
//       // TODO: doesn't work, look into how to move the zoom level on the basic material.
//       // const zoomLevel = 1.2 - Math.sin(rnd * 10000 + state.clock.elapsedTime / 6) / 7;
//       // (image.current.material as unknown as THREE.PerspectiveCamera).zoom = zoomLevel;
//       // image.current.scale.x = THREE.MathUtils.lerp(image.current.scale.x, GOLDENRATIO * (hovered ? 0.99 : 1), 0.4);
//       // image.current.scale.y = THREE.MathUtils.lerp(image.current.scale.y, 1 * (hovered ? 0.98 : 1), 0.4);
//     }

//     if (project?.current?.scale && mode !== "grid") {
//       // Make project scale slowly instead of immediately
//       if (focused) {
//         project.current.scale.x = THREE.MathUtils.damp(project.current.scale.x, 1.2, 6, delta);
//         project.current.scale.y = THREE.MathUtils.damp(project.current.scale.y, 1.2, 6, delta);
//       } else {
//         project.current.scale.x = THREE.MathUtils.damp(project.current.scale.x, 1, 6, delta);
//         project.current.scale.y = THREE.MathUtils.damp(project.current.scale.y, 1, 6, delta);
//       }
//     }

//     if (frame.current) {
//       if (focused && !hovered) {
//         (frame.current.material as unknown as THREE.MeshBasicMaterial)?.color.lerp(c.set("#00A6FB"), 0.1);
//       } else if (!focused && !hovered) {
//         (frame.current.material as unknown as THREE.MeshBasicMaterial)?.color.lerp(c.set("white"), 0.1);
//       } else {
//         (frame.current.material as unknown as THREE.MeshBasicMaterial)?.color.lerp(c.set("#00A6FB"), 0.1);
//       }
//     }
//   });
//   return (
//     <group {...props}>
//       <mesh ref={project}>
//         <mesh
//           name={id}
//           onPointerOver={e => (e.stopPropagation(), setHovered(true))}
//           onPointerOut={() => setHovered(false)}
//           scale={[1.05 * GOLDENRATIO, 1.075, 0.05]}
//           position={[0, GOLDENRATIO / 2, 0.67]}>
//           <boxGeometry />
//           <meshStandardMaterial color="#8f8f8f" metalness={0.5} roughness={0.5} envMapIntensity={2} />
//         </mesh>

//         <mesh ref={image} raycast={() => null} scale={[GOLDENRATIO, 1, 0.6]} position={[0, GOLDENRATIO / 2, 0.7]}>
//           <planeBufferGeometry attach="geometry" />
//           <meshBasicMaterial attach="material" map={imageTexture} fog={false} />
//         </mesh>
//         {focused && (
//           <Html
//             scale={100}
//             raycast={() => null}
//             position={[-GOLDENRATIO / 1.99, GOLDENRATIO / 1.277, 0.69]}
//             zIndexRange={[200, 300]}>
//             <div
//               onMouseEnter={() => {
//                 if (lockedClick?.current) lockedClick.current = true;
//               }}
//               onMouseLeave={() => {
//                 if (lockedClick?.current) lockedClick.current = false;
//               }}
//               className={`${focused ? "show-on-delay" : "hidden"} clickable`}
//               style={{
//                 position: "relative",
//                 display: "flex",
//                 alignItems: "end",
//                 opacity: 0,
//                 animation: "fade-in 0.4s ease-in forwards",
//                 animationDelay: "0", //"0.4s",
//                 transition: "height, width 0.1s ease-in",
//                 minWidth: "500px",
//               }}>
//               <ProjectResourceOverlay
//                 projects={JSON.parse(JSON.stringify(state.projectsData))}
//                 projectId={snap.currentProject?.id}
//                 dialog={true}
//               />
//             </div>
//           </Html>
//         )}

//         <mesh
//           ref={frame}
//           raycast={() => null}
//           scale={[1.05 * GOLDENRATIO, 1.075, 0]}
//           position={[0, GOLDENRATIO / 2, 0.699]}>
//           <boxGeometry />
//           <meshBasicMaterial toneMapped={false} fog={false} />
//         </mesh>
//       </mesh>
//     </group>
//   );
// };

// interface GroundProps {
//   opacity?: SpringValue<number>;
// }

// const Ground: React.FC<GroundProps> = ({ opacity }) => {
//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
//       <planeGeometry args={[120, 120]} />
//       <MeshReflectorMaterial
//         blur={[300, 100]}
//         resolution={2048}
//         mixBlur={0.7}
//         mixStrength={2.3}
//         roughness={1}
//         depthScale={1.5}
//         minDepthThreshold={0.2}
//         maxDepthThreshold={1.6}
//         color="#101010"
//         metalness={0.8}
//         mirror={1}
//         opacity={opacity?.get() ?? 1}
//         transparent
//       />
//     </mesh>
//   );
// };

// const ProjectNavigator: React.FC = () => {
//   const autoCompleteRef = useRef(null);

//   const snap = useSnapshot(state);

//   const changeView = (view: "horizontal" | "grid") => {
//     state.currentProject = null;
//     state.currentView = view;
//   };
//   const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

//   const handleClick = (event: any) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? "simple-popover" : undefined;

//   const filterProjects = (options: Project[], { inputValue }: any) => {
//     const projects = options.filter(
//       item =>
//         item.title.includes(inputValue) ||
//         item.keywords.filter(keyword => keyword.toLowerCase().includes(inputValue.toLowerCase())).length > 0,
//     );

//     return projects;
//   };

//   const changeProject = (e: React.SyntheticEvent<Element, Event>, val: Project | null) => {
//     if (val) {
//       const projects = JSON.parse(JSON.stringify(snap.allProjects)) as ProjectImageType[];

//       const [project] = projects.filter(proj => proj.id === val.uuid);
//       if (project) {
//         state.currentProject = JSON.parse(JSON.stringify(project));
//       }
//     }
//   };

//   return (
//     <div
//       style={{
//         position: "absolute",
//         width: "100%",
//         top: 0,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "flex-end",
//         gap: 8,
//         marginTop: 8,
//         paddingRight: 8,
//       }}>
//       <IconButton component="button" size="small" color="primary" onClick={(e: any) => handleClick(e)}>
//         <Icon>search_icon</Icon>
//       </IconButton>
//       <IconButton
//         component="button"
//         size="small"
//         color="primary"
//         onClick={() => {
//           changeView("horizontal");
//         }}>
//         <Icon>view_column</Icon>
//       </IconButton>
//       <IconButton component="button" size="small" color="primary" onClick={() => changeView("grid")}>
//         <Icon>view_comfy</Icon>
//       </IconButton>

//       <Popover
//         marginThreshold={8}
//         id={id}
//         open={open}
//         anchorReference="anchorPosition"
//         anchorPosition={{ top: 100, left: typeof window !== "undefined" ? window?.innerWidth : 0 }}
//         anchorOrigin={{
//           vertical: "top",
//           horizontal: "center",
//         }}
//         transformOrigin={{
//           vertical: "top",
//           horizontal: "right",
//         }}
//         onClose={handleClose}>
//         {snap.projectsData && (
//           <Autocomplete
//             onChange={changeProject}
//             ref={autoCompleteRef}
//             filterOptions={filterProjects}
//             getOptionLabel={(opt: Project) => opt.title}
//             sx={{ width: 400 }}
//             size="small"
//             options={snap.projectsData as Project[]}
//             renderInput={params => (
//               <TextField {...params} placeholder="Search for projects, libraries or techniques" />
//             )}></Autocomplete>
//         )}
//       </Popover>
//     </div>
//   );
// };

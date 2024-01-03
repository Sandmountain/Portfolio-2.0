/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { animated as a, useSpring as useSprng } from "react-spring";

import router from "next/router";

import { Dialog } from "@mui/material";
import { Cloud, Environment, Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer } from "@react-three/postprocessing";
import { proxy, useSnapshot } from "valtio";
import { subscribeKey } from "valtio/utils";

import { Project, ProjectImageType } from "../../types/Project";
import { Indicators } from "./HorizontalDisplay/components/SlideIndicators";
import ProjectContent from "./ProjectDialog/ProjectContent";
import { ProjectDisplaySwitcher } from "./components/ProjectDisplaySwitcher/ProjectDisplaySwitcher";
import { ProjectNavigator } from "./components/ProjectNavigator";
import SwipeCapturer from "./components/SwipeCapturer/SwipeCapturer";

export const GOLDENRATIO = 16 / 9;

// Using a Valtio state model to bridge reactivity between
// the canvas and the dom.
interface ProjectState {
  current: null | string;
  currentProject: null | ProjectImageType;
  currentView: "horizontal" | "grid";
  allProjects: null | ProjectImageType[];
  projectsData: null | Project[];
  isProjectDialogOpen: boolean;
  isSearchFocused: boolean;
  isFrameLocked: boolean;
}

export const state = proxy<ProjectState>({
  current: null,
  currentProject: null,
  allProjects: null,
  projectsData: null,
  currentView: "horizontal",
  isProjectDialogOpen: false,
  isSearchFocused: false,
  isFrameLocked: false,
});

interface PortfolioView {
  images: ProjectImageType[];
  projects: Project[];
}

const PortfolioView: React.FC<PortfolioView> = ({ images, projects }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const snap = useSnapshot(state);

  const getProject = (): Project | undefined => {
    if (snap.projectsData && snap.currentProject) {
      const project = snap.projectsData.filter(proj => snap.currentProject?.id === proj.uuid);
      return project[0] as Project;
    }
  };

  const styles = useSprng({
    to: [{ opacity: 1 }],
    from: { opacity: 0 },
    delay: 500,
  });

  useEffect(() => {
    state.allProjects = images;
    state.projectsData = projects;
  }, [images, projects]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    router.push(`/portfolio`, undefined, {
      shallow: true,
    });
    state.isProjectDialogOpen = false;
  };

  subscribeKey(state, "isProjectDialogOpen", () => {
    if (state.isProjectDialogOpen && !openDialog) {
      router.push(`?name=${snap.currentProject?.title.toLocaleLowerCase().replaceAll(" ", "-")}`, undefined, {
        shallow: true,
      });
      setOpenDialog(true);
    }
  });

  return (
    <div id="canvas-container" style={{ width: "100%", height: "100%", position: "relative" }}>
      <SwipeCapturer>
        <Canvas dpr={[1, 2]} camera={{ fov: 70, position: [0, 10, 50] }}>
          <fog attach="fog" args={["black", 5, 20]} />
          <ambientLight intensity={1} />

          <Environment preset="city" blur={10} far={20} />
          <group position={[0, 0, -5]} scale={[5, 5, 1]}>
            <Cloud width={15} opacity={0.2} speed={0.1}></Cloud>
          </group>

          {/* Align group in center of frame */}
          <group position={[0, -0.8, 0]}>
            <ProjectDisplaySwitcher images={images} />
          </group>
          {/* Postprocessing */}
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.4} intensity={0.5} />
            <DepthOfField target={[0, 0, 13]} focalLength={0.3} bokehScale={15} height={700} />
          </EffectComposer>
        </Canvas>
        <Loader />
      </SwipeCapturer>
      <a.div style={styles}>
        <ProjectNavigator />
      </a.div>

      <Dialog fullWidth maxWidth={"xl"} open={openDialog} onClose={handleCloseDialog}>
        <ProjectContent project={getProject()} projects={projects} dialog />
      </Dialog>

      <Indicators projects={images} />
    </div>
  );
};

export default PortfolioView;

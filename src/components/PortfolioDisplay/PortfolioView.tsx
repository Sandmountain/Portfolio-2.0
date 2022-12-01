/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { animated as a, useSpring as useSprng } from "react-spring";

import router from "next/router";

import { Dialog } from "@mui/material";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
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
}

export const state = proxy<ProjectState>({
  current: null,
  currentProject: null,
  allProjects: null,
  projectsData: null,
  currentView: "horizontal",
  isProjectDialogOpen: false,
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
        <Canvas dpr={[1, 2]} camera={{ fov: 70, position: [0, 10, 15] }}>
          <fog attach="fog" args={["#151515", 0, 5]} />
          <ambientLight intensity={2} />
          <Environment preset="city" />

          {/* Align group in center of frame */}
          <group position={[0, -0.8, 0]}>
            <ProjectDisplaySwitcher images={images} />
          </group>
        </Canvas>
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

import React from "react";
import { useTransition } from "react-spring";

import { animated } from "@react-spring/three";
import { useSnapshot } from "valtio";

import { ProjectImageType } from "../../../../types/Project";
import { GridDisplay } from "../../GridDisplay/GridDisplay";
import { HorizontalDisplay } from "../../HorizontalDisplay/HorizontalDisplay";
import Ground from "../../HorizontalDisplay/components/Ground";
import { state } from "../../PortfolioView";

interface ProjectDisplaySwitcherProps {
  images: ProjectImageType[];
  v?: THREE.Vector3;
}
export const ProjectDisplaySwitcher: React.FC<ProjectDisplaySwitcherProps> = ({ images }) => {
  const snap = useSnapshot(state);

  const transition = useTransition(snap.currentView, {
    from: { scale: 0, opacity: 0 },
    enter: () => ({ scale: 1, opacity: 1 }),
    leave: { scale: 0, opacity: 0 },
    config: { mass: 100, duration: 100 },
  });

  return transition(({ scale }, view) => (
    <>
      {view === "horizontal" && (
        <>
          <animated.mesh scale={scale}>
            <HorizontalDisplay images={images} />
            <Ground />
          </animated.mesh>
        </>
      )}
      {view === "grid" && (
        <animated.mesh scale={scale}>
          <GridDisplay images={images} />
        </animated.mesh>
      )}
    </>
  ));
};

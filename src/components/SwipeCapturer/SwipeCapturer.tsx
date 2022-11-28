import React, { useEffect, useState } from "react";

import { useSnapshot } from "valtio";

import { state } from "../HorizontalProjectDisplay/HorizontalProjectDisplay";

interface Props {
  children: React.ReactNode;
}

const SwipeCapturer: React.FC<Props> = ({ children }) => {
  const [focusedIdx, setFocusedIdx] = useState<number>(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const snap = useSnapshot(state);
  const minSwipeDistance = 100;

  const isActive = snap && snap.currentProject && snap.currentView !== "grid";

  const onTouchStart = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement, MouseEvent>,
    touchEvent = true,
  ) => {
    setTouchEnd(0); // otherwise the swipe is fired even with usual touch events
    if (touchEvent) {
      setTouchStart((e as unknown as TouchEvent).targetTouches[0].clientX);
    } else {
      setTouchStart((e as unknown as MouseEvent).clientX);
    }
  };

  const onTouchMove = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement, MouseEvent>,
    touchEvent = true,
  ) => {
    if (touchStart) {
      if (touchEvent) {
        setTouchEnd((e as unknown as TouchEvent).targetTouches[0]?.clientX);
      } else {
        setTouchEnd((e as unknown as MouseEvent).clientX);
      }
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;

    const isLeftSwipe = distance > minSwipeDistance;

    if (state.currentProject) {
      if (isLeftSwipe) {
        state.currentProject = state.allProjects?.[focusedIdx + 1] ?? null;
        console.log("swiping left");
      } else {
        state.currentProject = state.allProjects?.[focusedIdx - 1] ?? null;
        console.log("swiping right");
      }
    }

    // add your conditional logic here
  };

  useEffect(() => {
    if (snap.projectsData) {
      setFocusedIdx(snap.projectsData.findIndex(proj => proj.uuid === snap.currentProject?.id));
    }
  }, [snap.projectsData, snap.currentProject]);

  // const onIndicatorClick = (index: number) => {
  //   // Reset if same project is clicked again
  //   if (state.currentProject?.id === projects[index].id) {
  //     state.currentProject = null;
  //   } else {
  //     state.currentProject = projects[index];
  //   }
  // };

  return (
    <div
      style={{ height: "100%", width: "100%" }}
      onMouseDown={e => isActive && onTouchStart(e, false)}
      onMouseMove={e => isActive && onTouchMove(e, false)}
      onMouseUp={() => isActive && onTouchEnd()}
      onTouchStart={e => isActive && onTouchStart(e, true)}
      onTouchMove={e => isActive && onTouchMove(e, true)}
      onTouchEnd={() => isActive && onTouchEnd()}>
      {children}
    </div>
  );
};

export default SwipeCapturer;

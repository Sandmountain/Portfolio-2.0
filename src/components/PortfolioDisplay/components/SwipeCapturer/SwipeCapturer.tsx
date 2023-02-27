import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { debounce } from "@mui/material";
import { useSnapshot } from "valtio";
import { subscribeKey } from "valtio/utils";

import { state } from "../../PortfolioView";

interface Props {
  children: React.ReactNode;
}

const SwipeCapturer: React.FC<Props> = ({ children }) => {
  //const [focusedIdx, setFocusedIdx] = useState<number>(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const snap = useSnapshot(state);
  const minSwipeDistance = 50;

  const focusedIdx = useRef<number>(-1);

  const isActive = snap && snap.currentView !== "grid";

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

    if (isLeftSwipe) {
      state.currentProject = state.allProjects?.[focusedIdx.current + 1] ?? null;

      focusedIdx.current = focusedIdx.current + 1;
    } else {
      state.currentProject = state.allProjects?.[focusedIdx.current - 1] ?? null;
      focusedIdx.current = focusedIdx.current + 1;
    }
  };

  useEffect(() => {
    if (snap.projectsData && snap.currentProject) {
      focusedIdx.current = snap.projectsData.findIndex(proj => proj.uuid === snap.currentProject?.id);
    }
  }, [snap.projectsData, snap.currentProject]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const onScrollBounce = useCallback(
    (e: WheelEvent) => {
      if (state.currentView === "grid" || state.isProjectDialogOpen || state.isSearchFocused) return;

      if (e.deltaY > 0) {
        state.currentProject = state.allProjects?.[focusedIdx.current + 1] ?? null;
        focusedIdx.current = focusedIdx.current + 1;
      } else {
        state.currentProject = state.allProjects?.[focusedIdx.current - 1] ?? null;
        focusedIdx.current = focusedIdx.current - 1;
      }
    },
    [focusedIdx],
  );

  const onScroll = useMemo(() => debounce(onScrollBounce, 100), [onScrollBounce]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (state.currentView === "grid" || state.isProjectDialogOpen || state.isSearchFocused) return;
    if(e.key === "ArrowRight") {
      state.currentProject = state.allProjects?.[focusedIdx.current + 1] ?? null;
      focusedIdx.current = focusedIdx.current + 1;
    } 
    if(e.key === "ArrowLeft") {
      state.currentProject = state.allProjects?.[focusedIdx.current - 1] ?? null;
      focusedIdx.current = focusedIdx.current - 1;
    }
  }

  useEffect(() => {
    window.addEventListener("wheel", onScroll);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  subscribeKey(state, "currentView", () => {
    if (state.currentView === "horizontal") {
      focusedIdx.current = -1;
    }
  });

  return (
    <div
      ref={scrollRef}
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

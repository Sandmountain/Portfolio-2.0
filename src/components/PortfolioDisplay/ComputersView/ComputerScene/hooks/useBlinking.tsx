import React, { useEffect, useState } from "react";

export const useBlinking = (start: boolean) => {
  const [cursorBlinking, setCursorBlinking] = React.useState(start);

  useEffect(() => {
    const blinkCursorDelay = 500; // Delay in ms for cursor blink
    const cursorInterval = setInterval(() => {
      setCursorBlinking(vis => !vis);
    }, blinkCursorDelay);

    return () => clearInterval(cursorInterval);
  }, []);

  return cursorBlinking;
};

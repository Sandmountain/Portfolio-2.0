import React, { Children, ReactNode, createRef, useEffect, useRef, useState } from "react";

import { Box } from "@mui/material";

import styles from "./ImageCarousel.module.css";

interface IImageCarousel {
  gap?: number;
  width?: string;
  onImageChange?: (index: number) => void;
  children: ReactNode;
}

interface ExtendedProps extends React.HTMLAttributes<HTMLElement> {
  onMouseUp?: (event: React.MouseEvent<HTMLElement>) => void;
  ref?: React.RefObject<HTMLElement>;
}

const ImageCarousel: React.FC<IImageCarousel> = ({ onImageChange, width = "100%", gap = 12, children }) => {
  const [isMoving, setIsMoving] = useState(false);
  const [overShoot, setOverShoot] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const carouselRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const refs = useRef<React.RefObject<HTMLElement>[]>([]);
  const hasOvershotRef = useRef(0);

  useEffect(() => {
    refs.current = Children.toArray(children).map((_, i) => refs.current[i] ?? createRef());

    if (refs.current[0]?.current) {
      setImageWidth((refs.current[0]?.current as HTMLDivElement).clientWidth);
    }
  }, [children]);

  const getClosestChildIndex = () => {
    if (carouselRef.current) {
      const carouselWidth = carouselRef.current.offsetWidth;
      const scrollPosition = carouselRef.current.scrollLeft + carouselWidth / 2;

      let closestImageIndex = 0;
      let minDistance = Infinity;

      refs.current.forEach((imageRef, index) => {
        if (imageRef && imageRef.current) {
          const imagePosition = imageRef.current.offsetLeft + imageRef.current.offsetWidth / 2;
          const distance = Math.abs(imagePosition - scrollPosition);

          if (distance < minDistance) {
            minDistance = distance;
            closestImageIndex = index;
          }
        }
      });

      return closestImageIndex;
    }
  };

  const scrollToClosestChild = (index?: number) => {
    if (!carouselRef.current || !refs.current || index === undefined) return;

    const carouselWidth = carouselRef.current.offsetWidth;

    if (refs.current[index] && refs.current[index].current) {
      const closestImage = refs.current[index].current;

      if (!closestImage) return;

      carouselRef.current.scrollTo({
        left: closestImage.offsetLeft - (carouselWidth - closestImage.offsetWidth) / 2,
        behavior: "smooth",
      });
    }
  };

  const handleImageChange = (index: number) => {
    setSelectedImage(index);
    onImageChange && onImageChange(index);
  };

  const onMouseDown = (event: React.MouseEvent) => {
    // Removing old animation class when dragging is enabled

    // Store the initial position of the mouse when the drag starts
    const initialMousePosition = event.clientX;
    const initialScrollLeft = carouselRef.current?.scrollLeft ?? 0;

    // Set up a mouse move event listener to track the element's movement
    const onMouseMove = (event: MouseEvent) => {
      if (!carouselRef.current || !innerRef.current) return;

      setIsMoving(true);

      const newScrollPosition = initialScrollLeft + initialMousePosition - event.clientX;
      carouselRef.current.scrollLeft = newScrollPosition;

      if (newScrollPosition < 0) {
        setOverShoot(-newScrollPosition / 10);
        hasOvershotRef.current = -newScrollPosition / 10;
        return;
      }

      const maxScrollableWidth = innerRef.current.clientWidth - carouselRef.current.clientWidth;

      if (newScrollPosition > maxScrollableWidth) {
        const overshoot = -newScrollPosition + maxScrollableWidth;
        if (overshoot < imageWidth * 5) {
          setOverShoot(overshoot / 10);
          hasOvershotRef.current = overshoot / 10;
        }
      }
    };

    // Set up a mouse up event listener to stop tracking the element's movement
    const onMouseUp = (event: MouseEvent) => {
      // Remove the mouse move and mouse up event listeners
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      // Due to React being react, a ref has to been used since the state sets weirdly.
      if (hasOvershotRef.current !== 0) {
        const overshootIndex = hasOvershotRef.current < 0 ? refs.current.length - 1 : 0;

        setSelectedImage(overshootIndex);
        onImageChange && onImageChange(overshootIndex);
        scrollToClosestChild(overshootIndex);
      } else if (event.clientX !== initialMousePosition) {
        const idx = getClosestChildIndex();
        scrollToClosestChild(idx);

        onImageChange && onImageChange(idx ?? 0);
      }

      // Reset
      setOverShoot(0);
      hasOvershotRef.current = 0;
      setIsMoving(false);
    };

    // Add the mouse move and mouse up event listeners
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const renderChild = (child: ReactNode, index: number) => {
    if (React.isValidElement(child)) {
      const extendedChild = child as React.ReactElement<ExtendedProps>;
      return React.cloneElement(extendedChild, {
        onMouseUp: (event: React.MouseEvent<HTMLElement>) => handleClickChild(event, index),
        ref: refs.current[index],
      });
    }

    throw new Error(`Child at index ${index} is not a valid React element`);
  };

  const handleClickChild = (event: React.MouseEvent, index: number) => {
    if (!carouselRef.current) return;
    const imageElement = event.currentTarget as HTMLElement;

    handleImageChange(index);

    const scrollLeft = imageElement.offsetLeft - carouselRef.current.offsetWidth / 2 + imageElement.offsetWidth / 2;
    carouselRef.current.scroll({ left: scrollLeft, behavior: "smooth" });
  };

  const handleClickNavigator = (index: number) => {
    setSelectedImage(index);
    scrollToClosestChild(index);

    onImageChange && onImageChange(index);
  };

  return (
    <Box component="div" className={styles.carousel} sx={{ width: `${width}` }}>
      <Box component="div" className={styles["carousel-container"]} onMouseDown={onMouseDown} ref={carouselRef}>
        <Box
          className={styles["carousel-inner-container"]}
          ref={innerRef}
          component="div"
          style={{
            transform: `translateX(${overShoot}px)`,
            transition: isMoving ? "none" : "transform 0.1s ease-in",
            gap: gap,
          }}>
          {Children.map(children, renderChild)}
        </Box>
      </Box>
      <Box component="div" sx={{ display: "flex", gap: "5px" }}>
        {Children.map(children, (_, idx) => (
          <Box
            component="div"
            className={styles["carousel-indicator-container"]}
            onClick={() => handleClickNavigator(idx)}>
            <Box
              component="div"
              key={idx}
              className={styles["carousel-indicator"]}
              style={{
                backgroundColor: idx === selectedImage ? "#0f0" : "gray",
              }}></Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ImageCarousel;

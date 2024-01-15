import React, { useEffect, useMemo, useRef, useState } from "react";

import { Html, PerspectiveCamera, RenderTexture, useGLTF } from "@react-three/drei";
import { ForwardRefComponent } from "@react-three/drei/helpers/ts-utils";
import { HtmlProps } from "@react-three/drei/web/Html";
import { GroupProps, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Outline, Scanline, Select, Selection } from "@react-three/postprocessing";
import * as THREE from "three";

import { useProjectContext } from "../../../context/ProjectContext";
import { useBlinking } from "../../hooks/useBlinking";
import styles from "./Commandline.module.css";
import BlinkingDot from "./components/BlinkingDot";

interface ICommandLineProps extends GroupProps {
  variant: "description" | "keywords";
}

const CommandLineScreen: React.FC<ICommandLineProps> = ({ variant, ...props }) => {
  const { selectedProject } = useProjectContext();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const { nodes, materials } = useGLTF("/computers_1-transformed.glb");

  //  const splitSentence = useMemo(() => text.split(/(?<=[.!?])\s/), [text]);

  // const [typedSentences, setTypedSentences] = useState<string[]>([]);
  // const [currentSentence, setCurrentSentence] = useState("");

  const endOfTextRef = React.useRef<HTMLDivElement>(null);

  // useFrame(() => {
  //   if (!flimmerRef.current) return;
  //   const rand = Math.random();
  //   if (rand > 0.9) {
  //     flimmerRef.current.opacity = THREE.MathUtils.lerp(flimmerRef.current.opacity, 1 * rand, 0.1);
  //   } else {
  //     flimmerRef.current.opacity = THREE.MathUtils.lerp(flimmerRef.current.opacity, 1.5 * rand, 0.1);
  //   }
  // });

  // useEffect(() => {
  //   const sentences = text.split(/(?<=[.!?])\s/); // Splits the text by sentence-ending punctuation followed by whitespace
  //   // let currentCharIndex = 0;
  //   // let sentenceIndex = 0;

  //   // const typingDelay = Math.max(Math.random() * 100, Math.min(50)); // Delay in ms between each character
  //   // const typingInterval = setInterval(() => {
  //   //   if (sentenceIndex < sentences.length) {
  //   //     const sentence = sentences[sentenceIndex];
  //   //     setCurrentSentence(sentence.substring(0, currentCharIndex));
  //   //     currentCharIndex++;

  //   //     if (currentCharIndex > sentence.length) {
  //   //       setTypedSentences(prevSentences => [...prevSentences, sentence]);
  //   //       sentenceIndex++;
  //   //       currentCharIndex = 0;
  //   //     }
  //   //   } else {
  //   //     clearInterval(typingInterval);
  //   //   }
  //   }, typingDelay);

  //   return () => clearInterval(typingInterval);
  // }, [text]);

  const renderKeywords = (keywords: string[]) => {
    return keywords.map((word, index) => (
      <>
        <span>
          {word}
          {index < keywords.length - 1 ? ", " : "."}
        </span>
      </>
    ));
  };

  return (
    <group {...props}>
      <mesh castShadow receiveShadow geometry={nodes["Object_218"].geometry} material={materials.Texture} />
      <mesh castShadow receiveShadow geometry={nodes["Object_219"].geometry}>
        <Html
          castShadow
          receiveShadow
          style={{ height: 35, width: 49, overflow: "hidden", filter: "blur(0.2px)" }}
          occlude
          transform
          distanceFactor={10}
          position={[0, 0.62, 0.2]}>
          <div className={styles.typewriter}>
            <p className={styles.paragraph}>
              <span>
                {variant === "description"
                  ? selectedProject.shortDescription
                  : renderKeywords(selectedProject.keywords)}
              </span>
              <BlinkingDot />
            </p>
            <span ref={endOfTextRef} />
          </div>
        </Html>
        <meshPhysicalMaterial transmission={1} roughness={0.8} ior={2} opacity={1} thickness={1}></meshPhysicalMaterial>
      </mesh>
    </group>
  );
};

export default CommandLineScreen;

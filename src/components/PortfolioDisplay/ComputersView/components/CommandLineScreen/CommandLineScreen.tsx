import React, { useEffect, useMemo, useState } from "react";

import { Html, PerspectiveCamera, RenderTexture, useGLTF } from "@react-three/drei";
import { ForwardRefComponent } from "@react-three/drei/helpers/ts-utils";
import { HtmlProps } from "@react-three/drei/web/Html";
import { GroupProps } from "@react-three/fiber";
import { Bloom, EffectComposer, Outline, Scanline, Select, Selection } from "@react-three/postprocessing";
import * as THREE from "three";

import styles from "./Commandline.module.css";

interface ICommandLineProps extends GroupProps {
  text: string;
}

const CommandLineScreen: React.FC<ICommandLineProps> = ({ text, ...props }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const { nodes, materials } = useGLTF("/computers_1-transformed.glb");

  const splitSentence = useMemo(() => text.split(/(?<=[.!?])\s/), [text]);

  const [typedSentences, setTypedSentences] = useState<string[]>([]);
  const [currentSentence, setCurrentSentence] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  const endOfTextRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the end of the text whenever it updates
    // endOfTextRef.current?.scrollTop = 40;
  }, []);

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

  useEffect(() => {
    const blinkCursorDelay = 500; // Delay in ms for cursor blink
    const cursorInterval = setInterval(() => {
      setCursorVisible(vis => !vis);
    }, blinkCursorDelay);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <group {...props}>
      <mesh castShadow receiveShadow geometry={nodes["Object_218"].geometry} material={materials.Texture} />
      {/* <Selection>
        <EffectComposer multisampling={8} autoClear={false} renderPriority={2}>
          <Outline blur visibleEdgeColor="white" edgeStrength={4} width={1000} />
        </EffectComposer>
        <Select enabled> */}
      <mesh castShadow receiveShadow geometry={nodes["Object_219"].geometry}>
        <Html
          castShadow
          receiveShadow
          style={{ height: 35, width: 47, overflow: "hidden", filter: "blur(0.2px)" }}
          occlude
          transform
          distanceFactor={10}
          position={[0, 0.62, 0.2]}>
          <div className={styles.typewriter}>
            <p className={styles.paragraph}>
              {/* {splitSentence.map((sentence, index) => (
            <p key={index} style={{ display: "inline" }}>
              {index !== 0 && (
                <>
                  <br />
                </>
              )}
              {` ${sentence}`}
            </p>
          ))} */}
              <span> {text}</span>
              <span style={{ opacity: cursorVisible ? 1 : 0, fontWeight: 700 }}>■</span>
              {/* Invisible div to manage the scroll */}
            </p>
            <span ref={endOfTextRef} />
          </div>
        </Html>
        <meshPhysicalMaterial
          transmission={1}
          roughness={0.6}
          ior={2}
          // transparent
          opacity={0.8}
          color="#ffffff"
          thickness={1}></meshPhysicalMaterial>
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes["Object_219"].geometry}>
        <meshBasicMaterial toneMapped={false} transparent opacity={0.01}>
          <RenderTexture width={1280} height={720} attach="map" anisotropy={16}>
            <PerspectiveCamera makeDefault aspect={1 / 1} position={[-5, 0, 15]} />
            <color attach="background" args={["rgba(255,255,255, 1)"]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} />
          </RenderTexture>
        </meshBasicMaterial>
      </mesh>
      {/* </Select>
      </Selection> */}
    </group>
  );
};

export default CommandLineScreen;

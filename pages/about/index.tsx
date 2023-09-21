import React, { Suspense } from "react";

import { Box } from "@mui/system";
import { Cloud, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import About from "../../src/components/About/About";
import { ContentfulImageType, ContentfulMD } from "../../src/types/Project";
import { getAboutMe } from "../../src/utils/contentful/contentful";

interface IIndex {
  about: ContentfulMD;
  profilePicture: ContentfulImageType;
  chatGpt: boolean;
  chatGptQuery: ContentfulMD;
  chatGptAnswer: ContentfulMD;
  chatGptAvatar: ContentfulImageType;
  chatGptSummarize: ContentfulMD;
  shortVersion: ContentfulMD;
}

const index: React.FC<IIndex> = ({
  about,
  profilePicture,
  chatGpt,
  chatGptQuery,
  chatGptAnswer,
  chatGptAvatar,
  chatGptSummarize,
  shortVersion,
}) => {
  return (
    <Box
      sx={{
        height: "calc(100vh - 50px)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
      }}>
      <About
        about={about}
        profilePicture={profilePicture}
        chatGpt={chatGpt}
        chatGptQuery={chatGptQuery}
        chatGptAnswer={chatGptAnswer}
        chatGptAvatar={chatGptAvatar}
        chatGptSummarize={chatGptSummarize}
        shortVersion={shortVersion}
      />

      <Box sx={{ width: "100%", height: "100%", position: "absolute", filter: "blur(5)", opacity: 0.25 }}>
        <Suspense fallback={null}>
          <Canvas dpr={[1, 2]} camera={{ fov: 70, position: [0, 0, 5] }}>
            <ambientLight intensity={1} />
            <Environment preset="city" blur={10} far={20} />
            <group position={[0, 0, 5]}>
              <Cloud width={15} speed={0.01} />
            </group>
          </Canvas>
        </Suspense>
      </Box>
    </Box>
  );
};

export const getStaticProps = async () => {
  const { items } = await getAboutMe();
  return {
    props: {
      about: items[0].fields.about,
      profilePicture: items[0].fields.profilePicture,
      chatGpt: items[0].fields?.chatGpt ?? false,
      chatGptQuery: items[0].fields?.chatGptQuery,
      chatGptAnswer: items[0].fields?.chatGptAnswer,
      chatGptAvatar: items[0].fields?.chatGptAvatar,
      chatGptSummarize: items[0].fields?.chatGptSummarize,
      shortVersion: items[0].fields?.shortVersion,
    },
  };
};

export default index;

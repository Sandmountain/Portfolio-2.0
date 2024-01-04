import { ReactNode, createContext, useMemo } from "react";

import { Merged, useGLTF } from "@react-three/drei";

type Instances = {
  [key: string]: THREE.Mesh;
};

export const MeshContext = createContext<any | null>(null);

export function Instances({ children }: { children: ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const { nodes, materials } = useGLTF("/computers_1-transformed.glb");

  const instances = useMemo(
    () => ({
      Keyboard: nodes.Object_4,
      Computer: nodes.Object_16,
      Object3: nodes.Object_52,
      Object13: nodes.Object_172,
      Object14: nodes.Object_174,
      Object23: nodes.Object_22,
      Object24: nodes.Object_26,
      Object32: nodes.Object_178,
      Object36: nodes.Object_28,
      Object45: nodes.Object_206,
      Object46: nodes.Object_207,
      Object47: nodes.Object_215,
      Object48: nodes.Object_216,
      Sphere: nodes.Sphere,
    }),
    [nodes],
  ) as Instances;
  return (
    <Merged castShadow receiveShadow meshes={instances}>
      {(instances: Instances) => (
        <MeshContext.Provider value={{ instances, nodes, materials }}>{children}</MeshContext.Provider>
      )}
    </Merged>
  );
}

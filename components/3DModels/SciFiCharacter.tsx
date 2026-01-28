import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";

function ThreeDModel(props: any) {
  const group = useRef<any>(null);
  const { scene, animations } = useGLTF("/models/primary_ion_drive.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play embedded GLTF animation
    const firstAction = actions[Object.keys(actions)[0]];
    firstAction?.play();
  }, [actions]);

  return (
    <group ref={group} {...props}>
      <primitive object={scene} scale={2.5} />
    </group>
  );
}

import React from "react";

const SciFiCharacter = () => {
  return (
    <div className="h-[750px]">
      <Canvas camera={{ position: [5, 5, 5], fov: 80 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <ThreeDModel />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} />
      </Canvas>
    </div>
  );
};

export default SciFiCharacter;

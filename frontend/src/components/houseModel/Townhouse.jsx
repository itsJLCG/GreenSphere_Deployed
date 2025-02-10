import { useTexture } from "@react-three/drei";
import React, { useState, useMemo } from "react";
import { Window } from "./SingleFamilyHouse.jsx";

const TownHouse = () => {
  const townTexture1 = useTexture("../assets/images/townwall1.jpg");
  const townTexture2 = useTexture("../assets/images/townwall2.jpg");
  const doorTexture = useTexture("../assets/images/door.jpg");
  const roofTexture = useTexture("../assets/images/townhouseroof.jpg");

  return (
    <group position={[0, 1, 0]}>
      {/* Base */}
      <mesh position={[0, 1.75, 0]}>
        <boxGeometry args={[5, 7.5, 6]} />
        <meshStandardMaterial map={townTexture2} />
      </mesh>
      <mesh position={[5, 2, 0]}>
        <boxGeometry args={[5, 8, 6]} />
        <meshStandardMaterial map={townTexture1} />
      </mesh>
      <mesh position={[-5, 2, 0]}>
        <boxGeometry args={[5, 8, 6]} />
        <meshStandardMaterial map={townTexture1} />
      </mesh>

      {/* Door */}
      <mesh position={[0, -0.5, 3.01]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial map={doorTexture} />
      </mesh>
      <mesh position={[5, -0.5, 3.01]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial map={doorTexture} />
      </mesh>
      <mesh position={[-5, -0.5, 3.01]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial map={doorTexture} />
      </mesh>

      {/* Windows */}
      <Window position={[-1.5, 3.5, 3.01]} />
      <Window position={[1.5, 3.5, 3.01]} />

      <Window position={[6.5, 3.5, 3.01]} />
      <Window position={[-6.5, 3.5, 3.01]} />

      <Window position={[3.5, 3.5, 3.01]} />
      <Window position={[-3.5, 3.5, 3.01]} />

      {/* Roof */}
      <mesh position={[0, 7, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[5, 4, 4]} />
        <meshStandardMaterial map={roofTexture} />
      </mesh>
      <mesh position={[5, 8, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[5, 4, 4]} />
        <meshStandardMaterial map={roofTexture} />
      </mesh>
      <mesh position={[-5, 8, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[5, 4, 4]} />
        <meshStandardMaterial map={roofTexture} />
      </mesh>
    </group>
  );
};

export default TownHouse;
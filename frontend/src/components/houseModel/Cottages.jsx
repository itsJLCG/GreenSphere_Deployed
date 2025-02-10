import { useTexture } from "@react-three/drei";
import React, { useState, useMemo } from "react";
import { Roofs } from "./SingleFamilyHouse.jsx";

const WindowCottage = ({ position }) => {
  const WindowCottage = useTexture("../assets/images/windowcottage.jpg"); // ✅ Fixed syntax

  return (
    <mesh position={position}>
      <boxGeometry args={[0.85, 1.5, 0.1]} /> {/* Window size remains the same */}
      <meshStandardMaterial map={WindowCottage} /> {/* ✅ Apply texture */}
    </mesh>
  );
};

const CottagesHouse = () => {
    const wallTexture = useTexture("../assets/images/cottagewall.webp");
    const doorTexture = useTexture("../assets/images/cottagedoor.jpg");
  
    return (
      <group position={[0, 0, 0]}>
        {/* Base */}
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[6, 6, 6]} />
          <meshStandardMaterial map={wallTexture} />
        </mesh>
  
        {/* Door */}
        <mesh position={[0, 0.5, 3.01]}>
          <boxGeometry args={[2, 3, 0.1]} />
          <meshStandardMaterial map={doorTexture} />
        </mesh>
  
        {/* Windows */}
        <WindowCottage position={[-2.5, 3, 3.01]} />
        <WindowCottage position={[2.5, 3, 3.01]} />
  
        {/* Automatically applying the Gable roof with custom texture */}
        <Roofs.Gable texturePath="../assets/images/cottageroof.jpg" />
      </group>
    );
  };

export default CottagesHouse;
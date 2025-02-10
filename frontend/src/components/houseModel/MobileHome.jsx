import { useTexture } from "@react-three/drei";
import React, { useState, useMemo } from "react";
import SolarPanel from "../renewableModel/SolarPanel.jsx";

const WindowMobile = ({ position }) => {
  const WindowCottage = useTexture("../assets/images/mobilewindow.jpg"); // ✅ Fixed syntax

  return (
    <mesh position={position}>
      <boxGeometry args={[0.85, 1.5, 0.1]} /> {/* Window size remains the same */}
      <meshStandardMaterial map={WindowCottage} /> {/* ✅ Apply texture */}
    </mesh>
  );
};

const MobileRoofGrid = ({ onSelect, solarPanels, setSolarPanels }) => {
  const gridSizeX = 5; // 5x3 grid for the mobile home roof
  const gridSizeY = 3;
  const cellSize = 2; // Each cell is 2x2 in size

  const handleClick = (row, col) => {
    const cellKey = `${row}-${col}`;
    // Toggle Solar Panel: Add if not there, remove if already placed
    if (solarPanels.some(([r, c]) => r === row && c === col)) {
      setSolarPanels(solarPanels.filter(([r, c]) => r !== row || c !== col));
    } else {
      setSolarPanels([...solarPanels, [row, col]]);
    }
  };

  return (
    <group position={[0, 4.51, 0]} rotation={[-Math.PI / 2, 0, 0]}> {/* Positioned on top of the mobile home */}
      {Array.from({ length: gridSizeY }).map((_, row) =>
        Array.from({ length: gridSizeX }).map((_, col) => {
          const x = (col - (gridSizeX - 1) / 2) * cellSize; // Centering the grid
          const y = (row - (gridSizeY - 1) / 2) * cellSize;
          const isSelected = solarPanels.some(([r, c]) => r === row && c === col);

          return (
            <mesh
              key={`${row}-${col}`}
              position={[x, y, 0]}
              onClick={() => handleClick(row, col)}
            >
              <planeGeometry args={[cellSize, cellSize]} />
              <meshStandardMaterial
                color={isSelected ? "yellow" : "green"}
                transparent={true}
                opacity={isSelected ? 0 : 0.5}
              />
            </mesh>
          );
        })
      )}

      {/* Render Solar Panels */}
      {solarPanels.map(([row, col], index) => {
        const x = (col - (gridSizeX - 1) / 2) * cellSize;
        const y = (row - (gridSizeY - 1) / 2) * cellSize;
        return <SolarPanel key={index} position={[x, y, 0.1]} />;
      })}
    </group>
  );
};

const MobileHome = ({ showSolarPanels }) => {
  const wallTexture = useTexture("../assets/images/mobilewall.jpg");
  const doorTexture = useTexture("../assets/images/mobiledoor.jpg");
  const wheelTexture = useTexture("../assets/images/wheel.jpg");
  const [solarPanels, setSolarPanels] = useState([]);

  return (
    <group position={[0, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[10, 4, 5]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 1.5, 2.6]}>
        <boxGeometry args={[3, 2.5, 0.1]} />
        <meshStandardMaterial map={doorTexture} />
      </mesh>

      {/* Windows */}
      <WindowMobile position={[-3, 2, 2.6]} />
      <WindowMobile position={[3, 2, 2.6]} />

      {/* Roof */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[10.15, 1, 5.95]} />
        <meshStandardMaterial map={useTexture("../assets/images/mobileroof.jpg")} />
      </mesh>

      {/* Solar Grid - Only show when `showSolarPanels` is true */}
      {showSolarPanels && <MobileRoofGrid solarPanels={solarPanels} setSolarPanels={setSolarPanels} />}

      {/* Wheels */}
      <mesh position={[-4, 0, 2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.5, 32]} />
        <meshStandardMaterial map={wheelTexture} />
      </mesh>
      <mesh position={[4, 0, 2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.5, 32]} />
        <meshStandardMaterial map={wheelTexture} />
      </mesh>
      <mesh position={[-4, 0, -2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.5, 32]} />
        <meshStandardMaterial map={wheelTexture} />
      </mesh>
      <mesh position={[4, 0, -2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.5, 32]} />
        <meshStandardMaterial map={wheelTexture} />
      </mesh>
    </group>
  );
};

export default MobileHome;

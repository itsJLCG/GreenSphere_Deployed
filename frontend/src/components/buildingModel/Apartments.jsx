import { useTexture } from "@react-three/drei";
import React, { useState, useMemo } from "react";
import SolarPanel from "../renewableModel/SolarPanel";

const ApartmentRoofGrid = ({ onSelect, solarPanels, setSolarPanels }) => {
  const gridWidth = 6; // 6 columns
  const gridHeight = 4; // 4 rows
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
      <group position={[0, 18.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {Array.from({ length: gridHeight }).map((_, row) =>
              Array.from({ length: gridWidth }).map((_, col) => {
                  const x = (col - (gridWidth - 1) / 2) * cellSize; // Centering the grid
                  const y = (row - (gridHeight - 1) / 2) * cellSize;
                  const isSelected = solarPanels.some(([r, c]) => r === row && c === col);

                  return (
                      <mesh
                          key={`${row}-${col}`}
                          position={[x, y, 0]} // Positions grid cells flat on the roof
                          onClick={() => handleClick(row, col)}
                      >
                          <planeGeometry args={[cellSize, cellSize]} />
                          <meshStandardMaterial
                              color={isSelected ? "yellow" : "green"}
                              transparent={true}
                              opacity={isSelected ? 0 : 0.5} // Make grid transparent if panel placed
                          />
                      </mesh>
                  );
              })
          )}

          {/* Render Solar Panels */}
          {solarPanels.map(([row, col], index) => {
              const x = (col - (gridWidth - 1) / 2) * cellSize;
              const y = (row - (gridHeight - 1) / 2) * cellSize;
              return <SolarPanel key={index} position={[x, y, 0]} />;
          })}
      </group>
  );
};

const ApartmentsBuilding = ({ showSolarPanels }) => {
  const wallTexture = useTexture("../assets/images/apartmentwall.avif");
  const roofTexture = useTexture("../assets/images/apartmentroof.webp");
  const [solarPanels, setSolarPanels] = useState([]);

  return (
    <group position={[0, 1.5, 0]}>
      {/* Floors (Stacked boxes to form a tall apartment) */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[0, i * 5, 0]}>
          <boxGeometry args={[12, 5, 8]} />
          <meshStandardMaterial map={wallTexture} />
        </mesh>
      ))}

      {/* Roof */}
      <mesh position={[0, 17.75, 0]}>
        <boxGeometry args={[12, 0.5, 8.5]} />
        <meshStandardMaterial map={roofTexture} />
      </mesh>

      {/* Show Apartment Roof Grid only when Solar Panels are enabled */}
      {showSolarPanels && <ApartmentRoofGrid solarPanels={solarPanels} setSolarPanels={setSolarPanels} />}
    </group>
  );
};

export default ApartmentsBuilding;

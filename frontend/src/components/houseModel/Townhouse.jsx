import { useTexture } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import React, { useState, useMemo } from "react";
import { Window } from "./SingleFamilyHouse.jsx";

export const SolarWaterHeatingTiles = ({ onSelect, solarWaterHeating, setSolarWaterHeating, showSolarWaterHeating }) => {
  const gltf = useGLTF("../assets/models/solarwaterheater.glb");

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -2, 0];

  // House boundaries based on new walls
  const walls = [
    { position: [0, 1.75, 0], size: [5, 7.5, 6] },  // Base
    { position: [5, 2, 0], size: [5, 8, 6] },       // Right Wall
    { position: [-5, 2, 0], size: [5, 8, 6] }       // Left Wall
  ];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid (not inside any wall)
  const isValidPosition = (x, z) => {
    return !walls.some(({ position, size }) => {
      const xMin = position[0] - size[0] / 2;
      const xMax = position[0] + size[0] / 2;
      const zMin = position[2] - size[2] / 2;
      const zMax = position[2] + size[2] / 2;

      return x >= xMin && x <= xMax && z >= zMin && z <= zMax;
    });
  };

  // Handle grid cell click
  const handleClick = (x, z) => {
    if (!showSolarWaterHeating) return; // Prevent placement when slot is closed

    onSelect?.(x, z); // Trigger parent logic if provided

    setSolarWaterHeating((prevTiles) => {
      const exists = prevTiles.some(tile => tile.x === x && tile.z === z);
      return exists
        ? prevTiles.filter(tile => tile.x !== x || tile.z !== z) // Remove if clicked again
        : [...prevTiles, { x, z }]; // Add if not exists
    });
  };

  return (
    <>
      {/* Clickable Grid (Only active when showSolarWaterHeating is true) */}
      {showSolarWaterHeating &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - gridSize / 2) * cellSize + cellSize / 2;
            const z = (row - gridSize / 2) * cellSize + cellSize / 2;

            if (!isValidPosition(x, z)) return null;

            const isPlaced = solarWaterHeating.some(tile => tile.x === x && tile.z === z);

            return (
              <mesh
                key={`${x}-${z}`}
                position={[x, platformCenter[1] + 0.01, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={() => handleClick(x, z)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial
                  color={isPlaced ? "yellow" : "green"}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            );
          })
        )}

      {/* Always Render Placed Solar Water Heaters */}
      {solarWaterHeating.map(({ x, z }, index) => (
        <primitive
          key={`${x}-${z}-${index}`}
          object={gltf.scene.clone()}
          position={[x, -1.60, z]} // Adjusted Y-position
          scale={[3.5, 3.5, 3.5]} // Increased scale
        />
      ))}
    </>
  );
};

export const MicroHydroPowerSystemTiles = ({ onSelect, microHydroPowerSystem, setMicroHydroPowerSystem, showMicroHydroPowerSystem }) => {
  const gltf = useGLTF("../assets/models/microHydropowerSystem.glb");

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -2, 0];

  // House boundaries based on new walls
  const walls = [
    { position: [0, 1.75, 0], size: [5, 7.5, 6] },  // Base
    { position: [5, 2, 0], size: [5, 8, 6] },       // Right Wall
    { position: [-5, 2, 0], size: [5, 8, 6] }       // Left Wall
  ];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid (not inside any wall)
  const isValidPosition = (x, z) => {
    return !walls.some(({ position, size }) => {
      const xMin = position[0] - size[0] / 2;
      const xMax = position[0] + size[0] / 2;
      const zMin = position[2] - size[2] / 2;
      const zMax = position[2] + size[2] / 2;

      return x >= xMin && x <= xMax && z >= zMin && z <= zMax;
    });
  };

  // Handle grid cell click
  const handleClick = (x, z) => {
    if (!showMicroHydroPowerSystem) return; // Prevent placement when slot is closed

    onSelect?.(x, z); // Trigger parent logic if provided

    setMicroHydroPowerSystem((prevTiles) => {
      const exists = prevTiles.some(tile => tile.x === x && tile.z === z);
      return exists
        ? prevTiles.filter(tile => tile.x !== x || tile.z !== z) // Remove if clicked again
        : [...prevTiles, { x, z }]; // Add if not exists
    });
  };

  return (
    <>
      {/* Clickable Grid (Only active when showMicroHydroPowerSystem is true) */}
      {showMicroHydroPowerSystem &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - gridSize / 2) * cellSize + cellSize / 2;
            const z = (row - gridSize / 2) * cellSize + cellSize / 2;

            if (!isValidPosition(x, z)) return null;

            const isPlaced = microHydroPowerSystem.some(tile => tile.x === x && tile.z === z);

            return (
              <mesh
                key={`${x}-${z}`}
                position={[x, platformCenter[1] + 0.01, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={() => handleClick(x, z)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial
                  color={isPlaced ? "green" : "brown"}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            );
          })
        )}

      {/* Always Render Placed Micro Hydro Power Systems */}
      {microHydroPowerSystem.map(({ x, z }, index) => (
        <primitive
          key={`${x}-${z}-${index}`}
          object={gltf.scene.clone()}
          position={[x, -2, z]} // Adjusted Y-position
          scale={[0.7, 0.7, 0.7]} // Increased scale
          rotation={[0, Math.PI / 2, 0]} // Rotates 90 degrees to the left
        />
      ))}
    </>
  );
};

export const SmallWindTurbinesTiles = ({ onSelect, smallWindTurbines, setSmallWindTurbines, showSmallWindTurbines }) => {
  const gltf = useGLTF("../assets/models/windTurbine.glb");

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -2, 0];

  // House boundaries (Increased size to 14)
  const houseSize = 14;
  const houseCenter = [0, 2, 0];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid (Excluding house area and first two rows)
  const isValidPosition = (x, z, row) => {
    // Remove first two rows from recommendation
    if (row < 3) return false;

    const houseXMin = houseCenter[0] - houseSize / 2;
    const houseXMax = houseCenter[0] + houseSize / 2;
    const houseZMin = houseCenter[2] - houseSize / 2;
    const houseZMax = houseCenter[2] + houseSize / 2;

    return !(x >= houseXMin && x <= houseXMax && z >= houseZMin && z <= houseZMax);
  };

  // Handle grid cell click
  const handleClick = (x, z) => {
    if (!showSmallWindTurbines) return;

    onSelect?.(x, z);

    setSmallWindTurbines((prevTiles) => {
      const exists = prevTiles.some(tile => tile.x === x && tile.z === z);
      return exists
        ? prevTiles.filter(tile => tile.x !== x || tile.z !== z)
        : [...prevTiles, { x, z }];
    });
  };

  return (
    <>
      {/* Clickable Grid (Only active when showSmallWindTurbines is true) */}
      {showSmallWindTurbines &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - gridSize / 2) * cellSize + cellSize / 2;
            const z = (row - gridSize / 2) * cellSize + cellSize / 2;

            if (!isValidPosition(x, z, row)) return null;

            const isPlaced = smallWindTurbines.some(tile => tile.x === x && tile.z === z);

            return (
              <mesh
                key={`${x}-${z}`}
                position={[x, platformCenter[1] + 0.01, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={() => handleClick(x, z)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial
                  color={isPlaced ? "green" : "red"}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            );
          })
        )}

      {/* Always Render Placed SmallWindTurbines */}
      {smallWindTurbines.map(({ x, z }, index) => (
        <primitive
          key={`${x}-${z}-${index}`}
          object={gltf.scene.clone()}
          position={[x, -2, z]}
          scale={[0.6, 0.6, 0.6]}
        />
      ))}
    </>
  );
};

export const VerticalAxisWindTurbinesTiles = ({ onSelect, verticalAxisWindTurbines, setVerticalAxisWindTurbines, showVerticalAxisWindTurbines }) => {
  const gltf = useGLTF("../assets/models/verticalAxisWindTurbine.glb");

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -2, 0];

  // House boundaries (Increased size to 14)
  const houseSize = 14;
  const houseCenter = [0, 2, 0];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid (Excluding house area and first two rows)
  const isValidPosition = (x, z, row) => {
    // Remove first two rows from recommendation
    if (row < 3) return false;

    const houseXMin = houseCenter[0] - houseSize / 2;
    const houseXMax = houseCenter[0] + houseSize / 2;
    const houseZMin = houseCenter[2] - houseSize / 2;
    const houseZMax = houseCenter[2] + houseSize / 2;

    return !(x >= houseXMin && x <= houseXMax && z >= houseZMin && z <= houseZMax);
  };

  // Handle grid cell click
  const handleClick = (x, z) => {
    if (!showVerticalAxisWindTurbines) return;

    onSelect?.(x, z);

    setVerticalAxisWindTurbines((prevTiles) => {
      const exists = prevTiles.some(tile => tile.x === x && tile.z === z);
      return exists
        ? prevTiles.filter(tile => tile.x !== x || tile.z !== z)
        : [...prevTiles, { x, z }];
    });
  };

  return (
    <>
      {/* Clickable Grid (Only active when showVerticalAxisWindTurbines is true) */}
      {showVerticalAxisWindTurbines &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - gridSize / 2) * cellSize + cellSize / 2;
            const z = (row - gridSize / 2) * cellSize + cellSize / 2;

            if (!isValidPosition(x, z, row)) return null;

            const isPlaced = verticalAxisWindTurbines.some(tile => tile.x === x && tile.z === z);

            return (
              <mesh
                key={`${x}-${z}`}
                position={[x, platformCenter[1] + 0.01, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={() => handleClick(x, z)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial
                  color={isPlaced ? "green" : "violet"}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            );
          })
        )}

      {/* Always Render Placed VerticalAxisWindTurbines */}
      {verticalAxisWindTurbines.map(({ x, z }, index) => (
        <primitive
          key={`${x}-${z}-${index}`}
          object={gltf.scene.clone()}
          position={[x, 3.75, z]}
          scale={[3, 3, 4]}
          rotation={[Math.PI / 2, 0, 0]} // Rotate the model upright
        />
      ))}

    </>
  );
};

export const HeatPumpTiles = ({ onSelect, heatPump, setHeatPump, showHeatPump }) => {
  const gltf = useGLTF("../assets/models/heatPump.glb");

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -2, 0];

  // Recommended Zones (Buildings)
  const recommendedZones = [
    { center: [0, 1.75, 0], size: [5, 7.5, 6] },  // Central building
    { center: [5, 2, 0], size: [5, 8, 6] },      // Right building
    { center: [-5, 2, 0], size: [5, 8, 6] }      // Left building
  ];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is inside a recommended area
  const isValidPosition = (x, z) => {
    return recommendedZones.some(({ center, size }) => {
      const xMin = center[0] - size[0] / 2;
      const xMax = center[0] + size[0] / 2;
      const zMin = center[2] - size[2] / 2;
      const zMax = center[2] + size[2] / 2;

      return x >= xMin && x <= xMax && z >= zMin && z <= zMax;
    });
  };

  // Handle grid cell click
  const handleClick = (x, z) => {
    if (!showHeatPump) return;

    onSelect?.(x, z);

    setHeatPump((prevTiles) => {
      const exists = prevTiles.some(tile => tile.x === x && tile.z === z);
      return exists
        ? prevTiles.filter(tile => tile.x !== x || tile.z !== z)
        : [...prevTiles, { x, z }];
    });
  };

  return (
    <>
      {/* Clickable Grid (Only active when showHeatPump is true) */}
      {showHeatPump &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - gridSize / 2) * cellSize + cellSize / 2;
            const z = (row - gridSize / 2) * cellSize + cellSize / 2;

            if (!isValidPosition(x, z)) return null; // Now allows placement **inside** the buildings only

            const isPlaced = heatPump.some(tile => tile.x === x && tile.z === z);

            return (
              <mesh
                key={`${x}-${z}`}
                position={[x, platformCenter[1] + 0.01, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={() => handleClick(x, z)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial
                  color={isPlaced ? "yellow" : "blue"} // Highlight placed tiles
                  transparent
                  opacity={0.5}
                />
              </mesh>
            );
          })
        )}

      {/* Always Render Placed Heat Pumps */}
      {heatPump.map(({ x, z }, index) => (
        <primitive
          key={`${x}-${z}-${index}`}
          object={gltf.scene.clone()}
          position={[x, -5.50, z]}
          scale={[3, 3, 3]}
        />
      ))}
    </>
  );
};

const TownHouse = ({ roofType, showSolarPanels, showSolarRoofTiles, showSolarWaterHeating, showHeatPump, showSmallWindTurbines, showVerticalAxisWindTurbines, showMicroHydroPowerSystem }) => {
  const townTexture1 = useTexture("../assets/images/townwall1.jpg");
  const townTexture2 = useTexture("../assets/images/townwall2.jpg");
  const doorTexture = useTexture("../assets/images/door.jpg");
  const roofTexture = useTexture("../assets/images/townhouseroof.jpg");
  const [solarWaterHeating, setSolarWaterHeating] = useState([]);
  const [heatPump, setHeatPump] = useState([]);
  const [smallWindTurbines, setSmallWindTurbines] = useState([]);
  const [verticalAxisWindTurbines, setVerticalAxisWindTurbines] = useState([]);
  const [microHydroPowerSystem, setMicroHydroPowerSystem] = useState([]);

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

      <SolarWaterHeatingTiles
        solarWaterHeating={solarWaterHeating}
        setSolarWaterHeating={setSolarWaterHeating}
        showSolarWaterHeating={showSolarWaterHeating}
      />
      <HeatPumpTiles
        heatPump={heatPump}
        setHeatPump={setHeatPump}
        showHeatPump={showHeatPump}
      /> 
      <SmallWindTurbinesTiles
        smallWindTurbines={smallWindTurbines}
        setSmallWindTurbines={setSmallWindTurbines}
        showSmallWindTurbines={showSmallWindTurbines}
      />
      <VerticalAxisWindTurbinesTiles
        verticalAxisWindTurbines={verticalAxisWindTurbines}
        setVerticalAxisWindTurbines={setVerticalAxisWindTurbines}
        showVerticalAxisWindTurbines={showVerticalAxisWindTurbines}
      />
      <MicroHydroPowerSystemTiles
        microHydroPowerSystem={microHydroPowerSystem}
        setMicroHydroPowerSystem={setMicroHydroPowerSystem}
        showMicroHydroPowerSystem={showMicroHydroPowerSystem}
      />
    </group>
  );
};

export default TownHouse;
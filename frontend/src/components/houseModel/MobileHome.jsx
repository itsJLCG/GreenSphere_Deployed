import { useTexture, useGLTF } from "@react-three/drei";
import React, { useState, useMemo } from "react";
import SolarPanel from "../renewableModel/SolarPanel.jsx";
import TechnoEconomicAnalysis from "../TechnoEconomicAnalysis.jsx";
import { Html } from "@react-three/drei";

export const SolarWaterHeatingTiles = ({ onSelect, solarWaterHeating, setSolarWaterHeating, showSolarWaterHeating }) => {
  const gltf = useGLTF("../assets/models/solarwaterheater.glb");

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -1, 0];

  // House boundaries based on new walls
  const walls = [
    { position: [0, 1.75, 0], size: [5, 7.5, 6] },  // Base
    { position: [4, 2, 0], size: [4, 8, 6] },       // Right Wall
    { position: [-4, 2, 0], size: [4, 8, 6] }       // Left Wall
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
          position={[x, -0.6, z]} // Adjusted Y-position
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
  const platformCenter = [0, -1, 0];

  // House boundaries based on new walls
  const walls = [
    { position: [0, 1.75, 0], size: [5, 7.5, 6] },  // Base
    { position: [4, 2, 0], size: [4, 8, 6] },       // Right Wall
    { position: [-4, 2, 0], size: [4, 8, 6] }       // Left Wall
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
          position={[x, -1, z]} // Adjusted Y-position
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
  const platformCenter = [0, -1, 0];

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
          position={[x, -1, z]}
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
  const platformCenter = [0, -1, 0];

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
          position={[x, 4.75, z]}
          scale={[3, 3, 4]}
          rotation={[Math.PI / 2, 0, 0]} // Rotate the model upright
        />
      ))}

    </>
  );
};

export const PicoHydroPowerTiles = ({ onSelect, picoHydroPower, setPicoHydroPower, showPicoHydroPower }) => {
  const gltf = useGLTF("../assets/models/picoHydroPower.glb");

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -1, 0];

  // House boundaries excluding base and center area
  const walls = [
    { position: [4, 2, 0], size: [4, 8, 6] },       // Right Wall
    { position: [-4, 2, 0], size: [4, 8, 6] },      // Left Wall
    { position: [0, 1.75, 0], size: [6, 7.5, 6] }   // Center Area (Base of House)
  ];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid (not inside any wall or center area)
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
    if (!showPicoHydroPower) return; // Prevent placement when slot is closed

    onSelect?.(x, z); // Trigger parent logic if provided

    setPicoHydroPower((prevTiles) => {
      const exists = prevTiles.some(tile => tile.x === x && tile.z === z);
      return exists
        ? prevTiles.filter(tile => tile.x !== x || tile.z !== z) // Remove if clicked again
        : [...prevTiles, { x, z }]; // Add if not exists
    });
  };

  return (
    <>
      {/* Clickable Grid (Only active when showPicoHydroPower is true) */}
      {showPicoHydroPower &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - gridSize / 2) * cellSize + cellSize / 2;
            const z = (row - gridSize / 2) * cellSize + cellSize / 2;

            if (!isValidPosition(x, z)) return null;

            const isPlaced = picoHydroPower.some(tile => tile.x === x && tile.z === z);

            return (
              <mesh
                key={`${x}-${z}`}
                position={[x, platformCenter[1] + 0.01, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={() => handleClick(x, z)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial
                  color={isPlaced ? "green" : "black"}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            );
          })
        )}

      {/* Always Render Placed Pico Hydro Power Systems */}
      {picoHydroPower.map(({ x, z }, index) => (
        <primitive
          key={`${x}-${z}-${index}`}
          object={gltf.scene.clone()}
          position={[x, -1, z]} // Adjusted Y-position
          scale={[0.1, 0.1, 0.1]} // Increased scale
          rotation={[Math.PI / -2, 0, 0]} // Rotates 90 degrees to the left
        />
      ))}
    </>
  );
};


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

const MobileHome = ({ roofType, showSolarPanels, showSolarRoofTiles, showSolarWaterHeating, showSmallWindTurbines, showVerticalAxisWindTurbines, showMicroHydroPowerSystem, showPicoHydroPower }) => {
  const wallTexture = useTexture("../assets/images/mobilewall.jpg");
  const doorTexture = useTexture("../assets/images/mobiledoor.jpg");
  const wheelTexture = useTexture("../assets/images/wheel.jpg");
  const [solarPanels, setSolarPanels] = useState([]);
  const [solarWaterHeating, setSolarWaterHeating] = useState([]);
  const [smallWindTurbines, setSmallWindTurbines] = useState([]);
  const [verticalAxisWindTurbines, setVerticalAxisWindTurbines] = useState([]);
  const [microHydroPowerSystem, setMicroHydroPowerSystem] = useState([]);
  const [picoHydroPower, setPicoHydroPower] = useState([]);

  return (
    <group position={[0, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[10, 4, 5]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Lamp on the Wall */}
      <mesh position={[-4.5, 2.9, 2.40]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={showSolarPanels ? "yellow" : "black"} />
      </mesh>

      <mesh position={[4.5, 2.9, 2.40]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={showSolarPanels ? "yellow" : "black"} />
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

      <SolarWaterHeatingTiles
        solarWaterHeating={solarWaterHeating}
        setSolarWaterHeating={setSolarWaterHeating}
        showSolarWaterHeating={showSolarWaterHeating}
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
      <PicoHydroPowerTiles
        picoHydroPower={picoHydroPower}
        setPicoHydroPower={setPicoHydroPower}
        showPicoHydroPower={showPicoHydroPower}
      />

      {/* For Analysis */}
      <Html>
        <TechnoEconomicAnalysis
          solarPanels={solarPanels}
          solarWaterHeating={solarWaterHeating}
          smallWindTurbines={smallWindTurbines}
          verticalAxisWindTurbines={verticalAxisWindTurbines}
          microHydroPowerSystem={microHydroPowerSystem}
          picoHydroPower={picoHydroPower}
        />
      </Html>

    </group>
  );
};

export default MobileHome;

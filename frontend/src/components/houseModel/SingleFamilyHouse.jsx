import { useTexture } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import SolarPanel from "../renewableModel/SolarPanel.jsx";
import SolarRoofTiles from "../renewableModel/SolarRoofTiles.jsx";
import React, { useState } from "react";

const SolarWaterHeatingTiles = ({ onSelect, solarWaterHeating, setSolarWaterHeating, showSolarWaterHeating }) => {
  const gltf = useGLTF("../assets/models/solarwaterheater.glb");

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -1, 0];

  // House boundaries
  const houseSize = 6;
  const houseCenter = [0, 2, 0];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid
  const isValidPosition = (x, z) => {
    const houseXMin = houseCenter[0] - houseSize / 2;
    const houseXMax = houseCenter[0] + houseSize / 2;
    const houseZMin = houseCenter[2] - houseSize / 2;
    const houseZMax = houseCenter[2] + houseSize / 2;

    return !(x >= houseXMin && x <= houseXMax && z >= houseZMin && z <= houseZMax);
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
          position={[x, -0.5, z]} // Adjusted Y-position
          scale={[3.5, 3.5, 3.5]} // Increased scale
        />
      ))}
    </>
  );
};

const MicroHydroPowerSystemTiles = ({ onSelect, microHydroPowerSystem, setMicroHydroPowerSystem, showMicroHydroPowerSystem }) => {
  const gltf = useGLTF("../assets/models/microHydropowerSystem.glb");

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -1, 0];

  // House boundaries
  const houseSize = 6;
  const houseCenter = [0, 2, 0];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid
  const isValidPosition = (x, z) => {
    const houseXMin = houseCenter[0] - houseSize / 2;
    const houseXMax = houseCenter[0] + houseSize / 2;
    const houseZMin = houseCenter[2] - houseSize / 2;
    const houseZMax = houseCenter[2] + houseSize / 2;

    return !(x >= houseXMin && x <= houseXMax && z >= houseZMin && z <= houseZMax);
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

      {/* Always Render Placed MicroHydroPowerSystem */}
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

const HeatPumpTiles = ({ onSelect, heatPump, setHeatPump, showHeatPump }) => {
  const gltf = useGLTF("../assets/models/heatPump.glb");

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -1, 0];

  // House boundaries (Now the recommended area)
  const houseSize = 6;
  const houseCenter = [0, 2, 0];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid (Reversed logic)
  const isValidPosition = (x, z) => {
    const houseXMin = houseCenter[0] - houseSize / 2;
    const houseXMax = houseCenter[0] + houseSize / 2;
    const houseZMin = houseCenter[2] - houseSize / 2;
    const houseZMax = houseCenter[2] + houseSize / 2;

    // Now it only allows positions inside the house boundaries
    return x >= houseXMin && x <= houseXMax && z >= houseZMin && z <= houseZMax;
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

            if (!isValidPosition(x, z)) return null; // Now, it only allows placements inside the house boundaries

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

      {/* Always Render Placed Solar Water Heaters */}
      {heatPump.map(({ x, z }, index) => (
        <primitive
          key={`${x}-${z}-${index}`}
          object={gltf.scene.clone()}
          position={[x, -4.50, z]}
          scale={[3, 3, 3]}
        />
      ))}
    </>
  );
};

const SmallWindTurbinesTiles = ({ onSelect, smallWindTurbines, setSmallWindTurbines, showSmallWindTurbines }) => {
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

const VerticalAxisWindTurbinesTiles = ({ onSelect, verticalAxisWindTurbines, setVerticalAxisWindTurbines, showVerticalAxisWindTurbines }) => {
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
          position={[x, 4.7, z]}
          scale={[3, 3, 4]}
          rotation={[Math.PI / 2, 0, 0]} // Rotate the model upright
        />
      ))}

    </>
  );
};

// Flat Roof Grid with Solar Panels Toggle
const FlatRoofGrid = ({ onSelect, solarPanels, setSolarPanels, showSolarPanels }) => {
  const gridSize = 3; // 3x3 grid
  const cellSize = 2; // Each cell is 2x2 in size

  const handleClick = (row, col) => {
    const cellKey = `${row}-${col}`;
    // Toggle Solar Panel: Add if not there, remove if already placed
    if (solarPanels.some(([r, c]) => r === row && c === col)) {
      // If the panel is already there, remove it
      setSolarPanels(solarPanels.filter(([r, c]) => r !== row || c !== col));
    } else {
      // Otherwise, add the panel
      setSolarPanels([...solarPanels, [row, col]]);
    }
  };

  return (
    <group position={[0, 6.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {showSolarPanels && Array.from({ length: gridSize }).map((_, row) =>
        Array.from({ length: gridSize }).map((_, col) => {
          const x = (col - 1) * cellSize; // Centering the grid
          const y = (row - 1) * cellSize;
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
        const x = (col - 1) * cellSize;
        const y = (row - 1) * cellSize;
        return <SolarPanel key={index} position={[x, y, 0]} />;
      })}
    </group>
  );
};

const FlatRoofGridTiles = ({ onSelect, solarRoofTiles, setSolarRoofTiles, showSolarRoofTiles }) => {
  const gridSize = 3; // 3x3 grid
  const cellSize = 2; // Each cell is 2x2 in size

  const handleClick = (row, col) => {
    const cellKey = `${row}-${col}`;
    // Toggle Solar Panel: Add if not there, remove if already placed
    if (solarRoofTiles.some(([r, c]) => r === row && c === col)) {
      // If the panel is already there, remove it
      setSolarRoofTiles(solarRoofTiles.filter(([r, c]) => r !== row || c !== col));
    } else {
      // Otherwise, add the panel
      setSolarRoofTiles([...solarRoofTiles, [row, col]]);
    }
  };

  return (
    <group position={[0, 6.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {showSolarRoofTiles && Array.from({ length: gridSize }).map((_, row) =>
        Array.from({ length: gridSize }).map((_, col) => {
          const x = (col - 1) * cellSize; // Centering the grid
          const y = (row - 1) * cellSize;
          const isSelected = solarRoofTiles.some(([r, c]) => r === row && c === col);

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
      {solarRoofTiles.map(([row, col], index) => {
        const x = (col - 1) * cellSize;
        const y = (row - 1) * cellSize;
        return <SolarRoofTiles key={index} position={[x, y, 0]} />;
      })}
    </group>
  );
};

const ShedRoofGrid = ({ solarPanels, setSolarPanels, showSolarPanels }) => {
  const gridSize = 3; // 3x3 grid
  const cellSize = 2; // Each cell is 2x2
  const roofAngle = Math.PI / 2.221; // Adjust based on your roof's slope
  const roofHeight = 6.5; // Raised slightly to fit exactly on the roof

  const handleClick = (row, col) => {
    const cellKey = `${row}-${col}`;
    if (solarPanels.some(([r, c]) => r === row && c === col)) {
      setSolarPanels(solarPanels.filter(([r, c]) => r !== row || c !== col));
    } else {
      setSolarPanels([...solarPanels, [row, col]]);
    }
  };

  return (
    <group position={[0, roofHeight, 0]} rotation={[-roofAngle, 0, 0]}>
      {/* Clickable Grid for Solar Panels */}
      {showSolarPanels &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - 1) * cellSize;
            const y = (row - 1) * cellSize;
            const isSelected = solarPanels.some(([r, c]) => r === row && c === col);

            return (
              <mesh
                key={`${row}-${col}`}
                position={[x, y, 0.01]}
                onClick={() => handleClick(row, col)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial color={isSelected ? 'yellow' : 'green'} transparent opacity={isSelected ? 0 : 0.5} />
              </mesh>
            );
          })
        )}

      {/* Render Solar Panels */}
      {solarPanels.map(([row, col], index) => {
        const x = (col - 1) * cellSize;
        const y = (row - 1) * cellSize;
        return <SolarPanel key={index} position={[x, y, 0.1]} />;
      })}
    </group>
  );
};

const ShedRoofGridTiles = ({ solarRoofTiles, setSolarRoofTiles, showSolarRoofTiles }) => {
  const gridSize = 3; // 3x3 grid
  const cellSize = 2; // Each cell is 2x2
  const roofAngle = Math.PI / 2.221; // Adjust based on your roof's slope
  const roofHeight = 6.5; // Raised slightly to fit exactly on the roof

  const handleClick = (row, col) => {
    const cellKey = `${row}-${col}`;
    if (solarRoofTiles.some(([r, c]) => r === row && c === col)) {
      setSolarRoofTiles(solarRoofTiles.filter(([r, c]) => r !== row || c !== col));
    } else {
      setSolarRoofTiles([...solarRoofTiles, [row, col]]);
    }
  };

  return (
    <group position={[0, roofHeight, 0]} rotation={[-roofAngle, 0, 0]}>
      {/* Clickable Grid for Solar Panels */}
      {showSolarRoofTiles &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - 1) * cellSize;
            const y = (row - 1) * cellSize;
            const isSelected = solarRoofTiles.some(([r, c]) => r === row && c === col);

            return (
              <mesh
                key={`${row}-${col}`}
                position={[x, y, 0.01]}
                onClick={() => handleClick(row, col)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial color={isSelected ? 'yellow' : 'green'} transparent opacity={isSelected ? 0 : 0.5} />
              </mesh>
            );
          })
        )}

      {/* Render Solar Roof Tiles */}
      {solarRoofTiles.map(([row, col], index) => {
        const x = (col - 1) * cellSize;
        const y = (row - 1) * cellSize;
        return <SolarRoofTiles key={index} position={[x, y, 0.1]} />;
      })}
    </group>
  );
};

const ButterflyRoofGrid = ({ solarPanels, setSolarPanels, showSolarPanels }) => {
  const gridSize = 3; // 3x3 grid
  const cellSize = 2; // Each cell is 2x2 in size

  const handleClick = (row, col, section) => {
    const cellKey = `${section}-${row}-${col}`;
    if (solarPanels.some(([s, r, c]) => s === section && r === row && c === col)) {
      setSolarPanels(solarPanels.filter(([s, r, c]) => !(s === section && r === row && c === col)));
    } else {
      setSolarPanels([...solarPanels, [section, row, col]]);
    }
  };

  return (
    <group position={[-0.75, 5.3 + 0.1, 0]} rotation={[0, 4.75, 0]}>
      {/* Left Sloped Section */}
      {showSolarPanels && <group position={[0, 0.05, 1]} rotation={[Math.PI / 3, 0, 0]}>
        {Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - 1) * cellSize;
            const y = (row - 1) * cellSize;
            const isSelected = solarPanels.some(([s, r, c]) => s === "left" && r === row && c === col);
            return (
              <mesh
                key={`left-${row}-${col}`}
                position={[x, y, 0.05]} // Slightly above the roof
                onClick={() => handleClick(row, col, "left")}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial color={isSelected ? "yellow" : "green"} opacity={isSelected ? 0 : 0.5} />
              </mesh>
            );
          })
        )}
      </group>}

      {/* Right Sloped Section */}
      {showSolarPanels && <group position={[0, 0.05, -1]} rotation={[-Math.PI / 2.75, 0, 0]}>
        {Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - 1) * cellSize;
            const y = (row - 1) * cellSize;
            const isSelected = solarPanels.some(([s, r, c]) => s === "right" && r === row && c === col);
            return (
              <mesh
                key={`right-${row}-${col}`}
                position={[x, y, 0.05]} // Slightly above the roof
                onClick={() => handleClick(row, col, "right")}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial color={isSelected ? "yellow" : "green"} opacity={isSelected ? 0 : 0.5} />
              </mesh>
            );
          })
        )}
      </group>}
    </group>
  );
};

// Roofs Component
export const Roofs = {
  Gable: ({ texturePath }) => {
    const roofTexture = useTexture(texturePath);
    return (
      <mesh position={[0, 7, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[5, 4, 4]} />
        <meshStandardMaterial map={roofTexture} />
      </mesh>
    );
  },
  Flat: ({ showSolarPanels, showSolarRoofTiles }) => {
    const roofTexture = useTexture("../assets/images/roof.jpg");
    const [solarPanels, setSolarPanels] = useState([]);
    const [solarRoofTiles, setSolarRoofTiles] = useState([]);

    return (
      <group>
        {/* Roof Base */}
        <mesh position={[0, 5.5, 0]}>
          <boxGeometry args={[6, 1, 6]} />
          <meshStandardMaterial map={roofTexture} />
        </mesh>
        {/* Recommended Area Grid & Solar Panels */}

        <FlatRoofGridTiles
          solarRoofTiles={solarRoofTiles}
          setSolarRoofTiles={setSolarRoofTiles}
          showSolarRoofTiles={showSolarRoofTiles}
        />
        <FlatRoofGrid
          solarPanels={solarPanels}
          setSolarPanels={setSolarPanels}
          showSolarPanels={showSolarPanels}
        />
      </group>
    );
  },
  Shed: ({ showSolarPanels, showSolarRoofTiles }) => {
    const roofTexture = useTexture("../assets/images/roof.jpg");
    const [solarPanels, setSolarPanels] = useState([]);
    const [solarRoofTiles, setSolarRoofTiles] = useState([]);

    return (
      <group>
        {/* Roof Base with Slight Rotation */}
        <mesh position={[0, 6, 0]} rotation={[Math.PI / 20, 0, 0]}>
          <boxGeometry args={[6, 1, 6]} />
          <meshStandardMaterial map={roofTexture} />
        </mesh>
        {/* Recommended Area Grid & Solar Panels */}
        <ShedRoofGrid
          solarPanels={solarPanels}
          setSolarPanels={setSolarPanels}
          showSolarPanels={showSolarPanels}
        />
        <ShedRoofGridTiles
          solarRoofTiles={solarRoofTiles}
          setSolarRoofTiles={setSolarRoofTiles}
          showSolarRoofTiles={showSolarRoofTiles}
        />
      </group>
    );
  },
  Butterfly: ({ showSolarPanels }) => {
    const roofTexture = useTexture("../assets/images/roof.jpg");
    const [solarPanels, setSolarPanels] = useState([]);
    return (
      <group position={[-0.75, 5.3, 0]} rotation={[0, 4.75, 0]}>
        <mesh position={[0, 0, 1]} rotation={[Math.PI / 3, 0, 0]}>
          <boxGeometry args={[5.85, 3.25]} />
          <meshStandardMaterial map={roofTexture} />
        </mesh>
        <mesh position={[0, 0, -1]} rotation={[-Math.PI / 2.75, 0, 0]}>
          <boxGeometry args={[5.85, 6.25]} />
          <meshStandardMaterial map={roofTexture} />
        </mesh>
        <ButterflyRoofGrid solarPanels={solarPanels} setSolarPanels={setSolarPanels} showSolarPanels={showSolarPanels} />
      </group>
    );
  },
};

// Window Component
export const Window = ({ position }) => {
  const windowTexture = useTexture("../assets/images/window.webp");
  return (
    <mesh position={position}>
      <boxGeometry args={[0.85, 1.5, 0.1]} />
      <meshStandardMaterial map={windowTexture} />
    </mesh>
  );
};

const SingleFamilyHouse = ({ roofType, showSolarPanels, showSolarRoofTiles, showSolarWaterHeating, showHeatPump, showSmallWindTurbines, showVerticalAxisWindTurbines, showMicroHydroPowerSystem }) => {
  const wallTexture = useTexture("../assets/images/wall.png");
  const doorTexture = useTexture("../assets/images/door.jpg");
  const [solarWaterHeating, setSolarWaterHeating] = useState([]);
  const [heatPump, setHeatPump] = useState([]);
  const [smallWindTurbines, setSmallWindTurbines] = useState([]);
  const [verticalAxisWindTurbines, setVerticalAxisWindTurbines] = useState([]);
  const [microHydroPowerSystem, setMicroHydroPowerSystem] = useState([]);

  return (
    <group position={[0, 0, 0]}>
      {/* Walls */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[6, 6, 6]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Lamp on the Wall */}
      <mesh position={[-2.5, 4.5, 2.91]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={showSolarPanels || showSolarRoofTiles ? "yellow" : "black"} />
      </mesh>

      <mesh position={[2.5, 4.5, 2.91]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={showSolarPanels || showSolarRoofTiles ? "yellow" : "black"} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.5, 3.01]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial map={doorTexture} />
      </mesh>

      {/* Windows */}
      <Window position={[-2.5, 3, 3.01]} />
      <Window position={[2.5, 3, 3.01]} />

      {/* Roof */}
      {roofType &&
        React.createElement(Roofs[roofType], {
          texturePath: "../assets/images/roof.jpg",
          showSolarPanels,
          showSolarRoofTiles,
          showSolarWaterHeating,
          showHeatPump,
        })}

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


export default SingleFamilyHouse;
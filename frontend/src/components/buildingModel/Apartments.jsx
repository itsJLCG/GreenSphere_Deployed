import { useTexture, useGLTF, useAnimations } from "@react-three/drei";
import React, { useState, useMemo, useEffect, useRef } from "react";
import SolarPanel from "../renewableModel/SolarPanel";
import TechnoEconomicAnalysis from "../TechnoEconomicAnalysis";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export const SolarWaterHeatingTiles = ({ onSelect, solarWaterHeating, setSolarWaterHeating, showSolarWaterHeating }) => {
  const gltf = useGLTF("../assets/models/solarwaterheater.glb");

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -2.5, 0];

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
          position={[x, -2.1, z]} // Adjusted Y-position
          scale={[3.5, 3.5, 3.5]} // Increased scale
        />
      ))}
    </>
  );
};

export const MicroHydroPowerSystemTiles = ({ onSelect, microHydroPowerSystem, setMicroHydroPowerSystem, showMicroHydroPowerSystem }) => {
  const { scene, animations } = useGLTF("../assets/models/microHydropowerSystem.glb");
  const { actions } = useAnimations(animations, scene);

  // Ref to store mixers for each turbine
  const mixers = useRef([]);

  useEffect(() => {
    console.log("Animations loaded:", animations);
    console.log("Actions:", actions);

    if (actions && actions["Peddles.009Action"]) {
      console.log("Playing animation: Peddles.009Action");
      actions["Peddles.009Action"].setLoop(THREE.LoopRepeat);
      actions["Peddles.009Action"].play();
    } else {
      console.error("Animation 'Peddles.009Action' not found or scene not loaded");
    }
  }, [actions]);

  // Update all mixers on every frame
  useFrame((_, delta) => {
    mixers.current.forEach((mixer) => mixer.update(delta));
  });

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -2.5, 0];

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

      {/* Render Animated Micro Hydro Power Systems */}
      {microHydroPowerSystem.map(({ x, z }, index) => {
        const turbine = scene.clone();
        const mixer = new THREE.AnimationMixer(turbine);

        // Reapply animations to the cloned scene
        animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat);
          action.play();
        });

        // Store the mixer in the ref
        mixers.current[index] = mixer;

        return (
          <primitive
            key={`${x}-${z}-${index}`}
            object={turbine}
            position={[x, -2.5, z]} // Adjusted Y-position
            scale={[0.7, 0.7, 0.7]} // Increased scale
            rotation={[0, Math.PI / 2, 0]} // Rotates 90 degrees to the left
          />
        );
      })}
    </>
  );
};


export const SmallWindTurbinesTiles = ({ onSelect, smallWindTurbines, setSmallWindTurbines, showSmallWindTurbines }) => {
  const { scene, animations } = useGLTF("../assets/models/wind_turbine(2).glb");
  const { actions } = useAnimations(animations, scene);

  // Ref to store mixers for each turbine
  const mixers = useRef([]);

  useEffect(() => {
    console.log("Animations loaded:", animations); // Log animations
    console.log("Actions:", actions); // Log actions

    if (actions && actions["turbineSpin"]) {
      console.log("Playing animation: turbineSpin");
      actions["turbineSpin"].setLoop(THREE.LoopRepeat); // Loop the animation
      actions["turbineSpin"].play();
    } else {
      console.error("Animation 'turbineSpin' not found or scene not loaded");
    }
  }, [actions]);

  // Update all mixers on every frame
  useFrame((state, delta) => {
    mixers.current.forEach((mixer) => mixer.update(delta));
  });

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -2.5, 0];

  // House boundaries (Increased size to 14)
  const houseSize = 14;
  const houseCenter = [0, 2, 0];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid (Excluding house area and first two rows)
  const isValidPosition = (x, z, row) => {
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

      {/* Render Animated SmallWindTurbines */}
      {smallWindTurbines.map(({ x, z }, index) => {
        const turbine = scene.clone();
        const mixer = new THREE.AnimationMixer(turbine);

        // Reapply animations to the cloned scene
        animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat);
          action.play();
        });

        // Store the mixer in the ref
        mixers.current[index] = mixer;

        return (
          <primitive
            key={`${x}-${z}-${index}`}
            object={turbine}
            position={[x, -2.5, z]}
            scale={[55, 55, 55]}
            rotation={[0, - Math.PI / 2, 0]}
          />
        );
      })}
    </>
  );
};


export const VerticalAxisWindTurbinesTiles = ({ onSelect, verticalAxisWindTurbines, setVerticalAxisWindTurbines, showVerticalAxisWindTurbines }) => {
  const { scene, animations } = useGLTF("../assets/models/verticalAxisWindTurbineAnimated.glb");
  const { actions } = useAnimations(animations, scene);

  // Ref to store mixers for each turbine
  const mixers = useRef([]);

  useEffect(() => {
    console.log("Animations loaded:", animations);
    console.log("Actions:", actions);

    if (actions && actions["Object_6.001Action"]) {
      console.log("Playing animation: Object_6.001Action");
      actions["Object_6.001Action"].setLoop(THREE.LoopRepeat);
      actions["Object_6.001Action"].play();
    } else {
      console.error("Animation 'Object_6.001Action' not found or scene not loaded");
    }
  }, [actions]);

  // Update all mixers on every frame
  useFrame((_, delta) => {
    mixers.current.forEach((mixer) => mixer.update(delta));
  });

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -2.5, 0];

  // House boundaries
  const houseSize = 14;
  const houseCenter = [0, 2, 0];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is valid
  const isValidPosition = (x, z, row) => {
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
      const exists = prevTiles.some((tile) => tile.x === x && tile.z === z);
      return exists
        ? prevTiles.filter((tile) => tile.x !== x || tile.z !== z)
        : [...prevTiles, { x, z }];
    });
  };

  return (
    <>
      {/* Clickable Grid */}
      {showVerticalAxisWindTurbines &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - gridSize / 2) * cellSize + cellSize / 2;
            const z = (row - gridSize / 2) * cellSize + cellSize / 2;

            if (!isValidPosition(x, z, row)) return null;

            const isPlaced = verticalAxisWindTurbines.some((tile) => tile.x === x && tile.z === z);

            return (
              <mesh
                key={`${x}-${z}`}
                position={[x, platformCenter[1] + 0.01, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={() => handleClick(x, z)}
              >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial color={isPlaced ? "green" : "violet"} transparent opacity={0.5} />
              </mesh>
            );
          })
        )}

      {/* Always Render Placed VerticalAxisWindTurbines */}
      {verticalAxisWindTurbines.map(({ x, z }, index) => {
        const turbine = scene.clone();
        const mixer = new THREE.AnimationMixer(turbine);

        animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat);
          action.play();
        });

        mixers.current[index] = mixer;

        return (
          <primitive
            key={`${x}-${z}-${index}`}
            object={turbine}
            position={[x, 6.5, z]}
            scale={[0.6,0.7,0.7]}
          />
        );
      })}
    </>
  );
};


export const HeatPumpTiles = ({ onSelect, heatPump, setHeatPump, showHeatPump }) => {
  const gltf = useGLTF("../assets/models/heatPump.glb");

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -2.5, 0];

  // Recommended Zones (Buildings)
  const recommendedZones = [
    { center: [0, 1.75, 0], size: [5, 7.5, 6] },  // Central building
    { center: [4, 2, 0], size: [4, 8, 6] },      // Right building
    { center: [-4, 2, 0], size: [4, 8, 6] }      // Left building
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
          position={[x, -6, z]}
          scale={[3, 3, 3]}
        />
      ))}
    </>
  );
};

export const VerticalFarmingTiles = ({ onSelect, verticalFarming, setVerticalFarming, showVerticalFarming }) => {
  const gltf = useGLTF("../assets/models/verticalFarming.glb");

  // Platform settings
  const platformSize = 20;
  const platformCenter = [0, -2.5, 0];

  // Recommended Zone (Only the first row)
  const recommendedZones = [
    { center: [0, 1.75, 0], size: [5, 7.5, 6] }  // Central building (First row)
  ];

  // Grid settings
  const gridSize = 10;
  const cellSize = platformSize / gridSize;

  // Check if position is inside the recommended area
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
    if (!showVerticalFarming) return;

    onSelect?.(x, z);

    setVerticalFarming((prevTiles) => {
      const exists = prevTiles.some(tile => tile.x === x && tile.z === z);
      return exists
        ? prevTiles.filter(tile => tile.x !== x || tile.z !== z)
        : [...prevTiles, { x, z }];
    });
  };

  return (
    <>
      {/* Clickable Grid (Only active when showVerticalFarming is true) */}
      {showVerticalFarming &&
        Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const x = (col - gridSize / 2) * cellSize + cellSize / 2;
            const z = (row - gridSize / 2) * cellSize + cellSize / 2;

            if (!isValidPosition(x, z)) return null; // Now allows placement **inside** the first row only

            const isPlaced = verticalFarming.some(tile => tile.x === x && tile.z === z);

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

      {/* Always Render Placed VerticalFarming */}
      {verticalFarming.map(({ x, z }, index) => (
        <primitive
          key={`${x}-${z}-${index}`}
          object={gltf.scene.clone()}
          position={[x, -2.5, -1]}
          scale={[1.5,1.5,1.5]}
        />
      ))}
    </>
  );
};


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

const ApartmentsBuilding = ({ showSolarPanels, showSolarRoofTiles, showSolarWaterHeating, showHeatPump, showSmallWindTurbines, showVerticalAxisWindTurbines, showMicroHydroPowerSystem, showVerticalFarming }) => {
  const wallTexture = useTexture("../assets/images/apartmentwall.avif");
  const roofTexture = useTexture("../assets/images/apartmentroof.webp");
  const [solarPanels, setSolarPanels] = useState([]);
  const [solarWaterHeating, setSolarWaterHeating] = useState([]);
  const [heatPump, setHeatPump] = useState([]);
  const [smallWindTurbines, setSmallWindTurbines] = useState([]);
  const [verticalAxisWindTurbines, setVerticalAxisWindTurbines] = useState([]);
  const [microHydroPowerSystem, setMicroHydroPowerSystem] = useState([]);
  const [verticalFarming, setVerticalFarming] = useState([]);


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
      <VerticalFarmingTiles
        verticalFarming={verticalFarming}
        setVerticalFarming={setVerticalFarming}
        showVerticalFarming={showVerticalFarming}
      />

      {/* For Analysis */}
      <Html>
        <TechnoEconomicAnalysis
          solarPanels={solarPanels}
          solarWaterHeating={solarWaterHeating}
          heatPump={heatPump}
          smallWindTurbines={smallWindTurbines}
          verticalAxisWindTurbines={verticalAxisWindTurbines}
          microHydroPowerSystem={microHydroPowerSystem}
          verticalFarming={verticalFarming}
        />
      </Html>
    </group>
  );
};

export default ApartmentsBuilding;

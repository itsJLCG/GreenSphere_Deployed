import { useTexture } from "@react-three/drei";
import React, { useState, useMemo } from "react";
import { Roofs, SolarWaterHeatingTiles, MicroHydroPowerSystemTiles, HeatPumpTiles, SmallWindTurbinesTiles, VerticalAxisWindTurbinesTiles, GableRoofGrid, GableRoofGridTiles } from "./SingleFamilyHouse.jsx";
import TechnoEconomicAnalysis from "../TechnoEconomicAnalysis.jsx";
import { Html } from "@react-three/drei";

const WindowCottage = ({ position }) => {
  const WindowCottage = useTexture("../assets/images/windowcottage.jpg"); // ✅ Fixed syntax

  return (
    <mesh position={position}>
      <boxGeometry args={[0.85, 1.5, 0.1]} /> {/* Window size remains the same */}
      <meshStandardMaterial map={WindowCottage} /> {/* ✅ Apply texture */}
    </mesh>
  );
};

const CottagesHouse = ({ roofType, showSolarPanels, showSolarRoofTiles, showSolarWaterHeating, showHeatPump, showSmallWindTurbines, showVerticalAxisWindTurbines, showMicroHydroPowerSystem }) => {
  const wallTexture = useTexture("../assets/images/cottagewall.webp");
  const doorTexture = useTexture("../assets/images/cottagedoor.jpg");
  const [solarWaterHeating, setSolarWaterHeating] = useState([]);
  const [heatPump, setHeatPump] = useState([]);
  const [solarPanels, setSolarPanels] = useState([]);
  const [solarRoofTiles, setSolarRoofTiles] = useState([]);
  const [smallWindTurbines, setSmallWindTurbines] = useState([]);
  const [verticalAxisWindTurbines, setVerticalAxisWindTurbines] = useState([]);
  const [microHydroPowerSystem, setMicroHydroPowerSystem] = useState([]);

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

      {/* Gable Roof */}
      <Roofs.Gable texturePath="../assets/images/cottageroof.jpg" />

      {/* Gable Roof Grid for Solar Panels */}
      <GableRoofGrid
        solarPanels={solarPanels}
        setSolarPanels={setSolarPanels}
        showSolarPanels={showSolarPanels}
      />
      <GableRoofGridTiles
        solarRoofTiles={solarRoofTiles}
        setSolarRoofTiles={setSolarRoofTiles}
        showSolarRoofTiles={showSolarRoofTiles}
      />

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

      {/* For Analysis */}
      <Html>
        <TechnoEconomicAnalysis
          solarPanels={solarPanels}
          solarRoofTiles={solarRoofTiles}
          solarWaterHeating={solarWaterHeating}
          heatPump={heatPump}
          smallWindTurbines={smallWindTurbines}
          verticalAxisWindTurbines={verticalAxisWindTurbines}
          microHydroPowerSystem={microHydroPowerSystem}
        />
      </Html>
    </group>
  );
};


export default CottagesHouse;
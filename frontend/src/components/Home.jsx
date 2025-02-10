import React, { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats, useTexture, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import CottagesHouse from "./houseModel/Cottages.jsx";
import TownHouse from "./houseModel/Townhouse.jsx";
import MobileHome from "./houseModel/MobileHome.jsx";
import ApartmentsBuilding from "./buildingModel/Apartments.jsx";
import OfficeBuilding from "./buildingModel/OfficeBuilding.jsx";
import SingleFamilyHouse from "./houseModel/SingleFamilyHouse.jsx";
import { Roofs } from "./houseModel/SingleFamilyHouse.jsx";
import RenewableSlots from "./RenewableSlots.jsx";
import { Html } from "@react-three/drei";

const Platform = () => {
  const texture = useTexture("../assets/images/grass.webp");
  const { scene } = useGLTF("../assets/models/Trees.glb");
  const trees = useMemo(() => Array.from({ length: 9 }, () => scene.clone()), [scene]);
  const treePositions = [
    [-8, -1, -8], [8, -1, -8], [6, -1, -6], [-6.5, -1, -6], [4, -1, -8],
    [2, -1, -7], [1, -1, -8], [-1.5, -1, -7], [-4, -1, -8]
  ];
  const treeScales = [2, 2.1, 2, 2.2, 2.3, 1.7, 2.2, 2.4, 1.8];

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      {treePositions.map((position, index) => (
        <primitive key={index} object={trees[index]} position={position} scale={treeScales[index]} />
      ))}
    </>
  );
};

const HouseModels = {
  "Single-Family": SingleFamilyHouse,
  "Cottages": CottagesHouse,
  "TownHouse": TownHouse,
  "Mobile Home": MobileHome,
};

const BuildingModels = {
  "Apartments": ApartmentsBuilding,
  "Office Building": OfficeBuilding,
};
const Home = () => {
  const [showHouseOptions, setShowHouseOptions] = useState(false);
  const [showBuildingOptions, setShowBuildingOptions] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [roofType, setRoofType] = useState(null);
  const [bgColor, setBgColor] = useState("linear-gradient(black, lightblue)");
  const [isOuterSpace, setIsOuterSpace] = useState(false);
  const [isForest, setIsForest] = useState(false);
  const [isAncient, setIsAncient] = useState(false);
  const [isUnderwater, setIsUnderwater] = useState(false);
  const [isCyberpunk, setIsCyberpunk] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [showSolarPanels, setShowSolarPanels] = useState(false);

  const handleSolarPanelToggle = (state) => {
    setShowSolarPanels(state);
  };
  
  const toggleBackgroundColor = () => {
    if (isOuterSpace || isAncient || isUnderwater || isCyberpunk || isForest) {
      setIsOuterSpace(false); setIsAncient(false); setIsUnderwater(false); setIsCyberpunk(false); setIsForest(false);
    }
    setBgColor((prevColor) => prevColor === "linear-gradient(black, lightblue)" ? "linear-gradient(lightblue, yellow)" : "linear-gradient(black, lightblue)");
  };

  const changeTheme = (theme) => {
    setIsOuterSpace(false); setIsAncient(false); setIsUnderwater(false); setIsCyberpunk(false); setIsForest(false);
    if (theme === "Outer Space") setIsOuterSpace(true);
    if (theme === "Ancient") setIsAncient(true);
    if (theme === "Underwater") setIsUnderwater(true);
    if (theme === "Cyberpunk") setIsCyberpunk(true);
    if (theme === "Forest") setIsForest(true);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Control Panel */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
        <div style={{ display: "flex", gap: "10px" }}>
          {[
            { label: 'Houses', options: HouseModels, setShow: setShowHouseOptions, showOptions: showHouseOptions, setSelection: setSelectedHouse },
            { label: 'Buildings', options: BuildingModels, setShow: setShowBuildingOptions, showOptions: showBuildingOptions, setSelection: setSelectedBuilding }
          ].map(({ label, options, setShow, showOptions, setSelection }) => (
            <div key={label}>
              <button
                onClick={() => {
                  setShow(!showOptions);
                  label === 'Houses' ? setShowBuildingOptions(false) : setShowHouseOptions(false); // Close the other menu if open
                }}
                style={buttonStyle}
              >
                {label}
              </button>
              {showOptions && (
                <div style={dropdownStyle}>
                  {Object.keys(options).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelection(option);
                        label === 'Houses' ? setSelectedBuilding(null) : setSelectedHouse(null); // Reset the other selection
                      }}
                      style={buttonStyle}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Roof Selection - Only show if Single-Family house is selected */}
        {selectedHouse === "Single-Family" && (
          <div style={{ marginTop: 210 }}>
            <p style={{ color: "white", marginBottom: "5px" }}>Select Roof Type:</p>
            {Object.keys(Roofs).map((roof) => (
              <button key={roof} onClick={() => setRoofType(roof)} style={buttonStyle}>
                {roof}
              </button>
            ))}
          </div>
        )}
      </div>

      {(isOuterSpace || isAncient || isUnderwater || isCyberpunk || isForest) && (
        <video
          src={
            isOuterSpace
              ? "../assets/images/outerspace.mp4"
              : isAncient
                ? "../assets/images/ancient.mp4"
                : isUnderwater
                  ? "../assets/images/underwater.mp4"
                  : isCyberpunk
                    ? "../assets/images/cyberpunk.mp4"
                    : "../assets/images/forest.mp4"
          }
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "fill",
            zIndex: -1,
          }}
        />
      )}

      {/* 3D Canvas */}
      <Canvas
        style={{
          background: isOuterSpace || isAncient || isUnderwater || isCyberpunk || isForest ? "transparent" : bgColor,
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        camera={{ position: [0, 0, 11] }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <OrbitControls />
        <Platform />
        {(selectedHouse || selectedBuilding) && (
          <Html position={[0, -3, 0]}>
            <RenewableSlots 
              infrastructure={selectedHouse || selectedBuilding} 
              roofType={roofType} 
              onSolarPanelClick={handleSolarPanelToggle} 
            />
          </Html>
        )}

        {/* Render Selected House or Building */}
        {selectedHouse && React.createElement(HouseModels[selectedHouse], { roofType, showSolarPanels })}
        {selectedBuilding && React.createElement(BuildingModels[selectedBuilding], { showSolarPanels })}
      </Canvas>

      {/* Day / Night Mode Button */}
      <button
        onClick={toggleBackgroundColor}
        style={floatButtonStyle}
      >
        Day / Night Mode
      </button>

      {/* Theme Button to Toggle the Menu */}
      <button
        onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
        style={{ ...floatButtonStyle, left: "1280px" }} // Correct way to merge styles
      >
        Theme
      </button>

      {/* Theme Selection Menu */}
      {isThemeMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '1280px',
            background: "#1e1942",
            padding: '10px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
          }}
        >
          {['Outer Space', 'Forest', 'Ancient', 'Underwater', 'Cyberpunk'].map((theme) => (
            <ul key={theme} style={{ listStyle: 'none', padding: 5, margin: 0 }}>
              <li
                onClick={() => changeTheme(theme)}
                style={{ cursor: 'pointer' }}
              >
                {theme}
              </li>
            </ul>
          ))}
        </div>


      )}
    </div>
  );
};

const buttonStyle = { background: "#1e1942", color: "white", padding: "10px 15px", margin: "5px 0", border: "none", borderRadius: "5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", transition: "all 0.3s ease", width: "160px" };
const dropdownStyle = { background: "#1e1942", color: "white", padding: "10px", position: "absolute", top: "50px", left: "0", zIndex: "9", width: "160px", borderRadius: "5px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)" };
const floatButtonStyle = { position: "absolute", top: "20px", left: "1370px", background: "#1e1942", color: "white", border: "none", cursor: "pointer", zIndex: 20, fontSize: "14px" };

export default Home;

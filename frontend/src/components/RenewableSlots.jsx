import React, { useState } from 'react';
import './RenewableSlots.css'; // Assuming you have a CSS file for styling

const RenewableSlots = ({ infrastructure, roofType, onSolarPanelClick }) => {
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [showSolarPanels, setShowSolarPanels] = useState(false);

  // Define the ranking of renewable energy sources for different infrastructures
  const renewableEnergyRankings = {
    "Single-Family with Gable": [
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Single-Family with Flat": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Single-Family with Shed": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Single-Family with Butterfly": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Cottages": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "TownHouse": [
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Mobile Home": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Apartments": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
    ],
    "Office Building": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
    ],
  };

  // Get the renewable energy slots based on the selected infrastructure and roof type
  const renewableEnergySlots = renewableEnergyRankings[`${infrastructure} with ${roofType}`] || renewableEnergyRankings[infrastructure] || [];

  const handleSlotHover = (index) => {
    setHoveredSlot(index);
  };

  const handleSlotLeave = () => {
    setHoveredSlot(null);
  };

  const handleSolarPanelClick = () => {
    const newState = !showSolarPanels;
    setShowSolarPanels(newState);
    onSolarPanelClick(newState);  // Notify Home.jsx
  };
  

  return (
    <div className="hotbar-container">
      <div className="recommendation-text">
        <span className="highly-recommended">Highly Recommended</span>
        <span className="least-recommended">Least Recommended</span>
      </div>
      <div className="hotbar">
        {renewableEnergySlots.map((slot, index) => (
          <div
            key={index}
            className="slot"
            onMouseEnter={() => handleSlotHover(index)}
            onMouseLeave={handleSlotLeave}
            onClick={slot.name === 'Solar Panels' ? handleSolarPanelClick : undefined}
          >
            <img src={slot.image} alt={slot.name} className="slot-image" />
            {hoveredSlot === index && (
              <div className="tooltip">
                <strong>{slot.type}</strong>
                <div>{slot.name}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenewableSlots;
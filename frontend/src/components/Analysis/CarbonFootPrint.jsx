import React, { useState } from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CarbonFootprint = () => {
  const [selectedEnergy, setSelectedEnergy] = useState('solar');

  const energyData = {
    solar: {
      co2Reduction: 1.2,
      treesEquivalent: 50,
      fossilComparison: 2.5,
      icon: "🌞",
      bgGradient: "linear-gradient(135deg, #FFB75E, #ED8F03)"
    },
    wind: {
      co2Reduction: 2.5,
      treesEquivalent: 100,
      fossilComparison: 3.8,
      icon: "🌪️",
      bgGradient: "linear-gradient(135deg, #48c6ef, #6f86d6)"
    },
    hydro: {
      co2Reduction: 1.8,
      treesEquivalent: 75,
      fossilComparison: 3.0,
      icon: "💧",
      bgGradient: "linear-gradient(135deg, #0093E9, #80D0C7)"
    }
  };

  const getChartData = (value, maxValue) => ({
    datasets: [{
      data: [value, maxValue - value],
      backgroundColor: [
        'rgba(76, 175, 80, 0.9)', // Green color
        'rgba(76, 175, 80, 0.1)'  // Light green for remaining
      ],
      borderWidth: 0,
      cutout: '75%'
    }],
    labels: ['Value', 'Remaining']
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  };

  return (
    <div className="container">
      <h2 className="title">Carbon Footprint Analysis</h2>
      
      <div className="energy-selector">
        {Object.keys(energyData).map(energy => (
          <button
            key={energy}
            className={`energy-btn ${selectedEnergy === energy ? 'active' : ''}`}
            onClick={() => setSelectedEnergy(energy)}
            style={{
              background: selectedEnergy === energy ? energyData[energy].bgGradient : 'transparent'
            }}
          >
            <span className="icon">{energyData[energy].icon}</span>
            <span className="text">{energy.charAt(0).toUpperCase() + energy.slice(1)}</span>
          </button>
        ))}
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ background: energyData[selectedEnergy].bgGradient }}>
          <div className="stat-content">
            <h3>CO₂ Reduction</h3>
            <div className="chart-container">
              <Doughnut data={getChartData(energyData[selectedEnergy].co2Reduction, 3)} options={chartOptions} />
              <div className="stat-overlay">
                <p className="stat-value">{energyData[selectedEnergy].co2Reduction}</p>
                <p className="stat-label">tons per year</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="stat-card" style={{ background: energyData[selectedEnergy].bgGradient }}>
          <div className="stat-content">
            <h3>Trees Equivalent</h3>
            <div className="chart-container">
              <Doughnut data={getChartData(energyData[selectedEnergy].treesEquivalent, 150)} options={chartOptions} />
              <div className="stat-overlay">
                <p className="stat-value">{energyData[selectedEnergy].treesEquivalent}</p>
                <p className="stat-label">trees annually</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="stat-card" style={{ background: energyData[selectedEnergy].bgGradient }}>
          <div className="stat-content">
            <h3>Fossil Fuel Impact</h3>
            <div className="chart-container">
              <Doughnut data={getChartData(energyData[selectedEnergy].fossilComparison, 5)} options={chartOptions} />
              <div className="stat-overlay">
                <p className="stat-value">{energyData[selectedEnergy].fossilComparison}</p>
                <p className="stat-label">tons CO₂ offset</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section" style={{ borderColor: selectedEnergy === 'solar' ? '#ED8F03' : selectedEnergy === 'wind' ? '#6f86d6' : '#80D0C7' }}>
        <h3>Impact Analysis</h3>
        <p>
          Switching to {selectedEnergy} power can significantly reduce your carbon footprint.
          The annual CO₂ reduction of {energyData[selectedEnergy].co2Reduction} tons is equivalent
          to planting {energyData[selectedEnergy].treesEquivalent} trees, offsetting
          {energyData[selectedEnergy].fossilComparison} tons of CO₂ from fossil fuels.
        </p>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
          color: white;
          background: linear-gradient(165deg, rgba(45, 55, 72, 0.95), rgba(26, 32, 44, 0.98));
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          height: 100vh;
          overflow-y: auto;
        }

        .title {
          font-size: 2rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 1.5rem;
          background: linear-gradient(45deg, #4CAF50, #8BC34A);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .energy-selector {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .energy-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: white;  // Changed from black to white
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 1rem;
          font-weight: 600;
        }

        .energy-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .energy-btn.active {
          transform: scale(1.05);
          border-color: transparent;
        }

        .icon {
          font-size: 1.5rem;
          color: white;  // Added to ensure icons are also white
        }

        .text {
          color: white;  // Added to ensure text is white
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          position: relative;
          padding: 1rem;
          border-radius: 16px;
          text-align: center;
          overflow: hidden;
          transition: all 0.4s ease;
          min-height: 250px;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        }

        .stat-content {
          position: relative;
          z-index: 1;
        }

        .stat-card h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: white;  // Changed from black to white
        }
        .stat-value {
          font-size: 3rem;
          font-weight: bold;
          color: white;
          margin: 0.5rem 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .stat-label {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .info-section {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 16px;
          border: 2px solid;
          backdrop-filter: blur(8px);
          transition: all 0.4s ease;
        }

        .info-section:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .info-section h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: white;
        }

        .info-section p {
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
        }

        .chart-container {
          position: relative;
          height: 200px;
          width: 100%;
        }

        .stat-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          width: 100%;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .energy-selector {
            flex-direction: column;
            gap: 1rem;
          }

          .title {
            font-size: 2rem;
          }

          .stat-value {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CarbonFootprint;

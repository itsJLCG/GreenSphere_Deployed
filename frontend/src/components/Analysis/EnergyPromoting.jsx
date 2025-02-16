import React, { useState } from "react";
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EnergyPromoting = () => {
  const [selectedEnergy, setSelectedEnergy] = useState('solar');

  const energyOptions = {
    solar: {
      title: 'Solar Energy',
      icon: '☀️',
      initialCost: 20000,
      yearlyReturn: 2500,
      efficiency: 85,
      environmentalImpact: 95,
      bestFor: ['Residential', 'Commercial', 'Agricultural'],
      color: '#FFB75E'
    },
    wind: {
      title: 'Wind Energy',
      icon: '🌪️',
      initialCost: 15000,
      yearlyReturn: 2000,
      efficiency: 80,
      environmentalImpact: 90,
      bestFor: ['Rural', 'Coastal', 'Industrial'],
      color: '#48c6ef'
    },
    hydro: {
      title: 'Hydro Energy',
      icon: '💧',
      initialCost: 25000,
      yearlyReturn: 3000,
      efficiency: 90,
      environmentalImpact: 85,
      bestFor: ['River proximity', 'Industrial', 'Community'],
      color: '#0093E9'
    }
  };

  const ROIData = {
    labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8'],
    datasets: [{
      label: 'Return on Investment',
      data: Array.from({ length: 8 }, (_, i) => 
        -energyOptions[selectedEnergy].initialCost + 
        (energyOptions[selectedEnergy].yearlyReturn * (i + 1))
      ),
      borderColor: energyOptions[selectedEnergy].color,
      backgroundColor: `${energyOptions[selectedEnergy].color}33`,
      fill: true,
    }]
  };

  const efficiencyData = {
    labels: ['Efficiency Rating', 'Environmental Impact'],
    datasets: [{
      data: [
        energyOptions[selectedEnergy].efficiency,
        energyOptions[selectedEnergy].environmentalImpact
      ],
      backgroundColor: [
        energyOptions[selectedEnergy].color,
        `${energyOptions[selectedEnergy].color}99`
      ],
    }]
  };

  return (
    <div className="container">
      <h2 className="title">Promoting Renewable Energy Adoption</h2>
      
      <div className="energy-selector">
        {Object.keys(energyOptions).map(energy => (
          <button
            key={energy}
            className={`energy-btn ${selectedEnergy === energy ? 'active' : ''}`}
            onClick={() => setSelectedEnergy(energy)}
          >
            <span>{energyOptions[energy].icon}</span>
            <span>{energyOptions[energy].title}</span>
          </button>
        ))}
      </div>

      <div className="analysis-grid">
        <div className="chart-card">
          <h3>Return on Investment Analysis</h3>
          <Line 
            data={ROIData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
              },
              scales: {
                y: {
                  ticks: { color: 'white' },
                  grid: { color: 'rgba(255,255,255,0.1)' }
                },
                x: {
                  ticks: { color: 'white' },
                  grid: { color: 'rgba(255,255,255,0.1)' }
                }
              }
            }}
          />
        </div>

        <div className="chart-card">
          <h3>Efficiency Metrics</h3>
          <Bar 
            data={efficiencyData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
              },
              scales: {
                y: {
                  max: 100,
                  ticks: { color: 'white' },
                  grid: { color: 'rgba(255,255,255,0.1)' }
                },
                x: {
                  ticks: { color: 'white' },
                  grid: { color: 'rgba(255,255,255,0.1)' }
                }
              }
            }}
          />
        </div>

        <div className="info-card">
          <h3>Best Applications</h3>
          <div className="tag-container">
            {energyOptions[selectedEnergy].bestFor.map((use, index) => (
              <span key={index} className="tag">{use}</span>
            ))}
          </div>
          <div className="cost-benefit">
            <div className="cost-item">
              <span>Initial Investment</span>
              <span>${energyOptions[selectedEnergy].initialCost}</span>
            </div>
            <div className="cost-item">
              <span>Yearly Return</span>
              <span>${energyOptions[selectedEnergy].yearlyReturn}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          color: white;
          background: linear-gradient(165deg, rgba(45, 55, 72, 0.95), rgba(26, 32, 44, 0.98));
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          height: 100vh;
          overflow-y: auto;
          position: relative;
        }

        .container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at top right, rgba(76, 175, 80, 0.1), transparent 60%),
                      radial-gradient(circle at bottom left, rgba(139, 195, 74, 0.1), transparent 60%);
          border-radius: 20px;
          pointer-events: none;
        }

        .title {
          font-size: 2.5rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 2rem;
          background: linear-gradient(45deg, #4CAF50, #8BC34A, #4CAF50);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .energy-selector {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .energy-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: white;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .energy-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: 0.5s;
        }

        .energy-btn:hover::before {
          left: 100%;
        }

        .energy-btn.active {
          background: rgba(76, 175, 80, 0.2);
          border-color: #4CAF50;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(76, 175, 80, 0.2);
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          margin-top: 1rem;
        }

        .chart-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .chart-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 36px rgba(76, 175, 80, 0.2);
          border-color: rgba(76, 175, 80, 0.3);
        }

        .chart-card h3 {
          margin-bottom: 1.5rem;
          color: white;
          font-size: 1.25rem;
          font-weight: 600;
          position: relative;
          padding-left: 1rem;
        }

        .chart-card h3::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 20px;
          background: #4CAF50;
          border-radius: 2px;
        }

        .info-card {
          grid-column: span 2;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(76, 175, 80, 0.2);
          backdrop-filter: blur(12px);
        }

        .tag-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin: 1.5rem 0;
        }

        .tag {
          background: rgba(76, 175, 80, 0.15);
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          border: 1px solid rgba(76, 175, 80, 0.3);
          transition: all 0.3s ease;
          font-size: 0.9rem;
          backdrop-filter: blur(4px);
        }

        .tag:hover {
          background: rgba(76, 175, 80, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(76, 175, 80, 0.2);
        }

        .cost-benefit {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .cost-item {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid rgba(76, 175, 80, 0.2);
          transition: all 0.3s ease;
        }

        .cost-item:hover {
          background: rgba(76, 175, 80, 0.1);
          transform: translateY(-2px);
        }

        .cost-item span:first-child {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .cost-item span:last-child {
          font-size: 1.2rem;
          font-weight: 600;
          color: #4CAF50;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1.5rem;
          }

          .analysis-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .info-card {
            grid-column: span 1;
          }

          .title {
            font-size: 2rem;
          }

          .energy-selector {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EnergyPromoting;

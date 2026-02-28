import React, { useState } from 'react';
import './CostCalculator.css';
import { FaArrowLeft, FaCalculator, FaBalanceScale, FaDollarSign, FaThermometerHalf, FaTint } from 'react-icons/fa';

const CONVERTER_OPTIONS = [
  { value: 'calculator', label: 'Basic Calculator', icon: <FaCalculator /> },
  { value: 'weight', label: 'Weight Converter', icon: <FaBalanceScale /> },
  { value: 'currency', label: 'Currency Converter', icon: <FaDollarSign /> },
  { value: 'temperature', label: 'Temperature Converter', icon: <FaThermometerHalf /> },
  { value: 'volume', label: 'Volume Converter', icon: <FaTint /> },
];

export default function CostCalculator({ setCurrentPage, darkMode }) {
  const [selected, setSelected] = useState('calculator');

  return (
    <div className={`costcalc-container${darkMode ? ' dark' : ''}`}>
      <button
        className="costcalc-back-btn"
        style={{ background: 'none', border: 'none', color: '#ff7d00', fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 600 }}
        onClick={() => setCurrentPage && setCurrentPage('home')}
      >
        <FaArrowLeft style={{ marginRight: '0.5em' }} /> Back to Home
      </button>
      <h2 className="costcalc-title">Cost Calculator & Converters</h2>
      <div className="costcalc-dropdown-card">
        <label htmlFor="converter-select">Choose Converter:</label>
        <select
          id="converter-select"
          className="costcalc-select"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          {CONVERTER_OPTIONS.map(opt => (
            <option value={opt.value} key={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="costcalc-section">
        {selected === 'calculator' && <BasicCalculator darkMode={darkMode} />}
        {selected === 'weight' && <WeightConverter darkMode={darkMode} />}
        {selected === 'currency' && <CurrencyConverter darkMode={darkMode} />}
        {selected === 'temperature' && <TemperatureConverter darkMode={darkMode} />}
        {selected === 'volume' && <VolumeConverter darkMode={darkMode} />}
      </div>
    </div>
  );
}

function BasicCalculator({ darkMode }) {
  const [display, setDisplay] = useState('');
  const handleClick = val => setDisplay(prev => prev + val);
  const handleClear = () => setDisplay('');
  const handleBackspace = () => setDisplay(prev => prev.slice(0, -1));
  const handleEqual = () => {
    try {
      // eslint-disable-next-line no-eval
      setDisplay(eval(display).toString());
    } catch {
      setDisplay('Error');
    }
  };
  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ];
  return (
    <div className={`costcalc-basic${darkMode ? ' dark' : ''}`}>
      <input className="costcalc-display" value={display} readOnly />
      <div className="costcalc-btn-grid">
        {buttons.flat().map(btn => (
          btn === '=' ? (
            <button key={btn} className="costcalc-btn eq" onClick={handleEqual}>=</button>
          ) : btn === 'C' ? (
            <button key={btn} className="costcalc-btn clr" onClick={handleClear}>C</button>
          ) : btn === '<' ? (
            <button key={btn} className="costcalc-btn bks" onClick={handleBackspace}>&larr;</button>
          ) : (
            <button key={btn} className="costcalc-btn" onClick={() => handleClick(btn)}>{btn}</button>
          )
        ))}
        <button className="costcalc-btn clr" onClick={handleClear}>C</button>
        <button className="costcalc-btn bks" onClick={handleBackspace}>&larr;</button>
      </div>
    </div>
  );
}

// Import actual converter components
import {
  WeightConverter,
  CurrencyConverter,
  TemperatureConverter,
  VolumeConverter
} from './Converters';

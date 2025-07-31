import React, { useState, useEffect } from 'react';
import './ConverterCard.css';
import Keypad from './Keypad';

export default function WeightConverter({ darkMode }) {
  const [input, setInput] = useState('');
  const [fromUnit, setFromUnit] = useState('kg');
  const [toUnit, setToUnit] = useState('lb');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const UNITS = [
  { value: 'mg', label: 'Milligrams (mg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'st', label: 'Stones (st)' },
];
const TO_KG = {
  mg: v => v / 1e6,
  g: v => v / 1000,
  kg: v => v,
  oz: v => v * 0.0283495,
  lb: v => v * 0.453592,
  st: v => v * 6.35029,
};
const FROM_KG = {
  mg: v => v * 1e6,
  g: v => v * 1000,
  kg: v => v,
  oz: v => v / 0.0283495,
  lb: v => v / 0.453592,
  st: v => v / 6.35029,
};
const STORAGE_KEY = 'weightConverterState';

useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const { fromUnit, toUnit } = JSON.parse(saved);
      if (fromUnit && toUnit) {
        setFromUnit(fromUnit);
        setToUnit(toUnit);
      }
    } catch {}
  }
}, []);
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ fromUnit, toUnit }));
}, [fromUnit, toUnit]);

const convert = () => {
  setError('');
  let val = parseFloat(input);
  if (isNaN(val) || val < 0) {
    setError('Enter a valid value');
    setResult('');
    return;
  }
  let kg = TO_KG[fromUnit](val);
  let res = FROM_KG[toUnit](kg);
  setResult(res.toFixed(4));
};

const handleSwap = () => {
  setFromUnit(toUnit);
  setToUnit(fromUnit);
  setResult('');
  setError('');
};

  return (
  <div className={`converter-card${darkMode ? ' dark' : ''}`}>
    <h3>Weight Converter</h3>
    <div className="converter-row" style={{flexWrap:'wrap'}}>
      <input
        className="converter-input"
        type="text"
        inputMode="none"
        value={input}
        min="0"
        aria-label="Value"
        readOnly
        placeholder="Enter value"
        style={{flex: '1 1 120px', background:'#fffbe7', color: darkMode ? '#ffbe40' : '#c96e07', fontWeight: 600, fontSize: '1.25em', border: '2px solid #ffbe40', borderRadius: '0.5em', textAlign: 'right', letterSpacing: '1px', marginBottom: '0.3em'}}
      />
      <Keypad value={input} setValue={setInput} darkMode={darkMode} />
      <select className="converter-select enhanced" value={fromUnit} onChange={e => setFromUnit(e.target.value)} aria-label="From unit">
        {UNITS.map(u => <option value={u.value} key={u.value}>{u.label}</option>)}
      </select>
      <button className="converter-btn" style={{minWidth:'44px',padding:'0 0.7em',margin:'0 0.6em'}} aria-label="Swap units" onClick={handleSwap}>&#8646;</button>
      <select className="converter-select enhanced" value={toUnit} onChange={e => setToUnit(e.target.value)} aria-label="To unit">
        {UNITS.map(u => <option value={u.value} key={u.value}>{u.label}</option>)}
      </select>
    </div>
    <button className="converter-btn" onClick={convert} style={{width:'100%',marginTop:'0.7em', fontWeight:700, fontSize:'1.1em', letterSpacing:'1px'}}>
      Convert
    </button>
    {error && <div className="converter-result enhanced-error" style={{color:'#e53935',marginTop:'0.7em',fontWeight:600,fontSize:'1.1em'}}>{error}</div>}
    {result && !error && (
      <div className="converter-result enhanced-result" style={{marginTop:'1em',padding:'0.8em 1.2em',background:darkMode?'#232323':'#fffbe7',border:'2px solid #ffbe40',borderRadius:'0.7em',color:darkMode?'#ffbe40':'#c96e07',fontSize:'1.25em',fontWeight:700,boxShadow:'0 2px 8px rgba(255,190,64,0.08)'}}>
        <span style={{fontSize:'1.1em'}}>Result:</span> <span style={{fontWeight:900,marginLeft:'0.5em'}}>{result} {toUnit}</span>
      </div>
    )}
  </div>
);
}

import React, { useState, useEffect } from 'react';
import './ConverterCard.css';
import Keypad from './Keypad';

const UNITS = [
  { value: 'ml', label: 'Milliliters (ml)' },
  { value: 'l', label: 'Liters (l)' },
  { value: 'tsp', label: 'Teaspoons (tsp)' },
  { value: 'tbsp', label: 'Tablespoons (tbsp)' },
  { value: 'cup', label: 'Cups (cup)' },
  { value: 'fl_oz', label: 'Fluid Ounces (fl oz)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'pt', label: 'Pints (pt)' },
  { value: 'qt', label: 'Quarts (qt)' },
  { value: 'gal', label: 'Gallons (gal)' },
];
const TO_ML = {
  ml: v => v,
  l: v => v * 1000,
  tsp: v => v * 4.92892,
  tbsp: v => v * 14.7868,
  cup: v => v * 236.588,
  fl_oz: v => v * 29.5735,
  oz: v => v * 29.5735,
  pt: v => v * 473.176,
  qt: v => v * 946.353,
  gal: v => v * 3785.41,
};
const FROM_ML = {
  ml: v => v,
  l: v => v / 1000,
  tsp: v => v / 4.92892,
  tbsp: v => v / 14.7868,
  cup: v => v / 236.588,
  fl_oz: v => v / 29.5735,
  oz: v => v / 29.5735,
  pt: v => v / 473.176,
  qt: v => v / 946.353,
  gal: v => v / 3785.41,
};
const STORAGE_KEY = 'volumeConverterState';

export default function VolumeConverter({ darkMode }) {
  const [input, setInput] = useState('');
  const [fromUnit, setFromUnit] = useState('ml');
  const [toUnit, setToUnit] = useState('cup');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

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
    let ml = TO_ML[fromUnit](val);
    let res = FROM_ML[toUnit](ml);
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
      <h3>Volume Converter</h3>
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

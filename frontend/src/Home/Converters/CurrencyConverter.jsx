import React, { useState, useEffect } from 'react';
import './ConverterCard.css';
import Keypad from './Keypad';

const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'PHP', label: 'Philippine Peso (₱)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'AUD', label: 'Australian Dollar (A$)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
  { value: 'SGD', label: 'Singapore Dollar (S$)' },
  { value: 'KRW', label: 'South Korean Won (₩)' },
  { value: 'CNY', label: 'Chinese Yuan (¥)' },
  { value: 'INR', label: 'Indian Rupee (₹)' },
];

const STORAGE_KEY = 'currencyConverterState';

export default function CurrencyConverter({ darkMode }) {
  const [input, setInput] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('PHP');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState({});
  const [ratesLoaded, setRatesLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setRatesLoaded(false);
    setLoading(true);
    fetch(`https://api.exchangerate.host/latest?base=${fromCurrency}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          setRates(data.rates);
          setRatesLoaded(true);
        } else {
          setRates({});
          setRatesLoaded(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setRates({});
        setRatesLoaded(false);
        setLoading(false);
      });
  }, [fromCurrency]);

  // Restore last selection
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { from, to } = JSON.parse(saved);
        if (from && to) {
          setFromCurrency(from);
          setToCurrency(to);
        }
      } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ from: fromCurrency, to: toCurrency }));
  }, [fromCurrency, toCurrency]);

  const convert = () => {
    setError('');
    let val = parseFloat(input);
    if (isNaN(val) || val < 0) {
      setError('Enter a valid amount');
      setResult('');
      return;
    }
    if (!ratesLoaded) {
      setError('Rates not loaded');
      setResult('');
      return;
    }
    const rate = rates[toCurrency];
    if (!rate) {
      setError('Unsupported currency');
      setResult('');
      return;
    }
    setResult((val * rate).toFixed(2));
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult('');
    setError('');
  };

  return (
    <div className={`converter-card${darkMode ? ' dark' : ''}`}>
      <h3>Currency Converter</h3>
      <div className="converter-row" style={{flexWrap:'wrap'}}>
        <input
          className="converter-input"
          type="text"
          inputMode="none"
          value={input}
          min="0"
          aria-label="Amount"
          readOnly
          placeholder="Enter amount"
          style={{flex: '1 1 120px', background:'#fffbe7', color: darkMode ? '#ffbe40' : '#c96e07', fontWeight: 600, fontSize: '1.25em', border: '2px solid #ffbe40', borderRadius: '0.5em', textAlign: 'right', letterSpacing: '1px', marginBottom: '0.3em'}}
        />
        <Keypad value={input} setValue={setInput} darkMode={darkMode} />
        <select className="converter-select enhanced" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} aria-label="From currency">
          {CURRENCIES.map(c => <option value={c.value} key={c.value}>{c.label}</option>)}
        </select>
        <button className="converter-btn" style={{minWidth:'44px',padding:'0 0.7em',margin:'0 0.6em'}} aria-label="Swap currencies" onClick={handleSwap}>&#8646;</button>
        <select className="converter-select enhanced" value={toCurrency} onChange={e => setToCurrency(e.target.value)} aria-label="To currency">
          {CURRENCIES.map(c => <option value={c.value} key={c.value}>{c.label}</option>)}
        </select>
      </div>
      <button className="converter-btn" onClick={convert} style={{width:'100%',marginTop:'0.7em', fontWeight:700, fontSize:'1.1em', letterSpacing:'1px'}} disabled={!ratesLoaded}>
        {ratesLoaded ? 'Convert' : 'Loading rates...'}
      </button>
      {error && <div className="converter-result enhanced-error" style={{color:'#e53935',marginTop:'0.7em',fontWeight:600,fontSize:'1.1em'}}>{error}</div>}
      {result && !error && (
        <div className="converter-result enhanced-result" style={{marginTop:'1em',padding:'0.8em 1.2em',background:darkMode?'#232323':'#fffbe7',border:'2px solid #ffbe40',borderRadius:'0.7em',color:darkMode?'#ffbe40':'#c96e07',fontSize:'1.25em',fontWeight:700,boxShadow:'0 2px 8px rgba(255,190,64,0.08)'}}>
          <span style={{fontSize:'1.1em'}}>Result:</span> <span style={{fontWeight:900,marginLeft:'0.5em'}}>{result} {toCurrency}</span>
        </div>
      )}
    </div>
  );
}

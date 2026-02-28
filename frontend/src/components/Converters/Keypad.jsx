import React from 'react';
import './Keypad.css';

export default function Keypad({ value, setValue, onEnter, darkMode }) {
  const handlePress = (val) => {
    if (val === 'C') setValue('');
    else if (val === '<') setValue(value.slice(0, -1));
    else if (val === '.') {
      if (!value.includes('.')) setValue(value + '.');
    } else if (val === '00') {
      setValue(value === '0' ? '0' : value + '00');
    } else if (val === 'Enter') {
      if (onEnter) onEnter();
    } else {
      // Prevent leading zeros
      if (value === '0') setValue(val);
      else setValue(value + val);
    }
  };

  const buttons = [
    ['7','8','9'],
    ['4','5','6'],
    ['1','2','3'],
    ['0','.','00'],
    ['C','<']
  ];

  return (
    <div className={`keypad${darkMode ? ' dark' : ''}`}> 
      {buttons.map((row, i) => (
        <div className="keypad-row" key={i}>
          {row.map(btn => (
            <button
              key={btn}
              className={`keypad-btn${btn==='Enter'?' keypad-enter':''}`}
              onClick={() => handlePress(btn)}
              tabIndex={0}
            >
              {btn === '<' ? <span>&#8592;</span> : btn}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

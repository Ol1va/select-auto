import React, { useState } from 'react';
import SelectAuto from './SelectAuto';

function App() {
  const [ data, setData ] = useState('');

  const handleChange = data => {
    setData(JSON.stringify(data, null, '\t'));
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        width: '40%',
        borderRadius: 5,
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
        padding: 30,
        margin: 'auto'
      }}>
        <SelectAuto onChange={handleChange} />
      </div>
      <div style={{
        marginTop: 15,
        marginLeft: 'auto',
        marginRight: 'auto',
        whiteSpace: 'pre'
      }}>
        { data }
      </div>
    </div>
  );
}

export default App;

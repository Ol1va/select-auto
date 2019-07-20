import React from 'react';
import PropTypes from 'prop-types';

import Title from './Title';

function InputArea(props) {
  const { label, value, onChange, gutterTop, ...other } = props;

  const inputProps = Object.assign(
    {},
    { value: value } || {},
    { onChange: onChange } || {},
    other
  );

  return (
    <div style={{ marginTop: gutterTop ? 10 : 0 }}>
      <Title label={label} />
      <input
        {...inputProps}
        style={{
          width: '-webkit-fill-available',
          fontSize: '1rem',
          padding: 5
        }}
      />
    </div>
  );
}

InputArea.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  gutterTop: PropTypes.bool
}

export default InputArea;

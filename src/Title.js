import React from 'react';
import PropTypes from 'prop-types';

const titleStyles = {
  paddingBottom: 8,
  fontSize: '1.2rem'
}

function Title(props) {
  const { label } = props;

  return (
    <div style={titleStyles}>
      <label>
        { label }
      </label>
    </div>
  );
}

Title.propTypes = {
  label: PropTypes.string.isRequired
}

export default Title;

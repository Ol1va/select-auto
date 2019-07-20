import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import InputArea from './InputArea';

const listContainerStyles = {
  maxHeight: '300px',
  overflow: 'scroll',
  width: '-webkit-fill-available',
  boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
  position: 'absolute',
  zIndex: 9999
}

const listStyles = {
  listStyleType: 'none',
  paddingInlineStart: 0,
  marginBlockStart: 0,
  marginBlockEnd: 0
}

const listItemStyles = {
  cursor: 'pointer',
  padding: 10,
  fontSize: '1rem'
}

function ListItem(props) {
  const { value, highlighted, selected, ...other } = props;

  return (
    <li
      style={{
        backgroundColor: highlighted ? 'lightgray' : 'white',
        fontWeight: selected ? 'bold' : 'normal',
        ...listItemStyles
      }}
      { ...other }
    >
      { value }
    </li>
  );
}

ListItem.propTypes = {
  value: PropTypes.string.isRequired,
  highlighted: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired
}

function ControlledAutocomplete(props) {
  const {
    onInputChange,
    onInputClick,
    items,
    label,
    gutterTop,
    ...rest } = props;

  const getFiltration = (data, condition) => {
    return data.filter(item => !condition || item.value.toLowerCase().includes(condition.toLowerCase()));
  }

  return (
    <Downshift {...rest}>
      {({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem
      }) => (
        <div style={{
          flexGrow: 1,
          position: 'relative'
        }}>
          <InputArea
            label={label}
            gutterTop={gutterTop}
            {...getInputProps({
              onClick: onInputClick,
              onChange: onInputChange,
              onBlur: onInputChange
            })}
          />
          { isOpen &&
            <div style={listContainerStyles}>
              <ul style={listStyles}>
                { getFiltration(items, inputValue)
                  .map((item, index) => (
                    <ListItem
                      key={item.value}
                      value={item.value}
                      highlighted={highlightedIndex === index}
                      selected={selectedItem === item}
                      { ...getItemProps({ item }) }
                    />
                  ))
                }
              </ul>
            </div>
          }
        </div>
      )}
    </Downshift>
  );
}

ControlledAutocomplete.propTypes = {
  onInputChange: PropTypes.func.isRequired,
  onInputClick: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  gutterTop: PropTypes.bool
}

function Autocomplete(props) {
  const { label, suggestions, onChange, gutterTop } = props;
  const [ state, setState ] = useState({
    selectedItem: '',
    inputValue: '',
    isOpen: false
  });

  useEffect(() => {
    if (suggestions.length === 0) {
      clearSelection();
    }
  }, [ suggestions ]);

  const handleSelectChange = selectedItem => {
    if (selectedItem !== state.selectedItem) {
      setState({
        ...state,
        selectedItem: selectedItem,
        isOpen: false
      });
      onChange(selectedItem);
    }
  }

  const handleStateChange = changes => {
    let {
      selectedItem = state.selectedItem,
      isOpen = state.isOpen,
      inputValue = state.inputValue
    } = changes;
    setState({
      selectedItem,
      isOpen,
      inputValue
    });
  }

  const handleInputChange = event => {
    const value = event.target.value;    
    let nextState = {...state};
    nextState.inputValue = value;
    if (suggestions.includes(value)) {
      nextState.selectedItem = value;
    }
    setState(nextState);
  }

  const handleInputClick = () => {
    setState({ ...state, isOpen: true });
  }

  const clearSelection = () => {
    setState({
      selectedItem: '',
      inputValue: '',
      isOpen: false
    });
  }

  return (
    <ControlledAutocomplete
      items={suggestions}
      isOpen={state.isOpen}
      selectedItem={state.selectedItem}
      inputValue={state.inputValue}
      onChange={handleSelectChange}
      onStateChange={handleStateChange}
      onInputChange={handleInputChange}
      onInputClick={handleInputClick}
      label={label}
      gutterTop={gutterTop}
      itemToString={ item => (item ? item.value : '') }
    />
  );
}

Autocomplete.propTypes = {
  label: PropTypes.string.isRequired,
  suggestions: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  gutterTop: PropTypes.bool
}

export default Autocomplete;

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Autocomplete from './Autocomplete';
import InputArea from './InputArea';

function SelectAuto(props) {
  const { onChange } = props;
  const [ carMarks, setCarMarks ] = useState([]);
  const [ carModels, setCarModels ] = useState([]);
  const [ mark, setMark ] = useState({
    selectedValue: null,
    inputValue: null
  });
  const [ model, setModel ] = useState({
    selectedValue: null,
    inputValue: null
  });

  // Получение списка марок
  useEffect(() => {
    let isMounted = true;

    const getData = async () => {
      const response = await fetch(
        'https://nadins.solutionfactory.ru/api/order/suggestions?type=carMark',
        { method: 'GET' }
      );
      const data = await response.json();
      if (isMounted) {
        setCarMarks(data.data);
      }
    }
    getData();

    return () => isMounted = false;
  }, []);

  // Получение списка моделей
  useEffect(() => {
    let isAllFilled = true;

    if (mark.selectedValue && model.selectedValue) {
      if ((mark.inputValue !== null && !mark.inputValue.trim()) ||
          (model.inputValue !== null && !model.inputValue.trim())) {
            isAllFilled = false;
          }
    }
    else {
      isAllFilled = false;
    }
    if (isAllFilled) {
      let data = {};
      if (mark.inputValue !== null) {
        data.markSelected = mark.selectedValue.value;
        data.mark = mark.inputValue;
      }
      else {
        data.mark = mark.selectedValue.value;
      }

      const { value, ...rest } = model.selectedValue;
      Object.assign(data, rest);

      if (model.inputValue !== null) {
        data.modelSelected = value;
        data.model = model.inputValue;
      }
      else {
        data.model = value;
      }
      onChange(data);
    }
    else {
      onChange({});
    }
  }, [mark, model, onChange]);

  const isEmptyOrNull = value => {
    return !value || !value.trim();
  }

  const handleMarkChange = event => {
    const value = event.target.value;
    if (isEmptyOrNull(value)) {
      setModel({
        selectedValue: null,
        inputValue: null
      });
    }
    setMark({ ...mark, inputValue: value });
  }

  const handleModelChange = event => {
    const value = event.target.value;
    setModel({ ...model, inputValue: value });
  }

  const handleSelectMarkChange = item => {
    setModel({
      selectedValue: null,
      inputValue: null
    });
    setCarModels([]);

    const getData = async () => {
      const response = await fetch(
        'https://nadins.solutionfactory.ru/api/order/suggestions?type=carModel&mark=' + item.value,
        { method: 'GET' }
      );
      const data = await response.json();
      setCarModels(data.data);
    }
    getData();

    setMark({
      selectedValue: item,
      inputValue: item.value.includes('Другая марка') ? '' : null
    });
  }

  const handleSelectModelChange = item => {
    setModel({
      selectedValue: item,
      inputValue: item.value.includes('Другая модель') ? '' : null
    });
  }

  const isModelInputOpen = mark.selectedValue
    ? mark.inputValue !== null
      ? mark.inputValue.trim()
      : true
    : false;

  return (
    <div>
      <Autocomplete
        label="Выберите марку автомобиля"
        suggestions={carMarks}
        onChange={handleSelectMarkChange}
      />

      { mark.inputValue !== null &&
        <InputArea
          label="Укажите марку автомобиля"
          value={mark.inputValue}
          onChange={handleMarkChange}
          gutterTop
        />
      }

      {isModelInputOpen &&
        <Autocomplete
          label="Выберите модель автомобиля"
          suggestions={carModels}
          onChange={handleSelectModelChange}
          gutterTop
        />
      }

      { model.inputValue !== null &&
        <InputArea
          label="Укажите модель автомобиля"
          // value={modelInput.value}
          value={model.inputValue}
          onChange={handleModelChange}
          gutterTop
        />
      }
    </div>
  );
}

SelectAuto.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default SelectAuto;

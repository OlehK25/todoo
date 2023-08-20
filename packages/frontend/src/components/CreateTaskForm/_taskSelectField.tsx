import React, { FC, ReactElement } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { ISelectField } from './interfaces/ISelectField';
import PropTypes from 'prop-types';

export const TaskSelectField: FC<ISelectField> = (
  props,
): ReactElement => {
  const {
    value = '',
    nameF = 'selectBox',
    onChange = (e: SelectChangeEvent) => console.log(e),
    label = 'Select Box',
    disabled = false,
    items = [{ value: '', label: 'Add Items' }],
  } = props;

  return (
    <FormControl fullWidth size="small">
      <InputLabel id={`${nameF}-id`}>{label}</InputLabel>
      <Select
        labelId={`${nameF}-id`}
        id={`${nameF}-id-select`}
        value={value}
        label={label}
        name={nameF}
        onChange={onChange}
        disabled={disabled}
      >
        {items.map((item, index) => (
          <MenuItem
            key={item.value + index}
            value={item.value}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

TaskSelectField.propTypes = {
  value: PropTypes.string,
  nameF: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired,
  ),
};

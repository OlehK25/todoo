import React, { FC, ReactElement } from "react";
import { TextField } from "@mui/material";
import { ITextField } from "./interfaces/ITextField";
import PropTypes from "prop-types";

export const TaskDescriptionField: FC<ITextField> = (props): ReactElement => {
  const {
    value = "",
    onChange = (e) => console.log(e),
    disabled = false,
  } = props;

  return (
    <TextField
      id="description"
      name="description"
      label="Task Description"
      placeholder="Task Description"
      value={value}
      variant="outlined"
      size="small"
      multiline
      rows={4}
      fullWidth
      disabled={disabled}
      onChange={onChange}
    />
  );
};

TaskDescriptionField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

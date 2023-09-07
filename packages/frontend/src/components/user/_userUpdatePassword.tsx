import * as React from "react";
import { FC, ReactElement } from "react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { IUpdatePassword } from "./interfaces/IUpdatePassword";

export const UpdatePassword: FC<IUpdatePassword> = ({
  label = "password",
  id = "password",
  value = "",
  disabled = false,
  onChange = (e) => console.log(e),
}): ReactElement => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ width: "100%" }} variant="outlined">
      <InputLabel size="small" htmlFor="outlined-adornment-password">
        {label}
      </InputLabel>
      <OutlinedInput
        id={id}
        type={showPassword ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
        value={value}
        disabled={disabled}
        onChange={onChange}
        size="small"
      />
    </FormControl>
  );
};

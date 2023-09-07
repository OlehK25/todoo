import * as React from "react";
import { FC, ReactElement, useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { IPassword } from "./interfaces/IPassword";

export const PasswordInput: FC<IPassword> = ({
  error = false,
  onBlur = () => console.log(),
  helperText = "",
  size = "small",
  label = "password",
  id = "password",
  value = "",
  disabled = false,
  onChange = (e) => console.log(e),
}): ReactElement => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <TextField
      id={id}
      label={label}
      variant="outlined"
      fullWidth
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      sx={{ margin: "2px 0px" }}
      error={error}
      size={size}
      helperText={helperText}
      disabled={disabled}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
//   <FormControl sx={{ width: "100%" }} variant="outlined">
//     <InputLabel
//       size={`${size === "medium" ? "normal" : "small"}`}
//       htmlFor="outlined-adornment-password"
//     >
//       {label}
//     </InputLabel>
//     <OutlinedInput
//       id={id}
//       type={showPassword ? "text" : "password"}
//       endAdornment={
//         <InputAdornment position="end">
//           <IconButton
//             aria-label="toggle password visibility"
//             onClick={handleClickShowPassword}
//             onMouseDown={handleMouseDownPassword}
//             edge="end"
//             size="small"
//           >
//             {showPassword ? <VisibilityOff /> : <Visibility />}
//           </IconButton>
//         </InputAdornment>
//       }
//       label={label}
//       value={value}
//       disabled={disabled}
//       onChange={onChange}
//       size={size}
//     />
//   </FormControl>
// );

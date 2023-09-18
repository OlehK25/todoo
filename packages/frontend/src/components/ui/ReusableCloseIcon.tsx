import * as React from "react";
import { FC, ReactElement } from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface IReusableCloseIcon {
  onClick?: () => void;
  color?: "primary" | "secondary" | "inherit";
  size?: "small" | "medium" | "large";
  setAccount?: boolean;
}

export const ReusableCloseIcon: FC<IReusableCloseIcon> = ({
  onClick = () => console.log(),
  color = "secondary",
  size = "medium",
  setAccount,
}): ReactElement => {
  return (
    <Box
      sx={{
        display: { xs: "flex", sm: `${setAccount ? "flex" : "none"}` },
        justifyContent: "flex-end",
        width: "100%",
        marginTop: "25px",
      }}
    >
      <IconButton size={size} color={color} onClick={onClick}>
        <CloseIcon fontSize="medium" />
      </IconButton>
    </Box>
  );
};

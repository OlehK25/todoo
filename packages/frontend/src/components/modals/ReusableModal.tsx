import React, { FC, ReactElement } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button, Stack } from "@mui/material";
import PropTypes from "prop-types";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";

import { IReusableModal } from "./interfaces/IReusableModal";

export const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "error.light",
  p: 4,
};

export const ReusableModal: FC<IReusableModal> = ({
  open = false,
  handleClose,
  title,
  description,
  onConfirm = (e) => console.log(e),
  confirmButtonText = "Confirm",
  confirmButtonIcon,
}): ReactElement => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{
        boxShadow: 24,
        backdropFilter: "blur(4px)",
      }}
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          {description}
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          display="flex"
          width="100%"
          justifyContent="space-around"
          mt={3}
        >
          <Button
            variant="outlined"
            color="warning"
            startIcon={confirmButtonIcon}
            onClick={onConfirm}
          >
            {confirmButtonText}
          </Button>
          <Button
            variant="contained"
            color="success"
            endIcon={<DoNotDisturbOnOutlinedIcon />}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

ReusableModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  onConfirm: PropTypes.func,
  confirmButtonIcon: PropTypes.element,
  confirmButtonText: PropTypes.string,
};

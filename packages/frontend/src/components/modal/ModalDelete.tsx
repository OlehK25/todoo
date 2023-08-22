import React, { FC, ReactElement, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";

import PropTypes from "prop-types";
import { IModalDelete } from "./interfaces/IModalDelete";

const style = {
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

export const ModalDeleteWindow: FC<IModalDelete> = (props): ReactElement => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { onDelete } = props;

  return (
    <div>
      <IconButton size="small" color="secondary" onClick={handleOpen}>
        <CloseIcon fontSize="small" />
      </IconButton>
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
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            color="error.light"
          >
            Delete Task ?
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this task?
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
              startIcon={<DeleteIcon />}
              onClick={() => {
                if (onDelete) {
                  onDelete();
                }
                handleClose();
              }}
            >
              Confirm
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
    </div>
  );
};

ModalDeleteWindow.propTypes = {
  onDelete: PropTypes.func,
};

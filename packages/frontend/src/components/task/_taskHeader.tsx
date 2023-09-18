import React, { FC, ReactElement, useState } from "react";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import { format } from "date-fns";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { ITaskHeader } from "./interfaces/ITaskHeader";
import { ReusableModal } from "../modals/ReusableModal";

export const TaskHeader: FC<ITaskHeader> = (props): ReactElement => {
  const {
    title = "This is a test title",
    date = new Date(),
    showCloseIcon = false,
    handleDelete = () => console.log(),
  } = props;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box display="flex" width="100%" justifyContent="space-between" mb={3}>
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontSize: { sm: "18px", md: "20px" },
          }}
        >
          {title}
        </Typography>
      </Box>
      {!showCloseIcon && (
        <Box
          sx={{
            display: { xs: "none", sm: "block" },
          }}
        >
          <Chip variant="outlined" label={`${format(date, "PPP")}`} />
        </Box>
      )}

      <Box
        sx={{
          display: { xs: "flex", sm: `${showCloseIcon ? "flex" : "none"}` },
        }}
      >
        <IconButton size="small" color="secondary" onClick={handleOpen}>
          <CloseIcon fontSize="small" />
        </IconButton>
        <ReusableModal
          open={open}
          handleClose={handleClose}
          title="Delete Task?"
          description="Are you sure you want to delete this task?"
          onConfirm={(e) => handleDelete(e, props.id)}
          confirmButtonIcon={<DeleteIcon />}
        />
      </Box>
    </Box>
  );
};

TaskHeader.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  showCloseIcon: PropTypes.bool,
};

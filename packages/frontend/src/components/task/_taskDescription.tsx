import React, { FC, ReactElement } from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

import { ITaskDescription } from './interfaces/ITaskDescription';

export const TaskDescription: FC<ITaskDescription> = (
  props,
): ReactElement => {
  const { description = 'This is a test description' } =
    props;

  return (
    <Box>
      <Typography>{description}</Typography>
    </Box>
  );
};

TaskDescription.propTypes = {
  description: PropTypes.string,
};

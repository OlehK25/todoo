import React, {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';

import { TaskTitleField } from './_taskTitleField';
import { TaskDescriptionField } from './_taskDecsriptionField';
import { TaskDateField } from './_taskDateField';
import { TaskSelectField } from './_taskSelectField';
import { Status } from './enums/status';
import { Priority } from './enums/priority';
import { sendApiRequest } from '../../helpers/sendApiRequest';
import { ICreateTask } from '../taskArea/interfaces/ICreateTask';
import { TaskStatusChangedContext } from '../../context/taskStatusChangedContext/TaskStatusChangedContext';

export const CreateTaskForm: FC = (): ReactElement => {
  const [title, setTitle] = useState<string | undefined>(
    undefined,
  );
  const [description, setDescription] = useState<
    string | undefined
  >(undefined);
  const [date, setDate] = useState<Date | null>(new Date());
  const [status, setStatus] = useState<string>(Status.todo);
  const [priority, setPriority] = useState<string>(
    Priority.normal,
  );
  const [showSuccessAlert, setShowSuccessAlert] =
    useState<boolean>(false);

  const tasksUpdatedContext = useContext(
    TaskStatusChangedContext,
  );

  const createTaskMutation = useMutation(
    (data: ICreateTask) =>
      sendApiRequest(
        'http://localhost:3500/tasks',
        'POST',
        data,
      ),
  );

  function handleCreateTask() {
    if (!title || !date || !description) return;

    const task = {
      title,
      description,
      date: date.toString(),
      status,
      priority,
    };

    createTaskMutation.mutate(task);
  }

  // Manage Side Effects inside the application
  useEffect(() => {
    if (createTaskMutation.isSuccess) {
      setShowSuccessAlert(true);
      tasksUpdatedContext.toggle();
    }
    const successAlertTimeout = setTimeout(() => {
      setShowSuccessAlert(false);
    }, 5000);

    return () => {
      clearTimeout(successAlertTimeout);
    };
  }, [createTaskMutation.isSuccess]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      width="100%"
      px={4}
      my={6}
    >
      {showSuccessAlert && (
        <Alert
          severity="success"
          sx={{
            width: '100%',
            marginBottom: '16px',
          }}
        >
          <AlertTitle>Success</AlertTitle>
          The task has been created successfully!
        </Alert>
      )}

      <Typography mb={2} component="h2" variant="h6">
        Create a Task
      </Typography>

      <Stack sx={{ width: '100%' }} spacing={2}>
        <TaskTitleField
          disabled={createTaskMutation.isLoading}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <TaskDescriptionField
          disabled={createTaskMutation.isLoading}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <TaskDateField
          disabled={createTaskMutation.isLoading}
          value={date}
          onChange={(date) => setDate(date)}
        />

        <Stack
          direction="row"
          sx={{ width: '100%' }}
          spacing={2}
        >
          <TaskSelectField
            disabled={createTaskMutation.isLoading}
            label="Status"
            nameF="status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as string)
            }
            items={[
              {
                value: Status.todo,
                label: Status.todo.toUpperCase(),
              },
              {
                value: Status.inProgress,
                label: Status.inProgress.toUpperCase(),
              },
            ]}
          />
          <TaskSelectField
            disabled={createTaskMutation.isLoading}
            label="Priority"
            nameF="priority"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as string)
            }
            items={[
              {
                value: Priority.low,
                label: Priority.low,
              },
              {
                value: Priority.normal,
                label: Priority.normal,
              },
              {
                value: Priority.high,
                label: Priority.high,
              },
            ]}
          />
        </Stack>
        {createTaskMutation.isLoading && <LinearProgress />}
        <Button
          disabled={
            !title ||
            !date ||
            !description ||
            !status ||
            !priority
          }
          onClick={handleCreateTask}
          variant="contained"
          size="large"
          fullWidth
        >
          Create A Task
        </Button>
      </Stack>
    </Box>
  );
};

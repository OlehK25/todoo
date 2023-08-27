import React, {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert, Box, Button, Grid, LinearProgress } from "@mui/material";
import { format } from "date-fns";
import toast from "react-hot-toast";

import { TaskCounter } from "../taskCounter/TaskCounter";
import { Task } from "../task/Task";
import { sendApiRequest } from "../../helpers/sendApiRequest";
import { ITaskAPI } from "./interfaces/ITaskAPI";
import { Status } from "../CreateTaskForm/enums/status";
import { IUpdateTask } from "../CreateTaskForm/interfaces/IUpdateTask";
import { countTasks } from "./helpers/countTasks";
import { TaskStatusChangedContext } from "../../context";

export const TaskArea: FC = (): ReactElement => {
  const taskUpdatedContext = useContext(TaskStatusChangedContext);
  const [selectedStatus, setSelectedStatus] = useState<Status | string>("ALL");
  const [noCount, setNoCount] = useState(false);

  const { error, isLoading, data, refetch } = useQuery(["tasks"], async () =>
    sendApiRequest<ITaskAPI[]>("http://localhost:3500/tasks", "GET"),
  );

  const updateTaskMutation = useMutation((data: IUpdateTask) =>
    sendApiRequest("http://localhost:3500/tasks", "PUT", data),
  );

  const deleteTaskMutation = useMutation((id: string) =>
    sendApiRequest(`http://localhost:3500/tasks/${id}`, "DELETE"),
  );

  function countTasksByStatus(status: Status | string) {
    if (status === "ALL") return data?.length;
    return data?.filter((task) => task.status === status)?.length;
  }

  useEffect(() => {
    refetch();
  }, [taskUpdatedContext.updated]);

  useEffect(() => {
    if (updateTaskMutation.isSuccess) {
      toast.success(`Task updated successfully!!!`);
      taskUpdatedContext.toggle();
    }
  }, [updateTaskMutation.isSuccess]);

  useEffect(() => {
    if (deleteTaskMutation.isSuccess) {
      toast.success(`Task deleted successfully!!!`);
      taskUpdatedContext.toggle();
    } else if (deleteTaskMutation.isError) {
      toast.error(`Error deleting Task. Please try again later. ${error}`);
    }
  }, [deleteTaskMutation.isSuccess]);

  useEffect(() => {
    const count = countTasksByStatus(selectedStatus);
    setNoCount(count === 0);
  }, [taskUpdatedContext.updated, data, selectedStatus]);

  function handleStatusChange(
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) {
    updateTaskMutation.mutate({
      id,
      status: e.target.checked ? Status.inProgress : Status.todo,
    });
  }

  function handlerMarkComplete(
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) {
    updateTaskMutation.mutate({
      id,
      status: Status.completed,
    });
  }

  function handlerDeleteTask(
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) {
    deleteTaskMutation.mutate(id);
  }

  const toggleSelectedStatus = (status: Status | string) => {
    if (selectedStatus === status) {
      setSelectedStatus("ALL");
    } else {
      setSelectedStatus(status);
    }
  };

  return (
    <Grid item md={8} px={4}>
      <Box mb={8} px={4}>
        <h2>Status Of Your Tasks As On {format(new Date(), "PPPP")}</h2>
      </Box>

      <Grid container display="flex" justifyContent="center">
        <Grid
          item
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          alignItems="center"
          md={10}
          xs={12}
          mb={8}
        >
          <Button onClick={() => toggleSelectedStatus("ALL")}>
            <TaskCounter
              selectedStatus={selectedStatus}
              count={data ? data.length : undefined}
              status={"ALL"}
            />
          </Button>

          <Button onClick={() => toggleSelectedStatus(Status.todo)}>
            <TaskCounter
              count={data ? countTasks(data, Status.todo) : undefined}
              status={Status.todo}
              selectedStatus={selectedStatus}
            />
          </Button>

          <Button onClick={() => toggleSelectedStatus(Status.inProgress)}>
            <TaskCounter
              count={data ? countTasks(data, Status.inProgress) : undefined}
              status={Status.inProgress}
              selectedStatus={selectedStatus}
            />
          </Button>

          <Button onClick={() => toggleSelectedStatus(Status.completed)}>
            <TaskCounter
              count={data ? countTasks(data, Status.completed) : undefined}
              status={Status.completed}
              selectedStatus={selectedStatus}
            />
          </Button>
        </Grid>

        <Grid item display="flex" flexDirection="column" md={8} xs={10}>
          <>
            {error && (
              <Alert severity="error">
                There was an error fetching your tasks. Please try again later.
              </Alert>
            )}

            {!error && Array.isArray(data) && data.length === 0 && (
              <Alert severity="warning">
                You don`t have any tasks yet. Create one now.
              </Alert>
            )}

            {noCount && (
              <Alert severity="warning">
                You don`t have any tasks with the selected status yet. Create
                one now.
              </Alert>
            )}

            {isLoading ? (
              <LinearProgress />
            ) : (
              Array.isArray(data) &&
              data.length > 0 &&
              data.map((task) => {
                return (
                  selectedStatus === Status.completed
                    ? task.status === Status.completed
                    : selectedStatus === Status.todo
                    ? task.status === Status.todo
                    : selectedStatus === Status.inProgress
                    ? task.status === Status.inProgress
                    : task.status === Status.todo ||
                      task.status === Status.inProgress ||
                      task.status === Status.completed
                ) ? (
                  <Task
                    id={task.id}
                    key={task.id}
                    title={task.title}
                    date={new Date(task.date)}
                    description={task.description}
                    priority={task.priority}
                    status={task.status}
                    onStatusChange={handleStatusChange}
                    onClick={handlerMarkComplete}
                    onDelete={handlerDeleteTask}
                  />
                ) : (
                  false
                );
              })
            )}
          </>
        </Grid>
      </Grid>
    </Grid>
  );
};

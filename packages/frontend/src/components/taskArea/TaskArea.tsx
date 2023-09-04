import React, {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert, Button, Grid, LinearProgress } from "@mui/material";
import toast from "react-hot-toast";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import PropTypes from "prop-types";

import { TaskCounter } from "../taskCounter/TaskCounter";
import { Task } from "../task/Task";
import { sendApiRequest } from "../../helpers/sendApiRequest";
import { ITaskAPI } from "./interfaces/ITaskAPI";
import { Status } from "../CreateTaskForm/enums/status";
import { IUpdateTask } from "../CreateTaskForm/interfaces/IUpdateTask";
import { countTasks } from "./helpers/countTasks";
import { TaskStatusChangedContext } from "../../context";
import { Header } from "./Header";
import { ITaskArea } from "./interfaces/ITaskArea";

export const TaskArea: FC<ITaskArea> = ({
  isClicked = false,
  setIsClicked = () => console.log(),
  isAuthenticated = false,
}): ReactElement => {
  const taskUpdatedContext = useContext(TaskStatusChangedContext);
  const [selectedStatus, setSelectedStatus] = useState<Status | string>("ALL");
  const [noCount, setNoCount] = useState(false);

  const { error, isLoading, data, refetch } = useQuery(["tasks"], async () =>
    sendApiRequest<ITaskAPI[]>("http://localhost:3500/tasks", "GET"),
  );

  const [tasks, setTasks] = useState(data);

  const updateTaskMutation = useMutation((data: IUpdateTask) =>
    sendApiRequest("http://localhost:3500/tasks", "PUT", data),
  );

  const updateTaskOrderMutation = useMutation(
    (data: { id: string; order: number }) =>
      sendApiRequest(`http://localhost:3500/tasks/order`, "PUT", data),
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
    } else if (deleteTaskMutation.isSuccess) {
      toast.success(`Task deleted successfully!!!`);
      taskUpdatedContext.toggle();
    } else if (deleteTaskMutation.isError) {
      toast.error(`Error deleting Task. Please try again later. ${error}`);
    }
  }, [updateTaskMutation.isSuccess, deleteTaskMutation.isSuccess]);

  useEffect(() => {
    const count = countTasksByStatus(selectedStatus);
    setNoCount(count === 0);
  }, [taskUpdatedContext.updated, data, selectedStatus]);

  useEffect(() => {
    setTasks(data);
  }, [data]);

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

  function handleOnDragEnd(result: DropResult) {
    if (!result.destination) return;

    if (tasks) {
      const reorderedTasks = Array.from(tasks);
      const [removed] = reorderedTasks.splice(result.source.index, 1);
      reorderedTasks.splice(result.destination.index, 0, removed);

      setTasks(reorderedTasks);

      reorderedTasks.forEach((task, index) => {
        updateTaskOrderMutation.mutate({
          id: task.id,
          order: index,
        });
      });
    }
  }

  const toggleSelectedStatus = (status: Status | string) => {
    if (selectedStatus === status) {
      setSelectedStatus("ALL");
    } else {
      setSelectedStatus(status);
    }
  };

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((task) => {
        switch (selectedStatus) {
          case Status.completed:
            return task.status === Status.completed;
          case Status.todo:
            return task.status === Status.todo;
          case Status.inProgress:
            return task.status === Status.inProgress;
          default:
            return true;
        }
      })
    : [];

  return (
    <Grid item md={8} px={4}>
      <Header
        isAuthenticated={isAuthenticated}
        isClicked={isClicked}
        setIsClicked={setIsClicked}
      />

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

            {!error && data?.length !== 0 && noCount && (
              <Alert severity="warning">
                You don`t have any tasks with the selected status yet. Create
                one now.
              </Alert>
            )}

            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {isLoading ? (
                      <LinearProgress />
                    ) : (
                      filteredTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Task
                                id={task.id}
                                title={task.title}
                                date={new Date(task.date)}
                                description={task.description}
                                priority={task.priority}
                                status={task.status}
                                onStatusChange={handleStatusChange}
                                onClick={handlerMarkComplete}
                                handleDelete={handlerDeleteTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </>
        </Grid>
      </Grid>
    </Grid>
  );
};

TaskArea.propTypes = {
  isAuthenticated: PropTypes.bool,
  isClicked: PropTypes.bool,
  setIsClicked: PropTypes.func,
};

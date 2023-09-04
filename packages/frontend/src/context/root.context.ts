import { TaskStatusChangedProvider } from "./taskStatusChangedContext/TaskStatusChangedContext";
import { UserProvider } from "./User.context";

export const rootContext = [TaskStatusChangedProvider, UserProvider];

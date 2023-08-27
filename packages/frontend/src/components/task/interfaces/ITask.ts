import { ITaskHeader } from "./ITaskHeader";
import { ITaskDescription } from "./ITaskDescription";
import { ITaskFooter } from "./ITaskFooter";
import { IModalDelete } from "../../modal/interfaces/IModalDelete";

export interface ITask
  extends ITaskHeader,
    ITaskDescription,
    ITaskFooter,
    IModalDelete {
  priority?: string;
}

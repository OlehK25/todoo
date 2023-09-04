import { ITaskHeader } from "./ITaskHeader";
import { ITaskDescription } from "./ITaskDescription";
import { ITaskFooter } from "./ITaskFooter";
import React from "react";

export interface ITask extends ITaskHeader, ITaskDescription, ITaskFooter {
  priority?: string;
}

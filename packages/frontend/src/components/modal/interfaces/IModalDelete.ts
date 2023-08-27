import React from "react";
import { ITaskFooter } from "../../task/interfaces/ITaskFooter";

export interface IModalDelete extends ITaskFooter {
  onDelete?: (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => void;
}

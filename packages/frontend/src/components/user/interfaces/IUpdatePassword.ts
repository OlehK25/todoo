import { ChangeEvent } from "react";

export interface IUpdatePassword {
  label?: string;
  id?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

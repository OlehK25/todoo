import { ChangeEvent } from "react";

export interface IPassword {
  error?: boolean;
  helperText?: string | null;
  onBlur?: () => void;
  size?: "small" | "medium";
  label?: string;
  id?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

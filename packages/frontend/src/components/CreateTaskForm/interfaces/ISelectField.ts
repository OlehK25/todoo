import { IDisabled } from './IDisabled';
import { SelectChangeEvent } from '@mui/material';

export interface ISelectItems {
  value: string;
  label: string;
}

export interface ISelectField extends IDisabled {
  nameF?: string;
  label?: string;
  value?: string;
  onChange?: (event: SelectChangeEvent) => void;
  items?: ISelectItems[];
}

import { IUpdateAccount } from "./IUpdateAccount";

export interface IDeleteAccount extends IUpdateAccount {
  isLoading?: boolean;
  setIsLoading?: (isLoading: boolean) => void;
}

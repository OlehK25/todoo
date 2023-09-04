export interface IModalLogin {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  open: boolean;
  handleClose: () => void;
  handleLogin: (username: string, password: string) => void;
}

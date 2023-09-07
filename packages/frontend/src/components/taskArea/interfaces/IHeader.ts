export interface IHeader {
  isClickedAccount?: boolean;
  setIsClickedAccount?: (e: boolean) => void;
  loginModalOpen?: boolean;
  setLoginModalOpen?: (e: boolean) => void;
  isClicked?: boolean;
  setIsClicked?: (e: boolean) => void;
  isAuthenticated?: boolean;
}

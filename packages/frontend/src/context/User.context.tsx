import React, {
  createContext,
  useState,
  FC,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from "react";
import { IUsersAPI } from "../components/authentication/interfaces/IUsersAPI";

interface IUserContext {
  user: IUsersAPI | null;
  setUser: Dispatch<SetStateAction<IUsersAPI | null>>;
}

export const UserContext = createContext<IUserContext>({
  user: null,
  setUser: () => {},
});

export const UserProvider: FC<PropsWithChildren> = (props) => {
  const [user, setUser] = useState<IUsersAPI | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

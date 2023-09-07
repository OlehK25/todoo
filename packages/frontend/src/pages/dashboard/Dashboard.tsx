import React, {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { Grid } from "@mui/material";

import { Sidebar } from "../../components/sidebar/Sidebar";
import { TaskArea } from "../../components/taskArea/TaskArea";
import { UserContext } from "../../context";
import { fetchUserDetails } from "../../components/authentication/api";
import { Account } from "../../components/user/Account";

export const Dashboard: FC = (): ReactElement => {
  const { user, setUser } = useContext(UserContext);
  const isAuthenticated = user !== null;
  const [isClicked, setIsClicked] = useState(false);
  const [isClickedAccount, setIsClickedAccount] = useState(false);

  const token = localStorage.getItem("token");

  const { isError } = useQuery(
    ["userDetails"],
    () => fetchUserDetails(token!),
    {
      enabled: !!token,
      onSuccess: (data) => {
        if (data.user) {
          setUser(data.user);
        }
      },
    },
  );

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [isError]);

  return (
    <Grid
      container={isClicked || (isAuthenticated && isClickedAccount)}
      minHeight="100vh"
      p={0}
      m={0}
    >
      <TaskArea
        isAuthenticated={isAuthenticated}
        isClicked={isClicked}
        isClickedAccount={isClickedAccount}
        setIsClickedAccount={() => setIsClickedAccount(!isClickedAccount)}
        setIsClicked={() => setIsClicked(!isClicked)}
      />
      {isClicked && !isClickedAccount && (
        <Sidebar isAuthenticated={isAuthenticated} />
      )}

      {isClickedAccount && isAuthenticated && (
        <Account
          setIsClickedAccount={() => setIsClickedAccount(!isClickedAccount)}
        />
      )}
    </Grid>
  );
};

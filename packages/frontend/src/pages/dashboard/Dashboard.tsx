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

export const Dashboard: FC = (): ReactElement => {
  const { user } = useContext(UserContext);
  const isAuthenticated = user !== null;
  const [isClicked, setIsClicked] = useState(false);

  const token = localStorage.getItem("token");
  const { setUser } = useContext(UserContext);

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
    <Grid container={isClicked} minHeight="100vh" p={0} m={0}>
      <TaskArea
        isAuthenticated={isAuthenticated}
        isClicked={isClicked}
        setIsClicked={() => setIsClicked(!isClicked)}
      />
      {isClicked && <Sidebar isAuthenticated={isAuthenticated} />}
    </Grid>
  );
};

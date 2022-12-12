import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import isAuth, { userType } from "../lib/isAuth";
import { useHistory } from "react-router-dom";
import { Menu } from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: "none",
    color: "blue",
    fontSize: "20px",
  },
  icon: {
    color: "white",
  },
}));

const DrawerComponent = () => {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  const history = useHistory();
  return (
    <>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        {isAuth() ? (
          userType() === "admin" ? (
            <>
              {" "}
              <List>
                <ListItem
                  onClick={() => {
                    history.push("/logout");
                    setOpenDrawer(false);
                  }}
                >
                  <ListItemText>Logout</ListItemText>
                </ListItem>
              </List>
            </>
          ) : userType() === "recruiter" ? (
            <>
              {" "}
              <List>
                <ListItem
                  onClick={() => {
                    history.push("/");
                    setOpenDrawer(false);
                  }}
                >
                  <ListItemText>Home</ListItemText>
                </ListItem>
                <ListItem
                  onClick={() => {
                    history.push("/addjob");
                    setOpenDrawer(false);
                  }}
                >
                  <ListItemText>Add Jobs</ListItemText>
                </ListItem>
                <ListItem
                  onClick={() => {
                    history.push("/myjobs");
                    setOpenDrawer(false);
                  }}
                >
                  <ListItemText>My Jobs </ListItemText>
                </ListItem>
                <ListItem
                  onClick={() => {
                    history.push("/employees");
                    setOpenDrawer(false);
                  }}
                >
                  <ListItemText>Employees </ListItemText>
                </ListItem>
                <ListItem
                  onClick={() => {
                    history.push("/profile");
                    setOpenDrawer(false);
                  }}
                >
                  <ListItemText>Profile </ListItemText>
                </ListItem>
                <ListItem
                  onClick={() => {
                    history.push("/logout");
                    setOpenDrawer(false);
                  }}
                >
                  <ListItemText>Logout </ListItemText>
                </ListItem>
              </List>
            </>
          ) : (
            <>
              <List>
                <ListItem
                  onClick={() => {
                    history.push("/");
                    setOpenDrawer(false);
                  }}
                >
                  <ListItemText>Home</ListItemText>
                </ListItem>
                <ListItem
                  onClick={() => {
                    history.push("/applications");
                    setOpenDrawer(false);
                  }}
                >
                  <ListItemText>Applications</ListItemText>
                </ListItem>
                <ListItem
                  onClick={() => {
                    history.push("/profile");
                    setOpenDrawer(false);
                  }}
                >
                  <ListItemText>Profile </ListItemText>
                </ListItem>
                <ListItem
                  onClick={() => {
                    history.push("/logout");
                    setOpenDrawer(false);
                  }}
                >
                  <ListItemText>Logout </ListItemText>
                </ListItem>
              </List>
            </>
          )
        ) : (
          <List>
            <ListItem
              onClick={() => {
                history.push("/login");
                setOpenDrawer(false);
              }}
            >
              <ListItemText>Login</ListItemText>
            </ListItem>
            <ListItem
              onClick={() => {
                history.push("/signup");
                setOpenDrawer(false);
              }}
            >
              <ListItemText>Signup</ListItemText>
            </ListItem>
          </List>
        )}
      </Drawer>
      <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
        <Menu style={{ color: "white" }} />
      </IconButton>
    </>
  );
};
export default DrawerComponent;

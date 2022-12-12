import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import isAuth, { userType } from "../lib/isAuth";
import DrawerComponent from "./Drawer";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    fontWeight: "bold",
    fontStyle: "italic",
  },
  logoImage: {
    borderRadius: "50%",
    width: "80px",
    marginRight: 8,
  },
  navbar: {
    backgroundColor: "black",
  },
  logoName: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    width: "max-content",
  },
  navButtons: {
    fontWeight: "500",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  navbarButtons: {
    display: "flex",
  },
}));

const Navbar = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const classes = useStyles();
  let history = useHistory();

  const handleClick = (location) => {
    history.push(location);
  };

  const handleLogoClick = () => {
    history.push("/");
  };

  return (
    <AppBar position="fixed" className={classes.navbar}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.logoName} onClick={handleLogoClick}>
          <img className={classes.logoImage} src="i3.png" />
          <Typography variant="h6" className={classes.title}>
            HuskyJobs
          </Typography>
        </div>
        {isMobile ? (
          <DrawerComponent />
        ) : (
          <div className={classes.navbarButtons}>
            {isAuth() ? (
              userType() === "admin" ? (
                <>
                  <Button
                    className={classes.navButtons}
                    color="inherit"
                    onClick={() => handleClick("/logout")}
                  >
                    Logout
                  </Button>
                </>
              ) : userType() === "recruiter" ? (
                <>
                  <Button
                    className={classes.navButtons}
                    color="inherit"
                    onClick={() => handleClick("/")}
                  >
                    Home
                  </Button>
                  <Button
                    className={classes.navButtons}
                    color="inherit"
                    onClick={() => handleClick("/addjob")}
                  >
                    Add Jobs
                  </Button>
                  <Button
                    className={classes.navButtons}
                    color="inherit"
                    onClick={() => handleClick("/myjobs")}
                  >
                    My Jobs
                  </Button>
                  <Button
                    className={classes.navButtons}
                    color="inherit"
                    onClick={() => handleClick("/employees")}
                  >
                    Employees
                  </Button>
                  <Button
                    className={classes.navButtons}
                    color="inherit"
                    onClick={() => handleClick("/profile")}
                  >
                    Profile
                  </Button>
                  <Button
                    className={classes.navButtons}
                    color="inherit"
                    onClick={() => handleClick("/logout")}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className={classes.navButtons}
                    color="inherit"
                    onClick={() => handleClick("/")}
                  >
                    Home
                  </Button>
                  <Button
                    className={classes.navButtons}
                    color="inherit"
                    onClick={() => handleClick("/applications")}
                  >
                    Applications
                  </Button>
                  <Button
                    className={classes.navButtons}
                    color="inherit"
                    onClick={() => handleClick("/profile")}
                  >
                    Profile
                  </Button>
                  <Button
                    className={classes.navButtons}
                    color="inherit"
                    onClick={() => handleClick("/logout")}
                  >
                    Logout
                  </Button>
                </>
              )
            ) : (
              <>
                <Button
                  className={classes.navButtons}
                  color="inherit"
                  onClick={() => handleClick("/login")}
                >
                  Login
                </Button>
                <Button
                  className={classes.navButtons}
                  color="inherit"
                  onClick={() => handleClick("/signup")}
                >
                  Signup
                </Button>
              </>
            )}
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

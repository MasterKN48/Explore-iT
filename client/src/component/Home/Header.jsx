import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import context from "../../context";
import { useMediaQuery } from "@material-ui/core";
import Signout from "../Auth/Signout";
import AppLogo from "../../assets/app.png";

const Header = ({ classes }) => {
  const { state } = useContext(context);
  const { currentUser } = state;
  const mobileSize = useMediaQuery(`(max-width:650px)`);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.grow}>
            <img src={AppLogo} className={classes.icon} alt="logo-bar" />
            <Typography
              className={mobileSize ? classes.mobile : ""}
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
            >
              Explore-iT
            </Typography>
          </div>

          {currentUser && (
            <div className={classes.grow}>
              <img
                id="avt"
                className={classes.picture}
                alt={currentUser.name}
                src={currentUser.picture}
              />
              <Typography
                className={mobileSize ? classes.mobile : ""}
                variant="h5"
                color="inherit"
                noWrap
              >
                {currentUser.name}
              </Typography>
            </div>
          )}

          <Signout />
        </Toolbar>
      </AppBar>
    </div>
  );
};

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginRight: theme.spacing(1),
    height: "60px",
  },
  mobile: {
    display: "none",
  },
  picture: {
    height: "50px",
    borderRadius: "90%",
    marginRight: theme.spacing(2),
  },
});

export default withStyles(styles)(Header);

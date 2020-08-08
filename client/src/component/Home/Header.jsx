import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MapIcon from "@material-ui/icons/Map";
import Typography from "@material-ui/core/Typography";
import context from "../../context";
import Signout from "../Auth/Signout";

const Header = ({ classes }) => {
  const { state } = useContext(context);
  const { currentUser } = state;
  //console.log(currentUser);
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.grow}>
            <MapIcon className={classes.icon}></MapIcon>
            <Typography component="h1" variant="h6" color="inherit" noWrap>
              GeoPins
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
              <Typography variant="h5" color="inherit" noWrap>
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
    color: "green",
    fontSize: 45,
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

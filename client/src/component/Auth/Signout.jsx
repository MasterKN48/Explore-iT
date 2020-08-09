import React, { useContext } from "react";
import { GoogleLogout } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import { useMediaQuery } from "@material-ui/core";
import context from "../../context";

const Signout = ({ classes }) => {
  const { dispatch } = useContext(context);
  const mobileSize = useMediaQuery(`(max-width:650px)`);
  const onSignout = () => {
    dispatch({ type: "SIGNOUT_USER" });
    console.log("Signout user");
  };
  return (
    <div>
      <GoogleLogout
        onLogoutSuccess={onSignout}
        render={({ onClick }) => (
          <span onClick={onClick} className={classes.root}>
            <Typography
              style={{ display: mobileSize ? "none" : "block" }}
              variant="body1"
              className={classes.buttonText}
            >
              Signout
            </Typography>
            <ExitToApp className={classes.buttonIcon} />
          </span>
        )}
      />
    </div>
  );
};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex",
  },
  buttonText: {
    color: "orange",
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "orange",
  },
};

export default withStyles(styles)(Signout);

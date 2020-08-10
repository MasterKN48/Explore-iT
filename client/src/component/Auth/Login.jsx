import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { GoogleLogin } from "react-google-login";
import { Redirect } from "react-router-dom";
import { GraphQLClient } from "graphql-request";
import { ME_QUERY } from "../../graphql/queries";
import context from "../../context";
import AppLogo from "../../assets/app.png";

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
};
const ENDPOINT = "/api/graphql";

const Login = ({ classes }) => {
  const { state, dispatch } = useContext(context);
  const onSuccess = async (googleUser) => {
    //console.log(googleUser);
    const idToken = googleUser.getAuthResponse().id_token;
    try {
      const client = new GraphQLClient(ENDPOINT, {
        headers: { authorization: idToken },
      });
      const { me } = await client.request(ME_QUERY);
      //console.log({ data });
      dispatch({ type: "LOGIN_USER", payload: me });
      dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn() });
    } catch (error) {
      onFailure(error);
    }
  };

  const onFailure = (error) => {
    console.error(error);
    dispatch({ type: "IS_LOGGED_IN", payload: false });
  };

  return state.isAuth ? (
    <Redirect to="/" />
  ) : (
    <div className={classes.root}>
      <img src={AppLogo} alt="logo-bar" style={{ height: "84px" }} />
      <Typography
        component="h1"
        variant="h4"
        noWrap
        gutterBottom
        style={{ color: "rgb(66, 143, 244)" }}
      >
        Welcome to Explore-iT
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        Map Based Real Time Micro Blogging App
      </Typography>
      <GoogleLogin
        onFailure={onFailure}
        onSuccess={onSuccess}
        isSignedIn={true}
        theme="dark"
        buttonText="Login with Google"
        clientId="<Google-OAuth-Client-Id>"
      />
    </div>
  );
};

export default withStyles(styles)(Login);

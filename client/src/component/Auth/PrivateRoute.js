import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import context from "../../context";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { state } = useContext(context);
  return (
    <Route
      {...rest}
      render={(props) =>
        state.isAuth === false ? (
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;

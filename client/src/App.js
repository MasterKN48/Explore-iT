import React, { Suspense, lazy, useContext, useReducer } from "react";
import { CircularProgress } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import context from "./context";
import reducer from "./reducer";
import PrivateRoute from "./component/Auth/PrivateRoute";

const Home = lazy(() => import("./component/Home"));
const Login = lazy(() => import("./component/Auth/Login"));

const App = () => {
  const initialState = useContext(context);
  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log(state);
  return (
    <Router>
      <context.Provider value={{ state, dispatch }}>
        <Switch>
          <Suspense fallback={<CircularProgress color="primary" />}>
            <PrivateRoute exact path="/" component={Home} />
            <Route path="/login" component={Login} />
          </Suspense>
        </Switch>
      </context.Provider>
    </Router>
  );
};

export default App;

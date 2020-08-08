import React, { Suspense, lazy } from "react";
import { CircularProgress } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";

const Home = lazy(() => import("./component/Home"));
const Login = lazy(() => import("./component/Auth/Login"));

const App = () => {
  return (
    <Router>
      <Switch>
        <Suspense fallback={<CircularProgress color="primary" />}>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
        </Suspense>
      </Switch>
    </Router>
  );
};

export default withRouter(App);

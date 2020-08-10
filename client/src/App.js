import React, { Suspense, lazy, useContext, useReducer } from "react";
import { CircularProgress } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import context from "./context";
import reducer from "./reducer";
import PrivateRoute from "./component/Auth/PrivateRoute";
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import NotFound from "./assets/404.webp";

const Home = lazy(() => import("./component/Home"));
const Login = lazy(() => import("./component/Auth/Login"));

let url =
  window.location.hostname === "localhost"
    ? "ws://localhost:8000/graphql"
    : `wss://${window.location.hostname}/graphql`;

const wsLink = new WebSocketLink({
  uri: url,
  options: {
    reconnect: true,
  },
});

const client = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache(),
});

const NoMatchPage = () => {
  return (
    <div className="container-fluid" align="center">
      <img loading="lazy" style={{ height: "80vh" }} src={NotFound} alt="404" />
      <h5>
        The page you are looking for does not exist, <a href="/">click here</a>{" "}
        to go to the homepage.
      </h5>
    </div>
  );
};

const App = () => {
  const initialState = useContext(context);
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Router>
      <ApolloProvider client={client}>
        <context.Provider value={{ state, dispatch }}>
          <Suspense fallback={<CircularProgress color="primary" />}>
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route component={NoMatchPage} />
            </Switch>
          </Suspense>
        </context.Provider>
      </ApolloProvider>
    </Router>
  );
};

export default App;

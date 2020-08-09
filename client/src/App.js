import React, { Suspense, lazy, useContext, useReducer } from "react";
import { CircularProgress } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import context from "./context";
import reducer from "./reducer";
import PrivateRoute from "./component/Auth/PrivateRoute";
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";

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

const App = () => {
  const initialState = useContext(context);
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Router>
      <ApolloProvider client={client}>
        <context.Provider value={{ state, dispatch }}>
          <Switch>
            <Suspense fallback={<CircularProgress color="primary" />}>
              <PrivateRoute exact path="/" component={Home} />
              <Route path="/login" component={Login} />
            </Suspense>
          </Switch>
        </context.Provider>
      </ApolloProvider>
    </Router>
  );
};

export default App;

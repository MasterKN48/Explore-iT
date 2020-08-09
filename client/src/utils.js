import { useState, useEffect } from "react";
import { GraphQLClient } from "graphql-request";

const ENDPOINT =
  process.env.NODE_ENV === "prod"
    ? "/api/graphql"
    : "http://localhost:8000/api/graphql";

export const useClient = () => {
  const [token, setToken] = useState("");
  useEffect(() => {
    const token = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().id_token;
    setToken(token);
  }, []);
  return new GraphQLClient(ENDPOINT, {
    headers: { authorization: token },
  });
};

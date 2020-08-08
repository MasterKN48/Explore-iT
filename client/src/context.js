import { createContext } from "react";

const context = createContext({
  currentUser: null,
  isAuth: false,
});

export default context;

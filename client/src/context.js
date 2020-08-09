import { createContext } from "react";

const context = createContext({
  currentUser: null,
  isAuth: false,
  draft: null,
  pins: [],
  currentPin: null,
});

export default context;

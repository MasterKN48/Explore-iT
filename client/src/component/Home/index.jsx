import React from "react";
import withRoot from "../../theme/withRoot";
import Header from "./Header";
import Map from "../Maps/Map";

const Home = () => {
  return (
    <div>
      <Header />
      <br />
      <Map />
    </div>
  );
};

export default withRoot(Home);

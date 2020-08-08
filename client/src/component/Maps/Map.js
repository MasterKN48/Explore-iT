import React from "react";
import ReactMapGL, {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import { withStyles } from "@material-ui/core/styles";
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const TOKEN =
  "pk.eyJ1IjoicmFqZXNoc2l0aSIsImEiOiJja2RsdjYwOWsxMjd5MzNzOG85cXJidHl0In0.MfdbVSghtrLU7vsgPY5m6A";
const geolocateStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  padding: "10px",
};

const fullscreenControlStyle = {
  position: "absolute",
  top: 36,
  left: 0,
  padding: "10px",
};
const navStyle = {
  position: "absolute",
  top: 72,
  left: 0,
  padding: "10px",
};

const scaleControlStyle = {
  position: "absolute",
  bottom: 36,
  left: 0,
  padding: "10px",
};
const Map = ({ classes }) => {
  const [viewport, setViewport] = React.useState({
    latitude: 28.7041,
    longitude: 77.1025,
    zoom: 11,
  });
  return (
    <div>
      <div className={classes.root}>
        <ReactMapGL
          {...viewport}
          width="100vw"
          height="80vh"
          mapboxApiAccessToken={TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onViewportChange={(nextViewport) => setViewport(nextViewport)}
        >
          <div style={geolocateStyle}>
            <GeolocateControl />
          </div>
          <div style={fullscreenControlStyle}>
            <FullscreenControl />
          </div>
          <div style={navStyle}>
            <NavigationControl />
          </div>
          <div style={scaleControlStyle}>
            <ScaleControl />
          </div>
        </ReactMapGL>
      </div>
    </div>
  );
};

const styles = {
  root: {
    display: "flex",
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse",
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em",
  },
  deleteIcon: {
    color: "red",
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover",
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
};

export default withStyles(styles)(Map);

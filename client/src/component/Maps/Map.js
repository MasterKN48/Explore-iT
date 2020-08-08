import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Marker,
} from "react-map-gl";
import PinIcon from "./PinIcon";
import context from "../../context";
import Blog from "./Blog";
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
  const [viewport, setViewport] = useState({
    latitude: 28.7041,
    longitude: 77.1025,
    zoom: 11,
  });
  const { state, dispatch } = useContext(context);
  const [userPosition, setUserPosition] = useState(null);
  useEffect(() => {
    getUserPosition(); // eslint-disable-next-line
  }, []);
  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };
  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" });
    }
    const [longitude, latitude] = lngLat;
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: { longitude, latitude },
    });
  };
  return (
    <div>
      <div className={classes.root}>
        <ReactMapGL
          {...viewport}
          width="100vw"
          height="90vh"
          onClick={handleMapClick}
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
          {/**Pin for user current position */}
          {userPosition && (
            <Marker
              offsetLeft={-19}
              offsetTop={-37}
              latitude={userPosition.latitude}
              longitude={userPosition.longitude}
            >
              <PinIcon size={40} color="red" />
            </Marker>
          )}

          {/**Draft Pin */}
          {state.draft && (
            <Marker
              offsetLeft={-19}
              offsetTop={-37}
              latitude={state.draft.latitude}
              longitude={state.draft.longitude}
            >
              <PinIcon size={40} color="hotpink" />
            </Marker>
          )}
        </ReactMapGL>

        {/**Blog Area */}
        <Blog />
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

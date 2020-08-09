import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  Popup,
  GeolocateControl,
  Marker,
} from "react-map-gl";
import { useMediaQuery } from "@material-ui/core";
import PinIcon from "./PinIcon";
import context from "../../context";
import Blog from "./Blog";
import { useClient } from "../../utils";
import { GET_PINS_QUERY } from "../../graphql/queries";
import { DELETE_PIN_MUTATION } from "../../graphql/mutation";
import { withStyles } from "@material-ui/core/styles";
import { differenceInMinutes } from "date-fns";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import { useSubscription } from "@apollo/client";
import {
  PIN_ADDED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION,
} from "../../graphql/subscription";

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

  const client = useClient();
  const mobileSize = useMediaQuery(`(max-width:650px)`);

  const { state, dispatch } = useContext(context);

  const [userPosition, setUserPosition] = useState(null);

  const { data: dataA, loading: loadingA } = useSubscription(
    PIN_ADDED_SUBSCRIPTION
  );
  const { data: dataU, loading: loadingU } = useSubscription(
    PIN_UPDATED_SUBSCRIPTION
  );
  const { data: dataD, loading: loadingD } = useSubscription(
    PIN_DELETED_SUBSCRIPTION
  );

  useEffect(() => {
    if (loadingA !== true && dataA !== undefined) {
      console.log(dataA);
      dispatch({ type: "CREATE_PIN", payload: dataA.pinAdded });
    }
    if (loadingU !== true && dataU !== undefined) {
      console.log(dataU);
      dispatch({ type: "CREATE_COMMENT", payload: dataU.pinUpdated });
    }
    if (loadingD !== true && dataD !== undefined) {
      console.log(dataD);
      dispatch({ type: "DELETE_PIN", payload: dataD.pinDeleted });
    }
  }, [loadingA, loadingU, loadingD]);

  useEffect(() => {
    getPins(); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getUserPosition(); // eslint-disable-next-line
  }, []);

  const [popup, setPopUp] = useState(null);

  //remove popup is pin deleted
  useEffect(() => {
    const pinExist =
      popup && state.pins.findIndex((pin) => pin._id === popup._id) > -1;
    if (!pinExist) {
      setPopUp(null);
    }
  }, [state.pins.length]);

  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };
  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    //console.log(getPins);
    dispatch({ type: "GET_PINS", payload: getPins });
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

  const highlightNewPin = (pin) => {
    let isNewPin = differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 1;
    return isNewPin ? "limegreen" : "darkblue";
  };
  const handleSelectPin = (pin) => {
    setPopUp(pin);
    dispatch({ type: "SET_PIN", payload: pin });
  };
  const deletePin = async (pin) => {
    const variable = { pinId: pin._id };
    await client.request(DELETE_PIN_MUTATION, variable);
    //dispatch({ type: "DELETE_PIN", payload: deletePin });
    setPopUp(null);
  };
  const isAuthUser = () => state.currentUser._id === popup.author._id;
  return (
    <div>
      <div className={mobileSize ? classes.rootMobile : classes.root}>
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

          {/**All Pins */}
          {state.pins.map((pin) => (
            <Marker
              key={pin._id}
              offsetLeft={-19}
              offsetTop={-37}
              latitude={pin.latitude}
              longitude={pin.longitude}
            >
              <PinIcon
                onClick={() => handleSelectPin(pin)}
                size={40}
                color={highlightNewPin(pin)}
              />
            </Marker>
          ))}

          {/**PopUp */}
          {popup && (
            <Popup
              anchor="top"
              latitude={popup.latitude}
              longitude={popup.longitude}
              closeOnClick={false}
              onClose={() => setPopUp(null)}
            >
              <img
                loading="lazy"
                className={classes.popupImage}
                src={popup.image}
                alt={popup.title}
              />
              <div className={classes.popupTab}>
                <Typography>
                  {popup.latitude.toFixed(6)},{popup.longitude.toFixed(6)}
                </Typography>
                {isAuthUser() && (
                  <Button onClick={() => deletePin(popup)}>
                    <DeleteIcon className={classes.deleteIcon} />
                  </Button>
                )}
              </div>
            </Popup>
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
    objectFit: "contain",
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
};

export default withStyles(styles)(Map);

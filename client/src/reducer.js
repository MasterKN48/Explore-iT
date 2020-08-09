export default function reducer(state, { type, payload }) {
  switch (type) {
    case "LOGIN_USER":
      return {
        ...state,
        currentUser: payload,
      };
    case "IS_LOGGED_IN":
      return {
        ...state,
        isAuth: payload,
      };
    case "SIGNOUT_USER":
      return {
        ...state,
        currentUser: null,
        isAuth: false,
      };
    case "CREATE_DRAFT":
      return {
        ...state,
        currentPin: null,
        draft: {
          latitude: 0,
          longitude: 0,
        },
      };
    case "UPDATE_DRAFT_LOCATION":
      return {
        ...state,
        draft: payload,
      };
    case "DELETE_DRAFT":
      return {
        ...state,
        draft: null,
      };
    case "GET_PINS":
      return {
        ...state,
        pins: payload,
      };
    case "CREATE_PIN":
      const newPin = payload;
      const prevPins = state.pins.filter((pin) => pin._id !== newPin._id);
      console.log(prevPins, newPin);
      return {
        ...state,
        pins: [...prevPins, newPin],
      };
    case "SET_PIN":
      return {
        ...state,
        currentPin: payload,
        draft: null,
      };
    case "DELETE_PIN":
      const deletePin = payload;
      const tmp = state.pins.filter((pin) => pin._id !== deletePin._id);
      return {
        ...state,
        pins: [...tmp],
        currentPin: null,
      };
    case "CREATE_COMMENT":
      let updatedPin = payload;
      //find and replace
      let tmp2 = state.pins.map((pin) =>
        pin._id === updatedPin._id ? updatedPin : pin
      );
      console.log(updatedPin, tmp2);
      return {
        ...state,
        pins: tmp2,
        currentPin: updatedPin,
      };
    default:
      return state;
  }
}

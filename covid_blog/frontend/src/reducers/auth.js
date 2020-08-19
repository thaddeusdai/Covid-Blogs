const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoaded: false,
  user: null,
  info: null,
  infoLoaded: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "UPDATEDSELFPROFILE":
      return {
        ...state,
        user: action.payload,
      };
    case "SELFLOADED":
      return {
        ...state,
        isLoaded: true,
        isAuthenticated: true,
        user: action.payload,
      };
    case "SELFLOADING":
      return {
        ...state,
        isLoaded: false,
        infoLoaded: false,
      };
    case "SELFINFOLOADED":
      return {
        ...state,
        infoLoaded: true,
        isLoaded: true,
        info: action.payload,
      };
    case "REGISTER":
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        isLoaded: true,
        ...action.payload,
      };
    case "LOGOUT":
    case "SELFERROR":
      localStorage.removeItem("token");
      return {
        ...state,
        isAuthenticated: false,
        isLoaded: true,
        user: null,
        token: null,
      };
    case "REGISTERFAIL":
      console.log("register_fail");
      return state;
    case "LOGINFAIL":
      console.log("login fail");
      return state;
    case "LOGOUTERROR":
      console.log("logout fail");
      return state;
    case "USERERROR":
      console.log("user error");
    default:
      return state;
  }
}

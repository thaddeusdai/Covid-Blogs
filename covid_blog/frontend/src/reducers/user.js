const initialState = {
  userInfo: null,
  isLoaded: false,
  blogInfo: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "USERLOADING":
      return { ...state, isLoaded: false };
    case "USERLOADED":
      return { ...state, userInfo: action.payload };
    case "USERINFOLOADED":
      return { ...state, blogInfo: action.payload, isLoaded: true };
    default:
      return state;
  }
}

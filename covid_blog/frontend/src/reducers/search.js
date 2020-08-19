const initialState = { blogs: null, isLoaded: false };

export default function (state = initialState, action) {
  switch (action.type) {
    case "GETBLOGRESULTS":
      return { blogs: action.payload, isLoaded: true };
    case "LOADINGRESULTS":
      return { ...state, isLoaded: false };
    default:
      return state;
  }
}

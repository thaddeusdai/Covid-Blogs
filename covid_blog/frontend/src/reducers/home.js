const initialState = {
  image: null,
  isLoading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "LOADINGCLASSIFICATION":
      return {
        ...state,
        isLoading: true,
      };
    case "HOMEIMAGE":
      return {
        ...state,
        image: action.payload,
      };
    case "CLASSIFICATION":
      return {
        ...state,
        isLoading: false,
      };
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

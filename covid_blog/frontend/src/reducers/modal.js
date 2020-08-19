export default function (state = { openModal: false }, action) {
  switch (action.type) {
    case "OPENMODAL":
      return {
        ...state,
        openModal: true,
        ...action.payload,
      };
    case "CLOSEMODAL":
      return {
        ...state,
        openModal: false,
      };
    default:
      return state;
  }
}

const initialState = {
  msg: {},
  status: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "GETERRORS":
      return {
        msg: action.payload.msg,
        status: action.payload.status,
      };
    case "FORGOTFAIL":
      return {
        msg: action.payload.msg,
      };
    case "SUCCESS":
    case "FORGOTPASSWORD":
      return {
        msg: { success: action.payload },
      };
    case "CLASSIFICATION":
      return {
        msg: { classification: action.payload },
      };
    default:
      return state;
  }
}

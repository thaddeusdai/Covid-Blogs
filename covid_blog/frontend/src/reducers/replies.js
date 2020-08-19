import { bindActionCreators } from "redux";

const initialState = {
  isLoaded: false,
  replies: {},
  newComment: null,
  liked: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "UNLIKEDLIKEDREPLY":
      if (
        state.liked[action.payload.id] &&
        state.liked[action.payload.id][action.user] === true
      ) {
        state.liked[action.payload.id][action.user] = false;
      } else {
        if (!state.liked[action.payload.id]) {
          state.liked[action.payload.id] = {};
        }
        state.liked[action.payload.id][action.user] = true;
      }

      state.replies[action.commentIndex][action.index].likes =
        action.payload.likes;
      console.log(state.liked);
      return { ...state };
    case "UPLOADREPLY":
      state.replies[action.id].push(action.payload);
      return { ...state, newComment: action.payload };
    case "DELETEREPLY":
      let i;
      for (i = 0; i < state.replies[action.payload].length; i++) {
        if (state.replies[action.payload][i].id === action.replyId) {
          console.log(state.replies);
          state.replies[action.payload].splice(i, 1);
          console.log(state.replies);
        }
      }
      return { ...state };
    case "REPLIESLOADING":
      return {
        ...state,
        isLoaded: false,
      };
    case "REPLIESLOADED":
      state.replies[action.id] = action.payload;
      return {
        ...state,
        isLoaded: true,
      };
    default:
      return state;
  }
}

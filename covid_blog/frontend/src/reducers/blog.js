const initialState = {
  isLoaded: false,
  blog: null,
  comments: null,
  commentsLoaded: false,
  commentsLiked: {},
  blogsLiked: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "LIKEDUNLIKEDCOMMENT":
      if (
        state.commentsLiked[action.payload.id] &&
        state.commentsLiked[action.payload.id][action.user] === true
      ) {
        state.commentsLiked[action.payload.id][action.user] = false;
      } else {
        if (!state.commentsLiked[action.payload.id]) {
          state.commentsLiked[action.payload.id] = {};
        }
        state.commentsLiked[action.payload.id][action.user] = true;
      }

      return { ...state };
    case "LIKEDUNLIKEDBLOG":
      if (
        state.blogsLiked[action.payload.id] &&
        state.blogsLiked[action.payload.id][action.user] === true
      ) {
        state.blogsLiked[action.payload.id][action.user] = false;
      } else {
        if (!state.blogsLiked[action.payload.id]) {
          state.blogsLiked[action.payload.id] = {};
        }
        state.blogsLiked[action.payload.id][action.user] = true;
      }
      return { ...state, blog: action.payload };
    case "COMMENTSLOADING":
      return { ...state, commentsLoaded: false };
    case "UPLOADCOMMENT":
      state.comments.push(action.payload);
      return { ...state };
    case "DELETECOMMENT":
      let i;
      for (i = 0; i < state.comments.length; i++) {
        if (state.comments[i].id === action.payload) {
          state.comments.splice(i, 1);
          break;
        }
      }
      return { ...state };
    case "RELOADCOMMENTS":
      return { ...state, comments: action.payload };
    case "BLOGRELOADED":
      state.blog = action.payload;
      return { ...state };
    case "GETCOMMENTS":
      return {
        ...state,
        comments: action.payload,
        commentsLoaded: true,
      };
    case "BLOGLOADING":
      return {
        ...state,
        isLoaded: false,
      };
    case "BLOGLOADED":
      return {
        ...state,
        blog: action.payload,
        isLoaded: true,
      };

    default:
      return state;
  }
}

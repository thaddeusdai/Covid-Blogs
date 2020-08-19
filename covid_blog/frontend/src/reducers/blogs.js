const initialState = {
  blogs: [],
  quarantineBlogs: [],
  healthBlogs: [],
  hospitalBlogs: [],
  awarenessBlogs: [],
  isLoaded: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "CREATEDBLOG":
      let isLoaded = false;
      return { ...state, isLoaded };
    case "DELETEBLOG": {
      let isLoaded = false;
      return { ...state, isLoaded };
    }
    case "GETBLOGS":
      return {
        ...state,
        blogs: action.payload,
      };
    case "GETTAGBLOGS2":
      return {
        ...state,
        healthBlogs: action.payload,
      };
    case "GETTAGBLOGS3":
      return {
        ...state,
        hospitalBlogs: action.payload,
      };
    case "GETTAGBLOGS4":
      return {
        ...state,
        awarenessBlogs: action.payload,
      };
    case "GETTAGBLOGS1":
      return {
        ...state,
        quarantineBlogs: action.payload,
      };
    case "LOADINGBLOGS":
      return {
        ...state,
        isLoaded: false,
      };
    case "LOADEDBLOGS":
      return {
        ...state,
        isLoaded: true,
      };
    case "BLOGSERROR":
      console.log("blogs error");
      return state;
    default:
      return state;
  }
}

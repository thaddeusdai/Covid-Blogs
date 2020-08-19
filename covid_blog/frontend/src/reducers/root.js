import { combineReducers } from "redux";
import auth from "./auth";
import modal from "./modal";
import blogs from "./blogs";
import blog from "./blog";
import replies from "./replies";
import search from "./search";
import alerts from "./alerts";
import user from "./user";
import home from "./home";

export default combineReducers({
  auth,
  modal,
  blogs,
  blog,
  replies,
  user,
  search,
  alerts,
  home,
});

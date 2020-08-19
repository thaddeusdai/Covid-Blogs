import axios from "axios";
import { configToken } from "./auth";

export const getBlogResults = (field, data) => async (dispatch, getState) => {
  dispatch({ type: "LOADINGRESULTS" });
  await axios
    .get(`api/blogs/blog/?${field}=${data}`, configToken(getState))
    .then((resp) => {
      dispatch({
        type: "GETBLOGRESULTS",
        payload: resp.data,
      });
    })
    .catch((err) => {
      const errors = {
        msg: err.response.data,
        status: err.response.status,
      };
      dispatch({
        type: "GETERRORS",
        payload: errors,
      });
    });
};

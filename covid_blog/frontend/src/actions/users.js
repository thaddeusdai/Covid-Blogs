import { configToken } from "./auth";
import axios from "axios";

//will turn this into getting a specific user
export const getUser = (username) => async (dispatch, getState) => {
  dispatch({
    type: "USERLOADING",
  });
  await axios
    .get(`api/user/user/?username=${username}`, configToken(getState))
    .then((resp) => {
      dispatch({
        type: "USERLOADED",
        payload: resp.data[0],
      });
    })
    .catch((err) => {
      dispatch({
        type: "GETERRORS",
        payload: errors,
      });
    });
  await axios
    .get(`api/blogs/blog/?user=${username}`, configToken(getState))
    .then((resp) => {
      dispatch({ type: "USERINFOLOADED", payload: resp.data });
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

export const getSelf = () => async (dispatch, getState) => {
  dispatch({
    type: "SELFLOADING",
  });
  await axios
    .get("api/user/self/", configToken(getState))
    .then((resp) => {
      dispatch({
        type: "SELFLOADED",
        payload: resp.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: "SELFERROR",
      });
    });
};

export const getSelfInfo = (username) => async (dispatch, getState) => {
  dispatch({ type: "SELFLOADING" });
  await axios
    .get(`api/blogs/blog/?user=${username}`, configToken(getState))
    .then((resp) => {
      dispatch({ type: "SELFINFOLOADED", payload: resp.data });
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

export const updateSelfProfile = (form, header, state) => async (
  dispatch,
  getState
) => {
  if (state) {
    if (state.username !== getState().auth.user.username) {
      dispatch({
        type: "GETERRORS",
        payload: { msg: { error: "Username is not correct" } },
      });
      return;
    }
    if (state.newPassword !== state.newPassword2) {
      dispatch({
        type: "GETERRORS",
        payload: { msg: { error: "Passwords do not match" } },
      });
      return;
    }
  }
  const token = getState().auth.token;
  header.headers["Authorization"] = `Token ${token}`;
  await axios
    .patch(`api/user/self/`, form, header)
    .then((resp) => {
      dispatch({ type: "UPDATEDSELFPROFILE", payload: resp.data });
      dispatch({ type: "CLOSEMODAL" });
      dispatch({ type: "SUCCESS", payload: "Successfully updated profile" });
    })
    .catch((err) => {
      console.log(err);
      const errors = {
        msg: { error: "Update Failed" },
        status: err.response.status,
      };
      dispatch({
        type: "GETERRORS",
        payload: errors,
      });
    });
};

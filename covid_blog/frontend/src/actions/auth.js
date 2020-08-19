import axios from "axios";

export const configToken = (getState) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const token = getState().auth.token;
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }
  return config;
};

export const register = (form) => async (dispatch, getState) => {
  const body = JSON.stringify(form);
  await axios
    .post("/api/user/register/", body, configToken(getState))
    .then((resp) => {
      dispatch({ type: "CLOSEMODAL" });
      dispatch({ type: "SUCCESS", payload: "Registered successful" });
      dispatch({
        type: "REGISTER",
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

export const login = (form) => async (dispatch, getState) => {
  const body = JSON.stringify(form);
  await axios
    .post("/api/user/login/", body, configToken(getState))
    .then((resp) => {
      dispatch({
        type: "LOGIN",
        payload: resp.data,
      });
      dispatch({ type: "CLOSEMODAL" });
      dispatch({ type: "SUCCESS", payload: "Logged In Successfully" });
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

export const logout = () => async (dispatch, getState) => {
  await axios
    .post("api/user/logout/", {}, configToken(getState))
    .then((resp) => {
      dispatch({
        type: "LOGOUT",
      });
      dispatch({ type: "SUCCESS", payload: "Logged Out Successfully" });
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

export const forgotPassword = (form) => async (dispatch, getState) => {
  await axios
    .post("api/user/forgotpassword/", form, configToken(getState))
    .then((resp) => {
      dispatch({ type: "FORGOTPASSWORD", payload: resp.data.message });
    })
    .catch((err) => {
      const errors = { msg: err.response.data };
      dispatch({ type: "FORGOTFAIL", payload: errors });
    });
};

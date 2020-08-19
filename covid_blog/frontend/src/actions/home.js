import axios from "axios";

export const get_classification = (form, header) => async (dispatch) => {
  dispatch({ type: "LOADINGCLASSIFICATION" });
  await axios
    .post("api/classifier/classifier/", form, header)
    .then((resp) => {
      dispatch({ type: "CLASSIFICATION", payload: resp.data.classification });
      dispatch({ type: "HOMEIMAGE", payload: resp.data.image });
      axios.delete(`api/classifier/classifier/${resp.data.id}/`);
    })
    .catch((err) => console.log(err));
};

export const clear = () => (dispatch) => {
  dispatch({ type: "CLEAR" });
};

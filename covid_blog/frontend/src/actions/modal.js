export const openModal = (content) => (dispatch) => {
  dispatch({
    type: "OPENMODAL",
    payload: { content },
  });
};

export const closeModal = () => (dispatch) => {
  dispatch({
    type: "CLOSEMODAL",
  });
};

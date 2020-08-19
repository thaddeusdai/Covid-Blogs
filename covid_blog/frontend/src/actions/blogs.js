import { configToken } from "./auth";
import axios from "axios";

export const createBlog = (form) => async (dispatch, getState) => {
  let header = {
    headers: {
      accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: `Token ${getState().auth.token}`,
    },
  };
  await axios
    .post("api/blogs/blog/", form, header)
    .then((resp) => {
      dispatch({ type: "CLOSEMODAL" });
      dispatch({
        type: "CREATEDBLOG",
        payload: resp.data,
      });
      dispatch({ type: "SUCCESS", payload: "Blog Created!" });
    })
    .catch((err) => {
      console.log(err.data);
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

export const getBlogs = () => async (dispatch, getState) => {
  await axios
    .get("api/blogs/blog/", configToken(getState))
    .then((resp) => {
      dispatch({
        type: "GETBLOGS",
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

export const getTagBlogs = () => async (dispatch, getState) => {
  let j;
  for (j = 1; j < 5; j++) {
    await axios
      .get(`api/blogs/blog/?tag=${j}`, configToken(getState))
      .then((resp) => {
        dispatch({
          type: `GETTAGBLOGS${j}`,
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
  }
  dispatch({
    type: "LOADEDBLOGS",
  });
};

export const getComments = (blogId) => async (dispatch, getState) => {
  dispatch({ type: "COMMENTSLOADING" });
  await axios
    .get(
      `api/blogs/comment/?blog=${blogId}&parent=-1&order=1`,
      configToken(getState)
    )
    .then((resp) => {
      dispatch({
        type: "GETCOMMENTS",
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

export const loadBlog = (id) => async (dispatch, getState) => {
  dispatch({
    type: "BLOGLOADING",
  });
  await axios
    .get(`api/blogs/blog/${id}`, configToken(getState))
    .then((resp) => {
      dispatch({
        type: "BLOGLOADED",
        payload: resp.data,
      });
    })
    .catch((error) => {
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

export const loadReplies = (comment) => async (dispatch, getState) => {
  dispatch({
    type: "REPLIESLOADING",
  });

  await axios
    .get(`api/blogs/comment/?parent=${comment}`, configToken(getState))
    .then((resp) => {
      dispatch({
        type: "REPLIESLOADED",
        payload: resp.data,
        id: comment,
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

export const uploadComment = (form, blogId) => async (dispatch, getState) => {
  const f = JSON.stringify({
    ...form,
    blog: { id: blogId },
    replied: { id: -1 },
  });

  await axios
    .post("api/blogs/comment/", f, configToken(getState))
    .then((resp) => {
      dispatch({
        type: "UPLOADCOMMENT",
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

export const deleteBlog = (id) => async (dispatch, getState) => {
  let blogId = id;
  await axios
    .delete(`api/blogs/blog/${id}`, configToken(getState))
    .then(() => {
      dispatch({
        type: "DELETEBLOG",
        payload: blogId,
      });
      dispatch({ type: "SUCCESS", payload: "Blog Deleted!" });
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

export const deleteComment = (id) => async (dispatch, getState) => {
  await axios
    .delete(`api/blogs/comment/${id}`, configToken(getState))
    .then((resp) => {
      dispatch({
        type: "DELETECOMMENT",
        payload: id,
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

export const deleteReply = (id, replyId) => async (dispatch, getState) => {
  await axios
    .delete(`api/blogs/comment/${replyId}`, configToken(getState))
    .then((resp) => {
      dispatch({
        type: "DELETEREPLY",
        payload: id,
        replyId: replyId,
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

export const uploadReply = (form, commentId, blogId) => async (
  dispatch,
  getState
) => {
  const f = JSON.stringify({
    ...form,
    replied: { id: commentId },
    blog: { id: blogId },
  });
  await axios
    .post("api/blogs/comment/", f, configToken(getState))
    .then((resp) => {
      dispatch({
        type: "UPLOADREPLY",
        payload: resp.data,
        id: commentId,
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

export const UnlikedOrLikedReply = (likes, id, index, i, user) => async (
  dispatch,
  getState
) => {
  let form = { likes };
  form = JSON.stringify(form);
  await axios
    .patch(`api/blogs/comment/${id}/`, form, configToken(getState))
    .then((resp) => {
      dispatch({
        type: "UNLIKEDLIKEDREPLY",
        payload: resp.data,
        index: i,
        commentIndex: index,
        user: user,
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

export const likeOrUnlikeBlog = (likes, id, user) => async (
  dispatch,
  getState
) => {
  let form;
  form = { likes };
  form = JSON.stringify(form);

  await axios
    .patch(`api/blogs/blog/${id}/`, form, configToken(getState))
    .then((resp) => {
      dispatch({
        type: "LIKEDUNLIKEDBLOG",
        payload: resp.data,
        user: user,
      });
    })
    .catch((err) => {
      console.log(err);
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

export const likedOrUnlikeComment = (likes, id, user) => async (
  dispatch,
  getState
) => {
  let form;
  form = { likes };
  form = JSON.stringify(form);
  await axios
    .patch(`api/blogs/comment/${id}/`, form, configToken(getState))
    .then((resp) => {
      dispatch({ type: "LIKEDUNLIKEDCOMMENT", payload: resp.data, user: user });
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

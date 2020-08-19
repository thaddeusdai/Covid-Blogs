import React, { Component } from "react";
import { connect } from "react-redux";
import {
  loadReplies,
  UnlikedOrLikedReply,
  likedOrUnlikeComment,
  deleteComment,
  deleteReply,
} from "../../../actions/blogs";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import CommentInput from "./CommentInput";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(faThumbsUp);

class Comment extends Component {
  state = {
    commentBoxVisible: false,
    replies: this.props.replies.replies,
    newReply: "",
    likes: this.props.data.likes,
    liked: false,
  };

  static propTypes = {
    loadReplies: PropTypes.func.isRequired,
    UnlikedOrLikedReply: PropTypes.func.isRequired,
    likedOrUnlikeComment: PropTypes.func.isRequired,
  };
  componentDidMount() {
    if (this.props.data) {
      this.props.loadReplies(this.props.data.id);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.replies.newComment !== prevProps.replies.newComment) {
      this.setState({
        newReply: true,
      });
    }
  }

  likedReply = (likes, id, index, i, user) => {
    if (!this.props.replies.liked[id]) {
      this.props.UnlikedOrLikedReply(likes + 1, id, index, i, user);
    } else if (this.props.replies.liked[id][user] === true) {
      this.props.UnlikedOrLikedReply(likes - 1, id, index, i, user);
    } else {
      console.log(this.props.replies.liked[id][id]);
      console.log(id, index, i, user);
      this.props.UnlikedOrLikedReply(likes + 1, id, index, i, user);
    }
  };

  likedComment = async () => {
    if (!this.props.blog.commentsLiked[this.props.data.id]) {
      this.props.likedOrUnlikeComment(
        this.state.likes + 1,
        this.props.data.id,
        this.props.auth.user.username
      );
      this.setState({ likes: this.state.likes + 1 });
    } else if (
      this.props.blog.commentsLiked[this.props.data.id][
        this.props.auth.user.username
      ] === true
    ) {
      this.props.likedOrUnlikeComment(
        this.state.likes - 1,
        this.props.data.id,
        this.props.auth.user.username
      );
      this.setState({ likes: this.state.likes - 1 });
    } else {
      this.props.likedOrUnlikeComment(
        this.state.likes + 1,
        this.props.data.id,
        this.props.auth.user.username
      );
      this.setState({ likes: this.state.likes + 1 });
    }
  };

  comment = (user) => {
    let visible;
    if (this.state.commentBoxVisible === true) {
      visible = false;
    } else {
      visible = true;
    }
    this.setState({
      commentBoxVisible: visible,
      responseTo: user,
    });
  };

  deleteReply = (id, replyId) => {
    this.props.deleteReply(id, replyId);
  };

  deleteComment = () => {
    this.props.deleteComment(this.props.data.id);
  };

  collapseControl = () => {
    if (this.state.collapse === true) {
      this.setState({
        collapse: false,
        newReply: false,
      });
    } else {
      this.setState({
        collapse: true,
        newReply: false,
      });
    }
  };

  render() {
    if (!this.props.data | !this.props.replies.isLoaded) {
      return "";
    }

    let r, allReplies;
    if (this.props.replies.replies[this.props.data.id]) {
      r = this.props.replies.replies[this.props.data.id];
      if (r && r.length > 0) {
        allReplies = r.map((reply, i) => {
          let show, active;
          show = "";
          active =
            this.props.replies.liked[reply.id] &&
            this.props.replies.liked[reply.id][
              this.props.auth.user.username
            ] === true
              ? "active"
              : "what";
          if (this.state.collapse === false) {
            show = "show";
          }
          if (
            this.props.replies.newComment &&
            this.props.replies.newComment.id === reply.id
          ) {
            if (this.state.newReply === true) {
              return (
                <div key={i} className="ml-5 mb-3 mt-3">
                  {" "}
                  <div key={i} className="container bg-light rounded p-3">
                    {reply.user.username}:
                    <Link to={`/user/${reply.content.split(" ")[0]}/`}>
                      {" "}
                      <b>@{reply.content.split(" ")[0]}</b>{" "}
                    </Link>
                    {reply.content.split(" ").slice(1).join(" ")}
                  </div>
                  <div style={{ whiteSpace: "nowrap" }}>
                    <button
                      onClick={() => this.comment(reply.user.username)}
                      className="btn btn-outline-dark m-2"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() =>
                        this.likedReply(
                          reply.likes,
                          reply.id,
                          this.props.data.id,
                          i,
                          this.props.auth.user.username
                        )
                      }
                      className={`btn btn-outline-primary ml-4 ${active}`}
                    >
                      Like <FontAwesomeIcon icon="thumbs-up" />
                    </button>
                    <span className="text-muted ml-2">
                      {reply.likes} Likes{" "}
                    </span>
                    <button
                      onClick={() =>
                        this.deleteReply(this.props.data.id, reply.id)
                      }
                      className={`btn btn-danger ml-5 ${
                        this.props.auth.user.username === reply.user.username
                          ? ""
                          : "d-none"
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            }
          }

          return (
            <div
              key={i}
              id={`replies${this.props.data.id}`}
              className={`collapse ${show} ml-5 mb-3 mt-3`}
            >
              <div key={i} className="container bg-light rounded p-3">
                {reply.user.username}:{" "}
                <b>
                  <Link
                    exact="true"
                    to={`/user/${reply.content.split(" ")[0]}/`}
                  >
                    @{reply.content.split(" ")[0]}{" "}
                  </Link>
                </b>
                {reply.content.split(" ").slice(1).join(" ")}
              </div>

              <div style={{ whiteSpace: "nowrap" }}>
                <button
                  onClick={() => this.comment(reply.user.username)}
                  className="btn btn-outline-dark m-2"
                >
                  Reply
                </button>
                <button
                  onClick={() =>
                    this.likedReply(
                      reply.likes,
                      reply.id,
                      this.props.data.id,
                      i,
                      this.props.auth.user.username
                    )
                  }
                  className={`btn btn-outline-primary ml-4 ${active}`}
                >
                  Like <FontAwesomeIcon icon="thumbs-up" />
                </button>
                <span className="text-muted ml-2">{reply.likes} Likes </span>
                <button
                  onClick={() => this.deleteReply(this.props.data.id, reply.id)}
                  className={`btn btn-danger ml-5 ${
                    this.props.auth.user.username === reply.user.username
                      ? ""
                      : "d-none"
                  }`}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        });
      }
    }
    const deleteButton = (
      <button
        onClick={this.deleteComment}
        className={`btn btn-danger ml-5 ${
          this.props.auth.user.username === this.props.data.user.username
            ? ""
            : "d-none"
        }`}
      >
        Delete
      </button>
    );

    const liked =
      this.props.blog.commentsLiked[this.props.data.id] !== undefined &&
      this.props.blog.commentsLiked[this.props.data.id][
        this.props.auth.user.username
      ];

    return (
      <div>
        <div className="container ml-2 mb-3 mt-3">
          <div className="mb-1 p-3 bg-light rounded">
            {this.props.data.user.username}: {this.props.data.content}
          </div>
          <div style={{ whiteSpace: "nowrap" }}>
            <button
              onClick={() => this.comment(this.props.data.user.username)}
              className="btn btn-outline-dark m-2"
            >
              Reply
            </button>
            <button
              data-toggle="collapse"
              data-target={`#replies${this.props.data.id}`}
              className="btn btn-outline-white bg-white text-muted"
              onClick={this.collapseControl}
            >
              <u>{r && r.length !== 0 ? r.length : ""} Replies</u>
            </button>
            <span className="text-muted ml-2 mr-4">|</span>
            <button
              onClick={this.likedComment}
              className={`btn btn-outline-primary ${
                liked === true ? "active" : ""
              }`}
            >
              Like <FontAwesomeIcon icon="thumbs-up" />
            </button>
            <span className="text-muted ml-3">{this.state.likes} Likes</span>
            {deleteButton}
          </div>
          {allReplies}
          <div>
            <CommentInput
              show={this.state.collapse}
              responseTo={this.state.responseTo}
              display={this.state.commentBoxVisible}
              type="Reply"
              comment={this.props.data}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    replies: state.replies,
    blog: state.blog,
    auth: state.auth,
  };
}

export default connect(mapStateToProps, {
  loadReplies,
  UnlikedOrLikedReply,
  likedOrUnlikeComment,
  deleteComment,
  deleteReply,
})(Comment);

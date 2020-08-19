import React, { Component } from "react";
import { connect } from "react-redux";

import {
  uploadComment,
  getComments,
  uploadReply,
  loadReplies,
} from "../../../actions/blogs";

class CommentInput extends Component {
  state = {
    content: "",
    showNewComment: "",
    newComment: "",
  };

  onSubmit = (e) => {
    e.preventDefault();
    const a = "   ";
    const form = {
      content: `${this.props.responseTo ? this.props.responseTo : ""} ${a} ${
        this.state.content
      }`,
    };
    if (!this.props.comment) {
      if (this.props.blog) {
        this.props.uploadComment(form, this.props.blog.blog.id);
      }
    } else {
      this.props.uploadReply(
        form,
        this.props.comment.id,
        this.props.comment.blog.id
      );
    }
    this.setState({ content: "", showNewComment: this.props.show });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    if (this.props.display === false) {
      return "";
    }
    let responseTo;
    if (this.props.responseTo) {
      responseTo = `to ${this.props.responseTo}`;
    } else {
      responseTo = "";
    }

    return (
      <div className=" mt-2 mb-2 input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder={`Make a ${this.props.type} ${responseTo}`}
          aria-label={`Make a ${this.props.type} ${responseTo}`}
          aria-describedby="basic-addon2"
          name="content"
          onChange={this.onChange}
          value={this.state.content}
        />
        <div className="input-group-append">
          <button
            onClick={this.onSubmit}
            className="btn btn-outline-secondary"
            type="button"
          >
            {this.props.type}
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    blog: state.blog,
    replies: state.replies,
    user: state.auth,
  };
}

export default connect(mapStateToProps, {
  uploadComment,
  getComments,
  loadReplies,
  uploadReply,
})(CommentInput);

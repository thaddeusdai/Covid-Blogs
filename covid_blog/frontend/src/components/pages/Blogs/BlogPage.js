import React, { Component } from "react";
import { connect } from "react-redux";
import { Spinner } from "react-bootstrap";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  loadBlog,
  getComments,
  likeOrUnlikeBlog,
  deleteBlog,
} from "../../../actions/blogs";
import { Link } from "react-router-dom";
import Comment from "../../utility/Comments/Comment";
import "./AllBlogs.css";
import CommentInput from "../../utility/Comments/CommentInput";

import PropTypes from "prop-types";

library.add(faThumbsUp);

class BlogPage extends Component {
  state = {
    comments: [],
    likes: null,
  };

  static propTypes = {
    likeOrUnlikeBlog: PropTypes.func.isRequired,
  };
  componentDidMount() {
    this.props.loadBlog(this.props.match.params.blogid);
    this.props.getComments(this.props.match.params.blogid);
  }

  componentDidUpdate() {
    if (
      this.props.blog.blog &&
      this.state.likes !== this.props.blog.blog.likes
    ) {
      this.setState({ likes: this.props.blog.blog.likes });
    }
  }

  deleteBlog = () => {
    this.props.deleteBlog(this.props.blog.blog.id);
  };

  likeOrUnlike = () => {
    if (!this.props.blog.blogsLiked[this.props.blog.blog.id]) {
      this.props.likeOrUnlikeBlog(
        this.state.likes + 1,
        this.props.blog.blog.id,
        this.props.auth.user.username
      );
    } else if (
      this.props.blog.blogsLiked[this.props.blog.blog.id][
        this.props.auth.user.username
      ] === true
    ) {
      this.props.likeOrUnlikeBlog(
        this.state.likes - 1,
        this.props.blog.blog.id,
        this.props.auth.user.username
      );
    } else {
      this.props.likeOrUnlikeBlog(
        this.state.likes + 1,
        this.props.blog.blog.id,
        this.props.auth.user.username
      );
    }
  };

  render() {
    const blog = this.props.blog.blog;
    if ((this.props.blog.isLoaded === false) | !this.props.blog.comments) {
      return (
        <Spinner animation="border" variant="primary" className="spinner" />
      );
    }
    const tagsList = [];
    let i;
    for (i = 0; i < blog.tags.length; i++) {
      tagsList.push(blog.tags[i].name);
    }
    let comments, c;
    comments = this.props.blog.comments.map((comment, i) => {
      return <Comment key={i} data={comment} />;
    });

    const deleteBlog = (
      <Link
        to="/blogs"
        onClick={this.deleteBlog}
        className={`btn btn-danger ml-5 ${
          this.props.auth.user.username === this.props.blog.blog.user.username
            ? ""
            : "d-none"
        }`}
      >
        Delete
      </Link>
    );

    return (
      <div className="ml-5 mr-5 mt-3">
        <div className="text-center">
          <h1>
            <u>
              <strong>{blog.title}</strong>
            </u>
          </h1>
          <strong>
            {blog.image !== null ? <img src={blog.image} /> : ""}
            <i>
              <p>
                By:{" "}
                <Link exact="true" to={`/user/${blog.user.username}/`}>
                  {blog.user.username}
                </Link>
              </p>
              <p>Created on: {blog.uploaded.slice(0, 10)}</p>
              <p>Tags: {tagsList.join(", ")}</p>
            </i>
            <p>
              Likes <FontAwesomeIcon icon="thumbs-up" /> : {this.state.likes}
            </p>
          </strong>
          {deleteBlog}
        </div>
        <br />
        <br />
        <p className="blog-content">{blog.content}</p>
        <br />
        <br />
        <div className="container">
          <p>
            Did you enjoy reading the Blog? If so, please leave a{" "}
            <span
              className="text-primary"
              onClick={this.likeOrUnlike}
              style={{ cursor: "pointer" }}
            >
              <u>Like</u>
            </span>{" "}
            and show your support!
          </p>
        </div>
        <h3>Comments:</h3>
        <h5 className="mt-3">Add a Comment!</h5>
        <CommentInput blog={this.props.match.params.blogid} type="Comment" />
        <br />
        {comments}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    blog: state.blog,
    replies: state.replies,
    auth: state.auth,
  };
}

export default connect(mapStateToProps, {
  loadBlog,
  getComments,
  likeOrUnlikeBlog,
  deleteBlog,
})(BlogPage);

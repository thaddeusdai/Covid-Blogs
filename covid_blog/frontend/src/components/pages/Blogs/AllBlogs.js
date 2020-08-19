import React, { Component } from "react";
import PropTypes from "prop-types";
import { Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { getBlogs, getTagBlogs } from "../../../actions/blogs";
import { openModal } from "../../../actions/modal";
import Blog from "../../utility/Blog/Blog";
import Slider from "../../utility/Slider/Slider";
import CreateBlog from "../../utility/Blog/CreateBlog";

import "./AllBlogs.css";

class AllBlogs extends Component {
  static propTypes = {
    getBlogs: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getBlogs();
    this.props.getTagBlogs();
  }

  componentDidUpdate(prevProps) {
    let i;
    if (this.props.blogs.isLoaded === false) {
      this.props.getBlogs();
      this.props.getTagBlogs();
    }
  }

  createBlog = () => {
    this.props.openModal(<CreateBlog />);
  };

  addingBlogs = (curr) => {
    let b;
    if (curr.length > 0) {
      b = curr.map((blog, i) => {
        return (
          <Blog
            key={i}
            title={blog.title}
            image={blog.image}
            tags={blog.tags}
            likes={blog.likes}
            user={blog.user.username}
            userId={blog.user.id}
            id={blog.id}
          />
        );
      });
    }
    return b;
  };

  render() {
    let blogs, qBlogs, aBlogs, hospBlogs, healBlogs;

    if (
      this.props.blogs.isLoaded === false ||
      this.props.auth.isLoaded === false
    ) {
      return (
        <Spinner animation="border" variant="primary" className="spinner" />
      );
    } else {
      blogs = this.addingBlogs(this.props.blogs.blogs);
      qBlogs = this.addingBlogs(this.props.blogs.quarantineBlogs);
      aBlogs = this.addingBlogs(this.props.blogs.awarenessBlogs);
      healBlogs = this.addingBlogs(this.props.blogs.healthBlogs);
      hospBlogs = this.addingBlogs(this.props.blogs.hospitalBlogs);
    }

    return (
      <div className="col12">
        <h1 className="text-center my-3">
          <strong>COVID-19 All Blogs</strong>
        </h1>
        <p className="text-center mb-3">
          Read the blogs others have written relating to Covid19. If you have
          something you would like to share, please write a blog!
        </p>
        <button
          className="btn btn-primary btn-lg text-white"
          id="createBlog"
          onClick={this.createBlog}
        >
          Write a Blog!
        </button>
        <br />
        <br />
        {blogs === undefined ? (
          ""
        ) : (
          <Slider elements={blogs} type="blogs" title="All Blogs" />
        )}
        {qBlogs === undefined ? (
          ""
        ) : (
          <Slider
            elements={qBlogs}
            type="qblogs"
            title="Blogs About Quarantine"
          />
        )}
        {healBlogs === undefined ? (
          ""
        ) : (
          <Slider
            elements={healBlogs}
            type="healblogs"
            title="Blogs About Health"
          />
        )}
        {aBlogs === undefined ? (
          ""
        ) : (
          <Slider
            elements={aBlogs}
            type="ablogs"
            title="Blogs About Raising Awareness"
          />
        )}
        {hospBlogs === undefined ? (
          ""
        ) : (
          <Slider
            elements={hospBlogs}
            type="hospblogs"
            title="Hospital Blogs"
            title="Blogs About Hospitals"
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    blogs: state.blogs,
    auth: state.auth,
  };
}

export default connect(mapStateToProps, {
  getBlogs,
  getTagBlogs,
  openModal,
})(AllBlogs);

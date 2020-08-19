import React, { Component } from "react";
import { connect } from "react-redux";
import PropType from "prop-types";
import { Spinner } from "react-bootstrap";
import { getBlogResults } from "../../../actions/search";
import Blog from "../../utility/Blog/Blog";
import Slider from "../../utility/Slider/Slider";
import "./Search.css";

class Search extends Component {
  static propTypes = {
    getBlogResults: PropType.func.isRequired,
  };
  componentDidMount() {
    this.props.getBlogResults(
      this.props.match.params.type,
      this.props.match.params.data
    );
  }

  componentDidUpdate(prevProps) {
    if (
      (prevProps.match.params.type !== this.props.match.params.type) |
      (prevProps.match.params.data !== this.props.match.params.data)
    ) {
      this.props.getBlogResults(
        this.props.match.params.type,
        this.props.match.params.data
      );
    }
  }

  render() {
    if (this.props.search.isLoaded === false) {
      return (
        <Spinner animation="border" variant="primary" className="spinner" />
      );
    }
    if (this.props.search.blogs.length === 0) {
    }
    const blogResults = this.props.search.blogs.map((blog, i) => {
      return (
        <div className="m-3" key={i}>
          <Blog
            title={blog.title}
            image={blog.image}
            tags={blog.tags}
            likes={blog.likes}
            user={blog.user.username}
            id={blog.id}
          />
        </div>
      );
    });
    return (
      <div id="searchfield" className="box">
        <h1 className="my-4 text-center text-white">
          <u>
            <strong>Search Results</strong>
          </u>
        </h1>
        {this.props.search.blogs.length === 0 ? (
          <h1 className="text-white text-center">No Blogs Fit Your Search</h1>
        ) : (
          <div className="ml-auto mr-auto" id="searchSlider">
            <Slider elements={blogResults} type="search" title="" />
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    search: state.search,
  };
}

export default connect(mapStateToProps, { getBlogResults })(Search);

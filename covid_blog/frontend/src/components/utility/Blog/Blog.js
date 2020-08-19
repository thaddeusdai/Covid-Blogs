import React from "react";
import { Link } from "react-router-dom";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Blog.css";

library.add(faThumbsUp);

function Blog(props) {
  if (props.length === 0) {
    return "";
  }
  const tags = [];
  let i;
  for (i = 0; i < props.tags.length; i++) {
    tags.push(props.tags[i].name);
  }
  return (
    <div id="blog-card" className="card">
      <div className="card-body">
        <h5 className="card-title">{props.title}</h5>
        <p className="text-muted">
          By{" "}
          {
            <Link exact="true" to={`/user/${props.user}/`}>
              {props.user}
            </Link>
          }
        </p>
        <p className="card-text">
          Number of Likes: {props.likes} <FontAwesomeIcon icon="thumbs-up" />
        </p>
        <p className="card-text">Tags: {tags.join(", ")}</p>
        <hr /> <br />
        <Link to={`/blogs/blog/${props.id}`}>
          <button className="btn btn-success btn-block">Read</button>
        </Link>
      </div>
    </div>
  );
}

export default Blog;

import React, { Component } from "react";
import { connect } from "react-redux";
import { getUser } from "../../../actions/users";
import { Spinner } from "react-bootstrap";
import "./User.css";
import { Redirect } from "react-router-dom";

class OtherUser extends Component {
  componentDidMount() {
    this.props.getUser(this.props.match.params.username);
    console.log(this.props.match.params.username);
  }
  render() {
    if (this.props.match.params.username === this.props.auth.user.username) {
      return <Redirect to="/user/self" />;
    }
    if (this.props.user.isLoaded === false) {
      return (
        <Spinner animation="border" variant="primary" className="spinner" />
      );
    }
    let i;
    let totalLikes = 0;
    for (i = 0; i < this.props.user.blogInfo.length; i++) {
      totalLikes = totalLikes + this.props.user.blogInfo[i].likes;
    }

    return (
      <div className="bodyUser">
        <div
          className="container text-center mt-3 p-3"
          style={{ border: "3px solid black", background: "white" }}
        >
          <h1 className="mb-5">
            <strong>
              <u>{this.props.user.userInfo.username}</u>
            </strong>
          </h1>
          {this.props.user.userInfo.image !== null ? (
            <img
              className="img-fluid userImage"
              src={this.props.user.userInfo.image}
            />
          ) : (
            ""
          )}
          <h4 className="m-3">Bio:</h4>
          <p>{this.props.user.userInfo.bio}</p>
          <hr />
          <h4>Number of Blog(s) Written: {this.props.user.blogInfo.length}</h4>
          <h4>Total Likes from Blog(s): {totalLikes}</h4>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    auth: state.auth,
  };
}

export default connect(mapStateToProps, { getUser })(OtherUser);

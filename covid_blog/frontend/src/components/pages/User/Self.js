import React, { Component } from "react";
import { connect } from "react-redux";
import { getSelfInfo } from "../../../actions/users";
import { openModal } from "../../../actions/modal";
import ChangeProfilePic from "./ChangeProfilePic";
import ChangeBio from "./ChangeBio";
import ChangePassword from "./ChangePassword";
import PropTypes from "prop-types";
import { Spinner } from "react-bootstrap";

class Self extends Component {
  static propTypes = {
    getSelfInfo: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
  };
  componentDidMount() {
    this.props.getSelfInfo(this.props.self.user.username);
  }

  render() {
    if (
      (this.props.self.isLoaded === false) |
      (this.props.self.infoLoaded === false)
    ) {
      return (
        <Spinner animation="border" variant="primary" className="spinner" />
      );
    }
    let i;
    let totalLikes = 0;
    for (i = 0; i < this.props.self.info.length; i++) {
      totalLikes = totalLikes + this.props.self.info[i].likes;
    }

    let profilePic;
    if (this.props.self.user.image !== null) {
      profilePic = (
        <div>
          <img
            className="img-fluid userImage"
            src={this.props.self.user.image}
          />{" "}
          <br />
          <button
            className="btn btn-info m-3"
            onClick={() => this.props.openModal(<ChangeProfilePic />)}
          >
            Edit Profile Picture
          </button>
        </div>
      );
    } else {
      profilePic = (
        <button
          className="btn btn-info"
          onClick={() => this.props.openModal(<ChangeProfilePic />)}
        >
          Add Profile Picture
        </button>
      );
    }

    return (
      <div className="bodyUser">
        <div
          className="container text-center mt-3 p-3"
          style={{ border: "3px solid black", background: "white" }}
        >
          <h1 className="mb-5">
            <strong>
              <u>{this.props.self.user.username}</u>
            </strong>
          </h1>
          {profilePic}
          <h4 className="m-3">Bio:</h4>
          <p>{this.props.self.user.bio}</p>
          <button
            className="btn btn-info"
            onClick={() => this.props.openModal(<ChangeBio />)}
          >
            Edit Bio
          </button>
          <hr />
          <h4>Number of Blog(s) Written: {this.props.self.info.length}</h4>
          <h4>Total Likes from Blog(s): {totalLikes}</h4>
          <hr />
          <button
            className="btn btn-info"
            onClick={() => this.props.openModal(<ChangePassword />)}
          >
            Change Password
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    self: state.auth,
  };
}

export default connect(mapStateToProps, { getSelfInfo, openModal })(Self);

import React, { Component } from "react";
import { connect } from "react-redux";
import { closeModal } from "../../../actions/modal";
import { updateSelfProfile } from "../../../actions/users";

class ChangePassword extends Component {
  state = { username: "", password: "", newPassword: "", newPassword2: "" };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  submitPassword = async (getState) => {
    let header = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let form = JSON.stringify({
      username: this.state.username,
      old_password: this.state.password,
      password: this.state.newPassword,
    });
    this.props.updateSelfProfile(form, header, this.state);
    this.setState({
      username: "",
      password: "",
      newPassword: "",
      newPassword2: "",
    });
  };

  render() {
    return (
      <div>
        <h3 className="text-center">
          <strong>
            <u>Change Password</u>
          </strong>
        </h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Username"
              name="username"
              onChange={this.onChange}
              value={this.state.username}
            />
          </div>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter Current Password"
              name="password"
              onChange={this.onChange}
              value={this.state.password}
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter New Password"
              name="newPassword"
              onChange={this.onChange}
              value={this.state.newPassword}
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm New Password"
              name="newPassword2"
              onChange={this.onChange}
              value={this.state.newPassword2}
            />
          </div>
          <button
            type="submit"
            onClick={this.submitPassword}
            className="btn btn-success my-3 btn-block"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps, { closeModal, updateSelfProfile })(
  ChangePassword
);

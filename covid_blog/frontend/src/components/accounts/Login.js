import React, { Component } from "react";
import PropTypes from "prop-types";

import { login } from "../../actions/auth";
import { openModal, closeModal } from "../../actions/modal";
import { connect } from "react-redux";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";

class Login extends Component {
  state = {
    username: "",
    password: "",
  };

  static propTypes = {
    login: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  formSubmit = (e) => {
    let username, password;
    username = this.state.username;
    password = this.state.password;
    const form = { username, password };
    this.props.login(form);
    e.preventDefault();
    this.setState({
      username: "",
      password: "",
    });
  };

  render() {
    return (
      <div>
        <h2 className="text-center">Login</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Username"
              onChange={this.onChange}
              value={this.state.username}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              onChange={this.onChange}
              value={this.state.password}
            />
          </div>
          <button
            type="submit"
            onClick={this.formSubmit}
            className="btn btn-primary btn-block"
          >
            Submit
          </button>
          <hr />
          <p className="mt-2">
            Don't Have an Account?{" "}
            <span
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => {
                this.props.closeModal();
                this.props.openModal(<Register />);
              }}
            >
              Click Here!
            </span>
          </p>
          <p className="mt-1">
            Forgot Password?{" "}
            <span
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => {
                this.props.closeModal();
                this.props.openModal(<ForgotPassword />);
              }}
            >
              Click Here!
            </span>
          </p>
        </form>
      </div>
    );
  }
}

export default connect(null, { login, openModal, closeModal })(Login);

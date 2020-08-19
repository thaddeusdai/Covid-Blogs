import React, { Component } from "react";
import PropTypes from "prop-types";
import { withAlert } from "react-alert";
import { register } from "../../actions/auth";
import { openModal, closeModal } from "../../actions/modal";
import { connect } from "react-redux";

import Login from "./Login";

class Register extends Component {
  state = {
    username: "",
    password: "",
    email: "",
    password2: "",
  };

  static propTypes = {
    register: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  formSubmit = (e) => {
    if (this.state.password === this.state.password2) {
      const form = {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
      };
      this.props.register(form);
      e.preventDefault();
      this.setState({
        username: "",
        password: "",
        email: "",
        password2: "",
      });
    } else {
      alert.error("Passwords Do Not Match");
    }
  };

  render() {
    return (
      <div>
        <h2 className="text-center">Register</h2>
        <form>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
            />
          </div>
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
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="password2"
              className="form-control"
              placeholder="Confirm Password"
              onChange={this.onChange}
              value={this.state.password2}
            />
          </div>

          <button
            type="submit"
            onClick={this.formSubmit}
            className="btn btn-primary btn-block"
          >
            Submit
          </button>
          <p className="mt-2">
            Already Have an Account?{" "}
            <span
              style={{ cursor: "pointer", color: "blue" }}
              className="text-blue"
              onClick={() => {
                this.props.closeModal();
                this.props.openModal(<Login />);
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

export default connect(null, { register, openModal, closeModal })(
  withAlert()(Register)
);

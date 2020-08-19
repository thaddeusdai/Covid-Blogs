import React, { Component } from "react";
import { openModal, closeModal } from "../../actions/modal";
import { forgotPassword } from "../../actions/auth";
import Login from "./Login";
import Register from "./Register";
import { connect } from "react-redux";

class ForgotPassword extends Component {
  state = { username: "" };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  formSubmit = async () => {
    const form = JSON.stringify({ username: this.state.username });
    this.props.forgotPassword(form);
    this.setState({
      username: "",
    });
  };
  render() {
    return (
      <div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <h3 className="text-center">Forgot Password</h3>
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
          <button
            type="submit"
            onClick={this.formSubmit}
            className="btn btn-primary btn-block"
          >
            Submit
          </button>
          <hr />
          <p className="mt-2">
            Don't Have an account?{" "}
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
            Have an account?{" "}
            <span
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => {
                this.props.closeModal();
                this.props.openModal(<Login />);
              }}
            >
              Login Here!
            </span>
          </p>
        </form>
      </div>
    );
  }
}

export default connect(null, { openModal, closeModal, forgotPassword })(
  ForgotPassword
);

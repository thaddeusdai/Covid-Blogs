import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import "./NavBar.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Register from "../../accounts/Register";
import Login from "../../accounts/Login";
import { closeModal, openModal } from "../../../actions/modal";
import { getSelf } from "../../../actions/users";
import { logout } from "../../../actions/auth";

class NavBar extends Component {
  state = { title: "", user: "" };
  static propTypes = {
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    getSelf: PropTypes.func.isRequired,
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  clicked = () => {
    this.setState({ title: "", user: "" });
  };

  submit = (e) => {
    e.preventDefault();
  };

  render() {
    let visible;
    if (this.props.auth.isLoaded === false) {
      visible = { visibility: "hidden" };
    } else {
      visible = { visibility: "visible" };
    }
    return (
      <nav
        className="navbar navbar-expand-md navbar-dark bg-dark mb-10"
        style={visible}
      >
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {this.props.auth.user ? (
          <div className="d-none d-xl-block searchbar text-white">
            <ul className="navbar-nav ">
              <li className="nav-item" id="searchbar1">
                <form
                  className="form-inline my-lg-0"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label className="input-label d-none d-xl-block">
                    <span className="mr-2">Title:</span>
                  </label>
                  <input
                    className="form-control mr-sm-2 search-input"
                    type="search"
                    placeholder="Search by Title"
                    aria-label="Search"
                    name="title"
                    value={this.state.title}
                    onChange={this.onChange}
                  />

                  <Link
                    className="btn btn-outline-light my-sm-0 text-white"
                    to={`/blogs/search/title/${this.state.title}`}
                    onClick={this.clicked}
                  >
                    Search
                  </Link>
                </form>
              </li>
              <li className="nav-item" id="searchbar2">
                <form
                  className="form-inline my-lg-0"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label className="input-label d-none d-xl-block">
                    <span className="mr-2">Author:</span>
                  </label>
                  <input
                    className="form-control mr-sm-2 "
                    placeholder="Search by Username"
                    onChange={this.onChange}
                    name="user"
                    value={this.state.user}
                  />

                  <Link
                    className="btn btn-outline-light my-sm-0 text-white"
                    to={`/blogs/search/user/${this.state.user}`}
                    onClick={this.clicked}
                  >
                    Search
                  </Link>
                </form>
              </li>
            </ul>
          </div>
        ) : (
          ""
        )}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {this.props.auth.user ? (
              <>
                <li className="nav-item active">
                  <Link className="nav-link" to="/blogs">
                    Blogs
                  </Link>
                </li>
                <li onClick={this.props.logout} className="nav-item active">
                  <Link className="nav-link" to="/">
                    Logout
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/user/self">
                    <strong>{this.props.auth.user.username}</strong>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li
                  className="nav-link active text-white"
                  style={{ cursor: "pointer" }}
                  onClick={() => this.props.openModal(<Register />)}
                >
                  Sign Up
                </li>
                <li
                  className="nav-link active text-white"
                  style={{ cursor: "pointer" }}
                  onClick={() => this.props.openModal(<Login />)}
                >
                  Login
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps, {
  openModal,
  closeModal,
  getSelf,
  logout,
})(NavBar);

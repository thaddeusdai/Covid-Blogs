import React, { Component } from "react";
import { connect } from "react-redux";
import { updateSelfProfile } from "../../../actions/users";
import { closeModal } from "../../../actions/modal";

class ChangeBio extends Component {
  state = {};

  componentWillMount() {
    if (this.props.auth.user.bio === null) {
      this.setState({ bio: "" });
    } else {
      this.setState({ bio: this.props.auth.user.bio });
    }
  }

  submitBio = (e) => {
    let form = JSON.stringify(this.state);
    let header = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    this.props.updateSelfProfile(form, header);
  };

  changeText = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  render() {
    return (
      <form>
        <h3 className="text-center">
          <strong>
            <u>Update Bio</u>
          </strong>
        </h3>
        <div className="form-group">
          <label>{255 - this.state.bio.length} characters remaining</label>
          <textarea
            className="form-control"
            rows="3"
            name="bio"
            onChange={this.changeText}
            value={this.state.bio}
          ></textarea>
        </div>
        <button
          onClick={(e) => this.submitBio(e)}
          className="btn btn-success btn-block"
          type="button"
        >
          Submit
        </button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps, { updateSelfProfile, closeModal })(
  ChangeBio
);

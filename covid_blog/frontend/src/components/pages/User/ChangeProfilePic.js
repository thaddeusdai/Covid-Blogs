import React, { Component } from "react";
import Dropzone from "react-dropzone";
import "./User.css";
import { connect } from "react-redux";
import { updateSelfProfile } from "../../../actions/users";
import { closeModal } from "../../../actions/modal";

class ChangeProfilePic extends Component {
  state = { files: [] };

  onDrop = (files) => {
    this.setState({ files });
  };

  submitPic = () => {
    let header = {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };
    let form = new FormData();
    form.append("image", this.state.files[0], this.state.files[0].name);
    this.props.updateSelfProfile(form, header);
  };

  render() {
    const files = this.state.files.map((file) => (
      <li style={{ listStyle: "none" }} key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));

    return (
      <div>
        <h3 className="text-center mb-3">
          <strong>
            <u>New Profile Picture</u>
          </strong>
        </h3>
        <Dropzone onDrop={this.onDrop}>
          {({ getRootProps, getInputProps }) => (
            <section className="container">
              <div {...getRootProps({ className: "dropzone back" })}>
                <input style={{ background: "grey" }} {...getInputProps()} />
                <p className="text-center text-white">
                  Drag 'n' drop your picture here, or click to select picture!
                </p>
              </div>
              <aside className="text-center m-3">{files}</aside>
            </section>
          )}
        </Dropzone>
        <button className="btn btn-success btn-block" onClick={this.submitPic}>
          Submit
        </button>
      </div>
    );
  }
}

export default connect(null, { updateSelfProfile, closeModal })(
  ChangeProfilePic
);

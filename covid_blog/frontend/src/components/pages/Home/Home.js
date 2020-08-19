import React, { Component, Fragment } from "react";
import "./Home.css";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { Spinner } from "react-bootstrap";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get_classification, clear } from "../../../actions/home";

library.add(faImage);

class Home extends Component {
  state = { files: [] };

  onDrop = (files) => {
    this.setState({ files });
  };

  clearImg = () => {
    this.setState({ files: [] });
    this.props.clear();
  };

  sendImage = () => {
    let formData = new FormData();
    formData.append("image", this.state.files[0], this.state.files[0].name);
    let header = {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };
    this.props.get_classification(formData, header);
  };

  render() {
    const files = this.state.files.map((file) => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));

    return (
      <div className="text-center text-white homepage">
        <h1 className="m-3">
          Welcome To Home{" "}
          {this.props.auth.isAuthenticated
            ? `: ${this.props.auth.user.username}`
            : ""}
        </h1>
        <h3>
          Check to see if you are wearing the standard light blue facemask!
        </h3>
        <label>
          Make sure to upload a picture with your full face close to the camera
        </label>
        <Dropzone onDrop={this.onDrop} accept="image/png, image/jpeg">
          {({ getRootProps, getInputProps }) => (
            <section className="container">
              <div {...getRootProps({ className: "dropzone back" })}>
                <input {...getInputProps()} />
                <FontAwesomeIcon icon="image" size="4x" className="mb-3" />
                <p className="text-white">
                  Drag and drop some files here, or click to select files
                </p>
              </div>
              <aside>{files}</aside>
              {this.props.home.isLoading ? (
                <Spinner
                  animation="border"
                  variant="light"
                  style={{ width: "3rem", height: "3rem" }}
                  className="m-3"
                />
              ) : (
                ""
              )}
            </section>
          )}
        </Dropzone>
        {this.state.files.length > 0 ? (
          <Fragment>
            <img src={this.props.home.image} id="imageClassifier" /> <br />
            <button className="btn btn-primary m-3" onClick={this.sendImage}>
              Submit Image
            </button>
            <button className="btn btn-danger m-3" onClick={this.clearImg}>
              Clear
            </button>
          </Fragment>
        ) : (
          ""
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    home: state.home,
  };
}

export default connect(mapStateToProps, { get_classification, clear })(Home);

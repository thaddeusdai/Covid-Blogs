import React, { Component } from "react";
import { connect } from "react-redux";
import { createBlog } from "../../../actions/blogs";
import { closeModal } from "../../../actions/modal";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";
import "./Blog.css";

class CreateBlog extends Component {
  state = {
    content: "",
    title: "",
    files: [],
    contentError: false,
    titleError: false,
    quarantine: false,
    awareness: false,
    hospital: false,
    health: false,
  };
  static propTypes = {
    createBlog: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  blogContent = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onDrop = (files) => {
    this.setState({ files });
  };

  submitBlog = (e) => {
    e.preventDefault();
    let form = new FormData();
    let contentError, titleError, imgError;
    if (this.state.content === "") {
      contentError = true;
      this.setState({ contentError });
    } else {
      this.setState({ contentError: false });
    }
    if (this.state.title === "") {
      titleError = true;
      this.setState({ titleError });
    } else {
      this.setState({ titleError: false });
    }
    if (contentError === true || titleError === true) {
      return;
    }
    console.log(this.state.contentError, this.state.content);
    let tags = [
      this.state.quarantine ? "Quarantine" : "",
      this.state.health ? "Health" : "",
      this.state.hospital ? "Hospital" : "",
      this.state.awareness ? "Awareness" : "",
    ];
    let i;
    for (i = 0; i < tags.length; i++) {
      if (tags[i] === "") {
        tags.splice(i, 1);
      }
    }
    form.append("content", this.state.content);
    form.append("tags", tags);
    form.append("title", this.state.title);
    if (this.state.files[0]) {
      form.append("image", this.state.files[0], this.state.files[0].name);
    }
    this.setState({
      content: "",
      title: "",
      files: [],
      contentError: false,
      titleError: false,
      imgError: false,
      quarantine: false,
      awareness: false,
      hospital: false,
      health: false,
    });
    this.props.createBlog(form);
  };

  selectTags = (e) => {
    let name = e.target.name;
    console.log(name, this.state[name]);
    if (this.state[name]) {
      this.setState({ [e.target.name]: false });
    } else {
      this.setState({ [e.target.name]: true });
    }
  };

  render() {
    const files = this.state.files.map((file) => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));

    return (
      <form>
        <h3 className="text-center">
          <strong>
            <u>Create Your Blog!</u>
          </strong>
        </h3>
        <div className="m-2 p-2">
          <label>
            <b>Upload Blog Picture</b> (Optional)
          </label>
          <Dropzone onDrop={this.onDrop} accept="image/png, image/jpeg">
            {({ getRootProps, getInputProps }) => (
              <section className="container">
                <div {...getRootProps({ className: "dropzone back" })}>
                  <input {...getInputProps()} />
                  <p className="text-white text-center">
                    Drag and Drop Your Blog Picture Here! Or Click to Upload!
                  </p>
                </div>
                <aside>
                  <ul>{files}</ul>
                </aside>
              </section>
            )}
          </Dropzone>
        </div>
        <div
          className="form-group m-2 p-2"
          style={{ border: this.state.titleError ? "3px solid red" : "" }}
        >
          <label>
            <b>Add Title</b> (Required)
          </label>
          <input
            type="text"
            className="form-control"
            name="title"
            placeholder="Enter Title"
            value={this.state.title}
            onChange={this.blogContent}
            onSubmit={(e) => e.preventDefault()}
          />
        </div>
        <div className="form-group">
          <label>
            <b>Enter Tag(s)</b> (Optional)
          </label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="hospital"
              value="Hospital"
              onChange={this.selectTags}
              checked={this.state.hospital}
            />
            <label className="form-check-label">Hospital</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="health"
              value="Health"
              onChange={this.selectTags}
              checked={this.state.health}
            />
            <label className="form-check-label">Health</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="awareness"
              value="Awareness"
              onChange={this.selectTags}
              checked={this.state.awareness}
            />
            <label className="form-check-label">Awareness</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="quarantine"
              value="Quarantine"
              onChange={this.selectTags}
              checked={this.state.quarantine}
            />
            <label className="form-check-label">Quarantine</label>
          </div>
        </div>
        <hr />
        <div
          className="form-group m-2 p-2"
          style={{ border: this.state.contentError ? "3px solid red" : "" }}
        >
          <label>
            <b>Blog Content</b>
            <label className="ml-2">{`${
              10000 - this.state.content.length
            } characters remaining`}</label>{" "}
            (Required)
          </label>
          <textarea
            placeholder="Start writing your blog here!"
            className="form-control"
            rows="6"
            name="content"
            value={this.state.content}
            onChange={this.blogContent}
          ></textarea>
        </div>
        <button
          onClick={this.submitBlog}
          className="btn btn-outline-success btn-block"
          type="submit"
          style={{ cursor: "pointer" }}
        >
          Create Blog
        </button>
      </form>
    );
  }
}

export default connect(null, { createBlog, closeModal })(CreateBlog);

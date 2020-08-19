import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { closeModal } from "../../../actions/modal";
import "./Modal.css";

class Modal extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
  };
  render() {
    let display;
    if (this.props.modal.openModal === false) {
      display = { display: "none" };
    } else {
      display = { display: "block", bottom: "0px" };
    }
    return (
      <div className="site-modal" style={display}>
        <div className="modal-content">
          <div className="col right">
            <span className="close" onClick={this.props.closeModal}>
              &times;
            </span>
          </div>
          <div className="">{this.props.modal.content}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    modal: state.modal,
  };
}

export default connect(mapStateToProps, { closeModal })(Modal);

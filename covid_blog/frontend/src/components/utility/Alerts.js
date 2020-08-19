import React, { Component } from "react";
import { withAlert } from "react-alert";
import { connect } from "react-redux";
import PropType from "prop-types";

class Alerts extends Component {
  static propTypes = {
    alerts: PropType.object.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { alerts, alert } = this.props;
    if (alerts.msg !== prevProps.alerts.msg) {
      if (alerts.msg.username !== prevProps.alerts.msg.username) {
        alert.error(`Username: ${alerts.msg.username}`);
      }
      if (alerts.msg.password) {
        alert.error(`Password: ${alerts.msg.password}`);
      }
      if (alerts.msg.email) {
        alert.error(`Email: ${alerts.msg.email}`);
      }
      if (alerts.msg.error) {
        alert.error(alerts.msg.error);
      }
      if (alerts.msg.non_field_errors) {
        alert.error(alerts.msg.non_field_errors);
      }
      if (alerts.msg.success) {
        alert.success(alerts.msg.success);
      }
      if (alerts.msg.classification) {
        if (alerts.msg.classification === "Wearing Standard Facemask") {
          alert.success(alerts.msg.classification);
        } else {
          alert.error(alerts.msg.classification);
        }
      }
    }
  }
  render() {
    return <div></div>;
  }
}

function mapStateToProps(state) {
  return {
    alerts: state.alerts,
  };
}

export default connect(mapStateToProps)(withAlert()(Alerts));

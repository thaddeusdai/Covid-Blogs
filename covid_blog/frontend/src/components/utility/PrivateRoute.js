import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import React from "react";

const PrivateRoute = ({ component: Component, auth, ...other }) => (
  <Route
    {...other}
    render={(props) => {
      if (auth.isAuthenticated) {
        return <Component {...props} />;
      } else if (auth.isLoaded === false) {
        return <h3></h3>;
      } else {
        console.log(auth, "fjdskl");
        return <Redirect to="/" />;
      }
    }}
  />
);

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(PrivateRoute);

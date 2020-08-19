import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import NavBar from "./utility/NavBar/NavBar";
import Home from "./pages/home/Home";
import root from "../reducers/root";
import AllBlogs from "./pages/blogs/AllBlogs";
import Modal from "./utility/Modal/Modal";
import Search from "./pages/Search/Search";

import PrivateRoute from "./utility/PrivateRoute";
import BlogPage from "./pages/blogs/BlogPage";
import { getSelf } from "../actions/users";
import Self from "./pages/User/Self";
import OtherUser from "./pages/User/OtherUser";
import Alerts from "./utility/Alerts";

const middle = [thunk];
const init = {};
const store = createStore(
  root,
  init,
  composeWithDevTools(applyMiddleware(...middle))
);

class App extends Component {
  componentDidMount() {
    store.dispatch(getSelf());
  }
  render() {
    return (
      <Provider store={store}>
        <AlertProvider
          template={AlertTemplate}
          timeout={2500}
          position="top center"
          containerStyle={{
            zIndex: 11000,
          }}
        >
          <Fragment>
            <Router>
              <Route path="/" component={Modal} />
              <Route path="/" component={NavBar} />
              <Route exact path="/" component={Home} />
              <PrivateRoute exact path="/blogs" component={AllBlogs} />
              <PrivateRoute
                exact
                path="/blogs/blog/:blogid"
                component={BlogPage}
              />
              <Switch>
                <PrivateRoute
                  exact
                  path="/blogs/search/:type/:data"
                  component={Search}
                />
                <PrivateRoute
                  exact
                  path="/blogs/search/:type"
                  component={Search}
                />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/user/self" component={Self} />
                <PrivateRoute
                  exact
                  path="/user/:username"
                  component={OtherUser}
                />
              </Switch>
            </Router>
            <Alerts />
          </Fragment>
        </AlertProvider>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));

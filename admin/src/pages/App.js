import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Layout, message } from "antd";
import { fetchSelf } from "../actions/auth";
import { removeMessage } from "../actions/messages";
import { ADD_MESSAGE, ADD_ERROR } from "../actions/types";
import "./App.css";
import Header from "../components/Header";
import Login from "./auth/Login";
import Register from "./auth/Register";
import User from "./users/User";
import Users from "./users/Users";
import Subjects from "./subjects/Subjects";
import Subject from "./subjects/Subject";
import Lessons from "./lessons/Lessons";
import Lesson from "./lessons/Lesson";
import Questions from "./questions/Questions"

import withHelmet from "../hocs/withHelmet";

class App extends Component {
  componentDidMount() {
    this.props.fetchSelf();
  }

  componentDidUpdate() {
    if (this.props.messages.length > 0) {
      if (this.props.messages[0].type === ADD_MESSAGE) {
        message.success(this.props.messages[0].message, 1);
      } else if (this.props.messages[0].type === ADD_ERROR) {
        message.error(this.props.messages[0].message, 2);
      }
      this.props.removeMessage();
    }
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Layout>
            <Header />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/users/:id" component={User} />
            <Route exact path="/subjects" component={Subjects}/>
            <Route exact path="/subjects/:id" component={Subject} />
            <Route exact path="/lessons" component={Lessons} />
            <Route exact path="/lessons/:id" component={Lesson} />
            <Route exect path="/questions" component={Questions}/>
          </Layout>
        </BrowserRouter>
      </div>
    );
  }
}

App.propTypes = {
  fetchSelf: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({ type: PropTypes.string, message: PropTypes.string })
  ).isRequired,
  removeMessage: PropTypes.func.isRequired
};

function mapStateToProps({ messages }) {
  return { messages };
}

const EnhancedApp = withHelmet([
  { tag: "title", content: "Admin | ProENT" }
])(App);

export default connect(
  mapStateToProps,
  { fetchSelf, removeMessage }
)(EnhancedApp);

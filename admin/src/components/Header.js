import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Layout, Menu, Icon } from "antd";

import { logout as logoutAction } from "../actions/auth";

const menuItems = [
  { link: "/users", name: "Users", icon: "user" },
  { link: "/subjects", name: "Subjects", icon: "book" },
  { link: "/lessons", name: "Lessons", icon: "bank" }
];

class Header extends Component {
  state = {
    current: ""
  };

  handleClick = e => {
    this.setState({
      current: e.key
    });
  };

  renderContent() {
    if (this.props.auth) {
      return (
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
          theme="dark"
        >
          {this.props.auth.role === "admin" &&
            menuItems.map(item => (
              <Menu.Item key={item.name}>
                <Link to={item.link} key={item.link}>
                  <Icon type={item.icon} /> {item.name}
                </Link>
              </Menu.Item>
            ))}

          <Menu.Item
            key="logout"
            style={{ position: "absolute", top: 0, right: 50 }}
          >
            <a href="/" onClick={this.props.logout}>
              <Icon type="logout" /> Log Out
            </a>
          </Menu.Item>
        </Menu>
      );
    }
    return (
      <a
        style={{
          height: 46,
          lineHeight: "46px",
          position: "absolute",
          top: 0,
          right: 50
        }}
        href="/login"
      >
        <Icon type="login" /> Login
      </a>
    );
  }

  render() {
    return (
      <Layout.Header style={{ height: 46 }}>
        {this.renderContent()}
      </Layout.Header>
    );
  }
}

Header.propTypes = {
  auth: PropTypes.shape({
    role: PropTypes.string
  }),
  logout: PropTypes.func.isRequired
};

Header.defaultProps = {
  auth: {}
};

function mapStateToProps({ auth }) {
  return { auth };
}

const mapDispatchToProps = dispatch => ({
  logout: () => logoutAction(dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

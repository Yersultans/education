import React, { Component } from "react";
import PropTypes from "prop-types";
import { Input, Select, Button, DatePicker } from "antd";
import { connect } from "react-redux";
import {
  fetchUser,
  updateUser,
  updateUserPassword,
  giveUserSocialBadge
} from "../../actions/users";


const userRoles = ["admin", "user"];

class User extends Component {
  state = {
    username: (this.props.user && this.props.user.username) || "",
    firstName: (this.props.user && this.props.user.firstName) || "",
    lastName: (this.props.user && this.props.user.lastName) || "",
    password: "",
    role: (this.props.user && this.props.user.role) || "",
    parentEmail: (this.props.user && this.props.user.parentEmail) || "",
    birthDate: (this.props.user && this.props.user.birthDate) || ""
  };

  componentDidMount() {
    this.props.fetchSchoolsList();
    this.props.fetchUser(this.props.match.params.id);
    this.props.fetchChapters();
  }

  componentWillReceiveProps({ user }) {
    if (user) {
      this.setState({
        username: (user && user.username) || "",
        firstName: (user && user.firstName) || "",
        lastName: (user && user.lastName) || "",
        role: (user && user.role) || "",
        parentEmail: (user && user.parentEmail) || "",
        birthDate: (user && user.birthDate) || ""
      });
    }
  }

  onInputChange = ({ target }) => {
    this.setState({
      [target.name]: target.value
    });
  };

  onSocialBadgeClick = ({ socialType }) => {
    this.props.giveUserSocialBadge(socialType, this.props.user._id);
  };

  onRoleChange = value => {
    this.setState({ role: value });
  };


  removeDuplicates = array => {
    const filteredArray = array.filter(
      (el, index, arr) => arr.indexOf(el) === index
    );
    return filteredArray;
  };

  handleBirhdateChange = (_, birthDate) => {
    this.setState({ birthDate });
  };

  handlePasswordUpdateClick = () => {
    this.props.updateUserPassword(this.props.user._id, this.state.password);
  };

  handleUpdateClick = () => {
    const { username, firstName, lastName, parentEmail, birthDate, role } = this.state;
    this.props.updateUser(this.props.user._id, {
      username, 
      firstName, 
      lastName, 
      parentEmail, 
      birthDate, 
      role
       });
  };

 

  render() {
    const { user, schoolsList } = this.props;
    if (!user) {
      return <div>User not found</div>;
    }
    console.log(schoolsList);
    return (
      <div
        style={{
          minHeight: "calc(100vh - 86px)",
          width: "90%",
          margin: "auto",
          marginTop: 20,
          backgroundColor: "transparent",
          marginBottom: 20
        }}
      >
        <Input
          placeholder="Username"
          type="text"
          value={this.state.username}
          name="username"
          onChange={this.onInputChange}
          style={{ marginBottom: 8 }}
        />

        <Input
          placeholder="Firstname"
          type="text"
          value={this.state.firstName}
          name="firstName"
          onChange={this.onInputChange}
          style={{ marginBottom: 8 }}
        />

        <Input
          placeholder="Lastname"
          type="text"
          value={this.state.lastName}
          name="lastName"
          onChange={this.onInputChange}
          style={{ marginBottom: 8 }}
        />

        <Input
          placeholder="Parent's email"
          type="text"
          value={this.state.parentEmail}
          name="parentEmail"
          onChange={this.onInputChange}
          style={{ marginBottom: 8 }}
        />

        <DatePicker onChange={this.handleBirhdateChange} />
        <p>Birth date: {this.state.birthDate}</p>

        <div style={{ marginBottom: 8 }}>
          <Input
            placeholder="Password"
            type="text"
            value={this.state.password}
            name="password"
            onChange={this.onInputChange}
          />

          <Button
            style={{ marginTop: 10 }}
            type="primary"
            onClick={this.handlePasswordUpdateClick}
          >
            Update password
          </Button>
        </div>

        <Select
          mode="single"
          placeholder="Please select user type"
          defaultValue={this.state.role}
          onChange={this.onRoleChange}
          style={{ width: "100%", marginBottom: 8 }}
        >
          {userRoles.map(role => (
            <Select.Option value={role} key={role}>
              {role}
            </Select.Option>
          ))}
        </Select>

        <Button
          type="primary"
          onClick={this.handleUpdateClick}
          style={{ marginTop: 8 }}
        >
          Update
        </Button>

        <div
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center"
          }}
        >
          <Button
            onClick={() => {
              this.onSocialBadgeClick({ socialType: "facebook" });
            }}
            style={{ marginRight: 20 }}
          >
            {" "}
            Facebook
          </Button>
          <Button
            onClick={() => {
              this.onSocialBadgeClick({ socialType: "instagram" });
            }}
            style={{ marginRight: 20 }}
          >
            {" "}
            Instagram
          </Button>
          <Button
            onClick={() => {
              this.onSocialBadgeClick({ socialType: "medium" });
            }}
            style={{ marginRight: 20 }}
          >
            {" "}
            Medium
          </Button>
          <Button
            onClick={() => {
              this.onSocialBadgeClick({ socialType: "youtube" });
            }}
          >
            {" "}
            Youtube
          </Button>
        </div>
      </div>
    );
  }
}

User.propTypes = {
  /*eslint-disable */
  user: PropTypes.shape({
    _id: PropTypes.string,
    username: PropTypes.string,
    birthDate: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.string,
    parentEmail: PropTypes.string
  }).isRequired,
  fetchUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  giveUserSocialBadge: PropTypes.func.isRequired,
  updateUserPassword: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired
};

function mapStateToProps(state, ownProps) {
  const { user } = state;
  console.log("state: ", state)
  return { user: user[ownProps.match.params.id]};
}

const mapDispatchToProps = dispatch => ({
  fetchUser: id => fetchUser(id)(dispatch),
  updateUser: (id, values) => updateUser(id, values)(dispatch),
  giveUserSocialBadge: (socialType, userId) =>
    giveUserSocialBadge(socialType, userId)(dispatch),
  updateUserPassword: (id, password) =>
    updateUserPassword(id, password)(dispatch)
 
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);

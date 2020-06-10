import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Select, Button, DatePicker } from 'antd'
import { connect } from 'react-redux'
import {
  fetchUser,
  updateUser,
  updateUserPassword,
  giveUserSocialBadge
} from '../../actions/users'

const { Option } = Select

const userRoles = [
  'admin',
  'user',
  'reviewer',
  'teacher',
  'schoolAdmin',
  'contentManager',
  'schoolUser'
]

class User extends Component {
  state = {
    username: (this.props.user && this.props.user.username) || '',
    firstName: (this.props.user && this.props.user.firstName) || '',
    lastName: (this.props.user && this.props.user.lastName) || '',
    password: '',
    role: (this.props.user && this.props.user.role) || '',
    school: (this.props.user && this.props.user.school) || '',
    chapters: (this.props.user && this.props.user.chapters) || [],
    parentEmail: (this.props.user && this.props.user.parentEmail) || '',
    birthDate: (this.props.user && this.props.user.birthDate) || ''
  }

  componentDidMount() {
    this.props.fetchSchoolsList()
    this.props.fetchUser(this.props.match.params.id)
    this.props.fetchChapters()
  }

  componentWillReceiveProps({ user }) {
    if (user) {
      const newChapters = this.removeDuplicates([
        ...this.state.chapters,
        ...user.chapters
      ])
      this.setState({
        username: (user && user.username) || '',
        firstName: (user && user.firstName) || '',
        lastName: (user && user.lastName) || '',
        role: (user && user.role) || '',
        parentEmail: (user && user.parentEmail) || '',
        birthDate: (user && user.birthDate) || '',
        school: (user && user.school) || '',
        chapters: newChapters
      })
    }
  }

  onInputChange = ({ target }) => {
    this.setState({
      [target.name]: target.value
    })
  }

  onSocialBadgeClick = ({ socialType }) => {
    this.props.giveUserSocialBadge(socialType, this.props.user._id)
  }

  onRoleChange = value => {
    this.setState({ role: value })
  }

  onSchoolChange = value => {
    this.setState({ school: value })
  }

  removeDuplicates = array => {
    const filteredArray = array.filter(
      (el, index, arr) => arr.indexOf(el) === index
    )
    return filteredArray
  }

  handleBirhdateChange = (_, birthDate) => {
    this.setState({ birthDate })
  }

  handlePasswordUpdateClick = () => {
    this.props.updateUserPassword(this.props.user._id, this.state.password)
  }

  handleUpdateClick = () => {
    const {
      username,
      firstName,
      lastName,
      parentEmail,
      birthDate,
      role,
      chapters,
      school
    } = this.state
    this.props.updateUser(this.props.user._id, {
      username,
      firstName,
      lastName,
      parentEmail,
      birthDate,
      role,
      chapters,
      school: school || null
    })
  }

  handleChangeChapters = value => {
    this.setState({ chapters: this.removeDuplicates(value) })
  }

  render() {
    const { user, schoolsList } = this.props
    if (!user) {
      return <div>User not found</div>
    }
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 86px)',
          width: '90%',
          margin: 'auto',
          marginTop: 20,
          backgroundColor: 'transparent',
          marginBottom: 20
        }}
      >
        <div style={{ textAlign: 'left' }}>Username:</div>

        <Input
          placeholder="Username"
          type="text"
          value={this.state.username}
          name="username"
          onChange={this.onInputChange}
          style={{ marginBottom: 8 }}
        />
        <div style={{ textAlign: 'left' }}>Firstname:</div>

        <Input
          placeholder="Firstname"
          type="text"
          value={this.state.firstName}
          name="firstName"
          onChange={this.onInputChange}
          style={{ marginBottom: 8 }}
        />
        <div style={{ textAlign: 'left' }}>LastName:</div>

        <Input
          placeholder="Lastname"
          type="text"
          value={this.state.lastName}
          name="lastName"
          onChange={this.onInputChange}
          style={{ marginBottom: 8 }}
        />
        <div style={{ textAlign: 'left' }}>Parents email:</div>

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
          <div style={{ textAlign: 'left' }}>Password:</div>
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
        <div style={{ textAlign: 'left' }}>User type:</div>

        <Select
          mode="single"
          placeholder="Please select user type"
          defaultValue={this.state.role}
          onChange={this.onRoleChange}
          style={{ width: '100%', marginBottom: 8 }}
        >
          {userRoles.map(role => (
            <Select.Option value={role} key={role}>
              {role}
            </Select.Option>
          ))}
        </Select>
        <div>
          <div style={{ textAlign: 'left' }}>User school:</div>

          <Select
            mode="single"
            placeholder="Please select user school"
            defaultValue={this.state.school}
            onChange={this.onSchoolChange}
            style={{ width: '100%', marginBottom: 8 }}
          >
            {schoolsList &&
              schoolsList.map(school => (
                <Select.Option value={school._id} key={school._id}>
                  {school.name}
                </Select.Option>
              ))}
          </Select>
        </div>

        <div>
          <div style={{ textAlign: 'left' }}>User projects:</div>

          <Select
            mode="multiple"
            placeholder="Please select user project"
            style={{ width: '100%' }}
            defaultValue={user.chapters}
            onChange={this.handleChangeChapters}
          >
            {this.props.chapters.map(chapter => (
              <Option key={chapter._id} value={chapter._id}>
                {chapter.name}
              </Option>
            ))}
          </Select>
        </div>

        <Button
          type="primary"
          onClick={this.handleUpdateClick}
          style={{ marginTop: 8 }}
        >
          Update
        </Button>
        <div style={{ textAlign: 'center', marginTop: 10 }}>Social media:</div>

        <div
          style={{
            marginTop: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
          }}
        >
          <Button
            onClick={() => {
              this.onSocialBadgeClick({ socialType: 'facebook' })
            }}
            style={{ marginRight: 20 }}
          >
            {' '}
            Facebook
          </Button>
          <Button
            onClick={() => {
              this.onSocialBadgeClick({ socialType: 'instagram' })
            }}
            style={{ marginRight: 20 }}
          >
            {' '}
            Instagram
          </Button>
          <Button
            onClick={() => {
              this.onSocialBadgeClick({ socialType: 'medium' })
            }}
            style={{ marginRight: 20 }}
          >
            {' '}
            Medium
          </Button>
          <Button
            onClick={() => {
              this.onSocialBadgeClick({ socialType: 'youtube' })
            }}
          >
            {' '}
            Youtube
          </Button>
        </div>
      </div>
    )
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
    parentEmail: PropTypes.string,
    school: PropTypes.string,
    chapters: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        _id: PropTypes.string
      })
    ).isRequired
  }).isRequired,
  fetchUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  giveUserSocialBadge: PropTypes.func.isRequired,
  updateUserPassword: PropTypes.func.isRequired,
  fetchSchoolsList: PropTypes.func.isRequired,
  schoolsList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchChapters: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired,
  chapters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      _id: PropTypes.string
    })
  ).isRequired
}

function mapStateToProps(state, ownProps) {
  const { user, chapters, schoolsList } = state
  return { user: user[ownProps.match.params.id], schoolsList, chapters }
}

const mapDispatchToProps = dispatch => ({
  fetchUser: id => fetchUser(id)(dispatch),
  updateUser: (id, values) => updateUser(id, values)(dispatch),
  giveUserSocialBadge: (socialType, userId) =>
    giveUserSocialBadge(socialType, userId)(dispatch),
  updateUserPassword: (id, password) =>
    updateUserPassword(id, password)(dispatch),
  fetchSchoolsList: () => fetchSchoolsList()(dispatch),
  fetchChapters: () => fetchChapters(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(User)

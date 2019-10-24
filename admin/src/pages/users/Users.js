import React, { Component } from "react";
import PropTypes from "prop-types";
import { Table, Button, Divider, Input, Icon, Select } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import showConfirm from "../../components/DeleteFromTableFunc";
import CreateForm from "../../components/CreateForm";
import DefaultStyledContainer from "../../components/DefaultStyledContainer";
import {
  fetchUsers,
  createUser,
  deleteUser
} from "../../actions/users";

import randomInRange from "../../utils";

const { Option } = Select;

const CustomFilterDropdown = styled.div`
  padding: 8px;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);

  & > input {
    width: 130px;
    margin-right: 8px;
  }

  & > button {
    margin-right: 8px;
    :last-child {
      margin-right: 0;
    }
  }
`;

class Users extends Component {
  state = {
    modalVisible: false,
    importModalVisible: false,
    searchText: { userName: "", name: "" },
    failedEmails: [],
    isFinishedImport: false,
    pagination: {},
    loading: true
  };

  static getDerivedStateFromProps(props, state) {
    const pagination = { ...state.pagination };
    pagination.total = props.users.total;

    return {
      loading: false,
      pagination
    };
  }

  componentDidMount() {
    this.props.fetchUsers({ ...this.state.searchText });
  }

  onFilterDropdownVisibleChange = visible => {
    if (visible) {
      setTimeout(() => {
        this.searchInput.focus();
      });
    }
  };

  handleSearch = (key, selectedKeys, confirm) => () => {
    confirm();
    this.props.fetchUsers({});
  };

  handleReset = (key, clearFilters) => () => {
    clearFilters();
    // eslint-disable-next-line
    this.setState({ searchText: { ...this.state.searchText, [key]: "" } });
  };

  fields = [
    {
      key: "firstName",
      label: "FirstName"
    },
    {
      key: "lastName",
      label: "LastName"
    },
    {
      key: "parentEmail",
      label: "Parent email"
    },
    {
      key: "birthDate",
      label: "Birthdate",
      inputType: "date"
    },
    {
      key: "role",
      label: "User Role",
      options: [
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" },
        { value: "reviewer", label: "Reviewer" },
        { value: "teacher", label: "Teacher" }
      ]
    }
  ];

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  showImportUsersModal = () => {
    this.setState({ importModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ modalVisible: false, importModalVisible: false });
  };

  handleCreateStudents = async students => {
    try {
      const failedEmails = [];
      const newData = await Promise.all(
        students.map(
          item =>
            new Promise(resolve => {
              this.props.createUser(item).then(data => {
                if (data) {
                  return resolve(data.username);
                }
                failedEmails.push(item.parentEmail);
                return resolve(null);
              });
            })
        )
      );
      this.setState({ failedEmails, isFinishedImport: true });
      return newData;
    } catch (err) {
      /* eslint-disable-next-line */
      console.log("err: ", err);
    }
    return null;
  };

  handleCreate = async () => {
    const { form } = this.formRef.props;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      const editedValues = {
        ...values,
        password:
          `${values.firstName}${values.lastName}`
            .replace(/ /g, "")
            .toLowerCase()
            .split("@")[0] + randomInRange(100, 999),
        username: `${values.firstName}${values.lastName}`
          .replace(/ /g, "")
          .toLowerCase()
      };
      const res = await this.props.createUser(editedValues);
      form.resetFields();
      this.setState({
        newUserData: {
          password: editedValues.password,
          username: res.username,
          result: "User created"
        }
      });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  filterUserDropdown = ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters
  }) => (
    <CustomFilterDropdown>
      <Input
        // eslint-disable-next-line no-return-assign
        ref={ele => (this.searchInput = ele)}
        placeholder="Search user"
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={this.handleSearch("userName", selectedKeys, confirm)}
      />
      <Button
        type="primary"
        onClick={this.handleSearch("userName", selectedKeys, confirm)}
      >
        Search
      </Button>
      <Button onClick={this.handleReset("userName", clearFilters)}>
        Reset
      </Button>
    </CustomFilterDropdown>
  );

  filterNameDropdown = ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters
  }) => (
    <CustomFilterDropdown>
      <Input
        // eslint-disable-next-line no-return-assign
        ref={ele => (this.searchInput = ele)}
        placeholder="Search name"
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={this.handleSearch("name", selectedKeys, confirm)}
      />
      <Button
        type="primary"
        onClick={this.handleSearch("name", selectedKeys, confirm)}
      >
        Search
      </Button>
      <Button onClick={this.handleReset("name", clearFilters)}>Reset</Button>
    </CustomFilterDropdown>
  );

  handleTableChange = pagination => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
      loading: true
    });
    this.props.fetchUsers({
      page: pager.current,
      ...this.state.searchText
    });
  };

  filterIcon = filtered => (
    <Icon type="search-o" style={{ color: filtered ? "#108ee9" : "#aaa" }} />
  );

  render() {
    const columns = [
      {
        title: "Username",
        dataIndex: "username",
        key: "username",
        filterDropdown: this.filterUserDropdown,
        filterIcon: this.filterIcon,
        width: 200,
        onFilterDropdownVisibleChange: this.onFilterDropdownVisibleChange
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 175,
        filterDropdown: this.filterNameDropdown,
        filterIcon: this.filterIcon,
        onFilterDropdownVisibleChange: this.onFilterDropdownVisibleChange
      },
      {
        title: "Wupai",
        dataIndex: "wupai",
        key: "wupai",
        width: 75,
        render: text => <div style={{ textAlign: "center" }}> {text} </div>
      },
      {
        title: "Action",
        key: "action",
        width: 200,
        render: (text, item) => (
          <span>
            <Link to={`/users/${item._id}`}>
              <Button> Edit </Button>
            </Link>
            <Divider type="vertical" />
            <Button
              type="danger"
              onClick={() => showConfirm(() => this.props.deleteUser(item._id))}
            >
              Delete
            </Button>
          </span>
        )
      }
    ];
    return (
      <DefaultStyledContainer>
        <Table
          rowKey={row => row._id}
          dataSource={this.props.users.docs ? this.props.users.docs : []}
          columns={columns}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          loading={this.state.loading}
          title={() => (
            <div>
              <Button onClick={this.showModal}>Add new User</Button>
              <Button
                onClick={this.showImportUsersModal}
                style={{ marginLeft: "8px" }}
              >
                Import from CSV
              </Button>
            </div>
          )}
        />

        <CreateForm
          title="Add new user"
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.modalVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          fields={this.fields}
          dataToDisplay={this.state.newUserData}
        />
      </DefaultStyledContainer>
    );
  }
}

Users.propTypes = {
  fetchUsers: PropTypes.func.isRequired,
  createUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  users: PropTypes.oneOfType([
    PropTypes.shape({ docs: PropTypes.array }),
    PropTypes.arrayOf(PropTypes.shape({}))
  ]).isRequired
};

function mapStateToProps({ users}) {
  return { users };
}

export default connect(
  mapStateToProps,
  { fetchUsers, createUser, deleteUser }
)(Users);

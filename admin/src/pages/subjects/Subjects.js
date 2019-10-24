import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Table } from 'antd';
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import CreateForm from "../../components/CreateForm";
import DefaultStyledContainer from '../../components/DefaultStyledContainer';
import showConfirm from '../../components/DeleteFromTableFunc';
import { createSubject, fetchSubjects, deleteSubject } from '../../actions/subjects';

class Subjects extends Component{
  state = {
    modalVisible: false
  }

  componentDidMount() {
    this.props.fetchSubjects();
  }

  columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Image URL",
      dataIndex: "imgUrl",
      key: "imgUrl"
    },
    {
      title: "Action",
      key: "action",
      render: (text, item) => (
        <span>
          <Link to={`/subjects/${item._id}`}>
            <Button> Edit </Button>
          </Link>
          <Divider type="vertical" />
          <Button
            type="danger"
            onClick={() => {
              showConfirm(() => {this.props.deleteSubject(item._id)});
            }}
          >
            Delete
          </Button>
        </span>
      )
    }
  ];

  fields = [
    { key: "name", label: "Subject Name" },
    { key: "imgUrl", label: "Subject Image URL" }
  ];

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.createSubject(values);
      form.resetFields();
      this.setState({ modalVisible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    console.log('subjects: ', this.props.subjects)
    return (
      <DefaultStyledContainer>
        <Table
          dataSource={this.props.subjects}
          columns={this.columns}
          title={() => <Button onClick={this.showModal}>Add new Subject</Button>}
          onChange={this.handleTableChange}
        />

        <CreateForm
          title="Add new Subject"
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.modalVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          fields={this.fields}
        />
      </DefaultStyledContainer>
    );
  }

}

Subjects.propTypes = {
  subjects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  createSubject: PropTypes.func.isRequired,
  deleteSubject: PropTypes.func.isRequired,
  fetchSubjects: PropTypes.func.isRequired,
}

const mapStateToProps = ({ subjects }) =>( { subjects }) ;


export default connect(mapStateToProps, { fetchSubjects, createSubject, deleteSubject })(Subjects);

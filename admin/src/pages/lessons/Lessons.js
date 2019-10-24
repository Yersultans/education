import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Divider, Table } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import showConfirm from '../../components/DeleteFromTableFunc';
import DefaultStyledContainer from '../../components/DefaultStyledContainer';
import CreateForm from "../../components/CreateForm";
import {
  fetchLessons,
  createLesson,
  deleteLesson
} from "../../actions/lessons";
import { fetchSubjects } from "../../actions/subjects";

class Lessons extends Component {
  state = {
    modalVisible: false
  };

  componentDidMount() {
    this.props.fetchLessons();
    this.props.fetchSubjects();
  }

  columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject"
    },
    {
      title: "Action",
      key: "action",
      render: (text, item) => (
        <span>
          <Link to={`/lessons/${item._id}`}>
            <Button> Edit </Button>
          </Link>
          <Divider type="vertical" />
          <Button
            type="danger"
            onClick={() => {
              showConfirm(() => {this.props.deleteLesson(item._id)});
            }}
          >
            Delete
          </Button>
        </span>
      )
    }
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
      this.props.createLesson(values);
      form.resetFields();
      this.setState({ modalVisible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  handleFields = () => {
    const options = this.props.subjects.map(subject => ({ value: subject._id, label: subject.name }));
    const fields = [
      { key: "name", label: "Lesson Name" },
      {
        key: "subject",
        label: "Subject of the Lesson",
        options,
      }
    ];
    return fields;
  };

  render() {
    return (
      <DefaultStyledContainer>
        <Table
          dataSource={this.props.lessons}
          columns={this.columns}
          title={() => <Button onClick={this.showModal}>Add new Lesson</Button>}
          onChange={this.handleTableChange}
        />

        <CreateForm
          title="Add new Lesson"
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.modalVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          fields={this.handleFields()}
        />
      </DefaultStyledContainer>
    );
  }
}

Lessons.propTypes = {
  deleteLesson: PropTypes.func.isRequired,
  fetchLessons: PropTypes.func.isRequired,
  fetchSubjects: PropTypes.func.isRequired,
  createLesson: PropTypes.func.isRequired,
  lessons: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  subjects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

function mapStateToProps({lessons, subjects}) {
  return { lessons, subjects };
}

export default connect(
  mapStateToProps,
  { fetchLessons, createLesson, deleteLesson, fetchSubjects }
)(Lessons);

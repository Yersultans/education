import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input, Select } from "antd";
import { connect } from "react-redux";
import { fetchLesson, updateLesson } from "../../actions/lessons";
import { fetchSubjects } from "../../actions/subjects";

class Lesson extends Component {
  state = this.stateFromProps(this.props);

  componentDidMount() {
    this.props.fetchLesson(this.props.match.params.id);
    this.props.fetchSubjects();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.stateFromProps(nextProps));
  }

  stateFromProps(props) {
    const lesson = props.lesson[this.props.match.params.id];

    if(lesson && lesson.subject){
      return {
        name: lesson.name || "",
        subject: lesson.subject || ""
      };
    }
    if (lesson) {
      return {
        name: lesson.name || "",
      };
    }
    return { name: "" };
  }

  handleInputChange = (key, value) => {
    this.setState({ [key]: value });
  };

  handleUpdateClick = () => {
    const { name, subject } = this.state;
    this.props.updateLesson(
      this.props.match.params.id, { name, subject }
    );
  };

  handleSubjectChange = (subject) => {
    this.setState({ subject })
  }

  render() {
    const { subjects } = this.props;
    const { name, subject: currentSubject } = this.state;
    const lesson = this.props.lesson[this.props.match.params.id];
    if (!lesson) {
      return <div style={{ height: "calc(100vh - 86px)", width: '90%', margin: 'auto', marginTop: 20, backgroundColor: 'transparent', marginBottom: 20 }}>Lesson not found</div>;
    }

    return (
      <div style={{ height: "calc(100vh - 86px)", width: '90%', margin: 'auto', marginTop: 20, backgroundColor: 'transparent', marginBottom: 20 }}>
        <div style={{ textAlign: 'left' }}>
          Name of Lesson:
          <Input
            placeholder="Name"
            type="text"
            value={name}
            onChange={e => this.handleInputChange("name", e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <div>Subject of Subject:
            <Select
              mode="single"
              placeholder="Please select subject"
              defaultValue={currentSubject ? currentSubject.name : null}
              onChange={this.handleSubjectChange}
              style={{ width: "100%", marginBottom: 8 }}
            >
              {subjects.map(subject => (
                <Select.Option value={subject._id} key={subject._id}>
                  {subject.name}
                </Select.Option>
          ))}
            </Select>
          </div>
        </div>

        <Button
          type="primary"
          onClick={this.handleUpdateClick}
          style={{ marginRight: 8 }}
        >
          Update
        </Button>
      </div>
    );
  }
}

Lesson.propTypes = {
  subjects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchSubjects: PropTypes.func.isRequired,
  lesson: PropTypes.shape({
    name: PropTypes.string
  }).isRequired,
  fetchLesson: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateLesson: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const { lesson, subjects } = state;
  return { lesson, subjects };
}

export default connect(
  mapStateToProps,
  { fetchLesson, updateLesson, fetchSubjects }
)(Lesson);

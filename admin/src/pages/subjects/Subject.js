import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Input, DatePicker } from 'antd';
import { connect } from 'react-redux';

import { fetchSubject, updateSubject } from '../../actions/subjects';

const Container = styled.div`
  width: 90%;
  margin: 20px auto;
  background-color: transparent,
`;
class Subject extends Component {

  state = this.stateFromProps(this.props);

  componentDidMount() {
    this.props.fetchSubject(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.stateFromProps(nextProps));
  }

  stateFromProps(props) {
    const subject = props.subject[this.props.match.params.id];
    if (subject) {
      return {
        name: subject.name || "",
        imgUrl: subject.imgUrl || ""
      };
    }
    return { name: "", imgUrl: "" };
  }

  handleInputChange = (key, value) => {
    console.log("value", value);
    this.setState({ [key]: value });
  };

  handleUpdateClick = () => {
    console.log("timein hendle update: ", this.state.time);
    this.props.updateSubject(this.props.match.params.id, {
      name: this.state.name, 
      imgUrl: this.state.imgUrl
    });
  };

  render(){
    const subject = this.props.subject[this.props.match.params.id];
    if (!subject) {
      return <Container>Subject not found</Container>;
    }
    return (
      <Container>
        <div style={{ textAlign: 'left' }}>
          <div>Name of the Subject:
            <Input
              placeholder="Name"
              type="text"
              value={this.state.name}
              onChange={e => this.handleInputChange("name", e.target.value)}
              style={{ marginBottom: 8 }}
            />
          </div>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div>Image of the Subject:
            <Input
              placeholder="Image URL"
              type="text"
              value={this.state.imgUrl}
              onChange={e => this.handleInputChange("imgUrl", e.target.value)}
              style={{ marginBottom: 8 }}
            />
          </div>
        </div>

        <Button
          type="primary"
          onClick={this.handleUpdateClick}
          style={{ marginRight: 8 }}
        >
        Update
        </Button>
      </Container>
    );
  }
}

Subject.propTypes = {
  subject: PropTypes.shape({}).isRequired,
  fetchSubject: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateSubject: PropTypes.func.isRequired
}

const mapStateToProps = ({ subject }) => ({ subject });

export default connect(mapStateToProps, { fetchSubject, updateSubject })(Subject);

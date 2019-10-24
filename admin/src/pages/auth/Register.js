import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Icon, Row, Col } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { registerUser } from "../../actions/auth";

const FormItem = Form.Item;

class Register extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.registerUser(values, this.props.history);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Row type="flex" justify="center">
        <Col span={6}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator("username", {
                rules: [
                  { required: true, message: "Please input your username!" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Username"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator("password", {
                rules: [
                  { required: true, message: "Please input your Password!" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="Password"
                />
              )}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Register
              </Button>
              Or <a href="/login">login now!</a>
            </FormItem>
          </Form>
        </Col>
      </Row>
    );
  }
}

Register.propTypes = {
  form: PropTypes.shape({
    validateFields: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.shape({}).isRequired
  }).isRequired,
  registerUser: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired
};

export default connect(
  null,
  { registerUser }
)(Form.create()(withRouter(Register)));

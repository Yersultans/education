import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Input, Button, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import { useMutation, gql } from '@apollo/client'
import withHelmet from '../../hocs/withHelmet'
import LocalStorageUtils from '../../utils/LocalStorageUtils'
import AuthContext from '../../context/AuthContext'
import MessagesContext from '../../context/MessagesContext'

const FormItem = Form.Item

const LOGIN = gql`
  mutation login($input: LoginUserInput) {
    loginAdmin(input: $input) {
      token
    }
  }
`

function Login(props) {
  const [login, { data, error, loading }] = useMutation(LOGIN)
  const { updateCurrentUser } = useContext(AuthContext)
  const { displayMessage } = useContext(MessagesContext)

  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        login({
          variables: {
            input: values
          },
          errorPolicy: 'all'
        })
      }
    })
  }

  console.log('data is ', data)
  const { getFieldDecorator } = props.form

  useEffect(() => {
    if (!loading && error) {
      displayMessage({ type: 'error', message: JSON.stringify(error.message) })
    } else if (data && data.loginAdmin && data.loginAdmin.token) {
      LocalStorageUtils.save({
        key: 'token',
        value: `${data.loginAdmin.token}`
      })
      displayMessage({ type: 'notify', message: 'Successfully logged in' })
      updateCurrentUser()
      props.history.push('/')
    }
  }, [data, loading, error])

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
      <Row type="flex" justify="center">
        <Col span={6}>
          <Form onSubmit={handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('username', {
                rules: [
                  { required: true, message: 'Please input your username!' }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Username"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your Password!' }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
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
                Login
              </Button>
              Or <a href="/register">register now!</a>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.shape({
    validateFields: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.shape({}).isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
}

export default Form.create()(
  withHelmet([{ tag: 'title', content: 'Login' }])(withRouter(Login))
)

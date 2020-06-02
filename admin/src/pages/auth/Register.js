import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Icon, Row, Col } from 'antd'
import { withRouter } from 'react-router-dom'
import { useMutation, gql } from '@apollo/client'

import MessagesContext from '../../context/MessagesContext'

const FormItem = Form.Item

const REGISTER = gql`
  mutation register($input: RegisterUserInput) {
    registerUser(input: $input) {
      id
    }
  }
`

function Register(props) {
  const [register, { data, error, loading }] = useMutation(REGISTER)
  const { displayMessage } = useContext(MessagesContext)

  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        register({
          variables: {
            input: values
          },
          errorPolicy: 'all'
        })
      }
    })
  }

  useEffect(() => {
    if (!loading && error) {
      displayMessage({ type: 'error', message: JSON.stringify(error.message) })
    } else if (data && data.registerUser && data.registerUser.id) {
      displayMessage({
        type: 'notify',
        message: 'Registration successful, please, login'
      })
      props.history.push('/login')
    }
  }, [data, loading, error])

  const { getFieldDecorator } = props.form

  return (
    <Row type="flex" justify="center">
      <Col span={6}>
        <Form onSubmit={handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('username', {
              rules: [
                { required: true, message: 'Пожалуйста введите username!' }
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
              rules: [{ required: true, message: 'Пожалуйста введите пароль!' }]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="Пароль"
              />
            )}
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Зарегистрироваться
            </Button>
            или <a href="/login">Войти!</a>
          </FormItem>
        </Form>
      </Col>
    </Row>
  )
}

Register.propTypes = {
  form: PropTypes.shape({
    validateFields: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.shape({}).isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
}

export default Form.create()(withRouter(Register))

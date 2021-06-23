import React, { useEffect } from 'react'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { useMutation, gql } from '@apollo/client'
import { toast } from 'react-toastify'
import styled from 'styled-components'

import withHelmet from '../../hocs/withHelmet'
import withLoginLayout from '../../hocs/withLoginLayout'
import { useAuth } from '../../context/useAuth'
import { removeAnnoyingHeader } from '../../utils/apollo'

const LOGIN = gql`
  mutation login($input: LoginUserInput) {
    loginAdmin(input: $input) {
      token
    }
  }
`

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16
  }
}

const SubmitButton = styled(Button)`
  width: 100%;
`

const russianText = {
  login: 'Логин',
  password: 'Пароль',
  submit: 'Войти',
  header: 'Вход в админ-панель'
}

const Login = () => {
  const history = useHistory()
  const [login, { data, error, loading }] = useMutation(LOGIN)
  const { user, fetchUser } = useAuth()

  const handleSubmit = values => {
    const { username, password } = values
    login({
      variables: {
        input: { username, password }
      },
      errorPolicy: 'all'
    })
  }

  useEffect(() => {
    if (!loading && error) {
      toast.error(removeAnnoyingHeader(error.message))
    } else if (data && data.loginAdmin && data.loginAdmin.token) {
      localStorage.setItem('token', `${data.loginAdmin.token}`)
      toast.success('Successfully logged in')
      fetchUser()
      history.push('/subjects')
    }
  }, [data, loading, error])

  useEffect(() => {
    if (user) {
      history.push('/subjects')
    }
  }, [user])

  return (
    <>
      <h1> {russianText.header} </h1>
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true
        }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!'
            }
          ]}
        >
          <Input placeholder={russianText.login} prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!'
            }
          ]}
        >
          <Input.Password
            placeholder={russianText.password}
            prefix={<LockOutlined />}
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <SubmitButton type="primary" htmlType="submit" size="large">
            {russianText.submit}
          </SubmitButton>
        </Form.Item>
      </Form>
    </>
  )
}

export default withHelmet([{ tag: 'title', content: 'Login' }])(
  withLoginLayout(Login)
)

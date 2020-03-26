import React, { useState, useCallback } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import { Table, Button, Divider } from 'antd'

import CreateForm from '../../components/CreateForm'
import DefaultStyledContainer from '../../components/DefaultStyledContainer'
import showConfirm from '../../components/DeleteFromTableFunc'

import randomInRange from '../../utils'
import styled from 'styled-components'

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
`
const GET_USERS = gql`
  query getUsers {
    users {
      id
      username
      firstName
      lastName
      name
      parentEmail
      birthDate
      role
    }
  }
`

const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`

const ADD_USER = gql`
  mutation addUser($input: UserInput) {
    addUser(input: $input) {
      id
      username
      firstName
      lastName
      name
      parentEmail
      birthDate
      role
    }
  }
`

export default function Users() {
  const [addUser] = useMutation(ADD_USER, {
    update(cache, { data: { addUser: user } }) {
      const { users } = cache.readQuery({ query: GET_USERS })
      console.log('trying to update cache', user.id, users)
      cache.writeQuery({
        query: GET_USERS,
        data: { users: users.concat([user]) }
      })
    }
  })

  const [deleteUser] = useMutation(DELETE_USER, {
    update(cache, { data: { deleteUser: id } }) {
      const { users } = cache.readQuery({ query: GET_USERS })
      cache.writeQuery({
        query: GET_USERS,
        data: {
          users: users.filter(user => user.id !== id)
        }
      })
    }
  })

  const { data, loading, error } = useQuery(GET_USERS)

  const [modalVisible, setModalVisible] = useState(false)
  const [importModalVisible, setImportVisible] = useState(false)
  const [formRef, setFormRef] = useState(null)
  const [newUser, setNewUser] = useState(null)

  const saveFormRef = useCallback(node => {
    if (node !== null) {
      setFormRef(node)
    }
  }, [])

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: 200
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 175
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 100
    },
    {
      title: 'Wupai',
      dataIndex: 'wupai',
      key: 'wupai',
      width: 75,
      render: text => <div style={{ textAlign: 'center' }}> {text} </div>
    },
    {
      title: 'Action',
      key: 'action',
      width: 200,
      render: (text, item) => (
        <span>
          <Link to={`/users/${item.id}`}>
            <Button> Edit </Button>
          </Link>
          <Divider type="vertical" />
          <Button
            type="danger"
            onClick={() => {
              showConfirm(() => {
                deleteUser({ variables: { id: item.id } })
              })
            }}
          >
            Delete
          </Button>
        </span>
      )
    }
  ]

  const handleFields = () => {
    const fields = [
      {
        key: 'firstName',
        label: 'FirstName'
      },
      {
        key: 'lastName',
        label: 'LastName'
      },
      {
        key: 'parentEmail',
        label: 'Parent email'
      },
      {
        key: 'birthDate',
        label: 'Birthdate',
        inputType: 'date'
      },
      {
        key: 'role',
        label: 'User Role',
        options: [
          { value: 'admin', label: 'Admin' },
          { value: 'reviewer', label: 'Reviewer' },
          { value: 'teacher', label: 'Teacher' },
          { value: 'schoolAdmin', label: 'School Admin' },
          { value: 'schoolUser', label: 'School User' },
          { value: 'contentManager', label: 'Content Manager' }
        ]
      }
    ]
    return fields
  }

  const showModal = () => {
    setModalVisible(true)
  }

  const handleCancel = () => {
    setModalVisible(false)
    setImportVisible(false)
  }
  const showImportUsersModal = () => {
    setImportVisible(true)
  }
  const handleCreateStudents = async students => {
    try {
      const failedEmails = []
      const newData = await Promise.all(
        students.map(
          item =>
            new Promise(resolve => {
              this.props.createUser(item).then(data => {
                if (data) {
                  return resolve(data.username)
                }
                failedEmails.push(item.parentEmail)
                return resolve(null)
              })
            })
        )
      )
      this.setState({ failedEmails, isFinishedImport: true })
      return newData
    } catch (err) {
      /* eslint-disable-next-line */
      console.log('err: ', err)
    }
    return null
  }

  const handleCreate = () => {
    formRef.validateFields((err, values) => {
      if (err) {
        return
      }
      const editedValues = {
        ...values,
        password:
          `${values.firstName}${values.lastName}`
            .replace(/ /g, '')
            .toLowerCase()
            .split('@')[0] + randomInRange(100, 999),
        username: `${values.firstName}${values.lastName}`
          .replace(/ /g, '')
          .toLowerCase()
      }
      addUser({ variables: { input: editedValues } })
      formRef.resertFields()
      setNewUser({
        password: editedValues.password,
        username: editedValues.username,
        result: 'User created'
      })
    })
  }
  if (loading) return <div>Loading</div>
  if (error) return <p>ERROR</p>

  return (
    <DefaultStyledContainer>
      <Table
        dataSource={
          data && data.users
            ? data.users.map(user => {
                return { ...user, key: user.id }
              })
            : []
        }
        columns={columns}
        title={() => (
          <div>
            <Button onClick={showModal}>Add new User</Button>
            <Button
              onClick={showImportUsersModal}
              style={{ marginLeft: '8px' }}
            >
              Import from CSV
            </Button>
          </div>
        )}
      />

      <CreateForm
        title="Add new User"
        ref={saveFormRef}
        visible={modalVisible}
        onCancel={handleCancel}
        onCreate={handleCreate}
        fields={handleFields()}
        dataToDisplay={newUser}
      />
    </DefaultStyledContainer>
  )
}

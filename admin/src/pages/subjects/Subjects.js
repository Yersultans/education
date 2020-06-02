import React, { useState, useCallback } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import { Table, Button, Divider, Spin } from 'antd'

import CreateForm from '../../components/CreateForm'
import DefaultStyledContainer from '../../components/DefaultStyledContainer'
import showConfirm from '../../components/DeleteFromTableFunc'

const GET_SUBJECTS = gql`
  query getSubjects {
    subjects {
      id
      name
      language
    }
  }
`

const DELETE_SUBJECT = gql`
  mutation deleteSubject($id: ID!) {
    deleteSubject(id: $id)
  }
`

const ADD_SUBJECT = gql`
  mutation addSubject($input: SubjectInput) {
    addSubject(input: $input) {
      id
      name
      language
    }
  }
`

export default function Subjects() {
  const [modalVisible, setModalVisible] = useState(false)
  const [formRef, setFormRef] = useState(null)

  const [addSubject] = useMutation(ADD_SUBJECT, {
    update(cache, { data: { addSubject: subject } }) {
      const { subjects } = cache.readQuery({ query: GET_SUBJECTS })
      cache.writeQuery({
        query: GET_SUBJECTS,
        data: { subjects: subjects.concat([subject]) }
      })
    }
  })

  const [deleteSubject] = useMutation(DELETE_SUBJECT, {
    update(cache, { data: { deleteSubject: id } }) {
      const { subjects } = cache.readQuery({ query: GET_SUBJECTS })
      cache.writeQuery({
        query: GET_SUBJECTS,
        data: {
          subjects: subjects.filter(subject => subject.id !== id)
        }
      })
    }
  })

  const saveFormRef = useCallback(node => {
    if (node !== null) {
      setFormRef(node)
    }
  }, [])

  const { data, loading, error } = useQuery(GET_SUBJECTS)

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Язык',
      dataIndex: 'language',
      key: 'language'
    },
    {
      title: 'Действие',
      key: 'action',
      width: 200,
      render: (text, item) => (
        <span>
          <Link to={`/subjects/${item.id}`}>
            <Button> Редактировать </Button>
          </Link>
          <Divider type="vertical" />
          <Button
            type="danger"
            onClick={() => {
              showConfirm(() => {
                deleteSubject({ variables: { id: item.id } })
              })
            }}
          >
            Удалить
          </Button>
        </span>
      )
    }
  ]

  const handleFields = () => {
    const fields = [
      {
        key: 'name',
        label: 'Название'
      },
      {
        key: 'imageUrl',
        label: 'imageUrl'
      },
      {
        key: 'language',
        label: 'Язык',
        type: 'select',
        options: [
          {
            value: 'kazakh',
            label: 'kazakh'
          },
          {
            value: 'russian',
            label: 'russian'
          }
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
  }

  const handleCreate = () => {
    formRef.validateFields((err, values) => {
      if (err) {
        return
      }

      addSubject({
        variables: {
          input: values
        }
      })

      formRef.resetFields()
      setModalVisible(false)
    })
  }

  if (loading)
    return (
      <div>
        <Spin />
      </div>
    )
  if (error) return <p>ERROR</p>

  return (
    <DefaultStyledContainer>
      <Table
        dataSource={
          data && data.subjects
            ? data.subjects.map(subject => {
                return { ...subject, key: subject.id }
              })
            : []
        }
        columns={columns}
        title={() => (
          <div>
            <Button onClick={showModal}>Добавить новый Предмет</Button>
          </div>
        )}
      />

      <CreateForm
        title="Добавить новый Предмет"
        ref={saveFormRef}
        visible={modalVisible}
        onCancel={handleCancel}
        onCreate={handleCreate}
        fields={handleFields()}
      />
    </DefaultStyledContainer>
  )
}

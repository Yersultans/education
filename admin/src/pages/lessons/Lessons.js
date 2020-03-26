import React, { useState, useCallback } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import { Table, Button, Divider } from 'antd'

import CreateForm from '../../components/CreateForm'
import DefaultStyledContainer from '../../components/DefaultStyledContainer'
import showConfirm from '../../components/DeleteFromTableFunc'

const GET_LESSONS = gql`
  query getLessons {
    lessons {
      id
      name
      content
      imageUrl
      language
      subject {
        id
        name
      }
    }
  }
`

const GET_DATA = gql`
  query getData {
    lessons {
      id
      name
      content
      imageUrl
      language
      subject {
        id
        name
      }
    }
    subjects {
      id
      name
    }
  }
`

const DELETE_LESSON = gql`
  mutation deleteLesson($id: ID!) {
    deleteLesson(id: $id)
  }
`
const ADD_LESSON = gql`
  mutation addLesson($input: LessonInput) {
    addLesson(input: $input) {
      id
      name
      content
      imageUrl
      language
      subject {
        id
        name
      }
    }
  }
`
export default function Lessons() {
  const [modalVisible, setModalVisible] = useState(false)
  const [formRef, setFormRef] = useState(null)

  const [addLesson] = useMutation(ADD_LESSON, {
    update(cache, { data: { addLesson: lesson } }) {
      const { lessons } = cache.readQuery({ query: GET_LESSONS })
      cache.writeQuery({
        query: GET_LESSONS,
        data: { lessons: lessons.concat([lesson]) }
      })
    }
  })

  const [deleteLesson] = useMutation(DELETE_LESSON, {
    update(cache, { data: { deleteLesson: id } }) {
      const { lessons } = cache.readQuery({ query: GET_LESSONS })
      cache.writeQuery({
        query: GET_LESSONS,
        data: {
          lessons: lessons.filter(lesson => lesson.id !== id)
        }
      })
    }
  })

  const saveFormRef = useCallback(node => {
    if (node !== null) {
      setFormRef(node)
    }
  }, [])

  const { data, loading, error } = useQuery(GET_DATA)

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language'
    },
    {
      title: 'Action',
      key: 'action',
      width: 200,
      render: (text, item) => (
        <span>
          <Link to={`/lessons/${item.id}`}>
            <Button> Edit </Button>
          </Link>
          <Divider type="vertical" />
          <Button
            type="danger"
            onClick={() => {
              showConfirm(() => {
                deleteLesson({ variables: { id: item.id } })
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
        key: 'name',
        label: 'name'
      },
      {
        key: 'imageUrl',
        label: 'imageUrl'
      },
      {
        key: 'language',
        label: 'language',
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
      },
      {
        key: 'subject',
        label: 'subject',
        type: 'select',
        options:
          data && data.subjects
            ? data.subjects.map(subject => ({
                label: subject.name,
                value: subject.id
              }))
            : '',
        isMultipleSelection: false
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

      addLesson({
        variables: {
          input: values
        }
      })

      formRef.resetFields()
      setModalVisible(false)
    })
  }

  if (loading) return <div>Loading</div>
  if (error) return <p>ERROR</p>

  return (
    <DefaultStyledContainer>
      <Table
        dataSource={
          data && data.lessons
            ? data.lessons.map(lesson => {
                return { ...lesson, key: lesson.id }
              })
            : []
        }
        columns={columns}
        title={() => (
          <div>
            <Button onClick={showModal}>Add new Lesson</Button>
          </div>
        )}
      />

      <CreateForm
        title="Add new Lesson"
        ref={saveFormRef}
        visible={modalVisible}
        onCancel={handleCancel}
        onCreate={handleCreate}
        fields={handleFields()}
      />
    </DefaultStyledContainer>
  )
}

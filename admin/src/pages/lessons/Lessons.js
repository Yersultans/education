import React, { useState, useCallback } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import { Table, Button, Divider, Modal, Spin } from 'antd'

import CreateForm from '../../components/CreateForm'
import DefaultStyledContainer from '../../components/DefaultStyledContainer'
import showConfirm from '../../components/DeleteFromTableFunc'
import Lesson from './Lesson'

const GET_LESSONS = gql`
  query getLessons($id: ID!) {
    subject(id: $id) {
      id
      lessons {
        id
        name
        language
      }
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
      language
    }
  }
`
const UPDATE_SUBJECT = gql`
  mutation updateSubject($id: ID!, $input: SubjectInput) {
    updateSubject(id: $id, input: $input) {
      id
      lessons {
        id
        name
        language
      }
    }
  }
`
const UPDATE_LESSON = gql`
  mutation updateLesson($id: ID!, $input: LessonInput) {
    updateLesson(id: $id, input: $input) {
      id
      name
      language
    }
  }
`
export default function Lessons(props) {
  const { subjectId } = props
  const [modalVisible, setModalVisible] = useState(false)
  const [formRef, setFormRef] = useState(null)
  const [editingLesson, setEditingLesson] = useState(null)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [updateSubject] = useMutation(UPDATE_SUBJECT)
  const [updateLesson] = useMutation(UPDATE_LESSON)

  const [addLesson] = useMutation(ADD_LESSON, {
    update(cache, { data: { addLesson: lesson } }) {
      let { subject } = cache.readQuery({
        query: GET_LESSONS,
        variables: { id: subjectId }
      })
      subject = {
        id: subject.id,
        lessons: subject.lessons ? subject.lessons.concat([lesson]) : [lesson]
      }
      const lessons =
        subject && subject.lessons
          ? subject.lessons.map(dataLesson => dataLesson.id)
          : []
      updateSubject({ variables: { id: subjectId, input: { lessons } } })
      cache.writeQuery({
        query: GET_LESSONS,
        variables: { id: subjectId },
        data: { subject }
      })
    }
  })

  const [deleteLesson] = useMutation(DELETE_LESSON, {
    update(cache, { data: { deleteLesson: id } }) {
      let { subject } = cache.readQuery({
        query: GET_LESSONS,
        variables: { id: subjectId }
      })
      subject = {
        id: subject.id,
        lessons: subject.lessons.filter(nLesson => nLesson.id !== id)
      }
      const lessons =
        subject && subject.lessons
          ? subject.lessons.map(dataLesson => dataLesson.id)
          : []

      updateSubject({ variables: { id: subjectId, input: { lessons } } })
      cache.writeQuery({
        query: GET_LESSONS,
        variables: { id: subjectId },
        data: {
          subject
        }
      })
    }
  })

  const saveFormRef = useCallback(node => {
    if (node !== null) {
      setFormRef(node)
    }
  }, [])

  const handleLessonEdit = (state, editLesson) => {
    setEditModalVisible(state)
    setEditingLesson(editLesson)
  }

  const { data, loading, error } = useQuery(GET_LESSONS, {
    variables: { id: subjectId }
  })

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
          <Button onClick={() => handleLessonEdit(true, item)}>
            {' '}
            Редактировать{' '}
          </Button>
          <Divider type="vertical" />
          <Button
            type="danger"
            onClick={() => {
              showConfirm(() => {
                deleteLesson({ variables: { id: item.id } })
              })
            }}
          >
            Удалить
          </Button>
        </span>
      )
    }
  ]

  const handleUpdateClick = async () => {
    const { id } = editingLesson
    updateLesson({ variables: { id, input: editingLesson } })
  }

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

      addLesson({
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
          data && data.subject && data.subject.lessons
            ? data.subject.lessons.map(lesson => {
                return { ...lesson, key: lesson.id }
              })
            : []
        }
        columns={columns}
        title={() => (
          <div>
            <Button onClick={showModal}>Добавить новый Урок</Button>
          </div>
        )}
      />

      <CreateForm
        title="Добавить новый Урок"
        ref={saveFormRef}
        visible={modalVisible}
        onCancel={handleCancel}
        onCreate={handleCreate}
        fields={handleFields()}
      />
      {editingLesson && (
        <Modal
          visible={editModalVisible}
          onCancel={() => handleLessonEdit(false, null)}
          onOk={handleUpdateClick}
          footer={null}
        >
          <Lesson lessonId={editingLesson.id} />
        </Modal>
      )}
    </DefaultStyledContainer>
  )
}

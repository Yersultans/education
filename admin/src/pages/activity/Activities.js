import React, { useState, useCallback } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Table, Button, Divider, Modal, Spin } from 'antd'

// import CreateForm from '../../components/CreateForm'
import DefaultStyledContainer from '../../components/DefaultStyledContainer'
import showConfirm from '../../components/DeleteFromTableFunc'
import Activity from './Activity'

const GET_ACTIVITIES = gql`
  query getActivities($id: ID!) {
    lesson(id: $id) {
      id
      activities {
        id
        name
        language
      }
    }
  }
`
const DELETE_ACTIVITY = gql`
  mutation deleteActivity($id: ID!) {
    deleteActivity(id: $id)
  }
`
const ADD_ACTIVITY = gql`
  mutation addActivity($input: ActivityInput) {
    addActivity(input: $input) {
      id
      name
      language
    }
  }
`
const UPDATE_LESSON = gql`
  mutation updateLesson($id: ID!, $input: LessonInput) {
    updateLesson(id: $id, input: $input) {
      id
      activities {
        id
        name
        language
      }
    }
  }
`
const UPDATE_ACTIVITY = gql`
  mutation updateActivity($id: ID!, $input: ActivityInput) {
    updateActivity(id: $id, input: $input) {
      id
      name
      language
    }
  }
`
export default function Activities(props) {
  const { lessonId } = props
  const [modalVisible, setModalVisible] = useState(false)
  const [formRef, setFormRef] = useState(null)
  const [editingActivity, setEditingActivity] = useState(null)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [updateLesson] = useMutation(UPDATE_LESSON)
  const [updateActivity] = useMutation(UPDATE_ACTIVITY)

  const [addActivity] = useMutation(ADD_ACTIVITY, {
    update(cache, { data: { addActivity: activity } }) {
      let { lesson } = cache.readQuery({
        query: GET_ACTIVITIES,
        variables: { id: lessonId }
      })
      lesson = {
        id: lesson.id,
        activities: lesson.activities
          ? lesson.activities.concat([activity])
          : [activity]
      }
      const activities =
        lesson && lesson.activities
          ? lesson.activities.map(dataActivity => dataActivity.id)
          : []
      updateLesson({ variables: { id: lessonId, input: { activities } } })
      cache.writeQuery({
        query: GET_ACTIVITIES,
        variables: { id: lessonId },
        data: { lesson }
      })
    }
  })
  const [deleteActivity] = useMutation(DELETE_ACTIVITY, {
    update(cache, { data: { deleteActivity: id } }) {
      let { lesson } = cache.readQuery({
        query: GET_ACTIVITIES,
        variables: { id: lessonId }
      })
      lesson = {
        id: lesson.id,
        activities: lesson.activities.filter(nActivity => nActivity.id !== id)
      }
      const activities =
        lesson && lesson.activities
          ? lesson.activities.map(dataActivity => dataActivity.id)
          : []

      updateLesson({ variables: { id: lessonId, input: { activities } } })
      cache.writeQuery({
        query: GET_ACTIVITIES,
        variables: { id: lessonId },
        data: {
          lesson
        }
      })
    }
  })

  const saveFormRef = useCallback(node => {
    if (node !== null) {
      setFormRef(node)
    }
  }, [])

  const handleActivityEdit = (state, editActivity) => {
    setEditModalVisible(state)
    setEditingActivity(editActivity)
  }

  const { data, loading, error } = useQuery(GET_ACTIVITIES, {
    variables: { id: lessonId }
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
          <Button onClick={() => handleActivityEdit(true, item)}>
            {' '}
            Редактировать{' '}
          </Button>
          <Divider type="vertical" />
          <Button
            type="danger"
            onClick={() => {
              showConfirm(() => {
                deleteActivity({ variables: { id: item.id } })
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
    const { id } = editingActivity
    updateActivity({ variables: { id, input: editingActivity } })
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

      addActivity({
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
          data && data.lesson && data.lesson.activities
            ? data.lesson.activities.map(activity => {
                return { ...activity, key: activity.id }
              })
            : []
        }
        columns={columns}
        title={() => (
          <div>
            <Button onClick={showModal}>Добавить новый Раздел</Button>
          </div>
        )}
      />

      {/* <CreateForm
        title="Добавить новый Раздел"
        ref={saveFormRef}
        visible={modalVisible}
        onCancel={handleCancel}
        onCreate={handleCreate}
        fields={handleFields()}
      /> */}
      {editingActivity && (
        <Modal
          visible={editModalVisible}
          onCancel={() => handleActivityEdit(false, null)}
          onOk={handleUpdateClick}
          footer={null}
        >
          <Activity activityId={editingActivity.id} />
        </Modal>
      )}
    </DefaultStyledContainer>
  )
}

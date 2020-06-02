import React, { useState } from 'react'
import styled from 'styled-components'
import { useQuery, useMutation, gql } from '@apollo/client'
import EditComponent from '../../components/EditComponent'
import { Tabs, Icon, Spin } from 'antd'
import Activities from '../activity/Activities'

import DefaultStyledContainer from '../../components/DefaultStyledContainer'

const { TabPane } = Tabs

const GET_LESSON = gql`
  query getLesson($id: ID!) {
    lesson(id: $id) {
      id
      name
      content
      imageUrl
      language
      videoUrl
      subject {
        id
        name
      }
    }
  }
`

const UPDATE_LESSON = gql`
  mutation updateLesson($id: ID!, $input: LessonInput) {
    updateLesson(id: $id, input: $input) {
      id
      name
      content
      imageUrl
      language
      videoUrl
      subject {
        id
        name
      }
    }
  }
`
export default function Lesson(props) {
  const { lessonId: id } = props

  const [currentTab, setCurrentTab] = useState('1')

  const [updateLesson] = useMutation(UPDATE_LESSON)

  const { data, loading, error } = useQuery(GET_LESSON, { variables: { id } })

  if (loading)
    return (
      <div>
        <Spin />
      </div>
    )
  if (error) return <div>ERROR</div>

  const fields = [
    {
      key: 'name',
      label: 'Название',
      value: data && data.lesson ? data.lesson.name : '',
      isRequired: true
    },
    {
      key: 'content',
      label: 'Контент',
      value: data && data.lesson ? data.lesson.content : '',
      type: 'text'
    },
    {
      key: 'imageUrl',
      label: 'ImageUrl',
      value: data && data.lesson ? data.lesson.imageUrl : '',
      isRequired: true
    },
    {
      key: 'videoUrl',
      label: 'VideoUrl',
      value: data && data.lesson ? data.lesson.videoUrl : '',
      isRequired: true
    },
    {
      key: 'language',
      label: 'Язык',
      value: data && data.lesson ? data.lesson.language : '',
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

  const handleUpdateClick = values => {
    updateLesson({ variables: { id, input: values } })
  }

  const handleTabChange = activeKey => {
    setCurrentTab(activeKey)
  }

  return (
    <DefaultStyledContainer>
      <Tabs activityKey={currentTab} onChange={handleTabChange}>
        <TabPane
          tab={
            <span>
              <Icon type="project" />
              Урок
            </span>
          }
          key="1"
        >
          <EditComponent fields={fields} onUpdateClick={handleUpdateClick} />
        </TabPane>
        <TabPane
          key="2"
          tab={
            <span>
              <Icon type="book" />
              Разделы
            </span>
          }
        >
          <Activities lessonId={id} />
        </TabPane>
      </Tabs>
    </DefaultStyledContainer>
  )
}

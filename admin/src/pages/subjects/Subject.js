import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Tabs, Spin } from 'antd'
import { useQuery, useMutation, gql } from '@apollo/client'
import { ProjectOutlined, BookOutlined } from '@ant-design/icons'

// import EditComponent from '../../components/EditComponent'

import Lessons from '../lessons/Lessons'

import DefaultStyledContainer from '../../components/DefaultStyledContainer'

const { TabPane } = Tabs

const GET_SUBJECT = gql`
  query getSubject($id: ID!) {
    subject(id: $id) {
      id
      name
      imageUrl
      language
      lessons {
        id
      }
    }
  }
`

const UPDATE_SUBJECT = gql`
  mutation updateSubject($id: ID!, $input: SubjectInput) {
    updateSubject(id: $id, input: $input) {
      id
      name
      imageUrl
      language
      lessons {
        id
      }
    }
  }
`

export default function Subject(props) {
  const { id } = props.match.params

  const [currentTab, setCurrentTab] = useState('1')

  const [updateSubject] = useMutation(UPDATE_SUBJECT)

  const { data, loading, error } = useQuery(GET_SUBJECT, { variables: { id } })

  if (loading)
    return (
      <div>
        <Spin />
      </div>
    )
  if (error) return <div>ERROR</div>

  const fields = [
    {
      key: 'Название',
      label: 'Subject Name',
      value: data && data.subject ? data.subject.name : '',
      isRequired: true
    },
    {
      key: 'imageUrl',
      label: 'Subject ImageUrl',
      value: data && data.subject ? data.subject.imageUrl : '',
      isRequired: true
    },
    {
      key: 'Язык',
      label: 'Subject Language',
      value: data && data.subject ? data.subject.language : '',
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
    updateSubject({ variables: { id, input: values } })
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
              <ProjectOutlined />
              Предмет
            </span>
          }
          key="1"
        >
          {/* <EditComponent fields={fields} onUpdateClick={handleUpdateClick} /> */}
        </TabPane>
        <TabPane
          key="2"
          tab={
            <span>
              <BookOutlined />
              Уроки
            </span>
          }
        >
          <Lessons subjectId={id} />
        </TabPane>
      </Tabs>
    </DefaultStyledContainer>
  )
}

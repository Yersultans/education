import React from 'react'
import styled from 'styled-components'
import { useQuery, useMutation, gql } from '@apollo/client'
import EditComponent from '../../components/EditComponent'

import DefaultStyledContainer from '../../components/DefaultStyledContainer'

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

  const [updateLesson] = useMutation(UPDATE_LESSON)

  const { data, loading, error } = useQuery(GET_LESSON, { variables: { id } })

  if (loading) return <div>loading</div>
  if (error) return <div>ERROR</div>

  const fields = [
    {
      key: 'name',
      label: 'Lesson Name',
      value: data && data.lesson ? data.lesson.name : '',
      isRequired: true
    },
    {
      key: 'content',
      label: 'Lesson Content',
      value: data && data.lesson ? data.lesson.content : '',
      type: 'text'
    },
    {
      key: 'imageUrl',
      label: 'Lesson ImageUrl',
      value: data && data.lesson ? data.lesson.imageUrl : '',
      isRequired: true
    },
    {
      key: 'videoUrl',
      label: 'Lesson VideoUrl',
      value: data && data.lesson ? data.lesson.videoUrl : '',
      isRequired: true
    },
    {
      key: 'language',
      label: 'Lesson Language',
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

  return (
    <DefaultStyledContainer>
      <EditComponent fields={fields} onUpdateClick={handleUpdateClick} />
    </DefaultStyledContainer>
  )
}

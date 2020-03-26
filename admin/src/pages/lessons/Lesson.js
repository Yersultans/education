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
      subject {
        id
        name
      }
    }
  }
`
const GET_DATA = gql`
  query getData($id: ID!) {
    lesson(id: $id) {
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

const UPDATE_LESSON = gql`
  mutation deleteLesson($id: ID!, $input: LessonInput) {
    updateLesson(id: $id, input: $input) {
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
export default function Lesson(props) {
  const { id } = props.match.params

  const [updateLesson] = useMutation(UPDATE_LESSON)

  const { data, loading, error } = useQuery(GET_DATA, { variables: { id } })

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
    },
    {
      key: 'subject',
      label: 'subject',
      type: 'select',
      value:
        data && data.lesson && data.lesson.subject
          ? data.lesson.subject.id
          : '',
      options:
        data && data.subjects
          ? data.subjects.map(subject => ({
              label: subject.name,
              value: subject.id
            }))
          : [],
      isMultipleSelection: false
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

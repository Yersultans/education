import React from 'react'
import styled from 'styled-components'
import { useQuery, useMutation, gql } from '@apollo/client'
import EditComponent from '../../components/EditComponent'

import DefaultStyledContainer from '../../components/DefaultStyledContainer'

const GET_SUBJECT = gql`
  query getSubject($id: ID!) {
    subject(id: $id) {
      id
      name
      imageUrl
      language
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
    }
  }
`

export default function Subject(props) {
  const { id } = props.match.params

  const [updateSubject] = useMutation(UPDATE_SUBJECT)

  const { data, loading, error } = useQuery(GET_SUBJECT, { variables: { id } })

  if (loading) return <div>loading</div>
  if (error) return <div>ERROR</div>

  const fields = [
    {
      key: 'name',
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
      key: 'language',
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

  return (
    <DefaultStyledContainer>
      <EditComponent fields={fields} onUpdateClick={handleUpdateClick} />
    </DefaultStyledContainer>
  )
}

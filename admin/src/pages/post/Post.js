import React from 'react'
import styled from 'styled-components'
import { useQuery, useMutation, gql } from '@apollo/client'
import EditComponent from '../../components/EditComponent'

import DefaultStyledContainer from '../../components/DefaultStyledContainer'

const GET_POST = gql`
  query getPost($id: ID!) {
    post(id: $id) {
      id
      name
      imageUrl
      content
      user {
        id
      }
    }
  }
`

const UPDATE_POST = gql`
  mutation updatePost($id: ID!, $input: PostInput) {
    updatePost(id: $id, input: $input) {
      id
      name
      imageUrl
      content
      user {
        id
      }
    }
  }
`
export default function Post(props) {
  const { id } = props.match.params

  const [updatePost] = useMutation(UPDATE_POST)

  const { data, loading, error } = useQuery(GET_POST, { variables: { id } })

  if (loading) return <div>loading</div>
  if (error) return <div>ERROR</div>

  const fields = [
    {
      key: 'name',
      label: 'Post Name',
      value: data && data.post ? data.post.name : '',
      isRequired: true
    },
    {
      key: 'imageUrl',
      label: 'Post ImageUrl',
      value: data && data.post ? data.post.imageUrl : '',
      isRequired: true
    },
    {
      key: 'content',
      label: 'Post Content',
      value: data && data.post ? data.post.content : '',
      type: 'text',
      isRequired: true
    }
  ]
  const handleUpdateClick = values => {
    updatePost({ variables: { id, input: values } })
  }

  return (
    <DefaultStyledContainer>
      <EditComponent fields={fields} onUpdateClick={handleUpdateClick} />
    </DefaultStyledContainer>
  )
}
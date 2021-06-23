import React from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
// import EditComponent from '../../components/EditComponent'
import { Spin } from 'antd'

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

  // const [updatePost] = useMutation(UPDATE_POST)

  const { data, loading, error } = useQuery(GET_POST, { variables: { id } })

  if (loading)
    return (
      <div>
        <Spin />
      </div>
    )
  if (error) return <div>ERROR</div>

  return (
    <DefaultStyledContainer>
      {/* <EditComponent fields={fields} onUpdateClick={handleUpdateClick} /> */}
    </DefaultStyledContainer>
  )
}

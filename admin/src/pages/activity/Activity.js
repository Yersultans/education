import React from 'react'
import styled from 'styled-components'
import { useQuery, useMutation, gql } from '@apollo/client'
// import EditComponent from '../../components/EditComponent'

import DefaultStyledContainer from '../../components/DefaultStyledContainer'
import { Spin } from 'antd'

const GET_ACTIVITY = gql`
  query getActivity($id: ID!) {
    activity(id: $id) {
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

const UPDATE_ACTIVITY = gql`
  mutation updateActivity($id: ID!, $input: ActivityInput) {
    updateActivity(id: $id, input: $input) {
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
export default function Activity(props) {
  const { activityId: id } = props

  const [updateActivity] = useMutation(UPDATE_ACTIVITY)

  const { data, loading, error } = useQuery(GET_ACTIVITY, { variables: { id } })

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
      value: data && data.activity ? data.activity.name : '',
      isRequired: true
    },
    {
      key: 'content',
      label: 'Контент',
      value: data && data.activity ? data.activity.content : '',
      type: 'text'
    },
    {
      key: 'imageUrl',
      label: 'ImageUrl',
      value: data && data.activity ? data.activity.imageUrl : '',
      isRequired: true
    },
    {
      key: 'videoUrl',
      label: 'VideoUrl',
      value: data && data.activity ? data.activity.videoUrl : '',
      isRequired: true
    },
    {
      key: 'language',
      label: 'Язык',
      value: data && data.activity ? data.activity.language : '',
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
    updateActivity({ variables: { id, input: values } })
  }

  return (
    <DefaultStyledContainer>
      {/* <EditComponent fields={fields} onUpdateClick={handleUpdateClick} /> */}
    </DefaultStyledContainer>
  )
}

import React from 'react'
import styled from 'styled-components'
import { useQuery, useMutation, gql } from '@apollo/client'
import EditComponent from '../../components/EditComponent'

const Container = styled.div`
  width: 90%;
  margin: 20px auto;
  background-color: transparent;
`
const GET_SCHOOLS = gql`
  query getSchools {
    schools {
      id
      name
    }
  }
`
const GET_USER = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      id
      username
      firstName
      lastName
      parentEmail
      birthDate
      role
      password
      school {
        id
        name
      }
    }
  }
`

const UPDATE_USER = gql`
  mutation updateUser($id: ID!, $input: UserInput) {
    updateUser(id: $id, input: $input) {
      id
      username
      firstName
      lastName
      parentEmail
      birthDate
      role
      password
      school {
        id
        name
      }
    }
  }
`

export default function User(props) {
  const { id } = props.match.params

  const [updateUser] = useMutation(UPDATE_USER)

  const { data: userData, loadingUser, errorUser } = useQuery(GET_USER, {
    variables: { id }
  })

  const { data: schoolsData, loadingSchools, errorSchools } = useQuery(
    GET_SCHOOLS
  )

  if (loadingUser || loadingSchools) return <div>Loading</div>
  if (errorUser || errorSchools) return <div>ERROR</div>

  console.log('user', userData)
  const fields = [
    {
      key: 'username',
      label: 'User Name',
      value: userData && userData.user ? userData.user.username : '',
      isRequired: true
    },
    {
      key: 'firstName',
      label: 'User FirstName',
      value: userData && userData.user ? userData.user.firstName : '',
      isRequired: true
    },
    {
      key: 'lastName',
      label: 'User LastName',
      value: userData && userData.user ? userData.user.lastName : '',
      isRequired: true
    },
    {
      key: 'parentEmail',
      label: 'Parent Email',
      value: userData && userData.user ? userData.user.parentEmail : '',
      isRequired: true
    },
    {
      key: 'birthDate',
      label: 'User BirthDate',
      type: 'datePicker',
      dateString: userData && userData.user ? userData.user.birthDate : '',
      isRequired: true
    },
    {
      key: 'password',
      label: 'User Password',
      value: userData && userData.user ? userData.user.password : '',
      isRequired: true
    },
    {
      key: 'school',
      label: 'User School',
      value:
        userData && userData.user && userData.user.school
          ? userData.user.school.id
          : '',
      type: 'select',
      options:
        schoolsData && schoolsData.schools
          ? schoolsData.schools.map(school => ({
              label: school.name,
              value: school.id
            }))
          : [],
      isMultipleSelection: false
    },
    {
      key: 'role',
      label: 'User Role',
      value: userData && userData.user ? userData.user.role : '',
      type: 'select',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'reviewer', label: 'Reviewer' },
        { value: 'teacher', label: 'Teacher' },
        { value: 'schoolAdmin', label: 'School Admin' },
        { value: 'schoolUser', label: 'School User' },
        { value: 'contentManager', label: 'Content Manager' }
      ]
    }
  ]

  const handleUpdateClick = values => {
    updateUser({ variables: { id, input: values } })
  }

  return (
    <Container>
      <EditComponent fields={fields} onUpdateClick={handleUpdateClick} />
    </Container>
  )
}

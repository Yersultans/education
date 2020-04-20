import React, { useState, useCallback } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Button, Divider, Table } from 'antd'
import { Link } from 'react-router-dom'
import DefaultStyledContainer from '../../components/DefaultStyledContainer'
import showConfirm from '../../components/DeleteFromTableFunc'

const GET_DATA = gql`
  query Question {
    questions {
      id
      text
      correctAnswers
      options
      language
      subject {
        id
      }
      lesson {
        id
      }
    }
  }
`

const GET_QUESTIONS = gql`
  query questions {
    questions {
      id
      text
      correctAnswers
      options
      language
      subject {
        id
      }
      lesson {
        id
      }
    }
  }
`
const DELETE_QUESTION = gql`
  mutation deleteQuestion($id: ID!) {
    deleteQuestion(id: $id)
  }
`

export default function Questions() {
  const { data, loading, error } = useQuery(GET_DATA)

  const [deleteQuestion] = useMutation(DELETE_QUESTION, {
    update(cache, { data: { deleteQuestion: id } }) {
      const { questions } = cache.readQuery({ query: GET_QUESTIONS })
      cache.writeQuery({
        query: GET_QUESTIONS,
        data: {
          questions: questions.filter(question => question.id !== id)
        }
      })
    }
  })

  const columns = [
    {
      title: 'Question',
      dataIndex: 'text',
      key: 'text'
    },
    {
      title: 'Options',
      dataIndex: 'options',
      key: 'options',
      inputType: 'dynamic'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, item) => (
        <span>
          <Link to={`/questions/${item.id}`}>
            <Button> Edit </Button>
          </Link>
          <Divider type="vertical" />
          <Button
            type="danger"
            onClick={() => {
              showConfirm(() => {
                deleteQuestion({ variables: { id: item.id } })
              })
            }}
          >
            Delete
          </Button>
        </span>
      )
    }
  ]

  if (loading) return <div> Loading </div>
  if (error) return <div> Error </div>

  return (
    <DefaultStyledContainer>
      <Table
        rowKey={row => row.id}
        dataSource={
          data && data.questions
            ? data.questions.map(question => {
                return { ...question, key: question.id }
              })
            : []
        }
        columns={columns}
        title={() => (
          <>
            <Link to="/addQuestion">
              <Button>Add new NQuestion</Button>
            </Link>
          </>
        )}
      />
    </DefaultStyledContainer>
  )
}

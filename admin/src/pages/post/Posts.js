import React from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import { Table, Button, Divider } from 'antd'

import Loading from '../shared/Loading'
import DefaultStyledContainer from '../../components/DefaultStyledContainer'
import showConfirm from '../../components/DeleteFromTableFunc'
import withMainLayout from '../../hocs/withMainLayout'

const GET_CURRENT_USER = gql`
  query getCurrentUser {
    getCurrentUser {
      id
    }
  }
`

const GET_POSTS = gql`
  query getPosts {
    posts {
      id
      name
      user {
        id
        username
      }
    }
  }
`

const DELETE_POST = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id)
  }
`

const ADD_POST = gql`
  mutation addPost($input: PostInput) {
    addPost(input: $input) {
      id
      name
      user {
        id
        name
      }
    }
  }
`

function Posts() {
  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { addPost: post } }) {
      const { posts } = cache.readQuery({ query: GET_POSTS })
      cache.writeQuery({
        query: GET_POSTS,
        data: { posts: posts.concat([post]) }
      })
    }
  })

  const [deletePost] = useMutation(DELETE_POST, {
    update(cache, { data: { deletePost: id } }) {
      const { posts } = cache.readQuery({ query: GET_POSTS })
      cache.writeQuery({
        query: GET_POSTS,
        data: {
          posts: posts.filter(post => post.id !== id)
        }
      })
    }
  })

  const { data, loading, error } = useQuery(GET_POSTS)

  const { data: dataCurrentUser, loadingUser, errorUser } = useQuery(
    GET_CURRENT_USER
  )

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'пользователь',
      dataIndex: 'user.username',
      key: 'user.username'
    },
    {
      title: 'Действие',
      key: 'action',
      width: 200,
      render: (text, item) => (
        <span>
          <Link to={`/posts/${item.id}`}>
            <Button> Редактировать </Button>
          </Link>
          <Divider type="vertical" />
          <Button
            type="danger"
            onClick={() => {
              showConfirm(() => {
                deletePost({ variables: { id: item.id } })
              })
            }}
          >
            Удалить
          </Button>
        </span>
      )
    }
  ]

  if (loading || loadingUser) return <Loading />

  return (
    <DefaultStyledContainer>
      <Table
        dataSource={
          data && data.posts
            ? data.posts.map(post => {
                return { ...post, key: post.id }
              })
            : []
        }
        columns={columns}
        title={() => (
          <div>
            <Button onClick={() => console.log('asd')}>
              Добавить новый Пост
            </Button>
          </div>
        )}
      />
    </DefaultStyledContainer>
  )
}
export default withMainLayout(Posts)

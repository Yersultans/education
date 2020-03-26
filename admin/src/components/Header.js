import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd'
import AuthContext from '../context/AuthContext'

const adminMenu = [
  { link: '/users', name: 'Users', icon: 'user' },
  { link: '/questions', name: 'Questions', icon: 'question-circle' },
  { link: '/subjects', name: 'Subjects', icon: 'cluster' },
  { link: '/lessons', name: 'Lessons', icon: 'book' }
]

const contentManagerMenu = [
  { link: '/questions', name: 'Questions', icon: 'question-circle' },
  { link: '/subjects', name: 'Subjects', icon: 'cluster' },
  { link: '/lessons', name: 'Lessons', icon: 'book' }
]

function Header(props) {
  const [current, setCurrent] = useState('')
  const { currentUser } = useContext(AuthContext)

  const handleClick = e => {
    setCurrent(e.key)
  }

  const renderContent = () => {
    if (currentUser) {
      return (
        <Menu
          onClick={handleClick}
          selectedKeys={[current]}
          mode="horizontal"
          theme="dark"
        >
          {currentUser.role === 'admin' &&
            adminMenu.map(item => (
              <Menu.Item key={item.name}>
                <Link to={item.link} key={item.link}>
                  <Icon type={item.icon} /> {item.name}
                </Link>
              </Menu.Item>
            ))}

          {currentUser.role === 'contentManager' &&
            contentManagerMenu.map(item => (
              <Menu.Item key={item.name}>
                <Link to={item.link} key={item.link}>
                  <Icon type={item.icon} /> {item.name}
                </Link>
              </Menu.Item>
            ))}

          <Menu.Item key="logout">
            <div onClick={props.logout}>
              <Icon type="logout" /> Log Out
            </div>
          </Menu.Item>
        </Menu>
      )
    }

    return (
      <a
        style={{
          height: 46,
          lineHeight: '46px',
          position: 'absolute',
          top: 0,
          right: 50
        }}
        href="/login"
      >
        <Icon type="login" /> Login
      </a>
    )
  }

  return <Layout.Header style={{ height: 46 }}>{renderContent()}</Layout.Header>
}

export default Header

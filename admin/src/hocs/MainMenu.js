import React from 'react'
import PropTypes from 'prop-types'
import { Link, useHistory } from 'react-router-dom'
import {
  StarOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { Menu } from 'antd'
import { useAuth } from '../context/useAuth'

function MainMenu({ currentUrl }) {
  const { user, logout } = useAuth()
  const history = useHistory()

  const adminMenu = [
    { link: '/subjects', name: 'Предметы', icon: BookOutlined },
    // { link: '/users', name: 'Пользователи', icon: TeamOutlined },
    { link: '/questions', name: 'Вопросы', icon: QuestionCircleOutlined },
    { link: '/posts', name: 'Посты', icon: StarOutlined }
  ]

  const onLogoutClick = () => {
    logout()
    history.push('/login')
  }

  if (user) {
    return (
      <Menu selectedKeys={[currentUrl]} mode="inline" theme="light">
        {user.role === 'admin' &&
          adminMenu.map(item => (
            <Menu.Item key={item.link} icon={<item.icon />}>
              <Link to={item.link} key={item.link}>
                {item.name}
              </Link>
            </Menu.Item>
          ))}
        <Menu.Item
          key="logout"
          icon={<LogoutOutlined />}
          onClick={onLogoutClick}
          danger
        >
          Выйти
        </Menu.Item>
      </Menu>
    )
  }
  return <React.Fragment />
}

MainMenu.propTypes = {
  currentUrl: PropTypes.string.isRequired
}

export default MainMenu

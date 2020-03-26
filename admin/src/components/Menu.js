import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Layout, Icon } from 'antd'
import AuthContext from '../context/AuthContext'
import Logo from '../images/logo.svg'

const MenuDiv = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 30vw;
  height: 100vh;
  display: flex;
  overflow: auto;
  flex-direction: column;
  align-self: flex-start;
`

const StyledImg = styled.img`
  align-self: center;
  margin-top: 16px;
`
const UserInfoDiv = styled.div`
  background-color: white;
  margin: 40px;
  padding: 25px;
  border-radius: 8px;
`
const StyledRoleText = styled.p``
const StyledName = styled.h3`
  font-weight: 200 !important;
  font-size: 20px;
  line-height: 24px;
  color: #333;
`
const TabText = styled.div`
  color: rgba(36, 45, 52, 0.5);
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  align-self: center;
  margin-left: 10px;
  margin-top: 1px;
  ${p =>
    p.selected &&
    `
    color: #1746DD;
  `}
`
const StyledTab = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-start;
  width: 70%;
  margin: 20px 50px 0 50px;
  padding: 10px;
  cursor: pointer;
  ${p =>
    p.selected &&
    `
    background: rgba(23, 70, 221, 0.1);
    border-radius: 8px;
  `};

  :hover {
    background: rgba(23, 70, 221, 0.1);
    border-radius: 8px;
  }
`
const LogOutTab = styled(StyledTab)`
  margin: auto 60px 50px 50px;
`
const links = [
  {
    label: 'Users',
    url: '/users',
    iconUrl: 'user',
    dot: false,
    allowedUsers: ['admin']
  },
  {
    label: 'Categories',
    url: '/categories',
    iconUrl: 'cluster',
    dot: false,
    allowedUsers: ['admin', 'contentManager']
  },
  {
    label: 'Skills',
    url: '/skills',
    iconUrl: 'tool',
    dot: false,
    allowedUsers: ['admin', 'contentManager']
  },
  {
    label: 'Global Hints',
    url: '/globalhints',
    iconUrl: 'bulb',
    dot: false,
    allowedUsers: ['admin', 'contentManager']
  },
  {
    label: 'Submissions',
    url: '/submissions',
    iconUrl: 'file',
    dot: false,
    allowedUsers: ['admin', 'contentManager']
  },
  {
    label: 'Schools',
    url: '/schools',
    iconUrl: 'shop',
    dot: false,
    allowedUsers: ['admin', 'contentManager']
  },
  {
    label: 'Projects',
    url: '/chapters',
    iconUrl: 'project',
    dot: false,
    allowedUsers: ['admin', 'contentManager']
  },
  {
    label: 'NCourses',
    url: '/nCourses',
    iconUrl: 'read',
    dot: false,
    allowedUsers: ['contentManager', 'admin']
  },
  {
    label: 'NLessons',
    url: '/nLessons',
    iconUrl: 'container',
    dot: false,
    allowedUsers: ['contentManager', 'admin']
  },
  {
    label: 'NActivities',
    url: '/nActivities',
    iconUrl: 'book',
    dot: false,
    allowedUsers: ['contentManager', 'admin']
  },
  {
    label: 'Questions',
    url: '/questions',
    iconUrl: 'question-circle',
    dot: false,
    allowedUsers: ['contentManager', 'admin']
  }
]

export default function Menu(props) {
  const [current, setCurrent] = useState('')
  const { currentUser } = useContext(AuthContext)

  const handleClick = e => {
    setCurrent(e.key)
  }

  const renderLinks = () => {
    const linksByRole = links.filter(
      link => currentUser && link.allowedUsers.includes(currentUser.role)
    )
    return linksByRole.map(({ url, label, iconUrl }) => (
      <Link to={url} key={url}>
        <StyledTab>
          <TabText>
            <Icon type={iconUrl} style={{ fontSize: '24px' }} /> {label}
          </TabText>
        </StyledTab>
      </Link>
    ))
  }

  const renderContent = () => {
    if (currentUser) {
      return (
        <MenuDiv>
          <StyledImg src={Logo} />
          <UserInfoDiv>
            <StyledName>{`${currentUser.firstName} ${currentUser.lastName}`}</StyledName>
            <StyledRoleText>{currentUser.role}</StyledRoleText>
          </UserInfoDiv>
          {renderLinks()}
          <LogOutTab onClick={props.logout}>
            <TabText>
              <Icon type="logout" style={{ fontSize: '24px' }} /> Logout
            </TabText>
          </LogOutTab>
        </MenuDiv>
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
        <Icon type="login" />
        Login
      </a>
    )
  }
  console.log('window.location', window.location)
  return (
    <Layout.Sider width="30vw" style={{ background: 'none' }}>
      {renderContent()}
    </Layout.Sider>
  )
}

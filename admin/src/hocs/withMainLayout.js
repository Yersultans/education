import React from 'react'
import styled from 'styled-components'
import { Layout } from 'antd'
import { useHistory } from 'react-router-dom'

import MainMenu from './MainMenu'
import Logo from '../pages/logo.svg'

const { Header, Content, Sider } = Layout

const Wrapper = styled.div`
  margin: 24px;
  height: 100vh;
`
const LogoContainer = styled.div`
  box-sizing: border-box;
  background: #fff;
  padding: 24px 0px 16px 24px;
`

const StyledSider = styled(Sider)`
  height: 100%;
`

const StyledLayout = styled(Layout)`
  background-color: #fff;
`

const StyledHeader = styled(Header)`
  background: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 24px;
`
const StyledText = styled.div`
  height: 28px;
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: #262626;
`

const withMainLayout = Page => {
  return props => {
    const history = useHistory()
    const currentUrl = history.location.pathname

    const [currentHeader, setCurrentHeader] = React.useState('')

    const adminMenu = [
      { link: '/events', name: 'События' },
      { link: '/users', name: 'Пользователи' },
      { link: '/programSets', name: 'Программы' },
      { link: '/programs', name: 'Классы' },
      { link: '/exercises', name: 'Упражнения' },
      { link: '/levels', name: 'Уровни' },
      { link: '/heros', name: 'Персонажи' },
      { link: '/clubs', name: 'Клубы' },
      { link: '/payments', name: 'Пакеты' },
      { link: '/banners', name: 'Баннеры' },
      { link: '/messages', name: 'Сообщения' }
    ]
    // TODO: check for a prettier way to do this
    React.useEffect(() => {
      adminMenu.forEach(item => {
        if (currentUrl.startsWith(item.link)) {
          setCurrentHeader(item.name)
        }
      })
    }, [currentUrl])

    return (
      <StyledLayout>
        <StyledSider>
          <LogoContainer>
            <img src={Logo} alt="logo" />
          </LogoContainer>
          <MainMenu {...{ currentUrl, history, setCurrentHeader }} />
        </StyledSider>
        <Layout>
          <StyledHeader>
            <StyledText>{currentHeader}</StyledText>
          </StyledHeader>
          <Content>
            <Wrapper>
              <Page {...props} />
            </Wrapper>
          </Content>
        </Layout>
      </StyledLayout>
    )
  }
}

export default withMainLayout

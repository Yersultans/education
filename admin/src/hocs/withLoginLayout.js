import React from 'react'
import styled from 'styled-components'

const MainContainer = styled.div`
  background: #f0f2f5;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const withLoginLayout = Page => {
  return () => (
    <MainContainer>
      <Page />
    </MainContainer>
  )
}

export default withLoginLayout

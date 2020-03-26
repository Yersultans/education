import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'

const DefaultStyledContainer = ({ children }) => (
  <Layout.Content style={{ padding: '0 20px 0 20px' }}>
    {children.children > 1 ? children.map(child => child) : children}
  </Layout.Content>
)

DefaultStyledContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
}

export default DefaultStyledContainer

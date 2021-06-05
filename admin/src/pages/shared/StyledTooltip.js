import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const StyledQuestionCircle = styled(QuestionCircleOutlined)`
  margin-left: 5px;
`

const StyledTooltip = ({ text, fullText }) => (
  <>
    {text}
    <Tooltip title={fullText} placement="right">
      <span>
        <StyledQuestionCircle />
      </span>
    </Tooltip>
  </>
)

StyledTooltip.propTypes = {
  text: PropTypes.string.isRequired,
  fullText: PropTypes.string.isRequired
}

export default StyledTooltip

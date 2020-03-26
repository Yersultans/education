import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const CardImage = styled.img`
  width: 328px;
  height: 80px;
`

const BottomWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
`
const ButtonView = styled.button`
  height: 40px;
  background: #ffffff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  color: #969b9e;
  font-size: 16px;
  line-height: 16px;
`
const StyledTitle = styled.p`
  font-size: 16px;
  line-height: 24px;
  margin: 0 0 24px 0;
  font-weight: 500;
  color: #212428;
`

const ProjectContainer = styled.div`
  height: 256px;
  width: 328px;
  border-radius: 8px;
  margin: 12px;
  overflow: hidden;
  position: relative;
  background-color: white;
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  transition: box-shadow 0.2s ease-in-out;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.25);
  cursor: pointer;

  :hover {
    box-shadow: none;
  }
`

const Description = styled.div`
  color: #77787a;
  margin-bottom: 32px;
  font-size: 14px;
  line-height: 16px;
  font-family: 'Roboto', sans-serif;
  overflow: hidden;
  position: relative;
`

const ProjectCard = ({ course: { name, imageUrl, id } }) => (
  <ProjectContainer>
    <CardImage
      alt={`${name} image`}
      src={imageUrl || 'http://via.placeholder.com/352x216px'}
    />
    <BottomWrapper>
      <StyledTitle>{name}</StyledTitle>
      <Description>Published lessons</Description>
      <div>
        <Link to={`/courseManagement/${id}`}>
          <ButtonView>Edit Course</ButtonView>
        </Link>
        <Link to={`/nCourse/${id}`}>
          <ButtonView>View Course</ButtonView>
        </Link>
      </div>
    </BottomWrapper>
  </ProjectContainer>
)
ProjectCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string
  })
}

ProjectCard.defaultProps = {
  course: {}
}

export default ProjectCard

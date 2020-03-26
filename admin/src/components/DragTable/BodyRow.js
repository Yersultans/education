import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import PropTypes from 'prop-types'

const dragDirection = (
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset
) => {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2
  const hoverClientY = clientOffset.y - sourceClientOffset.y
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward'
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward'
  }
  return 'upward'
}

class BodyRow extends React.Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      ...restProps
    } = this.props
    const style = { ...restProps.style, cursor: 'move' }

    let { className } = restProps
    if (isOver && initialClientOffset) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset
      )
      if (direction === 'downward') {
        className += ' drop-over-downward'
      }
      if (direction === 'upward') {
        className += ' drop-over-upward'
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr {...restProps} className={className} style={style} />
      )
    )
  }
}

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index
    }
  }
}

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    // eslint-disable-next-line no-param-reassign
    monitor.getItem().index = hoverIndex
  }
}

BodyRow.propTypes = {
  isOver: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  moveRow: PropTypes.func.isRequired,
  dragRow: PropTypes.shape({}),
  clientOffset: PropTypes.shape({}),
  sourceClientOffset: PropTypes.shape({}),
  initialClientOffset: PropTypes.shape({})
}

BodyRow.defaultProps = {
  dragRow: null,
  clientOffset: null,
  sourceClientOffset: null,
  initialClientOffset: null
}

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset()
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset()
  }))(BodyRow)
)

export default DragableBodyRow

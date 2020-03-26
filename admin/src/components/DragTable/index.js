import React from 'react'
import { Table } from 'antd'
import { DragDropContext } from 'react-dnd'
import PropTypes from 'prop-types'
import HTML5Backend from 'react-dnd-html5-backend'

import DragableBodyRow from './BodyRow'

class DragSortingTable extends React.Component {
  components = {
    body: {
      row: DragableBodyRow
    }
  }

  moveRow = (dragIndex, hoverIndex) => {
    const { dataSource } = this.props
    const dragRow = dataSource[dragIndex]
    const newData = {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow]
      ]
    }
    this.props.onMoveRow(newData)
  }

  render() {
    return (
      <Table
        columns={this.props.columns}
        rowKey={this.props.rowKey}
        expandedRowRender={this.props.expandedRowRender}
        dataSource={this.props.dataSource}
        pagination={this.props.pagination}
        components={this.components}
        onRow={(record, index) => ({
          index,
          moveRow: this.moveRow
        })}
        title={this.props.title}
      />
    )
  }
}

DragSortingTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onMoveRow: PropTypes.func.isRequired,
  title: PropTypes.func.isRequired
}

const DragTable = DragDropContext(HTML5Backend)(DragSortingTable)

export default DragTable

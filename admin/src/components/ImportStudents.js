import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CsvParse from '@vtex/react-csv-parse'
import { Button, Modal, Table, Alert } from 'antd'
import { CSVLink } from 'react-csv'
import randomInRange from '../utils'

const { confirm } = Modal

const columns = [
  {
    title: '#',
    dataIndex: 'index'
  },
  {
    title: 'Firstname',
    dataIndex: 'firstName'
  },
  {
    title: 'Lastname',
    dataIndex: 'lastName'
  },
  {
    title: "Parent's Email",
    dataIndex: 'parentEmail'
  },
  {
    title: 'Birth date',
    dataIndex: 'birthDate'
  },
  {
    title: 'Password',
    dataIndex: 'password'
  }
]

const keys = ['index', 'firstName', 'lastName', 'parentEmail', 'birthDate']

class ImportStudents extends Component {
  state = {
    data: [],
    downloaded: false,
    readyToDownload: false
  }

  handleData = data => {
    const parsedData = data.filter(
      item =>
        item.index &&
        item.firstName &&
        item.parentEmail &&
        item.lastName &&
        item.birthDate
    )
    this.setState({
      data: parsedData.map(item => ({
        ...item,
        parentEmail: item.parentEmail.toLowerCase(),
        password:
          `${item.firstName}${item.lastName}`
            .replace(/ /g, '')
            .toLowerCase()
            .split('@')[0] + randomInRange(100, 999),
        username: `${item.firstName}${item.lastName}`
          .replace(/ /g, '')
          .toLowerCase()
      }))
    })
  }

  handleChange = value => {
    const newData = this.state.data.map(item => ({
      ...item,
      chapters: value
    }))
    this.setState({ data: newData })
  }

  handleCreate = async () => {
    const { data } = this.state
    const newData = await this.props.onOk(data)
    const fixedData = data.map((student, index) => ({
      ...student,
      username: newData[index]
    }))
    this.setState({ data: fixedData, readyToDownload: true })
  }

  closeModal = () => {
    this.setState({ data: [], downloaded: false, readyToDownload: false })
    document.getElementById('file').value = ''
    this.props.onCancel()
  }

  showConfirm = closeModal => {
    confirm({
      title: 'Warning',
      okText: 'Yes',
      cancelText: 'No',
      content:
        'Are you sure you want to close this modal? Have you downloaded the student data?',
      onOk() {
        closeModal()
      },
      onCancel() {}
    })
  }

  handleCancel = () => {
    if (!this.state.downloaded && this.state.data.length) {
      this.showConfirm(this.closeModal)
    } else {
      this.closeModal()
    }
  }

  handleDownload = () => {
    this.setState({ downloaded: true })
  }

  generateDownloadButton = studentsData => (
    <CSVLink data={studentsData}>
      <Button
        style={{ marginTop: 10, width: '100%', height: 60 }}
        type="danger"
        onClick={this.handleDownload}
      >
        Download students data
      </Button>
    </CSVLink>
  )

  render() {
    const { visible, title, failedEmails, isFinishedImport } = this.props
    const { data, readyToDownload } = this.state
    const filteredData = [
      [
        '#',
        'First Name',
        'Last Name',
        'Birth date',
        'Parent Email',
        'Password',
        'Username'
      ]
    ]
    data.map(item => {
      const dataArr = Object.values(item)
      dataArr.splice(8, 1)
      filteredData.push(dataArr)
      return null
    })
    return (
      <Modal
        visible={visible}
        title={title}
        okText="Create"
        onCancel={this.handleCancel}
        onOk={this.handleCreate}
        width="80%"
      >
        <CsvParse
          keys={keys}
          onDataUploaded={this.handleData}
          onError={this.handleError}
          render={onChange => (
            <input type="file" id="file" onChange={onChange} />
          )}
        />
        <Table
          style={{ marginTop: '24px' }}
          columns={columns}
          dataSource={data}
          size="large"
          bordered
        />
        {readyToDownload && this.generateDownloadButton(filteredData)}
        {failedEmails.length > 0 &&
          failedEmails.map(email => {
            /* eslint-disable-next-line */
            console.log(`Could not registered ${email}`)
            return (
              <Alert
                style={{ marginTop: 10 }}
                message={`Could not registered ${email}`}
                type="error"
              />
            )
          })}
        {isFinishedImport && (
          <Alert
            style={{ marginTop: 10 }}
            message="Users registrated!"
            type="success"
          />
        )}
      </Modal>
    )
  }
}

ImportStudents.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  failedEmails: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isFinishedImport: PropTypes.bool.isRequired
}

export default ImportStudents

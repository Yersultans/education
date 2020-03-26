import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'

class NotificationSocket extends Component {
  constructor() {
    super()
    this.state = {
      response: false,
      endpoint: 'http://localhost:5001'
    }
  }

  componentDidMount() {
    const { endpoint } = this.state
    const socket = socketIOClient(endpoint)
    socket.emit('online', 'test7')
    socket.on('test7', data => {
      this.setState({ response: 'We got' })
    })
  }

  render() {
    const { response } = this.state
    return (
      <div style={{ textAlign: 'center' }}>
        {response ? (
          <p>Your text from socket: {response}</p>
        ) : (
          <p>Loading Socket maybe...</p>
        )}
      </div>
    )
  }
}

export default NotificationSocket

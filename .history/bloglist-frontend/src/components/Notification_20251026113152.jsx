const Notification = ({ message }) => {
  if (!message) return null

  const notificationStyle = {
    color: 'green',
    background: '#eee',
    border: '2px solid green',
    padding: 10,
    marginBottom: 10
  }

  return <div style={notificationStyle}>{message}</div>
}

export default Notification

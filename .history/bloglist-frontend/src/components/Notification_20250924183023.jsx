const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  const style = {
    border: '2px solid black',
    padding: '10px',
    marginBottom: '10px'
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification

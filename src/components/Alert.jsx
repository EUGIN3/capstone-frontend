import Alert from '@mui/material/Alert'
import './styles/Alert.css'

function AlertComponent(props) {
  const {type, message, show} = props

  return (
    <div className={`alert ${show ? 'show' : ''}`}>
      <Alert severity={type}>
        {message}
      </Alert>
    </div>

  )
}

export default AlertComponent
import Alert from '@mui/material/Alert'
import './styles/Alert.css'

function AlertComponent(props) {
  const {type, message, show, isNoNavbar} = props

  return (
    <div className={`alert ${show ? 'show' : ''} ${isNoNavbar}`}>
      <Alert severity={type} variant="filled">
        {message}
      </Alert>
    </div>

  )
}

export default AlertComponent
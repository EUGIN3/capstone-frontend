import ButtonElement from '../forms/button/ButtonElement'
import { useNavigate } from 'react-router-dom'; 
import './NotFound.css'

import ghost from '../../assets/ghost.png'

function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <>
      <div className='notfound-page'>
          <div className="notfound-info-container">
              <div>
                  <p className="error">404</p>
                  <p className="error-msg">Seems like you're lost, this page does not exist.</p>
              </div>

              <div className="btn-con btn-con-notfound"
                onClick={handleGoHome}>
                  <ButtonElement
                      label='GO BACK THE APP'
                      variant='filled-black'
                      type={'submit'}
                      className='notfound-btn'
                  />
              </div>
          </div>

          <img src={ghost} alt="" className='not-found-img'/>
      </div>
    </>
  )
}

export default NotFound
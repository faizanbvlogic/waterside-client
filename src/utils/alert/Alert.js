import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { hideAlert } from '../../globalState/action-creators'
import {TOKEN_EXPIRED_MSG} from '../../constants'

function Alert() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const alert = useSelector(state => state.alert)
  let { message, status } = alert
  const color = status;
  status === "Dark" && (status = "Warning")
  status === "Light" && (status = "Warning")

  useEffect(() => {
    if(message === TOKEN_EXPIRED_MSG) {
      navigate('/auth-pages/login', { replace: true })
    }
    setTimeout(() => {
      // HIDE ALERT AFTER 2 MINS
      dispatch(hideAlert(""))
    }, 2000)
    // eslint-disable-next-line
  }, [alert.message])

  return <div>
    {alert.message !== "" &&
      <div className='alertTopContainer'>
        <div className='alert-container'>
          <div className={`alert alert-style-${color} show text-center`} role='alert'>
            <strong>{status}</strong>: {message}
          </div>
        </div>
      </div>
    }
  </div>
}

export default Alert;
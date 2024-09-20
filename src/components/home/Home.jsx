import React, { useEffect } from 'react'
import HeaderLayout from './HeaderLayout'
import Alerts from '../dynamic-compoenents/Alerts'

const Home = () => {
  const [showAlert, setShowAlert] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [variant, setVariant] = React.useState(null);
  useEffect(() => {
    const login_message = JSON.parse(localStorage.getItem('login_message'));
    if (login_message) {
      setShowAlert(true);
      setMessage('Login Successfully');
      setVariant('success');
      localStorage.removeItem('login_message');
    }
  })
  return (
    <div>
    <HeaderLayout>
      {showAlert && (
        <Alerts showAlert={showAlert} setShowAlert={setShowAlert} message={message} variant={variant} />
      )}
      <h1>Home</h1>
    </HeaderLayout>
      
    </div>
  )
}

export default Home

import React, { useState } from 'react'
import SocialButton from './SocialButton';
import { useHistory } from 'react-router'
import { socialLogin } from '../config/MyService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';


toast.configure()
export default function SocialLogin() {
 
  let History = useHistory();
  const [info, setInfo] = useState("")
  const handleSocialLogin = (user) => {
    console.log(user._profile.email)
    if (user !== null) {
      setInfo(user._profile.email)
    }
    console.log(user._profile.email)
    let obj = { email: user._profile.email, fname: user._profile.firstName, lname: user._profile.lastName, profile_pic: user._profile.profilePicURL }
    socialLogin(obj)
      .then(res => {
        console.log(res.data.err)
        if (res.data.err == 0) {
          localStorage.setItem("_token", res.data.token);
          localStorage.setItem("userdetails", obj.email);
          success(res.data.msg)
          History.push("/")

        }
        if (res.data.err == 1) {
          console.log(res.data)
          failure(res.data.msg)
        }
      })
    
    console.log(user)
  };
  const handleSocialLoginFailure = (err) => {
    console.error(err);
  };
  const success = (data) => toast.success(data, { position: toast.POSITION.TOP_CENTER });
  const failure = (data) => toast.error(data, { position: toast.POSITION.TOP_CENTER });
  return (
    <div>

      <SocialButton
        className="btn btn-primary"
        provider="facebook"
        appId="224268506474161"
        onLoginSuccess={handleSocialLogin}
        onLoginFailure={handleSocialLoginFailure}
        style={{ width: "300px" }}
      >
        Login with Facebook <FacebookIcon />
      </SocialButton>
      <br /><br />
      <SocialButton
        provider="google"
        className="btn btn-danger"
        appId="265237357137-qgdkedtl2c6g2s6cuh6dmv6r4114vl2u.apps.googleusercontent.com"
        onLoginSuccess={handleSocialLogin}
        onLoginFailure={handleSocialLoginFailure}
        style={{ width: "300px" }}
      >
        Login with Google <GoogleIcon />
      </SocialButton>


    </div>
  )
}

import React, { useState, useRef } from 'react'
import NavBar from './NavBar'
import { TextField, Alert } from '@mui/material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { ForgotPassword1, NewPassword } from '../config/MyService'
import { useHistory } from 'react-router';
import Footer from './Footer';
const regForpassword = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForOTP = RegExp(/^[0-9]{6}$/);
toast.configure()
export default function ForgotPassword() {
    let History = useHistory()

    const [data, setdata] = useState('');
    const [showNext, setShowNext] = useState(1)
    const [errors, seterror] = useState('');
    const [otpval, setOtpval] = useState();
    const [emailval, setEmailval] = useState("");
    const email = useRef(null)
    const otp = useRef(null)
    const newpassword = useRef(null)
    const cpassword = useRef(null)
    ///////////////////////////handler function to handle input field
    const handler = (event) => {
        const { name, value } = event.target;
        switch (name) {

            case "email":
                let error3 = regForEmail.test(value) ? " " : "Enter Correct Email-Id";
                seterror(error3);

                break;
            case "newpassword":
                let error4 = regForpassword.test(value)
                    ? " "
                    : "Password Should Contain atleast 8 character with Upper, lower and special character";
                seterror(error4);
                setdata(value)
                break;

            case "cpassword":
                let error5 = value === data ? "" : "Password does not match";
                seterror(error5);
                break;
            case "otp":
                let error6 = regForOTP.test(value) ? " " : "Enter 6 digit OTP";
                seterror(error6);

                break;
        }
    }
    ///////////////////////////////to get OTP on email
    const getOTP = () => {
      
        if (email.current.value !== "") {
            setEmailval(email.current.value)
            ForgotPassword1({ email: email.current.value })
                .then(res => {

                    if (res.data.err == 0) {

                        setOtpval(res.data.otp)
                        success(res.data.msg)
                        setShowNext(2)
                    }
                    if (res.data.err == 1) {

                        failure(res.data.msg)
                    }
                })
        }
        else {
            failure("Kindly Insert Email !!")
        }

    }
    ////////////////////////////////// validate otp
    const validateOTP = () => {
        
        if (otp.current.value == otpval) {
            success("User Validated !")
            setShowNext(3)
        }
        else {
            failure("Incorrect OTP")
        }
    }
    ///////////////////Insert New Password
    const NewPassword1 = () => {
        NewPassword({ email: emailval, password: newpassword.current.value })
            .then(res => {
                console.log(res.data)
                if (res.data.err == 0) {

                    success(res.data.msg)
                    History.push("/login")

                }
                if (res.data.err == 1) {

                    failure(res.data.msg)
                }
            })
    }
    ///////////////////Toast Functions
    const success = (data) => toast.success(data, { position: toast.POSITION.TOP_CENTER });
    const failure = (data) => toast.error(data, { position: toast.POSITION.TOP_CENTER });

    return (
        <div>
            <NavBar />

            <div className='container mx-auto' style={{ border: "solid black 1px", height: "350px", width: "600px", marginTop: "30px" }}>
                <h4 className="text-center">Forgot Password</h4><br />
                {showNext === 1 ?
                    <div style={{ marginTop: "30px" }}>
                        {errors.length > 1 && <Alert severity="warning">{errors}</Alert>}<br />
                        <TextField
                            style={{ width: "570px" }}
                            // height="60px"
                            onChange={handler}
                            name="email"
                            label="Email"
                            inputRef={email}
                            variant="outlined" /><br />
                        <button className="btn btn-primary " onClick={getOTP} style={{ marginTop: "10px", marginLeft: "230px" }}>Get OTP</button>
                    </div> :
                    showNext === 2 ?
                        <div style={{ marginTop: "30px" }}>
                            {errors.length > 1 && <Alert severity="warning">{errors}</Alert>}
                            <TextField
                                style={{ width: "570px" }}
                                onChange={handler}
                                name="otp"
                                label="Enter OTP"
                                type="password"
                                inputRef={otp}
                                variant="outlined" /><br />
                            <button className="btn btn-primary " onClick={validateOTP} style={{ marginTop: "10px", marginLeft: "230px" }}>Validate OTP</button>
                        </div> :
                        <div>
                            {errors.length > 1 && <Alert style={{ width: "570px" }} severity="warning">{errors}</Alert>}
                            <TextField
                                style={{ width: "570px" }}
                                autoComplete="false"
                                onChange={handler}
                                name="newpassword"
                                label="New Password"
                                type="password"
                                inputRef={newpassword}
                                variant="outlined" /><br /><br />
                            <TextField
                                style={{ width: "570px" }}
                                autoComplete="false"
                                onChange={handler}
                                name="cpassword"
                                inputRef={cpassword}
                                type="password"
                                label="Confirm Password"
                                variant="outlined" /><br />
                            {errors == "" ?
                                <button className="btn btn-primary " onClick={NewPassword1} style={{ marginTop: "10px", marginLeft: "230px" }}>Submit</button> :
                                <button className="btn btn-primary " disabled style={{ marginTop: "10px", marginLeft: "230px" }}>Submit</button>
                            }

                        </div>

                }

            </div>
            <Footer />
        </div>
    )
}

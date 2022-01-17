import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SocialLogin from "./SocialLogin";
import { Card, TextField, FormControl, CardContent, Button, Alert, FormControlLabel, Checkbox, Grid, Radio, RadioGroup } from "@mui/material";
import NavBar from "./NavBar";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { fetchuser, cartcount } from '../config/MyService'
import { useHistory } from "react-router";
import Footer from "./Footer";
import jwt_decode from 'jwt-decode'


const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForName = RegExp(/^[a-zA-Z]/);
const regForpassword = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
const regForMobile = RegExp(/^[0-9]{10}$/);

toast.configure()

export default function Registration() {
    let History = useHistory()

    const [state, setState] = useState();
    const [data, setdata] = useState('');
    const [errors, seterror] = useState('');
    const [gender, setGender] = useState("Male");
    const [uid, setUid] = useState('')
    const [count1, setCount1] = useState(0)
    const fname = useRef(null)
    const lname = useRef(null)
    const email = useRef(null)
    const mobile = useRef(null)
    const password = useRef(null)
    const cpassword = useRef(null)
    ///////////// Toast Functions
    const success = (data) => toast.success(data, { position: toast.POSITION.TOP_CENTER });
    const failure = (data) => toast.error(data, { position: toast.POSITION.TOP_CENTER });
    //////////Handle values of gender radio button
    const test = (event) => {

        console.log(event.target.value)
        setGender(event.target.value)
    }
    ///////////////////
    useEffect(() => {
        if (localStorage.getItem('_token') != undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwt_decode(token);
            console.log(decode)
            setUid(decode.uid)
            fetchuser(localStorage.getItem('userdetails'))
                .then(res => {
                    console.log(res.data);
                    // console.log(res.data.err)
                    if (res.data.err == 0) {
                        cartcounter()

                    }
                    else {
                        setCount1("")

                    }
                })
        }
        else {
            if (localStorage.getItem("mycart") !== null) {
                let cartItems = JSON.parse(localStorage.getItem("mycart"));
                setCount1(cartItems.length)
            }
        }
    }, [])
    /////////////////////

    const cartcounter = () => {
        cartcount(localStorage.getItem('userdetails'))

            .then(res => {

                if (res.data.err == 0) {
                    setCount1(res.data.data)

                }

            })
    }

    ///////////////////handler for text fields
    const handler = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "fname":
                let error = regForName.test(value) ? " " : "First Name should be character";
                seterror(error);
                break;
            case "lname":
                let error2 = regForName.test(value)
                    ? " "
                    : "Last Name should be character";
                seterror(error2);

                break;

            case "email":
                let error3 = regForEmail.test(value) ? " " : "Enter Correct Email-Id";
                seterror(error3);

                break;
            case "password":
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
            case "mobile":
                let error6 = regForMobile.test(value) ? " " : "Invalid Mobile Number";
                seterror(error6);

                break;
        }
    };
    console.log(errors)
    //////////////Validate and store in db
    const validate = (e) => {
        e.preventDefault();
        console.log(errors)

        if (fname.current.value !== "" && lname.current.value !== "" && email.current.value !== "" && mobile.current.value !== "" && password.current.value !== "") {

            let formData = {
                fName: fname.current.value,
                lName: lname.current.value,
                Email: email.current.value,
                Mobile: mobile.current.value,
                gender: gender,
                Pass: password.current.value


            };
            console.log(formData)
            setState(formData)
            axios.post(`http://localhost:3002/api/register`, formData)

                .then(res => {
                    console.log(res.data.err)
                    if (res.data.err == 0) {

                        success(res.data.msg)
                        History.push("/login")
                    }
                    if (res.data.err == 1) {
                        console.log(res.data)
                        failure(res.data.msg)
                    }
                })

            fname.current.value = null
            lname.current.value = null
            email.current.value = null
            mobile.current.value = null
            password.current.value = null
            cpassword.current.value = null
        }
        else {
            failure("Please Fill all the fields")
        }

    };

    return (
        <div className="row " style={{ width: "1238px" }}><NavBar count1={count1} />
            <div className="col-md-6">
                <div style={{ marginTop: "200px", marginLeft: "200px" }}><SocialLogin /><div className="vl" style={{ height: "400px" }}></div></div>
            </div>
            <div className="col-md-6" style={{ width: "400px" }}>
                <Card sx={{ width: "530px", marginLeft: "10px", marginTop: "30px" }}>

                    <CardContent>
                        <h3 style={{ color: "black", textAlign: "center" }}>
                            Register To NeoSTORE
                        </h3>
                        <br />

                        {errors.length > 1 && <Alert severity="warning">{errors}</Alert>}
                        <br />
                        <Grid container spacing={2}>

                            <form style={{ marginLeft: "20px" }}>
                                <TextField
                                    style={{ width: "490px" }}

                                    onChange={handler}
                                    name="fname"
                                    inputRef={fname}
                                    label="First Name"
                                    size="small"
                                    variant="outlined" /><br />
                                <TextField
                                    style={{ marginTop: "5px", width: "490px" }}
                                    onChange={handler}
                                    name="lname"
                                    inputRef={lname}
                                    label="Last Name"
                                    size="small"
                                    variant="outlined" /><br />
                                <TextField
                                    style={{ marginTop: "5px", width: "490px" }}
                                    onChange={handler}
                                    name="email"
                                    inputRef={email}
                                    label="Email"
                                    size="small"
                                    variant="outlined" /><br />
                                <TextField
                                    style={{ marginTop: "5px", width: "490px" }}
                                    onChange={handler}
                                    name="mobile"
                                    inputRef={mobile}
                                    label="Mobile Number"
                                    size="small"
                                    variant="outlined" /><br />
                                <TextField
                                    style={{ marginTop: "5px", width: "490px" }}
                                    onChange={handler}
                                    name="password"
                                    inputRef={password}
                                    type="password"
                                    label="Password"
                                    size="small"
                                    variant="outlined" /><br />
                                <TextField
                                    style={{ marginTop: "5px", width: "490px" }}
                                    onChange={handler}
                                    name="cpassword"
                                    inputRef={cpassword}
                                    type="password"
                                    label="Confirm password"
                                    size="small"
                                    variant="outlined" /><br />

                                <span style={{ marginLeft: "30px" }}>Gender</span>
                                <div className="form-check form-check-inline" style={{ marginLeft: "30px" }}>

                                    <input className="form-check-input" checked="checked" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Male" onChange={test} />
                                    <label className="form-check-label" >Male</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Female" onChange={test} />
                                    <label className="form-check-label"   >Female</label>
                                </div><br /><br />

                                {
                                    errors === "" ?
                                        <Button
                                            onClick={validate}
                                            style={{ marginLeft: "220px" }}
                                            variant="contained">
                                            Submit
                                        </Button> :
                                        <Button
                                            onClick={validate}
                                            style={{ marginLeft: "220px" }}
                                            disabled
                                            variant="contained">
                                            Submit
                                        </Button>
                                }

                            </form>
                        </Grid>
                    </CardContent>
                </Card>
            </div>


            <Footer />
        </div>
    );
}
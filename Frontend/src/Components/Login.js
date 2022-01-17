import { Card, CardContent, Grid, TextField, Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
import SocialLogin from '../Components/SocialLogin'
import NavBar from './NavBar'
import { useHistory } from 'react-router'
import { login, fetchuser, cartcount } from '../config/MyService'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer'
import jwt_decode from 'jwt-decode'

toast.configure()
export default function Login() {
    let History = useHistory();
    const [state, setState] = useState({ email: '', password: '', cartItems: [] });
    const [count1, setCount1] = useState(0)
    const [uid, setUid] = useState('')

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


    const cartcounter = () => {
        cartcount(localStorage.getItem('userdetails'))

            .then(res => {

                if (res.data.err == 0) {
                    setCount1(res.data.data)

                }

            })
    }
    //////////////////Handler function to handle input field
    const handler = (event) => {
        const { name, value } = event.target;
        if (localStorage.getItem("mycart") !== null) {

            let cartItems = JSON.parse(localStorage.getItem("mycart"));
            setState({ ...state, [name]: value, cartItems: cartItems })
        }
        else {

            setState({ ...state, [name]: value, cartItems: [] })
        }

    }

    /////////////////Authenticate User
    const postRegis = (event) => {
        event.preventDefault();


        login(state)
            .then(res => {
                console.log(res.data.err)
                if (res.data.err == 0) {
                    localStorage.setItem("_token", res.data.token);
                    localStorage.setItem("userdetails", state.email);
                    History.push("/")
                    success(res.data.msg)
                }
                if (res.data.err == 1) {
                    console.log(res.data)
                    failure(res.data.msg)
                }
            })



    }
    //////////////////////Toast Function
    const success = (data) => toast.success(data, { position: toast.POSITION.TOP_CENTER });
    const failure = (data) => toast.error(data, { position: toast.POSITION.TOP_CENTER });


    return (
        <div >
            <NavBar count1={count1} />
            <div className='container-fluid row'>
                <div className="col-md-6 ">
                    <div style={{ marginTop: "200px", marginLeft: "200px" }}><SocialLogin /><div className="vl"></div></div>

                </div>
                <div className="col-md-6">
                    <Card sx={{ width: "560px", marginLeft: "20px", marginTop: "100px" }}>

                        <CardContent>

                            <h3 style={{ color: "black", textAlign: "center" }}>
                                Login
                            </h3><br />
                            <Grid container spacing={2}>
                                <form method="post" style={{ marginLeft: "20px" }} >

                                    <TextField
                                        style={{ width: "520px" }}
                                        // height="60px"
                                        onChange={handler}
                                        name="email"
                                        label="Email"
                                        variant="outlined" /><br />
                                    <TextField
                                        style={{ marginTop: "5px", width: "520px" }}
                                        onChange={handler}
                                        type="password"
                                        name="password"
                                        label="Password"
                                        variant="outlined" /><br /><br />
                                    <Button
                                      
                                        onClick={postRegis}
                                        className="bg-success"
                                        style={{ marginLeft: "220px" }}
                                        variant="contained">
                                        Submit
                                    </Button>


                                    <br />
                                </form>
                            </Grid>
                        </CardContent>

                    </Card>
                </div>

            </div>
            <br />
            <button className="btn" style={{ marginLeft: "500px" }}><Link to="/register">Register Now</Link></button>&nbsp;|&nbsp;<button className="btn"><Link to="/forgotPassword">Forgot Password</Link></button>
            <Footer />
        </div>
    )
}

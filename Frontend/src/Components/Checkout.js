import React, { useState, useEffect } from 'react'
import NavBar from './NavBar'
import { Card, CardContent, Grid, TextField, Button, Alert } from '@mui/material'
import { fetchuser, fetchcart, fetchaddress, updateaddress, placeorder } from '../config/MyService'
import jwt_decode from 'jwt-decode'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router'
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

toast.configure()


const regForPincode = RegExp(/^[0-9]{6}$/);
const regForName = RegExp(/^[a-zA-Z]/);
const regForAddress = RegExp(/^[a-zA-Z0-9]/);

export default function Checkout() {

    let History = useHistory()
    const [uid, setUid] = useState('')
    const [data, setData] = useState([])
    const [subtotal, setsubtotal] = useState(0)
    const [finaltotal, setfinaltotal] = useState(0)
    const [editprof, setEditProf] = useState(1)
    const [fulladdress, setfulladdress] = useState([])
    const [updatePincode, setUpdatePincode] = useState("")
    const [updateCity, setUpdateCity] = useState("")
    const [updateID, setUpdateID] = useState("")
    const [errors, seterror] = useState('');
    const [address, setaddress] = useState('');
    const [pincode, setpincode] = useState('');
    const [city, setcity] = useState('');
    const [state, setstate] = useState('');
    const [country, setcountry] = useState('');
    const [selectedadd, setselectedadd] = useState([]);
    const [GST, setGST] = useState(0);


    const success = (data) => toast.success(data, { position: toast.POSITION.TOP_CENTER });
    const failure = (data) => toast.error(data, { position: toast.POSITION.TOP_CENTER });
    const warning = (data) => toast.warn(data, { position: toast.POSITION.TOP_CENTER });

    useEffect(() => {
        if (localStorage.getItem('_token') != undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwt_decode(token);
            console.log(decode)
            setUid(decode.uid)
            fetchuser(localStorage.getItem('userdetails'))
                .then(res => {
                    console.log(res.data);
                   
                    if (res.data.err == 0) {

                        fetchcartdata()
                        fetchadd()


                    }

                })
        }
        else {
            History.push("/login")
        }
    }, [])

    const fetchcartdata = () => {

        if (localStorage.getItem('userdetails') !== undefined) {
            fetchcart(localStorage.getItem('userdetails'))

                .then(res => {
                   
                    if (res.data.err == 0) {
                     
                        setData(res.data.data)
                        let total = 0
                        for (let i = 0; i < res.data.data.length; i++) {
                            total = total + res.data.data[i].total_product_cost;
                        }
                        
                        setsubtotal(total)
                        setGST(Math.floor(total * 0.05))
                        setfinaltotal(total + Math.floor(total * 0.05))



                    }
                    else {
                        failure(res.data.msg)
                    }
                })
        }
        else {
            console.log("user not logged in")
        }

    }
    const fetchadd = () => {
        fetchaddress(localStorage.getItem('userdetails'))
            .then(res => {
                console.log(res.data.data)
                setfulladdress(res.data.data)

            })
    }

    const updateAddress = (e) => {
        e.preventDefault();

        if (pincode !== "" && city !== "" && state !== "" && country !== "" && address !== "") {

            let formData = {
                pincode: parseInt(pincode),
                city: city,
                state: state,
                country: country,
                address: address,
                id: updateID,
                unique: localStorage.getItem('userdetails'),
                prevpincode: updatePincode


            };
            console.log(formData)
            updateaddress(formData)
                .then(res => {
                    console.log(res.data);
                    console.log(res.data.err)
                    if (res.data.err == 1) {
                        failure(res.data.msg)
                    }
                    else {
                        console.log(res.data)
                        success(res.data.msg)
                        fetchadd()
                        setEditProf(1)

                        // window.location.reload(false);
                    }


                })

        }
        else {
            failure("Please Fill all the fields")
        }

    }

    const handler = (event) => {
        const { name, value } = event.target;
        switch (name) {

            case "pincode":
                let error7 = regForPincode.test(value) ? " " : "Invalid Pincode";
                seterror(error7);
                setpincode(value)
                break;

            case "city":
                let error8 = regForName.test(value) ? " " : "Invalid City";
                seterror(error8);
                setcity(value)
                break;

            case "address":
                let error10 = regForAddress.test(value) ? " " : "Invalid Address";
                seterror(error10);
                setaddress(value)
                break;

            case "state":
                let error11 = regForName.test(value) ? " " : "Invalid State";
                seterror(error11);
                setstate(value)
                break;

            case "country":
                let error12 = regForName.test(value) ? " " : "Invalid Country";
                seterror(error12);
                setcountry(value)
                break;

        }
    }
    const selectAddress = (data) => {
        setselectedadd(data)
        setEditProf(3)
    }
    const placeorder1 = () => {
        if (data.length == 0) {
            failure("Nothing in the cart")
        }
        else {
            placeorder(selectedadd, subtotal, GST, finaltotal)
                .then(res => {
                    console.log(res.data);
                    console.log(res.data.err)
                    if (res.data.err == 1) {
                        failure(res.data.msg)
                    }
                    else {
                        console.log(res.data)
                        success(res.data.msg)
                        fetchadd()
                        setEditProf(1)
                        History.push("/MyProfile")

                        
                    }


                })
        }

    }

    return (

        <div>
            <NavBar />
            <div className='container row'>
                <div className='col-md-3'>
                    <Card sx={{ marginTop: "10px", width: "270px" }}>
                        <CardContent>
                            <h3>Review Order</h3>
                            <hr />
                            <span>SubTotal</span><span style={{ marginLeft: "100px" }}>₹ {subtotal}</span>
                            <hr />
                            <span>GST(5%)</span><span style={{ marginLeft: "100px" }}>₹ {GST}</span>
                            <hr />
                            <span>Order Total</span><span style={{ marginLeft: "80px" }}>₹ {finaltotal}</span>

                            {/* <button style={{marginTop:"20px",width:"100%"}} className="btn btn-primary">Proceed to buy</button> */}
                        </CardContent>
                    </Card>
                </div>

                <div className='col-md-9'>
                    <Card sx={{ width: "560px", marginLeft: "200px", marginTop: "10px" }}>



                        <CardContent>
                            {
                                editprof == 1 ?
                                    <>
                                        <span style={{ fontSize: "7mm", marginBottom: "10px" }}>Saved Addresses</span>
                                        <hr />
                                        {
                                            fulladdress.map((data, index) =>
                                                <Card sx={{ width: "500px", marginLeft: "10px", marginBottom: "10px" }} key={data._id}>
                                                    <CardContent>
                                                        <span style={{ fontSize: "6mm", fontWeight: "bold" }}>Address {index + 1}</span>
                                                        <button style={{ marginLeft: "130px" }} onClick={() => {
                                                            setUpdateID(data._id)
                                                            setUpdateCity(data.city)
                                                            setUpdatePincode(data.pincode)
                                                            setEditProf(2)
                                                        }} type="button" className="btn btn-outline-warning"><EditIcon /></button>
                                                        <button style={{ marginLeft: "10px" }} type="button" className="btn btn-outline-success" onClick={() => selectAddress(data)}>Select Address <DoneIcon /></button><br />

                                                        <span style={{ fontWeight: "bold" }}>Address: </span><span>{data.address}</span><br />
                                                        <span style={{ fontWeight: "bold" }}>City: </span><span>{data.city}</span>&nbsp;&nbsp;&nbsp; <span style={{ fontWeight: "bold" }}>Pincode: </span><span>{data.pincode}</span><br />
                                                        <span style={{ fontWeight: "bold" }}>State: </span><span>{data.state}</span><br />
                                                        <span style={{ fontWeight: "bold" }}>Country: </span><span>{data.country}</span>

                                                    </CardContent>

                                                </Card>

                                            )
                                        }
                                    </> :
                                    editprof == 2 ?
                                        <>
                                            <h4>Update Address</h4><span style={{ fontStyle: "italic", marginLeft: "200px" }}>Edit For</span> <span style={{ fontWeight: "bold", marginLeft: "20px" }}>City :</span><span>{updateCity}</span>  <span style={{ fontWeight: "bold", marginLeft: "10px" }}>Pincode :</span><span >{updatePincode} </span>
                                            <hr />
                                            {errors.length > 1 && <Alert severity="warning" >{errors}</Alert>}<br />
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Address"
                                                name="address"
                                                multiline
                                                rows={3}
                                                onChange={handler}
                                            /><br /><br />
                                            <TextField
                                                onChange={handler}
                                                name="pincode"

                                                label="Pincode"
                                                size="small"
                                                variant="outlined" /><br /><br />
                                            <TextField

                                                onChange={handler}
                                                name="city"

                                                label="City"
                                                size="small"
                                                variant="outlined" />&nbsp;&nbsp;&nbsp;
                                            <TextField

                                                onChange={handler}
                                                name="state"
                                                label="State"
                                                size="small"
                                                variant="outlined" /><br /><br />
                                            <TextField

                                                onChange={handler}
                                                name="country"
                                                label="Country"
                                                size="small"
                                                variant="outlined" /><br /><br />
                                            <button type="button" onClick={updateAddress} className="btn btn-outline-success" ><SaveIcon fontSize='large' /></button>  <button type="button" style={{ marginLeft: "10px" }} onClick={() => setEditProf(1)} className="btn btn-outline-danger" ><CloseIcon fontSize='large' /></button>
                                        </> :
                                        editprof == 3 ?
                                            <>
                                                <h4>Please Verify Address</h4>
                                                <hr />
                                                <span style={{ fontWeight: "bold" }}>Address: </span><span>{selectedadd.address}</span><br />
                                                <span style={{ fontWeight: "bold" }}>City: </span><span>{selectedadd.city}</span>&nbsp;&nbsp;&nbsp; <span style={{ fontWeight: "bold" }}>Pincode: </span><span>{selectedadd.pincode}</span><br />
                                                <span style={{ fontWeight: "bold" }}>State: </span><span>{selectedadd.state}</span><br />
                                                <span style={{ fontWeight: "bold" }}>Country: </span><span>{selectedadd.country}</span><br /><br />
                                                <button className="btn btn-success" style={{ width: "49%" }} onClick={placeorder1}>Place Order</button>
                                                <button className="btn btn-danger" style={{ width: "49%", marginLeft: "10px" }} onClick={() => {
                                                    setEditProf(1)
                                                }}>Go back</button>
                                            </> : ""
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

    )
}

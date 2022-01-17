import React, { useState, useEffect, useRef } from 'react'
import NavBar from './NavBar'
import { useHistory } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Alert } from "@mui/material";
import { faStream, faUserAlt, faAddressCard, faLock } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent, Grid, TextField, Button } from '@mui/material'
import { fetchuser, updateuserdata, uploadimage, fetchprofileimage, newaddress, fetchaddress, deleteaddress, updateaddress, checkpassword, updatePassword, fetchorder, cartcount } from '../config/MyService'
import jwt_decode from 'jwt-decode'
import Footer from './Footer';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import BackupIcon from '@mui/icons-material/Backup';
import UploadIcon from '@mui/icons-material/Upload';

toast.configure()


const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForName = RegExp(/^[a-zA-Z]/);
const regForAddress = RegExp(/^[a-zA-Z0-9]/);
const regForpassword = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
const regForMobile = RegExp(/^[0-9]{10}$/);
const regForPincode = RegExp(/^[0-9]{6}$/);

export default function MyProfile() {


    const [data, setData] = useState([])
    const [mainImage, setMainImage] = useState("")
    const [editprof, setEditProf] = useState(1)
    const [image, setImage] = useState('')
    const [errors, seterror] = useState('');
    const [gender, setGender] = useState("Male");
    const [fname, setfname] = useState('');
    const [lname, setlname] = useState('');
    const [email, setemail] = useState('');
    const [mobile, setmobile] = useState('');
    const [address, setaddress] = useState('');
    const [pincode, setpincode] = useState('');
    const [city, setcity] = useState('');
    const [state, setstate] = useState('');
    const [country, setcountry] = useState('');
    const [fulladdress, setfulladdress] = useState([])
    const [updatePincode, setUpdatePincode] = useState("")
    const [updateCity, setUpdateCity] = useState("")
    const [updateID, setUpdateID] = useState("")
    const [password, setPassword] = useState("")
    const [compare, setCompare] = useState(1)
    const [checkpass, setcheckpass] = useState("")
    const [orderdata, setorderdata] = useState([])
    const [count1, setCount1] = useState(0)

    const [uid, setUid] = useState('')


    let History = useHistory();

    const test = (event) => {

        console.log(event.target.value)
        setGender(event.target.value)
    }
    ///////////////////////
    const success = (data) => toast.success(data, { position: toast.POSITION.TOP_CENTER });
    const failure = (data) => toast.error(data, { position: toast.POSITION.TOP_CENTER });
    const warning = (data) => toast.warn(data, { position: toast.POSITION.TOP_CENTER });
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
                    console.log(res.data.err)
                    if (res.data.err == 0) {

                        setData(res.data.data);
                        fetchimage()
                        fetchadd()
                        fetchorderdata()
                        cartcounter()
                    }

                })
        }
        else {
            History.push("/login")
        }
    }, [])
    /////////////////
    const cartcounter = () => {
        cartcount(localStorage.getItem('userdetails'))

            .then(res => {

                if (res.data.err == 0) {
                    setCount1(res.data.data)

                }

            })
    }
    /////////////////
    const fetchimage = () => {
        let user = localStorage.getItem('userdetails');
        fetchprofileimage(user)
            .then(res => {

                if (res.data.err == 0) {
                    setMainImage(res.data.data.profile_image);

                }
                else {

                    setMainImage("Images/default.jpg")
                }
            })
    }
    //////////////////
    const fetchadd = () => {
        fetchaddress(localStorage.getItem('userdetails'))
            .then(res => {
                console.log(res.data.data)
                setfulladdress(res.data.data)

            })
    }
    /////////////////
    const deleteadd = (id) => {
        deleteaddress(id)
            .then(res => {
                if (res.data.err == 0) {
                    fetchadd()
                    success(res.data.msg)
                }
                else {
                    failure(res.data.msg)
                }

            })
    }
    ////////////////
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
                        setEditProf(2)


                    }


                })

        }
        else {
            failure("Please Fill all the fields")
        }

    }
    ///////////////
    const handler = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "fname":
                let error = regForName.test(value) ? " " : "First Name should be character";
                seterror(error);
                setfname(value)
                break;

            case "lname":
                let error2 = regForName.test(value)
                    ? " "
                    : "Last Name should be character";
                seterror(error2);
                setlname(value)
                break;

            case "email":
                let error3 = regForEmail.test(value) ? " " : "Enter Correct Email-Id";
                seterror(error3);
                setemail(value)
                break;

            case "mobile":
                let error6 = regForMobile.test(value) ? " " : "Invalid Mobile Number";
                seterror(error6);
                setmobile(value)
                break;

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
            case "password":
                setPassword(value)
                break;
            case "newpassword":
                let error14 = regForpassword.test(value)
                    ? " "
                    : "Password Should Contain atleast 8 character with Upper, lower and special character";
                seterror(error14)
                setcheckpass(value)
                setPassword(value)
                break;
            case "cpassword":
                let error15 = value === checkpass ? "" : "Password does not match";
                seterror(error15);
                break;
        }
    }
    ////////////////////

    const validate = (e) => {
        e.preventDefault();
        if (fname !== "" && address !== "" && email !== "" && mobile !== "") {

            let formData = {
                fName: fname,
                lName: lname,
                Email: email,
                Mobile: mobile,
                gender: gender,
                unique: localStorage.getItem('userdetails')


            };
            console.log(formData)
            updateuserdata(formData)
                .then(res => {
                    console.log(res.data);
                    console.log(res.data.err)
                    if (res.data.err == 1) {
                        failure(res.data.msg)
                    }
                    else {
                        localStorage.removeItem("userdetails")
                        localStorage.removeItem("_token")
                        localStorage.setItem("userdetails", res.data.email)
                        localStorage.setItem("_token", res.data.token);
                        success("Data Has been updated")
                        window.location.reload(false);
                    }


                })

        }
        else {
            failure("Please Fill all the fields")
        }

    };
    /////////////////////
    const validateAddress = (e) => {
        e.preventDefault();
        if (pincode !== "" && city !== "" && state !== "" && country !== "" && address !== "") {

            let formData = {
                pincode: pincode,
                city: city,
                state: state,
                country: country,
                address: address,
                unique: localStorage.getItem('userdetails')


            };
            console.log(formData)
            newaddress(formData)
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
                        setEditProf(2)

                    }


                })

        }
        else {
            failure("Please Fill all the fields")
        }

    };
    ///////////////////////
    const onFileChange = (e) => {
        setImage(e.target.files[0])
    }
    const submit = () => {
        let user = localStorage.getItem('userdetails');
        const formData = new FormData()
        formData.append('profileImg', image)
        uploadimage(formData, user)
            .then(res => {
                console.log(res)
                if (res.data.err == 0) {
                    fetchimage()
                }
                else {
                    failure("Email is not Matching with db")
                }

            })
    }
    ////////////////////////
    const checkifpasscorrect = (e) => {
        e.preventDefault();
        if (password !== "") {
            checkpassword({ password: password, user: localStorage.getItem('userdetails') })
                .then(res => {
                    console.log(res)
                    if (res.data.err == 0) {
                        //    setData
                        setCompare(0)

                    }
                    else {
                        failure(res.data.msg)
                    }

                })
        }
        else {
            failure("Enter Old Password")
        }

    }
    /////////////////////////
    const setnewpassword = (e) => {
        e.preventDefault();
        if (password !== "") {
            let formData = {
                user: localStorage.getItem('userdetails'),
                password: password
            }
            updatePassword(formData)
                .then(res => {

                    if (res.data.err == 1) {
                        failure(res.data.msg)
                    }
                    else {
                        console.log(res.data)
                        success(res.data.msg)
                        setEditProf(1);
                        setCompare(1)
                    }


                })
        }
        else {
            failure("Please enter password")
        }

    }
    //////////////////////////
    const fetchorderdata = () => {
        fetchorder(localStorage.getItem('userdetails'))
            .then(res => {

                if (res.data.err == 1) {
                    failure(res.data.msg)
                }
                else {
                    console.log(res.data.data)
                    setorderdata(res.data.data)

                }


            })
    }

    return (
        <div>
            <NavBar count1={count1} />
            <div className='container row' style={{ marginLeft: "45px" }}>
                <h3 style={{ marginTop: "20px" }}>My Account</h3><hr />
                <div className='col-md-3'>
                    <div>
                        <img src={mainImage} className='img-fluid ' style={{ borderRadius: "50% 50% 50% 50%", height: "200px", width: "90%", marginLeft: "13px" }} />
                        {/* <img src="https://lh3.googleusercontent.com/a-/AOh14Gi4aPSmQrgH4wKgykQej3RARpPYv2XpSOIP79VxNfY=s96-c"className='img-fluid ' style={{ borderRadius: "50% 50% 50% 50%", height: "200px", width: "90%", marginLeft: "13px" }} /> */}
                        <div>
                            <input type="file" className="formcontrol" onChange={onFileChange} />
                            <button className="btn btn-primary" style={{ marginTop: "10px" }} type="button" onClick={submit} >upload<UploadIcon /></button>
                        </div>
                    </div><br />
                    <div>
                        <h5 className='text-danger text-center' >{data.fname} {data.lname}</h5>
                        <button className='btn opt' onClick={() => setEditProf(6)} style={{ marginTop: "5px", width: "100%" }}><FontAwesomeIcon icon={faStream} /> Order</button>
                        <button className='btn opt' onClick={() => setEditProf(1)} style={{ marginTop: "5px", width: "100%" }}><FontAwesomeIcon icon={faUserAlt} /> Profile</button>
                        <button className='btn opt' onClick={() => setEditProf(2)} style={{ marginTop: "5px", width: "100%" }}><FontAwesomeIcon icon={faAddressCard} /> Address</button>
                        <button className='btn opt' onClick={() => setEditProf(5)} style={{ marginTop: "5px", width: "100%" }}><FontAwesomeIcon icon={faLock} /> Change Password</button>
                    </div>
                </div>
                <div className='col-md-9'>
                    <Card sx={{ width: "560px", marginLeft: "100px", }}>
                        <CardContent>
                            {
                                editprof == 1 ? <><h4>Profile</h4>
                                    <hr />
                                    <span style={{ fontWeight: "bolder" }}>First Name</span><span style={{ marginLeft: "100px" }}>{data.fname}</span><br /><br />
                                    <span style={{ fontWeight: "bolder" }}>Last Name</span><span style={{ marginLeft: "101px" }}>{data.lname}</span><br /><br />
                                    <span style={{ fontWeight: "bolder" }}>Gender</span><span style={{ marginLeft: "127px" }}>{data.gender}</span><br /><br />
                                    <span style={{ fontWeight: "bolder" }}>Mobile Number</span><span style={{ marginLeft: "65px" }}>{data.mobile}</span><br /><br />
                                    <span style={{ fontWeight: "bolder" }}>Email</span><span style={{ marginLeft: "140px" }}>{data.email}</span><br /><br />
                                    <button type="button" className="btn btn-outline-primary" onClick={() => setEditProf(0)}> <EditIcon fontSize="large" /></button></>
                                    :
                                    editprof == 0 ?
                                        <><h4>Profile</h4>
                                            <hr />
                                            {errors.length > 1 && <Alert severity="warning" >{errors}</Alert>}<br />
                                            <span style={{ fontWeight: "bolder" }}>First Name</span><span style={{ marginLeft: "100px" }}> <input type="text" className="form-control" style={{ width: "300px", marginTop: "-28px", marginLeft: "150px" }} name='fname' onChange={handler} placeholder={"e.g. " + data.fname} /></span><br />
                                            <span style={{ fontWeight: "bolder", marginTop: "-20px" }}>Last Name</span><span style={{ marginLeft: "100px" }}> <input type="text" className="form-control" style={{ width: "300px", marginTop: "-28px", marginLeft: "150px" }} name='lname' onChange={handler} placeholder={"e.g. " + data.lname} /></span><br />
                                            <span style={{ fontWeight: "bolder" }}>Gender</span><span style={{ marginLeft: "100px" }}>  <div className="form-check form-check-inline" style={{ marginLeft: "30px" }}>

                                                <input className="form-check-input" checked="checked" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Male" onChange={test} />
                                                <label className="form-check-label"  >Male</label>
                                            </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Female" onChange={test} />
                                                    <label className="form-check-label"  >Female</label>
                                                </div></span><br /><br />
                                            <span style={{ fontWeight: "bolder" }}>Mobile Number</span><span style={{ marginLeft: "100px" }}> <input type="text" className="form-control" style={{ width: "300px", marginTop: "-28px", marginLeft: "150px" }} name='mobile' onChange={handler} placeholder={"e.g. " + data.mobile} /></span><br />
                                            <span style={{ fontWeight: "bolder" }}>Email</span><span style={{ marginLeft: "100px" }}> <input type="text" className="form-control" style={{ width: "300px", marginTop: "-28px", marginLeft: "150px" }} name='email' onChange={handler} placeholder={"e.g. " + data.email} /></span><br />
                                            <button type="button" className="btn btn-outline-success" onClick={validate}><SaveIcon fontSize="large" /></button> <button type="button" style={{ marginLeft: "10px" }} onClick={() => setEditProf(1)} className="btn btn-outline-danger" ><CloseIcon fontSize="large" /></button>
                                        </> :
                                        editprof == 2 ?
                                            <>
                                                <span style={{ fontSize: "7mm", marginBottom: "10px" }}>Saved Addresses</span><button style={{ marginLeft: "253px" }} onClick={() => setEditProf(3)} type="button" className="btn btn-outline-success"><AddIcon fontSize='large' /></button>
                                                <hr />
                                                {
                                                    fulladdress.map((data, index) =>
                                                        <Card sx={{ width: "500px", marginLeft: "10px", marginBottom: "10px" }} key={data._id}>
                                                            <CardContent>
                                                                <span style={{ fontSize: "6mm", fontWeight: "bold" }}>Address {index + 1}</span>
                                                                <button style={{ marginLeft: "190px" }} onClick={() => {
                                                                    setUpdateID(data._id)
                                                                    setUpdateCity(data.city)
                                                                    setUpdatePincode(data.pincode)
                                                                    setEditProf(4)
                                                                }} type="button" className="btn btn-outline-warning"> <EditIcon /></button>
                                                                <button style={{ marginLeft: "10px" }} onClick={() => deleteadd(data._id)} type="button" className="btn btn-outline-danger"><DeleteIcon /></button><br />
                                                                <span style={{ fontWeight: "bold" }}>Address: </span><span>{data.address}</span><br />
                                                                <span style={{ fontWeight: "bold" }}>City: </span><span>{data.city}</span>&nbsp;&nbsp;&nbsp; <span style={{ fontWeight: "bold" }}>Pincode: </span><span>{data.pincode}</span><br />
                                                                <span style={{ fontWeight: "bold" }}>State: </span><span>{data.state}</span><br />
                                                                <span style={{ fontWeight: "bold" }}>Country: </span><span>{data.country}</span>

                                                            </CardContent>

                                                        </Card>

                                                    )
                                                }
                                            </>
                                            :
                                            editprof == 3 ?
                                                <>
                                                    <h4>Add New Address</h4>
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
                                                    <button type="button" onClick={validateAddress} className="btn btn-outline-success" ><SaveIcon fontSize="large" /></button><button type="button" style={{ marginLeft: "10px" }} onClick={() => setEditProf(2)} className="btn btn-outline-danger" ><CloseIcon fontSize="large" /></button>
                                                </>
                                                :
                                                editprof == 4 ?
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
                                                        <button type="button" onClick={updateAddress} className="btn btn-outline-success" ><SaveIcon fontSize="large" /></button>  <button type="button" style={{ marginLeft: "10px" }} onClick={() => setEditProf(2)} className="btn btn-outline-danger" ><CloseIcon fontSize="large" /></button>
                                                    </> : editprof == 5 ?

                                                        <>{
                                                            compare == 1 ?
                                                                <>
                                                                    <h4>Enter Old Password</h4>
                                                                    <hr />
                                                                    <TextField
                                                                        onChange={handler}
                                                                        name="password"
                                                                        type="password"
                                                                        label="Password"
                                                                        size="small"
                                                                        variant="outlined" /><br />
                                                                    <button type="button" style={{ marginTop: "10px" }} onClick={checkifpasscorrect} className="btn btn-outline-success" ><BackupIcon fontSize='large' /></button>
                                                                </> : compare == 0 ?
                                                                    <>
                                                                        <h4>Set New Password</h4>
                                                                        <hr />
                                                                        {errors.length > 1 && <Alert severity="warning" >{errors}</Alert>}<br />
                                                                        <TextField
                                                                            onChange={handler}
                                                                            name="newpassword"
                                                                            type="password"
                                                                            label="Password"
                                                                            size="small"
                                                                            variant="outlined" /><br /><br />
                                                                        <TextField
                                                                            onChange={handler}
                                                                            name="cpassword"
                                                                            type="password"
                                                                            label="Confirm Password"
                                                                            size="small"
                                                                            variant="outlined" /><br />
                                                                        {errors == "" ?
                                                                            <button className="btn btn-outline-primary " onClick={setnewpassword} style={{ marginTop: "10px" }}><SaveIcon fontSize="large" /></button> :
                                                                            <button className="btn btn-outline-primary " disabled style={{ marginTop: "10px" }}><SaveIcon fontSize="large" /></button>
                                                                        }
                                                                        <button type="button" style={{ marginLeft: "10px", marginTop: "10px" }} onClick={() => setCompare(1)} className="btn btn-outline-danger" ><CloseIcon fontSize="large" /></button>
                                                                    </> : ""
                                                        }

                                                        </> : editprof == 6 ?
                                                            <>
                                                                <span style={{ fontSize: "7mm", marginBottom: "10px" }}>Your Orders</span>
                                                                <hr />
                                                                {
                                                                    orderdata.map((data, index) =>
                                                                        <Card sx={{ width: "500px", marginLeft: "10px", marginBottom: "10px" }} key={data._id}>
                                                                            <CardContent>
                                                                                <span style={{ fontSize: "6mm", fontWeight: "bold" }}>Order {index + 1}</span><br />


                                                                                <span style={{ fontWeight: "bold" }}>Order id: </span><span>{data._id}</span><br />
                                                                                {
                                                                                    orderdata[index].product_purchased.map((val) =>
                                                                                        <img src={val.product_details.product_image} style={{ height: "80px", width: "100px", marginRight: "10px" }} />
                                                                                    )
                                                                                }
                                                                                <br />
                                                                                <button className='btn btn-primary' style={{ marginTop: "10px" }} onClick={() => {
                                                                                    History.push(
                                                                                        {
                                                                                            pathname: '/invoice',
                                                                                            state: { id: data._id }
                                                                                        }
                                                                                    )
                                                                                }}>Download Invoice</button>


                                                                            </CardContent>

                                                                        </Card>

                                                                    )
                                                                }
                                                            </> : ""

                            }

                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>

    )
}

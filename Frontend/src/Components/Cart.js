import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import NavBar from './NavBar'
import jwt_decode from 'jwt-decode'
import { fetchuser, fetchcart, editquantity, deleteitem, cartcount } from '../config/MyService'
import { Card, CardContent, Grid, TextField, Button } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

toast.configure()


export default function Cart() {

    let History = useHistory()
    const [access, setAccess] = useState(1)
    const [uid, setUid] = useState('')
    const [data, setData] = useState([])
    const [subtotal, setsubtotal] = useState(0)
    const [finaltotal, setfinaltotal] = useState(0)
    const [count1, setCount1] = useState(0)



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
                        setAccess(0)
                        fetchcartdata()
                        cartcounter()

                    }
                    else {
                        setAccess(1)


                    }
                })
        }
        else {
            fetchcartnologin()
        }
    }, [])
    ///////////////no login functions
    const fetchcartnologin = () => {
        let cartItems = JSON.parse(localStorage.getItem("mycart"));
        setData(cartItems);
        let total = 0
        for (let i = 0; i < cartItems.length; i++) {
            total = total + cartItems[i].total_product_cost;
        }
        setsubtotal(total)
        setfinaltotal(total + Math.floor(total * 0.05))
        setCount1(cartItems.length)

    }
    //////////////////
    const onAdd = (id) => {

        console.log(id)
        let cartItems = JSON.parse(localStorage.getItem("mycart"));
        for (let i = 0; i < cartItems.length; i++) {

            if (cartItems[i].id == id) {
                let quantity = cartItems[i].quantity + 1
                if (quantity < 11) {
                    cartItems[i].quantity = cartItems[i].quantity + 1
                    cartItems[i].total_product_cost = cartItems[i].quantity * cartItems[i].product_cost
                }
                else {
                    failure("Items must be less than 10")
                }

            }
        }
        localStorage.setItem("mycart", JSON.stringify(cartItems));
        fetchcartnologin()

    };
    ///////////////////
    const onSub = (id) => {

        console.log(id)
        let cartItems = JSON.parse(localStorage.getItem("mycart"));
        for (let i = 0; i < cartItems.length; i++) {

            if (cartItems[i].id == id) {
                let quantity = cartItems[i].quantity - 1
                if (quantity > 0) {
                    cartItems[i].quantity = cartItems[i].quantity - 1
                    cartItems[i].total_product_cost = cartItems[i].quantity * cartItems[i].product_cost
                }
                else {
                    failure("Items must be greater than 0")
                }

            }
        }
        localStorage.setItem("mycart", JSON.stringify(cartItems));
        fetchcartnologin()

    };
    //////////
    const onDelete = (index) => {
        let lstore = JSON.parse(localStorage.getItem("mycart"));
        lstore.splice(index, 1);
        console.log(lstore);
        let setStore = JSON.stringify(lstore);
        localStorage.setItem("mycart", setStore);
        // setCart(lstore);
        fetchcartnologin()
    };
    ///////////////////////after login functions
    const cartcounter = () => {
        cartcount(localStorage.getItem('userdetails'))

            .then(res => {

                if (res.data.err == 0) {
                    setCount1(res.data.data)

                }

            })
    }

    //////////////////////////

    const fetchcartdata = () => {

        if (localStorage.getItem('userdetails') !== undefined) {
            fetchcart(localStorage.getItem('userdetails'))

                .then(res => {
                    // console.log(res.data.data)
                    if (res.data.err == 0) {
                        cartcounter()
                        setData(res.data.data)
                        let total = 0
                        for (let i = 0; i < res.data.data.length; i++) {
                            total = total + res.data.data[i].total_product_cost;
                        }
                        // console.log(total)
                        setsubtotal(total)
                        // console.log(Math.floor(total*0.05))
                        setfinaltotal(total + Math.floor(total * 0.05))



                    }
                    else {
                        alert(res.data.msg)
                    }
                })
        }
        else {
            console.log("user not logged in")
        }

    }
    ///////////////////////////////
    const editquantityminus = (id) => {

        editquantity({ data: -1, id: id })

            .then(res => {

                if (res.data.err == 0) {
                    fetchcartdata()

                }
                else {
                    alert(res.data.msg)
                }
            })

    }
    /////////////////////////////////////
    const editquantityplus = (id) => {



        editquantity({ data: 1, id: id })

            .then(res => {

                if (res.data.err == 0) {
                    fetchcartdata()

                }
                else {
                    alert(res.data.msg)
                }
            })


    }
    /////////////////////////////////
    const deletecartitem = (id) => {

        deleteitem(id)

            .then(res => {

                if (res.data.err == 0) {
                    fetchcartdata()

                }
                else {
                    alert(res.data.msg)
                }
            })
    }
    /////////////////////////////





    return (
        <div>
            {
                access ?
                    <div>
                        <NavBar count1={count1} />
                        <div className='container row'>
                            <div className='col-md-9'>
                                <Card sx={{ marginTop: "50px" }}>
                                    <CardContent>
                                        <div>
                                            <table className="table">
                                                <thead>
                                                    <tr style={{ color: "#787878" }}>

                                                        <th scope="col" colSpan={2}>Product</th>
                                                        <th scope="col">Quantity</th>
                                                        <th scope="col">Price</th>
                                                        <th scope="col">Total</th>

                                                    </tr>
                                                </thead>

                                                {data == null ? "No Items in a cart" :
                                                    data.map((data, index) =>
                                                        <tbody key={data.id} >
                                                            <tr >
                                                                <th rowSpan={3} style={{ width: "110px" }}><img src={data.product_image} height="80px" width="100px" /></th>
                                                                <th ><span style={{ fontWeight: "normal" }}>{data.product_name}</span><br />
                                                                    <span style={{ fontWeight: "normal" }}>by : {data.product_producer}</span><br />
                                                                    <span style={{ fontWeight: "normal" }}>Status : </span><span style={{ fontWeight: "normal", color: "green" }}>In Stock</span></th>
                                                                <th><br /><IndeterminateCheckBoxIcon sx={{ color: "red" }} onClick={() => onSub(data.id)} style={{ marginLeft: "-8px" }} /><input type="text" style={{ width: "30px" }} value={data.quantity} disabled /><AddBoxRoundedIcon sx={{ color: "red" }} onClick={() => onAdd(data.id)} /></th>
                                                                <th><br />₹ {data.product_cost}</th>
                                                                <th><br />₹ {data.total_product_cost}</th>
                                                                <th><br /><DeleteIcon sx={{ color: "red" }} onClick={() => onDelete(index)} /></th>
                                                            </tr>
                                                        </tbody>
                                                    )
                                                }


                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="col-md-3">
                                <Card sx={{ marginTop: "50px", width: "270px" }}>
                                    <CardContent>
                                        <h3>Review Order</h3>
                                        <hr />
                                        <span>SubTotal</span><span style={{ marginLeft: "100px" }}>₹ {subtotal}</span>
                                        <hr />
                                        <span>GST(5%)</span><span style={{ marginLeft: "100px" }}>₹ {Math.floor(subtotal * 0.05)}</span>
                                        <hr />
                                        <span>Order Total</span><span style={{ marginLeft: "80px" }}>₹ {finaltotal}</span>

                                        <button style={{ marginTop: "20px", width: "100%" }} className="btn btn-primary" onClick={() => {
                                            failure("Please Login to Checkout")
                                        }}>Proceed to buy <ShoppingBagIcon /></button>
                                    </CardContent>
                                </Card>
                            </div>

                        </div>
                        <Footer />
                    </div>
                    :
                    <div>
                        <NavBar count1={count1} />
                        <div className='container row'>
                            <div className='col-md-9'>
                                <Card sx={{ marginTop: "50px" }}>
                                    <CardContent>
                                        <div>
                                            <table className="table">
                                                <thead>
                                                    <tr style={{ color: "#787878" }}>

                                                        <th scope="col" colSpan={2}>Product</th>
                                                        <th scope="col">Quantity</th>
                                                        <th scope="col">Price</th>
                                                        <th scope="col">Total</th>

                                                    </tr>
                                                </thead>

                                                {data == null ? "No Items in a cart" :
                                                    data.map((data) =>
                                                        <tbody key={data._id} >
                                                            <tr >
                                                                <th rowSpan={3} style={{ width: "110px" }}><img src={data.product_details.product_image} height="80px" width="100px" /></th>
                                                                <th ><span style={{ fontWeight: "normal" }}>{data.product_details.product_name}</span><br />
                                                                    <span style={{ fontWeight: "normal" }}>by : {data.product_details.product_producer}</span><br />
                                                                    <span style={{ fontWeight: "normal" }}>Status : </span><span style={{ fontWeight: "normal", color: "green" }}>In Stock</span></th>
                                                                <th><br /><IndeterminateCheckBoxIcon sx={{ color: "red" }} onClick={() => editquantityminus(data._id)} style={{ marginLeft: "-8px" }} /><input type="text" style={{ width: "30px" }} value={data.quantity} disabled /><AddBoxRoundedIcon sx={{ color: "red" }} onClick={() => editquantityplus(data._id)} /></th>
                                                                <th><br />₹ {data.product_details.product_cost}</th>
                                                                <th><br />₹ {data.total_product_cost}</th>
                                                                <th><br /><DeleteIcon sx={{ color: "red" }} onClick={() => deletecartitem(data._id)} /></th>
                                                            </tr>
                                                        </tbody>
                                                    )
                                                }


                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="col-md-3">
                                <Card sx={{ marginTop: "50px", width: "270px" }}>
                                    <CardContent>
                                        <h3>Review Order</h3>
                                        <hr />
                                        <span>SubTotal</span><span style={{ marginLeft: "100px" }}>₹ {subtotal}</span>
                                        <hr />
                                        <span>GST(5%)</span><span style={{ marginLeft: "100px" }}>₹ {Math.floor(subtotal * 0.05)}</span>
                                        <hr />
                                        <span>Order Total</span><span style={{ marginLeft: "80px" }}>₹ {finaltotal}</span>

                                        <button style={{ marginTop: "20px", width: "100%" }} className="btn btn-primary" onClick={() => {
                                            console.log(data.length)
                                            if (data.length == 0) {
                                                failure("Cart is Empty")
                                            }
                                            else {
                                                History.push("/checkout")
                                            }

                                        }}>Proceed to buy <ShoppingBagIcon /></button>
                                    </CardContent>
                                </Card>
                            </div>

                        </div>
                        <Footer />
                    </div>
            }
        </div>
    )
}

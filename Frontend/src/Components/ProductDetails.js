import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { FetchSingleProduct, cartcount, fetchuser, additemtocart, giverating } from '../config/MyService'
import NavBar from './NavBar';
import ReactImageMagnify from 'react-image-magnify'
import { FacebookShareButton, WhatsappShareButton, TwitterShareButton, RedditShareButton, RedditIcon } from 'react-share'
import { FacebookIcon, WhatsappIcon, TwitterIcon } from 'react-share';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareAlt } from '@fortawesome/free-solid-svg-icons'
import Footer from './Footer';
import jwt_decode from 'jwt-decode'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ReactStars from "react-rating-stars-component";
import StarRatings from 'react-star-ratings';




toast.configure()

export default function ProductDetails(props) {
    const location = useLocation();
    const [data, setData] = useState([])
    const [Mainimage, setMainImage] = useState("")
    const [image, setImage] = useState([])
    const [uid, setUid] = useState('')
    const [count1, setCount1] = useState(0)

    const [stars, setstars] = useState(0)
    const [bool, setBool] = useState(1)

    ///////////////Fetch Single Product Data
    const success = (data) => toast.success(data, { position: toast.POSITION.TOP_CENTER });
    const failure = (data) => toast.error(data, { position: toast.POSITION.TOP_CENTER });
    const warning = (data) => toast.warn(data, { position: toast.POSITION.TOP_CENTER });

    useEffect(() => {
        initial()

        if (localStorage.getItem('_token') != undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwt_decode(token);
            console.log(decode)
            setUid(decode.uid)
            fetchuser(localStorage.getItem('userdetails'))
                .then(res => {
                    console.log(res.data);

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
    /////////////////
    const rating = (rate) => {
        setstars(rate)

    }
    ///////////////
    const submitrating = () => {
        giverating({ rating: stars, id: data._id })
            .then(res => {
                if (res.data.err == 0) {
                    success(res.data.msg)
                    initial()
                    setBool(1)

                }

            })
    }
    ///////////////////
    const initial = () => {
        FetchSingleProduct(location.state.id)

            .then(res => {

                setData(res.data.data1)
                setImage(res.data.image)
                setMainImage(res.data.data1.product_image)


                document.documentElement.style.setProperty('--background-color', res.data.data1.color_id.color_code)
            })
    }
    /////////////////////
    const cartcounter = () => {
        cartcount(localStorage.getItem('userdetails'))

            .then(res => {

                if (res.data.err == 0) {
                    setCount1(res.data.data)

                }

            })
    }
    ////////////////////
    const addtocart = (data) => {

        if (localStorage.getItem('userdetails') == undefined) {


            let product = {
                id: data._id,
                product_name: data.product_name,
                product_cost: data.product_cost,
                total_product_cost: data.product_cost,
                product_image: data.product_image,
                product_producer: data.product_producer,
                quantity: 1
            }



            if (localStorage.getItem("mycart") !== null) {
                let arr = JSON.parse(localStorage.getItem("mycart"));


                for (let i = 0; i < arr.length; i++) {

                    if (arr[i].id == product.id) {
                        console.log("fine")
                        failure("data already Present")
                        return
                    }
                }


                arr.push(product);
                localStorage.setItem("mycart", JSON.stringify(arr));
                let cartItems = JSON.parse(localStorage.getItem("mycart"));
                success("Product Added to Cart");
                setCount1(cartItems.length)
                // window.location.reload();

            } else {
                let arr = [];
                arr.push(product);
                localStorage.setItem("mycart", JSON.stringify(arr));
                let cartItems = JSON.parse(localStorage.getItem("mycart"));
                success("Product Added to Cart");
                setCount1(cartItems.length)
            }




        }
        else {
            additemtocart(localStorage.getItem('userdetails'), data._id)

                .then(res => {
                    // console.log(res.data)
                    // setData(res.data.data1);
                    if (res.data.err == 0) {
                        success(res.data.msg)
                        cartcounter()
                    }
                    else {
                        warning(res.data.msg)
                    }
                })
        }
    }

    return (

        <div>

            <NavBar count1={count1} />

            <div className="container-fluid row">
                <div className="col-md-6" style={{ marginTop: "40px" }}>
                    <ReactImageMagnify {...{
                        smallImage: {

                            isFluidWidth: true,
                            src: Mainimage,
                            height: 500,
                            width: 600
                        },
                        largeImage: {
                            src: Mainimage,
                            width: 1200,
                            height: 1800
                        }
                    }} />
                    {/* <img src={Mainimage} className="img-fluid" style={{height:"500px",width:"600px"}} /> */}
                    <div style={{ marginTop: "25px" }}>
                        {
                            image.map((item, index) =>
                                <button key={index} className='btn' width="100px" height="400px" onClick={() => setMainImage(item)}> <img src={item} width="100px" height="60px" /></button>
                            )
                        }
                    </div>
                </div>
                <div className='col-md-5' style={{ marginTop: "80px", marginLeft: "50px" }}>
                    <h3>{data.product_name}</h3>




                    <hr />
                    <span>Price : </span><span style={{ fontWeight: "bold", color: "green" }}>₹{data.product_cost}</span><br />
                    <span>Color : </span><span className="dynamiccol">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><br /><br />
                    <h5>Share <FontAwesomeIcon icon={faShareAlt} /></h5>
                    <div style={{ marginTop: "20px", marginLeft: "30px" }} className="row">
                        <div className="col-md-2" >
                            <FacebookShareButton
                                url="https://www.pepperfry.com/"
                                title={"Checkout " + data.product_name}
                                hashtag='#react'
                            >
                                <FacebookIcon logofillColor="white" round={true}></FacebookIcon>
                            </FacebookShareButton>
                        </div>
                        <div className="col-md-2">
                            <WhatsappShareButton
                                url="https://www.pepperfry.com/"
                                quote={"Checkout " + data.product_name}
                                hashtag='#react'
                            >
                                <WhatsappIcon logofillColor="white" round={true}></WhatsappIcon>
                            </WhatsappShareButton>
                        </div>
                        <div className="col-md-2">
                            <TwitterShareButton
                                url="https://www.pepperfry.com/"
                                quote={"Checkout " + data.product_name}
                                hashtag='#react'
                            >
                                <TwitterIcon logofillColor="white" round={true}></TwitterIcon>
                            </TwitterShareButton>
                        </div>
                        <div className="col-md-2">
                            <RedditShareButton
                                url="https://www.pepperfry.com/"
                                quote={"Checkout " + data.product_name}
                                hashtag='#react'
                            >
                                <RedditIcon logofillColor="white" round={true}></RedditIcon>
                            </RedditShareButton>
                        </div>



                    </div>{bool ?
                        <div style={{ marginTop: "10px", marginLeft: "80px", marginBottom: "15px" }} >
                            <StarRatings
                                rating={data.product_rating}
                                starRatedColor="#ffd700"
                                starDimension="40px"
                                starSpacing="1px"
                            />
                        </div> : <div style={{ marginTop: "-10px", marginLeft: "80px" }}>

                            <ReactStars
                                // style={{height:"40px"}}
                                count={5}
                                onChange={rating}

                                value={stars}
                                isHalf={true}
                                edit={true}
                                size={50}
                                activeColor="#ffd700"
                            />
                            <button className="btn btn-outline-success" style={{ marginLeft: "60px" }} onClick={submitrating}>Submit</button>
                        </div>
                    }

                    <br />
                    <button className='btn btn-primary' style={{ marginLeft: "60px" }} onClick={() => addtocart(data)}>Add to Cart</button>
                    <button className='btn text-white' style={{ marginLeft: "30px", background: "#949400" }} onClick={() => setBool(0)} >Rate Product</button>
                </div>
            </div>
            <div className='container'>
                <h5 style={{ fontFamily: "monospace", marginTop: "30px" }}>Product Description</h5>
                <p style={{ fontStyle: "italic" }}>{data.product_desc}</p>
            </div>
            <Footer />
        </div>


    )
}

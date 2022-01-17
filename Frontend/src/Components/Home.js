import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { Carousel } from 'react-bootstrap'
import { FetchPopular, fetchuser, cartcount, additemtocart } from '../config/MyService'
import jwt_decode from 'jwt-decode'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer'
import { useHistory } from 'react-router'
import ReactStars from "react-rating-stars-component";
import StarRatings from 'react-star-ratings';

toast.configure()

export default function Home() {

  let History = useHistory()

  const [data, setData] = useState([])
  const [uid, setUid] = useState('')
  const [count1, setCount1] = useState(0)
  /////////////////Fetch Popular products based on ratings
  useEffect(() => {
    FetchPopular()

      .then(res => {
        setData(res.data.data1);
      })
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

  const success = (data) => toast.success(data, { position: toast.POSITION.TOP_CENTER });
  const failure = (data) => toast.error(data, { position: toast.POSITION.TOP_CENTER });
  const warning = (data) => toast.warn(data, { position: toast.POSITION.TOP_CENTER });


  const cartcounter = () => {
    cartcount(localStorage.getItem('userdetails'))

      .then(res => {

        if (res.data.err == 0) {
          setCount1(res.data.data)

        }

      })
  }
  const singleitem = (id) => {
    History.push(
      {
        pathname: '/ProductDetails',
        state: { id: id }
      }
    )
  }
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
        console.log("ok")


        arr.push(product);
        localStorage.setItem("mycart", JSON.stringify(arr));
        let cartItems = JSON.parse(localStorage.getItem("mycart"));
        success("Product Added to Cart");
        setCount1(cartItems.length)


      } else {
        let arr = [];
        arr.push(product);
        localStorage.setItem("mycart", JSON.stringify(arr));
        let cartItems = JSON.parse(localStorage.getItem("mycart"));
        success("Product Added to Cart");
        setCount1(cartItems.length)
      }
    } else {
      additemtocart(localStorage.getItem('userdetails'), data._id)

        .then(res => {

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
      <br />
      <div className='container-fluid'>
        <Carousel variant="dark">
          <Carousel.Item>
            <img
              className="d-block w-100 img-fluid"
              src="Images/image1.jpg"
              alt="First slide"
              style={{ height: "500px", width: "100%" }}
            />

          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="Images/image2.jpg"
              alt="Second slide"
              style={{ height: "500px", width: "100%" }}
            />

          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="Images/image3.jpg"
              alt="Third slide"
              style={{ height: "500px", width: "100%" }}
            />

          </Carousel.Item>
        </Carousel>

      </div>
      <div className="container row">
        <h3 className="text-center" style={{ marginLeft: "50px", marginTop: "10px" }}>Popular Products</h3>
        <button className=" btn btn-dark" style={{ marginLeft: "545px", width: "100px" }} onClick={() => {
          History.push("/products")
        }}>View All</button>
      </div>
      <div className="container row" style={{ marginLeft: "80px" }}>
        {data.map((data, key) =>

          <div className="card hov" key={data._id} style={{ width: "300px", height: "350px", padding: "10px", marginLeft: "20px", marginTop: "20px" }} >
            <img className="card-img-top" onClick={() => singleitem(data._id)} src={data.product_image} style={{ width: "100%", height: "200px" }} alt="Card image cap" />
            <div className="card-body">
              <h5 className="card-title text-primary text-center" onClick={() => singleitem(data._id)} style={{ fontSize: "15px" }} >{data.product_name}</h5>
              <p className="card-text text-center" onClick={() => singleitem(data._id)} style={{ fontWeight: "bold" }} >₹ {data.product_cost}</p>
              <div style={{ marginTop: "-27px", marginLeft: "70px" }}>
                <ReactStars

                  count={5}


                  value={data.product_rating}
                  isHalf={true}
                  edit={false}
                  size={24}
                  activeColor="#ffd700"
                />

              </div>
              <a href="#" className="btn btn-primary" style={{ marginLeft: "28%" }} onClick={() => addtocart(data)}>Add to Cart</a>
            </div>

          </div>)}


      </div>
      <Footer />
    </div>
  )
}

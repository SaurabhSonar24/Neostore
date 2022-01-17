import React, { useState, useEffect } from 'react'
import NavBar from './NavBar'
import { FetchAll, Filter, additemtocart, fetchuser, cartcount } from '../config/MyService'
import { useHistory } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import ReactPaginate from 'react-paginate'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from 'jwt-decode'
import Footer from './Footer'
import ReactStars from "react-rating-stars-component";

toast.configure()


export default function Products() {
    const [data, setData] = useState([])
    const [data1, setData1] = useState([])
    const [search, setSearch] = useState('')
    const [category, setCat] = useState('dummy')
    const [color, setCol] = useState('dummy')
    const [showdata, setshowdata] = useState(1)
    const [rating, setrating] = useState(0)
    const [pageNumber, setPageNumber] = useState(0);
    const [count1, setCount1] = useState(0)
    const [uid, setUid] = useState('')


    const ProductsPerPage = 6;
    const pagesVisited = pageNumber * ProductsPerPage;
    let History = useHistory();

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

    /////////////////////////////
    const success = (data) => toast.success(data, { position: toast.POSITION.TOP_CENTER });
    const failure = (data) => toast.error(data, { position: toast.POSITION.TOP_CENTER });
    const warning = (data) => toast.warn(data, { position: toast.POSITION.TOP_CENTER });
    ////////////////////////All Product Fetching
    const initial = () => {
        FetchAll()

            .then(res => {
                setData(res.data.data1);
            })
    }
    ///////////////////////////
    const cartcounter = () => {
        cartcount(localStorage.getItem('userdetails'))

            .then(res => {

                if (res.data.err == 0) {
                    setCount1(res.data.data)

                }

            })
    }

    //////////////////////////To Navigate to ProductDetails.js with props
    const singleitem = (id) => {
        History.push(
            {
                pathname: '/ProductDetails',
                state: { id: id }
            }
        )
    }

    ////////////////////////////////To handle Dropdown
    const handler = (e) => {
        e.preventDefault();
        switch (e.target.name) {
            case 'categories':
                setCat(e.target.value)
                break;

            case 'colors':
                setCol(e.target.value)
                break;

        }

    }
    ///////////////////////////////////// Filter Data by Dropdown
    const filter = () => {
        if (category == "dummy" && color == "dummy") {
            failure("Category or color should be selected")
        }
        else {
            setshowdata(0)
            Filter(category, color)

                .then(res => {
                    console.log(res.data)
                    setData(res.data.data1);
                    success("Products sorted by selected category")
                })
        }

    }
    /////////////////////////////////////// Filter Data with rating decendingly
    const rate = () => {
        setshowdata(1)
        setTimeout(() => {
            for (var i = 0; i < data.length; i++) {

                // Last i elements are already in place  
                for (var j = 0; j < (data.length - i - 1); j++) {

                    // Checking if the item at present iteration 
                    // is greater than the next iteration
                    if (data[j].product_rating > data[j + 1].product_rating) {

                        // If the condition is true then swap them
                        var temp = data[j]
                        data[j] = data[j + 1]
                        data[j + 1] = temp
                    }
                }
            }
            setData(data)
            setshowdata(0)
            success("Products Sorted by rating")
        }, 1000);
    }
    ///////////////////////////////////Filter Data with Price decendingly
    const maxprice = () => {
        setshowdata(1)
        setTimeout(() => {
            for (var i = 0; i < data.length; i++) {

                // Last i elements are already in place  
                for (var j = 0; j < (data.length - i - 1); j++) {

                    // Checking if the item at present iteration 
                    // is greater than the next iteration
                    if (data[j].product_cost < data[j + 1].product_cost) {

                        // If the condition is true then swap them
                        var temp = data[j]
                        data[j] = data[j + 1]
                        data[j + 1] = temp
                    }
                }
            }
            setData(data)
            setshowdata(0)
            success("Products Sorted by maximum price")
        }, 1000);
    }
    ////////////////////////////////////Filter Data with Price ascendingly
    const minprice = () => {
        setshowdata(1)
        setTimeout(() => {
            for (var i = 0; i < data.length; i++) {

                // Last i elements are already in place  
                for (var j = 0; j < (data.length - i - 1); j++) {

                    // Checking if the item at present iteration 
                    // is greater than the next iteration
                    if (data[j].product_cost > data[j + 1].product_cost) {

                        // If the condition is true then swap them
                        var temp = data[j]
                        data[j] = data[j + 1]
                        data[j + 1] = temp
                    }
                }
            }
            setData(data)
            setshowdata(0)
            success("Products Sorted by minimum price")
        }, 1000);

    }
    ////////////////////Pagination Functions
    const pageCount = Math.ceil(data.length / ProductsPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };
    /////////////////////////////////////

    const addtocart = (data) => {

        if (localStorage.getItem('userdetails') == undefined) {
            // failure("Log In to Continue")

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
            <div className='container-fluid  row'>
                <div className='col-md-8'>
                    <input type="text" className="form-control" placeholder="Search..." onChange={event => { setSearch(event.target.value) }} style={{ width: "580px", marginLeft: "220px", marginTop: "20px" }} />
                </div>
                <div className='col-md-4 '>
                    <label style={{ marginTop: "20px", marginLeft: '100px' }}>Sort By:</label>
                    <button className='btn' onClick={rate}><FontAwesomeIcon icon={faStar} /></button>
                    <button className='btn' onClick={maxprice}>₹<FontAwesomeIcon icon={faArrowDown} /></button>
                    <button className='btn' onClick={minprice}>₹<FontAwesomeIcon icon={faArrowUp} /></button>
                </div>


            </div>
            <div className="container-fluid row">

                <div className='col-md-2  '>
                    <button type='button' className='rcorners' style={{ backgroundColor: "white", marginTop: "20px" }} onClick={initial}>All Products</button>
                    <select name="categories" onChange={handler} className="rcorners" style={{ marginTop: "30px" }}>
                        <option value="dummy">Categories</option>
                        <option value="61cc10db2b4bfa84703d7254">Sofa</option>
                        <option value="61cc12192b4bfa84703d7256">Chair</option>
                        <option value="61cc12192b4bfa84703d7259">Dining Set</option>
                        <option value="61cc12192b4bfa84703d7257">Table</option>
                        <option value="61cc12192b4bfa84703d7258">Bed</option>
                    </select>

                    <select name="colors" onChange={handler} className="rcorners" style={{ marginTop: "15px" }}>
                        <option className="rcorners" value="dummy">Color</option>
                        <option className="rcorners" value="61cc0e482b4bfa84703d724f">Red</option>
                        <option className="rcorners" value="61cc0eae2b4bfa84703d7250">Blue</option>
                        <option className="rcorners" value="61cc0eed2b4bfa84703d7251">Yellow</option>
                        <option className="rcorners" value="61cc0f4b2b4bfa84703d7252">Green</option>
                        <option className="rcorners" value="61cc0f7b2b4bfa84703d7253">Black</option>
                    </select>
                    <button type="button" className="btn btn-primary" onClick={filter} style={{ marginTop: "15px", marginLeft: "10%" }}>Apply Filters</button>


                </div>
                <div className='col-md-10 '>
                    <div className="row">
                        {setshowdata ?
                            data.
                                slice(pagesVisited, pagesVisited + ProductsPerPage)
                                .filter((data) => {
                                    if (search == "" && rating == 0) {
                                        return data;
                                    }

                                    else if (data.product_name.toLowerCase().includes(search.toLowerCase())) {
                                        return data;

                                    }



                                }).
                                map((data) =>

                                    <div className="card hov" key={data._id} style={{ width: "300px", height: "350px", padding: "10px", marginLeft: "20px", marginTop: "20px" }} >
                                        <img className="card-img-top" onClick={() => singleitem(data._id)} src={data.product_image} style={{ width: "100%", height: "200px" }} alt="Card image cap" />
                                        <div className="card-body">
                                            <h5 className="card-title text-primary text-center" onClick={() => singleitem(data._id)} style={{ fontSize: "15px" }} >{data.product_name}</h5>
                                            <p className="card-text text-center" onClick={() => singleitem(data._id)} style={{ fontWeight: "bold" }} >₹ {data.product_cost}</p>
                                            <div style={{ marginTop: "-27px", marginLeft: "70px" }}>
                                                <ReactStars

                                                    count={5}
                                                    // onChange={ratingChanged}

                                                    value={data.product_rating}
                                                    isHalf={true}
                                                    edit={false}
                                                    size={24}
                                                    activeColor="#ffd700"
                                                />
                                            </div>
                                            <a className="btn btn-primary" onClick={() => addtocart(data)} style={{ marginLeft: "28%" }} >Add to Cart</a><br />

                                        </div>
                                    </div>)
                            :
                            setTimeout(() => {
                                // console.log('This will run after 1 second!')
                                data.
                                    filter((data) => {
                                        if (search == "") {
                                            return data;
                                        }
                                        else if (data.product_name.toLowerCase().includes(search.toLowerCase())) {
                                            return data;

                                        }

                                    }).
                                    map((data) =>

                                        <div className="card hov" key={data._id} style={{ width: "300px", height: "350px", padding: "10px", marginLeft: "20px", marginTop: "20px" }} >
                                            <img className="card-img-top" onClick={() => singleitem(data._id)} src={data.product_image} style={{ width: "100%", height: "200px" }} alt="Card image cap" />
                                            <div className="card-body">
                                                <h5 className="card-title text-primary text-center" onClick={() => singleitem(data._id)} style={{ fontSize: "15px" }} >{data.product_name}</h5>
                                                <p className="card-text text-center" onClick={() => singleitem(data._id)} style={{ fontWeight: "bold" }} >₹ {data.product_cost}</p>
                                                <div style={{ marginTop: "-27px", marginLeft: "70px" }}>
                                                    <ReactStars

                                                        count={5}
                                                        // onChange={ratingChanged}

                                                        value={data.product_rating}
                                                        isHalf={true}
                                                        edit={false}
                                                        size={24}
                                                        activeColor="#ffd700"
                                                    />
                                                </div>
                                                <a href="#" className="btn btn-primary" onClick={() => addtocart(data)} style={{ marginLeft: "28%" }} >Add to Cart</a>
                                            </div>
                                        </div>)
                            }, 2000)

                        }
                        <div style={{ marginTop: "70px" }}>

                            <ReactPaginate
                                style={{ marginTop: "100px" }}
                                previousLabel={"Previous "}
                                nextLabel={"Next"}
                                pageCount={pageCount}
                                onPageChange={changePage}
                                containerClassName={"paginationBttns "}
                                previousLinkClassName={"previousBttn"}
                                nextLinkClassName={"nextBttn "}
                                disabledClassName={"paginationDisabled "}
                                activeClassName={"paginationActive"}
                            />
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>

    )
}

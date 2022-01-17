import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { faUserAlt } from '@fortawesome/free-solid-svg-icons'
import { fetchuser } from '../config/MyService'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import jwt_decode from 'jwt-decode'

export default function NavBar(props) {
  const [bool, setbool] = useState(0)
  const [count2, setCount2] = useState(props.count1)
  const [uid, setUid] = useState('')

  let History = useHistory();
  // console.log(props.count1)
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
            setbool(0)

          }

        })
    }
    else {
      setbool(1)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("userdetails");
    localStorage.removeItem("_token");
    History.push("/login")
  }
  ////////////////NavBar
  return (
    <div>
      <nav className="navbar navbar-expand-lg " style={{ backgroundColor: "black", width: "100%" }}>
        <div className="container-fluid">
          <a className="navbar-brand" ><span style={{ fontSize: "25px", fontWeight: "bold", color: "white" }}>Neo</span><span className="text-danger" style={{ fontSize: "25px", fontWeight: "bolder" }}>STORE</span></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item" style={{ marginLeft: "100px" }}>
                <a className="nav-link" ><Link to="/" style={{ color: "#787878", textDecoration: "none" }}>Home</Link></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" style={{ marginLeft: "100px" }}><Link to="/products" style={{ color: "#787878", textDecoration: "none" }}>Products</Link></a>
              </li>

              <li>
                <button className="btn btn-light" style={{ marginLeft: "600px", height: "43px" }}><Link to="/Cart"><FontAwesomeIcon icon={faShoppingCart} style={{ color: "black" }} /><span className="d-flex align-items-center justify-content-center counter">{props.count1}</span></Link></button>
              </li>
              <li className="nav-item dropdown" style={{ marginLeft: "10px" }}>
                <button className="nav-link dropdown-toggle btn btn-light" style={{ paddingLeft: "17px" }} id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <FontAwesomeIcon icon={faUserAlt} color='black' />
                </button>
                {
                  bool ?
                    <ul className="dropdown-menu" style={{ marginLeft: "-70px", width: "50px" }} aria-labelledby="navbarDropdown" >

                      <li><button className="dropdown-item" onClick={() => {
                        History.push("/login")
                      }} >Login</button></li>

                    </ul> :
                    <ul className="dropdown-menu" style={{ marginLeft: "-70px", width: "50px" }} aria-labelledby="navbarDropdown" >

                      <li><button className="dropdown-item" ><Link to="/MyProfile" style={{ color: "black", textDecoration: "none" }}>My Profile</Link></button></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><a className="dropdown-item" onClick={logout}>Logout</a></li>
                    </ul>
                }

              </li>

            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

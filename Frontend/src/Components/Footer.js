import React from 'react'
import { useHistory } from 'react-router'

export default function Footer() {
    let History = useHistory();
    const map = () => {
        window.open("https://maps.google.com?q=" + 19.024387389175235 + "," + 72.84490574109896);
    }
    return (
        <div className="text-white row " style={{ marginTop: "50px", backgroundColor: "black", fontFamily: "cursive", width: "101%" }}>
            <div className='col-md-4 text-center' style={{ marginTop: "10px" }}>
                <h5>About Company</h5><br />
                <span>NeoSOFT Technologies is here at your quick and easy service for shopping.</span><br />
                <span>Contact Information</span><br />
                <span>Email: contact@neosofttech.com</span><br />
                <span>Phone: +91 0000000000</span><br />
                <span>MUMBAI, INDIA</span>

            </div>
            <div className='col-md-4 text-center' style={{ marginTop: "10px" }}>
                <h5>Information</h5><br />
                <a href='Images/TC.pdf' target='_blank' rel='noopener noreferrer' style={{ color: "white", textDecoration: "none" }}>Terms and Condition</a><br />
                <span>Guarantee and Return Policy</span><br />
                <span>Contact US</span><br />
                <span>Privacy Policy</span><br />
                <span onClick={map}>Locate US</span>

            </div>
            <div className='col-md-4 text-center' style={{ marginTop: "10px" }}>
                <h5>Newsletter</h5><br />
                <span>Sign Up to get exclusive offer from our favourite brands and to be well up in the news</span><br />
                <br />
                <input className='form-control' placeholder='your email' type="text" style={{ width: "230px", marginLeft: "70px" }}></input>
                <button className="btn btn-light" style={{ marginTop: "10px" }} onClick={() => {
                    History.push("/thankyou")
                }}>Subscribe</button>

            </div>
            <span className='text-center' style={{ marginTop: "10px" }}>Copyright 2021 NeoSOFT Technologies All Rights reserved
                | Design By Saurabh Sonar
            </span>
        </div>
    )
}

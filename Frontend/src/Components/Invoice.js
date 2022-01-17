import React, { useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import { fetchuser, getInvoice } from '../config/MyService'
import { useLocation, useHistory } from 'react-router'
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import DownloadIcon from '@mui/icons-material/Download';


const ref = React.createRef();


export default function Invoice() {
    const [uid, setUid] = useState('');
    const [temp, settemp] = useState([]);
    const [data, setData] = useState([]);
    const [address1, setAddress] = useState([]);
    let location = useLocation();
    let History = useHistory();
    useEffect(() => {
        console.log("hi")
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
                        getInvoice1()
                        console.log("success")
                    }
                    else {
                        console.log("failed")
                    }
                })
        }
        else {
            History.push("/login")
        }
    }, [])
    ////////////////////////
    const getInvoice1 = () => {
        getInvoice(location.state.id)
            .then(res => {

                if (res.data.err == 0) {
                    console.log(res.data.data)
                    settemp(res.data.data)
                    setData(res.data.arraydata)
                    setAddress(res.data.address)
                }



            })
    }
    /////////////////
    const generatePdf = () => {
        const input = document.getElementById("divToPrint");
        console.log(input);
        html2canvas(input, { useCORS: true }).then((canvas) => {
            const pdf = new jsPDF();
            const img = canvas.toDataURL(
                "https://play-lh.googleusercontent.com/UsvigGKehARil6qKKLlqhBrFUnzJEQ2UNIGC2UVaExuMx1NKWefGUojGbo3GyORzv-k"
            );
            pdf.addImage(img, "JPEG", 0, 0);
            pdf.save("Invoice.pdf");
        });
    };


    return (
        <div>

            < div
                className="container-fluid"
                style={{
                    height: "auto",
                }}
            >
                <br />

                <div id="divToPrint" className='card' style={{
                    padding: "30px 30px 30px 30px",
                    backgroundColor: "white",
                    maxWidth: "770px",
                    borderStyle: "10px solid black",
                    margin: "20px auto",
                    height: "auto",
                }}>
                    <div className="container row">
                        <div className="col-md-3">
                            <img src="Images/neologo.png" style={{ height: "80px", width: "250px" }}></img>

                        </div>
                        <div className="col-md-9">
                            <span style={{ marginLeft: "170px", marginBottom: "-30px", fontWeight: "bold" }}>Date: </span><span>{temp.date}</span><br />
                            <span style={{ marginLeft: "170px", fontWeight: "bold" }}>Order No.: </span><span>{temp._id}</span><br />
                            <span style={{ marginLeft: "170px", fontWeight: "bold" }}>Email id.: </span><span>{temp.email}</span>

                        </div>
                    </div>
                    <div className="container row" style={{ marginTop: "100px" }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Product Producer</th>
                                    <th scope="col">Product Cost</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Item Total</th>
                                </tr>
                            </thead>
                            <tbody >
                                {
                                    data.map((data, index) =>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{data.product_details.product_name}</td>
                                            <td>by {data.product_details.product_producer}</td>
                                            <td>{data.product_details.product_cost}</td>
                                            <td>{data.quantity}</td>
                                            <td>{data.total_product_cost}</td>

                                        </tr>
                                    )
                                }
                                <tr>
                                    <td colSpan="4"></td>
                                    <td style={{ fontWeight: "bold" }}>Item SubTotal</td>
                                    <td >{temp.subtotal}</td>
                                </tr>
                                <tr>
                                    <td colSpan="4"></td>
                                    <td style={{ fontWeight: "bold" }}>GST</td>
                                    <td >{temp.GST}</td>
                                </tr>
                                <tr>
                                    <td colSpan="4"></td>
                                    <td style={{ fontWeight: "bold" }}>Order Total</td>
                                    <td >{temp.Order_Total}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div><br /><br />
                    <div className="container row">
                        <div className="col-md-8">

                            <h5>Sold By</h5>
                            <span>NeoSOFT Technologies,</span><br />
                            <span>Mumbai-400014.</span><br />
                            <span>Maharashtra.</span><br />
                            <span>India.</span>
                        </div>


                        <div className="col-md-4">
                            <h5>Shipping Address</h5>
                            <span>{address1.address},</span><br />
                            <span>{address1.city}-{address1.pincode}.</span><br />
                            <span>{address1.state}.</span><br />
                            <span>{address1.country}.</span>
                        </div>

                    </div><br /><br />

                    <span style={{ fontSize: "9px" }}>*This is system generated invoice. If any problem regarding the invoice contact to our customer care 8888-8888-8888 or write us mail to
                        contact@neosofttech.com
                    </span>
                </div>
                <br />
                <div className='container'>
                    <div className="text-center">
                        <button className="btn btn-success" onClick={() => generatePdf()}>
                            Download Invoice  <DownloadIcon />
                        </button>
                        &nbsp; &nbsp;&nbsp; &nbsp;

                    </div>
                </div>
            </div>
        </div>

    )
}

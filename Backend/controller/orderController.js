const express = require("express")
const cartmodel = require('../db/CartSchema')
const productmodel = require("../db/ProductsSchema")
const jwtSecret = "asd889asdas5656asdas887";
const jwt = require('jsonwebtoken');
const ordermodel = require("../db/OrderSchema")

/////////////Place order
const placeorder = (req, res) => {
   
    let email = req.body.user;
    let address = req.body.address;
    let city = req.body.city;
    let pincode = req.body.pincode;
    let state = req.body.state;
    let country = req.body.country;

    let subtotal = req.params.subtotal;
    let GST = req.params.GST;
    let finaltotal = req.params.finaltotal;

    cartmodel.find({ email: email }, { product_details: 1, quantity: 1, total_product_cost: 1 }, (err, data) => {
        if (err) throw err;
        else {

            let ins = new ordermodel({ email: email, product_purchased: data, to_address: { address: address, city: city, pincode: pincode, state: state, country: country }, subtotal: subtotal, GST: GST, Order_Total: finaltotal });
            ins.save((err) => {
                if (err) {
                    console.log(err)
                    console.log("Already added")
                }
                else {
                    for (let i = 0; i < data.length; i++) {
                        
                        cartmodel.deleteOne({ _id: data[i]._id }, (err, data) => {
                            if (err) throw err;
                            if (data.deletedCount) {
                                console.log("ok")
                            }
                            else {
                                console.log("not ok")
                            }

                        })
                    }
                    res.json({ "err": 0, "msg": "Order Placed Successfully" })

                }
            })
        }
    })
}
////////fetch order details
const fetchorder = (req, res) => {
  
    let email = req.params.email;
    ordermodel.find({ email: email }, {}, (err, data) => {
        if (err) throw err;
       
        res.json({ "err": 0, "msg": "Order Data fetched", "data": data })
        
    })
}
/////////////Generate Invoice 

const getInvoice = (req, res) => {
    ordermodel.findOne({ _id: req.params.id }, (err, data) => {
        if (err) throw err;
        console.log(data.to_address)
        res.json({ "err": 0, "msg": "Order Data fetched", "data": data, "arraydata": data.product_purchased, "address": data.to_address })
       
    })

}





module.exports = { placeorder, fetchorder, getInvoice }


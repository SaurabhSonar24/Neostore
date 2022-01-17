const express = require("express")
const cartmodel = require('../db/CartSchema')
const productmodel = require("../db/ProductsSchema")
const jwtSecret = "asd889asdas5656asdas887";
const jwt = require('jsonwebtoken');

//////////////add to cart
const addtocart = (req, res) => {
    console.log(req.params)
    let id = req.params.id
    let user = req.params.user
    cartmodel.findOne({ email: user, product_id: id }, (err, data) => {
        if (err) throw err;

        if (data === null) {
            productmodel.findOne({ _id: id }, { product_name: 1, product_image: 1, product_cost: 1, product_producer: 1 }, (err, data) => {
                if (err) throw err;
                else {
                    let ins = new cartmodel({ email: user, product_details: { product_name: data.product_name, product_image: data.product_image, product_cost: data.product_cost, product_producer: data.product_producer }, product_id: id, quantity: 1, total_product_cost: data.product_cost });
                    ins.save((err) => {
                        if (err) {
                            console.log(err)
                            console.log("Already added")
                        }
                        else {

                            res.json({ "err": 0, "msg": "Item Added to cart" })
                        }
                    })
                }

            })
        }
        else {
            res.json({ "err": 1, "msg": "Item Already Present In the cart" })
        }
    })

}

//////////////////Fetch Cart

const fetchCart = (req, res) => {


    let email = req.params.user
    cartmodel.find({ email: email }, (err, data) => {
        if (err) throw err;
        else {
            let arr = []
           
            for (let i = 0; i < data.length; i++) {
                arr[i] = data[i].product_details
            }

            res.json({ "err": 0, "msg": "Cart Fetched Successfully", "data": data })

        }
    })
}
//////////////////////edit quantity function
const editquantity = (req, res) => {
    let variable = parseInt(req.body.data);
    let id = req.body.id;
    // console.log(variable)
    cartmodel.findOne({ _id: id }, (err, data) => {
        if (err) throw err;
        let quantity = data.quantity + variable;
        if (quantity < 11 && quantity > 0) {

            let tot_cost = quantity * data.product_details.product_cost;
            cartmodel.updateOne({ _id: id }, { $set: { "quantity": quantity, "total_product_cost": tot_cost } }, (err, data) => {
                if (err) throw err;
                if (data.matchedCount == 1) {

                    res.json({ "err": 0, "msg": "Quantity Updated" })

                }
                else {
                    res.json({ "err": 1, "msg": "email is not Matching with Database" })
                }
            })

        }
        else {
            res.json({ "err": 1, "msg": "Quantity must be in between 1 and 10 " })
        }
    })

}
//////////////////delete cart item
const deleteitem = (req, res) => {
    cartmodel.deleteOne({ _id: req.params.id }, (err, data) => {
        if (err) throw err;
        if (data.deletedCount) {
            res.json({ "err": 0, "msg": "Data Deleted" })
        }
        else {
            res.json({ "err": 1, "msg": "Unable to delete" })
        }

    })
}
////////////////Cart Count
const cartcount = (req, res) => {
    let email = req.params.user;
    cartmodel.find({ email: email }, (err, data) => {
        if (err) throw err;
        else {
            


            res.json({ "err": 0, "msg": "Cart Count Fetched Successfully", "data": data.length })

        }
    })
}
////////
const cartwithoutlogin = (req, res) => {

    // console.log(req.params.id)
    let id = req.params.id
    productmodel.findOne({ _id: id }, { product_name: 1, product_image: 1, product_cost: 1, product_producer: 1 }, (err, data) => {
        if (err) throw err;
        else {
            res.json({ "err": 0, "msg": "Product added to cart", "data": data })
        }

    })
}


module.exports = { addtocart, fetchCart, editquantity, deleteitem, cartcount, cartwithoutlogin }
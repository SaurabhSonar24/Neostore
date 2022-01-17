const express = require("express")
const usermodel = require("../db/UserSchema")
const addressmodel = require("../db/AddressSchema")
const cartmodel = require('../db/CartSchema')
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer')
const saltRounds = 10;
const jwtSecret = "asd889asdas5656asdas887";
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')



//////////Nodemailer
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'samsonar4050@gmail.com',
        pass: '*********'
    }
});

///////////////Register Module
const register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).json({ errors: errors.array() })
    }
    let fname = req.body.fName;
    let lname = req.body.lName;
    let email = req.body.Email;
    let mobile = req.body.Mobile;
    let gender = req.body.gender;
    let password = req.body.Pass;

    console.log(password)
    usermodel.findOne({ email: email }, (err, data) => {
        if (err) throw err;
        if (data === null) {
            const hash = bcrypt.hashSync(password, saltRounds);
            let ins = new usermodel({ fname: fname, lname: lname, email: email, mobile: mobile, gender: gender, password: hash, profile_image: "" });
            ins.save((err) => {
                if (err) {
                    console.log(err)
                    console.log("Already added")
                }
                else {

                    res.json({ "err": 0, "msg": "Registration Successful" })
                }
            })

        }
        else {
            res.json({ "err": 1, "msg": "User Already Exists" })
        }
    })

}



/////////////////////////// Login Module
const login = async (req, res) => {

    let email = req.body.email;
    let password = req.body.password;
    let cartItems = req.body.cartItems;

    usermodel.findOne({ email: email }, (err, data) => {
        if (err) {
            res.json({ "err": 1, "msg": "Email or password is not correct" })
        }
        else if (data == null) {
            res.json({ "err": 1, "msg": "Email or password is not correct" })
        }
        else {
            if (bcrypt.compareSync(password, data.password)) {
                let payload = {
                    uid: email
                }
                const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 })

                if (req.body.cartItems.length != 0) {

                    console.log(cartItems)
                    for (let i = 0; i < cartItems.length; i++) {
                        cartmodel.findOne({ email: email, product_id: cartItems[i].id }, (err, data) => {
                            if (err) throw err;
                            if (data == null) {

                                let ins = new cartmodel({ email: email, product_details: { product_name: cartItems[i].product_name, product_image: cartItems[i].product_image, product_cost: cartItems[i].product_cost, product_producer: cartItems[i].product_producer }, product_id: cartItems[i].id, quantity: cartItems[i].quantity, total_product_cost: cartItems[i].total_product_cost });
                                ins.save((err) => {
                                    if (err) {
                                        console.log(err)
                                        console.log("Already added")
                                    }

                                })
                            }
                        })
                    }
                    res.json({ "err": 0, "msg": "Login Success", "token": token })


                }
                else {

                    res.json({ "err": 0, "msg": "Login Success", "token": token })

                }



            }
            else {
                res.json({ "err": 1, "msg": "password is incorrect" })
            }
        }
    })
}

///////////////////////Social Login Module
const socialLogin = async (req, res) => {

    let email = req.body.email;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let profilepic = req.body.profile_pic;
    console.log(req.body)
    usermodel.findOne({ email: email }, (err, data) => {
        if (err) throw err;
        if (data === null) {
            
            let ins = new usermodel({ fname: fname, lname: lname, email: email, mobile: "", gender: "", password: "Social", profile_image: profilepic });
            ins.save((err) => {
                if (err) {
                    console.log(err)
                    console.log("Already added")
                }
                else {

                    
                    console.log("Registraion Successful")
                }
            })

        }
        else {
            console.log("User Exists")
        }
    })

    let payload = {
        uid: email
    }
    const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 })
    res.json({ "err": 0, "msg": "Login Success", "token": token })


}
//////////////////////////////////Forgot Password Module
const forgotPassword = async (req, res) => {

    let otp = Math.random().toFixed(6).split('.')[1]
    let email = req.body.email;


    usermodel.findOne({ email: email }, (err, data) => {
        if (err) {
            res.json({ "err": 1, "msg": "Error Occured" })
        }
        else if (data == null) {
            res.json({ "err": 1, "msg": "Email is not Present in Database" })
        }
        else {
            console.log(data.email)
            let mailDetails = {
                from: 'samsonar4050@gmail.com',
                to: data.email,
                subject: 'One Time Password for NeoSTORE',
                html: `<!DOCTYPE html><html lang="en"><head><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"></head><body><h3 class="text-center">One Time Password for NeoSTORE is :<span class="display-6">${otp}</span></h1></body></html>`,

            };

            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log(err)
                  
                } else {
                    console.log('Email sent successfully');
                    res.json({ "err": 0, "msg": "OTP has been sent to Registed Email", "otp": otp })
                }
            });
        }
    })

}
//////////////////////////////////New Password

const newPassword = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    const hash = bcrypt.hashSync(password, saltRounds);
    usermodel.updateOne({ email: email }, { $set: { "password": hash } }, (err, data) => {
        if (err) throw err;
        if (data.matchedCount == 1) {

            res.json({ "err": 0, "msg": "Password Updated" })
        }
        else {
            res.json({ "err": 1, "msg": "Email is not Matching with Database" })
        }
    })

}
///////////////////////////////////Fetch userdata

const fetchuserdata = (req, res) => {

    let email = req.params.email;

    usermodel.findOne({ email: email }, (err, data) => {
        if (err) {
            res.json({ "err": 1, "msg": "Email or password is not correct" })
        }
        else if (data == null) {
            res.json({ "err": 1, "msg": "User Unidentified" })
        }
        else {

            res.json({ "err": 0, "msg": "Welcome user", "data": data })

        }
    })

}
//////////////////////////////////////Update User info

const updateuser = (req, res) => {
  
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.array())
        res.json({ "err": 1, "msg": "Enter valid data" })
    }



    usermodel.updateOne({ email: req.body.unique }, { $set: { "fname": req.body.fName, "lname": req.body.lName, "email": req.body.Email, "mobile": parseInt(req.body.Mobile), "gender": req.body.gender } }, (err, data) => {
        if (err) throw err;
        if (data.matchedCount == 1) {
            let payload = {
                uid: req.body.Email
            }
            const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 })
            res.json({ "err": 0, "msg": "Data Updated", "token": token, "email": req.body.Email })

        }
        else {
            res.json({ "err": 1, "msg": "Email is not Matching with Database" })
        }
    })

}

/////////////////Upload Profile picture
const uploadimage = (req, res) => {
    console.log(req.params.user)
    console.log(req.file)
 
    const url = " http://127.0.0.1:8080/public/" + req.file.filename

    usermodel.updateOne({ email: req.params.user }, { $set: { "profile_image": url } }, (err, data) => {
        if (err) throw err;
        if (data.matchedCount == 1) {

            res.json({ "err": 0, "msg": "Profile Picture Uploaded" })

        }
        else {
            res.json({ "err": 1, "msg": "Email is not Matching with Database" })
        }
    })

}
////////////Fetch Profile Pic

const fetchimage = (req, res) => {


    usermodel.findOne({ email: req.params.user }, { profile_image: 1 }, (err, data) => {

        if (err) {
            res.json({ "err": 1, "msg": "Error Occured" })
        }
        else if (data.profile_image == "") {

            res.json({ "err": 1, "msg": "No Image Found" })
        }
        else {

            res.json({ "err": 0, "msg": "Profile Pic found", "data": data })

        }
    })



}
/////////////Enter New Address
const newaddress = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.array())
        res.json({ "err": 1, "msg": "Enter valid data" })
    }
    else {
      


        addressmodel.find({ user: req.body.unique, pincode: req.body.pincode }, (err, data) => {
            if (err) throw err;

            
            if (data.length === 0) {
                let ins = new addressmodel({ user: req.body.unique, address: req.body.address, city: req.body.city, country: req.body.country, pincode: req.body.pincode, state: req.body.state });
                ins.save((err) => {
                    if (err) {
                        console.log(err)
                        console.log("Already added")
                    }
                    else {

                        res.json({ "err": 0, "msg": "Address added " })
                    }
                })
            }
            else {
                res.json({ "err": 1, "msg": "Address with same pincode exist" })
            }
        })
    }
}

/////////Fetch added addresses
const fetchaddress = (req, res) => {
    addressmodel.find({ user: req.params.user }, (err, data) => {
        if (err) throw err;
        //   res.send(data)
        res.json({ "data": data, "err": 0, "msg": "Address fetched" })
    })
}

/////////////delete added address
const deleteaddress = (req, res) => {

    addressmodel.deleteOne({ _id: req.params.id }, (err, data) => {
        if (err) throw err;
        if (data.deletedCount) {
            res.json({ "err": 0, "msg": "Data Deleted" })
        }
        else {
            res.json({ "err": 1, "msg": "Unable to delete" })
        }

    })
}

/////////////Update Existing address
const updateaddress = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.array())
        res.json({ "err": 1, "msg": "Enter valid data" })
    }
    else {
        
        if (req.body.pincode == req.body.prevpincode) {
            addressmodel.updateOne({ _id: req.body.id }, { $set: { "address": req.body.address, "city": req.body.city, "country": req.body.country, "pincode": req.body.pincode, "state": req.body.state } }, (err, data) => {
                if (err) throw err;
                if (data.matchedCount == 1) {

                    res.json({ "err": 0, "msg": "Address Updated" })

                }
                else {
                    res.json({ "err": 1, "msg": "ID is not Matching with Database" })
                }
            })
        }
        else {
            addressmodel.findOne({ user: req.body.unique, pincode: req.body.pincode }, (err, data) => {
                if (err) throw err;
                console.log(data)
                if (data === null) {
                    addressmodel.updateOne({ _id: req.body.id }, { $set: { "address": req.body.address, "city": req.body.city, "country": req.body.country, "pincode": req.body.pincode, "state": req.body.state } }, (err, data) => {
                        if (err) throw err;
                        if (data.matchedCount == 1) {

                            res.json({ "err": 0, "msg": "Address Updated" })

                        }
                        else {
                            res.json({ "err": 1, "msg": "ID is not Matching with Database" })
                        }
                    })
                }
                else {
                    res.json({ "err": 1, "msg": "Your Address with this pincode already exists" })
                }
            })
        }

    }

}
///////////Validate old password
const checkpassword = (req, res) => {

    console.log(req.body.user)
    usermodel.findOne({ email: req.body.user }, (err, data) => {
        if (err) throw err;

        if (data.password == "Social") {
            res.json({ "err": 1, "msg": "Password can't change of social login user" })
        }
        else if (bcrypt.compareSync(req.body.password, data.password)) {
            res.json({ "err": 0, "msg": "Password Matched" })
        }
        else {
            res.json({ "err": 1, "msg": "Old Password is not matching" })
        }
    })
}

///////////Enter Updated password
const updatepassword = (req, res) => {
    console.log(req.body)
    let password = req.body.password;
    let user = req.body.user;
    const hash = bcrypt.hashSync(password, saltRounds);
    usermodel.updateOne({ email: user }, { $set: { "password": hash } }, (err, data) => {
        if (err) throw err;
        if (data.matchedCount == 1) {

            res.json({ "err": 0, "msg": "Password Updated" })

        }
        else {
            res.json({ "err": 1, "msg": "user is not Matching with Database" })
        }
    })
}

module.exports = { register, login, socialLogin, forgotPassword, newPassword, fetchuserdata, updateuser, uploadimage, fetchimage, newaddress, fetchaddress, deleteaddress, updateaddress, checkpassword, updatepassword }
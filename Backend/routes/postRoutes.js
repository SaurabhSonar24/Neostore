const express = require('express')
const router = express.Router();
const multer = require("multer")
const { v4: uuidv4 } = require("uuid");
const usercontroller = require("../controller/UserController")
const datacontroller = require("../controller/dataController")
const cartcontroller = require("../controller/cartController")
const ordercontroller = require("../controller/orderController")
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const jwtSecret = "asd889asdas5656asdas887";

const productmodel = require("../db/ProductsSchema")
const catModel = require('../db/CategorySchema');
const colorModel = require('../db/ColorSchema');
function autenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(token)
    if (token == null) {
        res.json({ "err": 1, "msg": "Token not match" })
    }
    else {
        jwt.verify(token, jwtSecret, (err, data) => {
            if (err) {
                res.json({ "err": 1, "msg": "Token incorrect" })
            }
            else {
                // console.log("Match")
                next();
            }
        })
    }
}

const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.post("/register", [
    check('fName').isLength({ min: 2 }).withMessage("Minimum length of 2"),
    check('lName').isLength({ min: 2 }).withMessage("Minimum length of 2"),
    check('Email').isEmail(),
    check('Mobile').isNumeric().isLength({ min: 10 }).withMessage('Check Digits'),
    check('gender').notEmpty(),
    check('Pass').isLength({ min: 8 }).withMessage("Minimum length of 8")
], usercontroller.register)


router.post("/login", usercontroller.login)

router.post("/socialLogin", usercontroller.socialLogin)

router.post("/forgotPassword", usercontroller.forgotPassword)

router.get("/fetchuserdetails/:email", autenticateToken, usercontroller.fetchuserdata)

router.post("/updateuserdata", [
    check('fName').isLength({ min: 2 }).withMessage("Minimum length of 2"),
    check('lName').isLength({ min: 2 }).withMessage("Minimum length of 2"),
    check('Email').isEmail(),
    check('Mobile').isNumeric().isLength({ min: 10 }).withMessage('Check Digits'),
    check('gender').notEmpty()
], usercontroller.updateuser)

router.post("/newaddress", [
    check('city').isLength({ min: 2 }).isAlpha().withMessage('city must be alphabetic.'),
    check('country').isAlpha().withMessage('country must be alphabetic.'),
    check('pincode').isNumeric().isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digit only'),
    check('state').isAlpha().withMessage('state must be alphabetic.')
], usercontroller.newaddress)

router.post("/updateaddress", [
    // check('address').isLength({ min: 5 }).isAlphanumeric().withMessage('address must be alphabetic.'),
    check('city').isLength({ min: 2 }).isAlpha().withMessage('city must be alphabetic.'),
    check('country').isAlpha().withMessage('country must be alphabetic.'),
    check('pincode').isNumeric().isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digit only'),
    check('state').isAlpha().withMessage('state must be alphabetic.')
], usercontroller.updateaddress)

router.get("/fetchaddress/:user", usercontroller.fetchaddress)

router.get("/deleteaddress/:id", usercontroller.deleteaddress)

router.post("/uploadimage/:user", upload.single('profileImg'), usercontroller.uploadimage)

router.post("/checkpassword", usercontroller.checkpassword)

router.post("/newpassword", usercontroller.newPassword)

router.post("/updatepassword", usercontroller.updatepassword)

router.get("/fetchimage/:user", usercontroller.fetchimage)

router.get("/fetchpopular", datacontroller.Popular)

router.get("/fetchall", datacontroller.All)


router.get("/fetchsingle/:id", datacontroller.SingleProduct)

router.get("/filter/:cat&&:col", datacontroller.filter)

router.post("/giverating", datacontroller.giverating)

router.post("/addtocart/:user&&:id", cartcontroller.addtocart)

router.get("/fetchcart/:user", cartcontroller.fetchCart)

router.post("/editquantity", cartcontroller.editquantity)

router.get("/deleteitem/:id", cartcontroller.deleteitem)

router.get("/cartcount/:user", cartcontroller.cartcount)

router.post("/cartwithoutlogin/:id", cartcontroller.cartwithoutlogin)

router.post("/placeorder/:subtotal&&:GST&&:finaltotal", ordercontroller.placeorder)

router.get("/fetchorder/:email", ordercontroller.fetchorder)

router.get("/getInvoice/:id", ordercontroller.getInvoice)







module.exports = router;